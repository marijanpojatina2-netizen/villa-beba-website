# Pinterest Launch Kit — Villa Ballena & Beluga

**Goal:** drive referral traffic *this season* (Pinterest pins rank in weeks, not months — unlike Google for a young domain). Primary market: German & Austrian families planning summer stays.

**Prereq already shipped:** `guides/[slug]` now emits `og:image` + Article Open Graph tags (commit on `v7-light`). Once the domain is claimed on Pinterest, guide pins become **Rich Pins** automatically.

---

## 1. One-time setup (~1 hour)

1. Create a **free Pinterest Business account** (or convert personal). Use the business email.
2. **Settings → Claimed accounts → Claim `ballenaandbeluga.com`.**
   - Method: add the meta tag Pinterest gives you, or upload the HTML file. (If you want, I can wire the meta tag into `layout.tsx` — just send me the tag.)
   - Claiming unlocks **Rich Pins** (reads our OG/Article tags), pin analytics, and "by Villa Ballena & Beluga" attribution on every pin.
3. Profile: name `Villa Ballena & Beluga — Luxusvilla Istrien`, bio in German with the domain, link to `https://www.ballenaandbeluga.com/de`.
4. Enable **auto-publish** / use the built-in **scheduler** (free) so you can batch a month of pins in one sitting.

## 2. Boards (German — Pinterest search is language-specific)

Create these 5 boards, each with a German title + 1-sentence German description:

| Board | Description (DE) |
|---|---|
| `Ferienhaus Istrien` | Luxusvilla mit privatem Pool in Svetvinčenat, Zentralistrien. |
| `Istrien Reisetipps` | Strände, Weingüter, Trüffel, Tagesausflüge — Insidertipps. |
| `Pool & Sauna Villa Kroatien` | Privater Pool, Sauna und Wellness in unserer Villa. |
| `Hochzeit & Events Istrien` | Heiraten in einer privaten Villa in Istrien. |
| `Istrien mit Kindern & großen Gruppen` | Großes Ferienhaus für Familien und Gruppen bis 18 Personen. |

## 3. Image format

- **Vertical 1000×1500 (2:3)** performs best. The webp guide heroes are landscape — crop/recompose them vertically in Canva (free) with a text overlay (German title + soft brand mark).
- Add a small logo/wordmark bottom-corner. Keep text large and legible on mobile.
- Reuse each photo in 2–3 layouts → more pins, more reach, no extra shoots.

## 4. First 10 pins — copy/paste German

Each entry: **destination URL** · **Pin title (≤100 char)** · **Pin description (keyword-rich, soft CTA, hashtags)**. Use the `/de/` locale URLs.

1. **/de/villa-ballena** · *Privater Pool & Sauna — Luxusvilla in Istrien*
   > Entspannen am privaten Pool mit Sauna in unserer Villa in Svetvinčenat, Zentralistrien. Ruhig, grün und nur 30 Min. vom Meer. Jetzt Termine für den Sommer sichern. #Istrien #FerienhausKroatien #Luxusvilla #PrivaterPool

2. **/de/guides/olive-oil-tasting-near-svetvincenat** · *Olivenöl-Verkostung in Vodnjan — unsere 3 Lieblingsproduzenten*
   > Istrisches Olivenöl gehört zur Weltspitze. Diese drei Produzenten bei Vodnjan empfehlen wir unseren Gästen — mit Verkostung direkt beim Erzeuger. #Istrien #Olivenöl #Vodnjan #Reisetipps

3. **/de/guides/beaches-near-svetvincenat** · *Die schönsten Strände bei Svetvinčenat*
   > Von versteckten Buchten bis zu familienfreundlichen Stränden — die besten Badeplätze in der Nähe unserer Villa, mit Anfahrt und Tipps. #Istrien #Strände #Kroatien #Urlaub

4. **/de/guides/truffle-hunting-near-svetvincenat** · *Trüffelsuche in Istrien — Erlebnis mit Hund*
   > Echte istrische Trüffel: eine geführte Suche mit Hund, gefolgt von einer Verkostung. Eines der schönsten Erlebnisse der Region. #Istrien #Trüffel #Foodie #Kroatien

5. **/de/guides/driving-to-istria-by-car** · *Mit dem Auto nach Istrien — Anreise aus Bayern & Österreich*
   > Route, Maut, Fahrzeit und Tipps für die Anreise nach Zentralistrien mit dem Auto. So einfach kommt ihr von München an unsere Tür. #Istrien #Anreise #Roadtrip #Kroatien

6. **/de/guides/istrian-wineries-near-svetvincenat** · *Istrische Weingüter in der Nähe*
   > Malvazija und Teran direkt beim Winzer verkosten. Die besten Weingüter rund um unsere Villa — ideal für einen Nachmittagsausflug. #Istrien #Wein #Malvazija #Reisetipps

7. **/de/weddings** · *Hochzeit in einer privaten Villa in Istrien*
   > Heiraten mit privatem Pool, Garten und Platz für die ganze Familie. Unsere Villa als exklusive Hochzeitslocation in Istrien. #HochzeitIstrien #Hochzeitslocation #Kroatien #Destinationwedding

8. **/de/complex-beba** · *Großes Ferienhaus in Istrien für bis zu 18 Personen*
   > Zwei Villen, ein Komplex: ideal für Familienfeiern, Mehrgenerationen-Urlaub und große Gruppen. Privater Pool, viel Platz, absolute Ruhe. #Istrien #Gruppenreise #Ferienhaus #Familienurlaub

9. **/de/guides/restaurants-central-istria** · *Wo essen in Zentralistrien — unsere Restaurant-Tipps*
   > Konobas, Fine Dining und versteckte Lokale rund um Svetvinčenat. Wo unsere Gäste am liebsten essen gehen. #Istrien #Restaurant #Foodie #Kroatien

10. **/de/guides/day-trips-from-svetvincenat** · *Tagesausflüge ab Svetvinčenat*
    > Pula, Rovinj, Motovun und mehr — die besten Tagesausflüge von unserer Villa aus, mit Fahrzeiten und Empfehlungen. #Istrien #Tagesausflug #Rovinj #Pula

> Mirror the best performers into English pins later, linking to the `/en/` URLs and an `Istria travel tips` board. German first — that's the market with intent right now.

## 5. Cadence

- **3–5 fresh pins/week.** Schedule a month ahead in one sitting.
- Re-pin your own top performers to a second relevant board after ~2 weeks.
- Check Pinterest analytics monthly: double down on whichever board/pin drives the most outbound clicks.

## 6. After going live

- Run each pinned URL through the **Pinterest Rich Pin Validator** once (confirms our OG tags are read). One pass per URL pattern is enough.
- Cross-check the share preview with Facebook's Sharing Debugger / WhatsApp — the same OG image now drives those too.
