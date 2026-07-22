'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

// ImageCapture (Chrome/Android) is not in TS lib.dom — minimal declaration.
declare class ImageCapture {
  constructor(track: MediaStreamTrack);
  takePhoto(): Promise<Blob>;
}

// Normalize any capture to a JPEG with a bounded long edge, re-encoding at
// lower quality if needed to stay well under the server-action body limit.
async function toUploadJpeg(blob: Blob): Promise<Blob> {
  const bitmap = await createImageBitmap(blob);
  const scale = Math.min(1, 2600 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  for (const quality of [0.9, 0.8, 0.7]) {
    const out = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/jpeg', quality));
    if (out && out.size <= 2.5 * 1024 * 1024) return out;
    if (quality === 0.7 && out) return out;
  }
  return blob;
}

// Fullscreen camera overlay with a document frame and scan-line animation.
// Captures a high-res JPEG frame from the live stream — always JPEG, so HEIC
// phone defaults can never reach the server.
export default function ScanCamera({
  onCapture,
  onUnavailable,
  onClose,
}: {
  onCapture: (blob: Blob) => void;
  onUnavailable: () => void;
  onClose: () => void;
}) {
  const t = useTranslations('checkin');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [ready, setReady] = useState(false);

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((tr) => tr.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment',
            width: { ideal: 3840 },
            height: { ideal: 2160 },
          },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((tr) => tr.stop());
          return;
        }
        streamRef.current = stream;
        // Close-up documents need continuous autofocus where supported.
        try {
          await stream.getVideoTracks()[0].applyConstraints({
            advanced: [{ focusMode: 'continuous' } as MediaTrackConstraintSet],
          });
        } catch {
          /* focusMode unsupported — camera default stays */
        }
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setReady(true);
      } catch {
        if (!cancelled) onUnavailable();
      }
    })();
    return () => {
      cancelled = true;
      stop();
    };
  }, [onUnavailable, stop]);

  const [capturing, setCapturing] = useState(false);

  async function capture() {
    const video = videoRef.current;
    const track = streamRef.current?.getVideoTracks()[0];
    if (!video || !video.videoWidth || !track || capturing) return;
    setCapturing(true);
    let raw: Blob | null = null;
    // Prefer a real still photo (full sensor resolution + autofocus run) —
    // video-frame grabs come out soft on phones at document distance.
    if (typeof ImageCapture !== 'undefined') {
      try {
        raw = await new ImageCapture(track).takePhoto();
      } catch {
        raw = null;
      }
    }
    if (!raw) {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d')!.drawImage(video, 0, 0);
      raw = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/jpeg', 0.92));
    }
    if (!raw) {
      setCapturing(false);
      onUnavailable();
      return;
    }
    try {
      const jpeg = await toUploadJpeg(raw);
      stop();
      onCapture(jpeg);
    } catch {
      setCapturing(false);
      onUnavailable();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      <style>{`
        @keyframes checkin-scanline {
          0% { top: 4%; }
          50% { top: 92%; }
          100% { top: 4%; }
        }
      `}</style>

      <video
        ref={videoRef}
        playsInline
        muted
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Document frame + animated scan line */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div
          className="relative w-[88%] max-w-md rounded-2xl border-2 border-white/90"
          style={{ aspectRatio: '1.586', boxShadow: '0 0 0 100vmax rgba(0,0,0,0.55)' }}
        >
          {/* corner accents */}
          <div className="absolute -left-0.5 -top-0.5 h-8 w-8 rounded-tl-2xl border-l-4 border-t-4 border-emerald-400" />
          <div className="absolute -right-0.5 -top-0.5 h-8 w-8 rounded-tr-2xl border-r-4 border-t-4 border-emerald-400" />
          <div className="absolute -bottom-0.5 -left-0.5 h-8 w-8 rounded-bl-2xl border-b-4 border-l-4 border-emerald-400" />
          <div className="absolute -bottom-0.5 -right-0.5 h-8 w-8 rounded-br-2xl border-b-4 border-r-4 border-emerald-400" />
          {ready && (
            <div
              className="absolute left-2 right-2 h-0.5 rounded bg-emerald-400"
              style={{
                animation: 'checkin-scanline 2.6s ease-in-out infinite',
                boxShadow: '0 0 12px 2px rgba(52, 211, 153, 0.8)',
              }}
            />
          )}
        </div>
      </div>

      <p className="absolute left-0 right-0 top-6 px-8 text-center text-sm font-medium text-white drop-shadow">
        {t('scanInstruction')}
      </p>

      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-8 pb-10 pt-6">
        <button
          type="button"
          onClick={() => {
            stop();
            onClose();
          }}
          className="rounded-full bg-white/20 px-5 py-3 text-sm font-medium text-white backdrop-blur"
        >
          {t('cancel')}
        </button>
        <button
          type="button"
          onClick={() => void capture()}
          disabled={!ready || capturing}
          aria-label={t('capture')}
          className="h-18 w-18 rounded-full border-4 border-white bg-white/30 p-1 disabled:opacity-40"
          style={{ height: 72, width: 72 }}
        >
          <span
            className={`block h-full w-full rounded-full bg-white ${capturing ? 'animate-pulse' : ''}`}
          />
        </button>
        <span className="w-[68px]" />
      </div>
    </div>
  );
}
