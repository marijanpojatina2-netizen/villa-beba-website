'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

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
            width: { ideal: 2560 },
            height: { ideal: 1440 },
          },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((tr) => tr.stop());
          return;
        }
        streamRef.current = stream;
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

  function capture() {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    const scale = Math.min(1, 2400 / Math.max(video.videoWidth, video.videoHeight));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(video.videoWidth * scale);
    canvas.height = Math.round(video.videoHeight * scale);
    canvas.getContext('2d')!.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(
      (blob) => {
        stop();
        if (blob) onCapture(blob);
        else onUnavailable();
      },
      'image/jpeg',
      0.9,
    );
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
          onClick={capture}
          disabled={!ready}
          aria-label={t('capture')}
          className="h-18 w-18 rounded-full border-4 border-white bg-white/30 p-1 disabled:opacity-40"
          style={{ height: 72, width: 72 }}
        >
          <span className="block h-full w-full rounded-full bg-white" />
        </button>
        <span className="w-[68px]" />
      </div>
    </div>
  );
}
