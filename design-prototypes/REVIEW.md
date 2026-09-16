# Reel Reveal: design review and redesign proposal

Reviewed 2026-09-16 on branch `feat/ai-chat`. I judged each page from its code: classes, spacing, heading order, states and breakpoints. Prototypes of the proposal are in this folder. Open `index.html` to see them all.

---

## 1. Overall verdict

**Overall score: 4.6 / 10.** The app works and has good bones: a quiz-first product, real TMDB imagery, sensible routes, and some careful recent work (`MovieInfoActions`, `ActorBiography`, `YouTubeFacade`). The look is what lets it down. It reads as a 2021 dark SaaS template with film posters dropped in, not as a film product with its own identity.

What makes it look generic or AI-made:

| Pattern | Where |
|---|---|
| Blurred glowing ellipse blobs behind every section | `src/app/(admin)/layout.tsx:26-34, 39-45`, `hero/Hero.tsx:46-53`, `howItWorks/HowItWorks.tsx:15-22`, `genres/Genres.tsx:13-22`, `tailwind.config.js:27-31` (`blur-header`, `blur-hero`, `blur-footer`) |
| Neon teal glow as the hover and focus state everywhere | `tailwind.config.js:37-38` (`hoverShadow`, `focusShadow`), used on buttons, chat, cards and the cookie banner |
| Navy background with one neon accent (#12132C and #20E8DA) and no other color | `tailwind.config.js:8-11` |
| One font (Urbanist) in 8 weights, body text set in weight 100 with widest tracking | `layout.tsx:10-14`, `globals.css:112` |
| Every button a full pill in uppercase | `ui/ButtonOrLink.tsx:27-29`, `globals.css:151-152`, `HeaderNavMenu.tsx:61` |
| Roughly 18px radius on everything (posters, inputs, cards, arrows) | `MovieCard.tsx:131,148`, `SharedInput.tsx:84`, `MySliderBtn.tsx:22` |
| Generic three-column "How it works" with icons | `howItWorks/HowItWorks.tsx:24-45` |
| Decorative motion on every section (fade and scale on scroll, 0.3s delay) | `variables/animation.ts:7-12`, used in Hero, HowItWorks, Genres (staggered per icon), GetShowMovies, SliderCarousel, Quiz |
| Floating round chat bubble with a glow | `aiChat/AiChat.tsx:328-336` |
| Stock "iPhone 14" mockup in a paywall | `quiz/Popup.tsx:32-38` |
| Emoji and hype copy ("Look no further!", "pop your popcorn") | `hero/Hero.tsx:21-28`, `HowItWorks.tsx:43`, `flashlight/Flashlight.tsx:19` |

Structural problems that matter more than style:

1. **The quiz, which is the product, is the fourth section on the home page.** It sits below a generic hero and a "How it works" block (`home/page.tsx:33-35`).
2. **Body copy is hard to read.** `p` is weight 100, `tracking-widest`, at 80% opacity (`globals.css:112`). Thin, widely tracked text on navy is tiring to read for more than a line, even though the color contrast technically passes.
3. **Payment and success are white cards with black buttons** (`checkout/Checkout.tsx:66,72`, `successPayment/SuccessPayment.tsx:124,144,150,170`). They look like a different product at the moment the user is asked to trust you with money.
4. **Key actions are hidden behind hover.** Save, watched and trailer only exist in the hover overlay (`movieCard/MovieCardHover.tsx:56-63`). On touch the first tap only shows the overlay (`MovieCard.tsx:80-81`), so opening a film takes two taps.
5. **Small text fails contrast.** `greyColor` #717180 on the chat panel is 3.4:1 and `disabledColor` (white at 40%) is 3.7-3.8:1. Both are used for 10-13px text (`AiChat.tsx:187, 230, 311`), which needs 4.5:1.
6. **Inconsistent naming.** The same page is called "Favorites" (`HeaderNavMenu.tsx:40`) and "My library" (`HeaderNavMenuMobile.tsx:71`). The mobile menu always says "Login", even for signed-in users (`HeaderNavMenuMobile.tsx:79`).

---

## 2. Proposed direction: "Late show"

The idea: the room just after the lights go down. It uses a warm plum-black instead of a cold navy, lit by one tungsten marquee-bulb amber. Film titles are set big in condensed signage type, and the posters themselves supply the color. Decoration comes from real stills, not blurred blobs. There is one orchestrated motion moment (the letterbox opening on the home page); everything else moves only when the user does something.

Why this and not the obvious options: a near-black page with one acid accent is today's generic dark theme, and cream with a serif is today's generic "editorial" look. Plum and tungsten come from cinema interiors and marquee lighting. The warm base also flatters poster art, which the cold navy currently fights.

### Palette

| Token | Hex | Role | Contrast on bg |
|---|---|---|---|
| `bg` (Auditorium) | `#22151F` | Page background | n/a |
| `surface` (Velvet) | `#301E2B` | Panels, inputs, cards | n/a |
| `raised` (Seat) | `#3C2737` | Hover surfaces, chips, tracks | n/a |
| `line` | `#4E3647` | Borders and rules (1px) | n/a |
| `text` (Screen) | `#F3EEE7` | Primary text | 15.2:1 |
| `muted` (Program) | `#BCAAB3` | Secondary text | 8.0:1 |
| `dim` | `#A08B97` | Captions, on bg and surface only | about 5:1 |
| `accent` (Tungsten) | `#F4B942` | Primary buttons, rating stars, progress, focus ring | 9.9:1 |
| `on-accent` | `#22151F` | Text on amber | 9.9:1 |
| `danger` (Exit) | `#FF6B57` | Errors, destructive actions | 6.3:1 |
| `ok` | `#8FD19E` | Payment confirmation only | n/a |

Rules: amber marks what to act on, plus ratings and progress. It is never used for decorative words inside headings (drop the teal spans in `QuizQuestions.tsx:48`, `MovieSearch.tsx:111`, `SavedMovies.tsx:69`). No gradients except image scrims. No glows.

**If the teal must stay as the brand color:** keep the whole system and swap `accent` to `#3FD8CB` with `on-accent` `#22151F`. It still works, but amber is the stronger choice with a warm base.

### Type

| Role | Font (Google Fonts) | Settings |
|---|---|---|
| Display: page titles, film and actor names, section heads, quiz answers | **Big Shoulders Display** 700/800 | Line-height 0.86-1, letter-spacing -0.01em, sentence case, never all caps |
| Body and UI | **Instrument Sans** 400/500/600 | 16px/1.55 body, 15px buttons, `tabular-nums` for years, ratings, prices, counters |

Scale (px): 13, 14, 16, 17, 20, 28-40 (section, `clamp`), 34-56 (display-m), 44-96 (display-l), 56-136 (display-xl). Measure: body 58-66ch, overview 62ch.

`next/font` setup (replaces Urbanist in `src/app/layout.tsx:10-14`):

```ts
import { Big_Shoulders_Display, Instrument_Sans } from "next/font/google";
const display = Big_Shoulders_Display({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-display" });
const sans = Instrument_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-sans" });
// <body className={`${display.variable} ${sans.variable} font-sans`}>
```

### Radius, spacing, elevation

- Radius: `poster` 3px (posters are printed sheets), `ui` 10px (buttons, inputs, panels), `panel` 14px (dialogs, the chat sheet), `full` only for chips, avatars and round icon buttons.
- Spacing (4px base): 4, 8, 12, 16, 24, 32, 48, 72, 112. Section padding `clamp(48px, 7vw, 96px)`. Page gutter `clamp(16px, 5vw, 72px)`, content max 1320px.
- Elevation: none by default. Separate things with a 1px `line` border or a `surface` fill. Use a real drop shadow only on things that float (the poster in the movie hero, the chat drawer, dialogs).

### Motion rules

1. **One orchestrated moment:** on the home hero, the letterbox bars open over the still (1.1s, `cubic-bezier(.2,.7,.2,1)`, runs once). Nothing else animates on load.
2. **Remove scroll-triggered entrances** (`animationSection` everywhere). Content should just be there.
3. **Motion answers input:** poster lifts 4px on hover or focus, drawer slides 280ms, quiz answer fills amber for 180ms before the next question, disclosure chevrons rotate.
4. **No autoplaying carousels** (`SliderCarousel.tsx:32-34`).
5. Honor `prefers-reduced-motion` globally (included in every prototype).

### Tailwind tokens (replace `theme.extend` in `tailwind.config.js`)

```js
colors: {
  bg: "#22151F", surface: "#301E2B", raised: "#3C2737", line: "#4E3647",
  ink: { DEFAULT: "#F3EEE7", muted: "#BCAAB3", dim: "#A08B97" },
  accent: { DEFAULT: "#F4B942", press: "#DDA02A", on: "#22151F" },
  danger: "#FF6B57", ok: "#8FD19E",
},
fontFamily: { display: ["var(--font-display)", "Arial Narrow", "sans-serif"], sans: ["var(--font-sans)", "system-ui", "sans-serif"] },
borderRadius: { poster: "3px", ui: "10px", panel: "14px" },
maxWidth: { content: "1320px" },
transitionTimingFunction: { out: "cubic-bezier(.2,.7,.2,1)" },
// delete: blur.*, boxShadow.hoverShadow/focusShadow, backgroundImage.cardGradient/quizBtnGradient/mobileBgGradient
```

Base layer (replace `globals.css:72-117`):

```css
body { @apply bg-bg text-ink font-sans antialiased; }
h1, h2, h3 { @apply font-display font-bold leading-none text-balance; }
p { @apply text-base leading-relaxed; }             /* no thin weight, no tracking, no opacity */
:focus-visible { @apply outline-2 outline-offset-2 outline-accent; }
.page-wrapper { @apply mx-auto w-full max-w-content px-[clamp(16px,5vw,72px)] py-12 md:py-20 flex flex-col gap-16 md:gap-24; }
```

### Shared component changes

| Component | Change |
|---|---|
| `ui/ButtonOrLink.tsx` | Variants: `primary` (`bg-accent text-accent-on hover:bg-[#FFC95C] active:bg-accent-press`), `ghost` (`border border-line hover:border-ink`), `quiet`, `danger`. `rounded-ui h-11 px-5 font-semibold`, sentence case, no `uppercase`, no shadow. Remove `aria-label="button"` (line 61): it overrides the visible label for screen readers. Merge `className` once (it is applied twice, lines 33 and 51/63). |
| `movieCard/MovieCard*.tsx` | Poster `rounded-poster`. Title, year and rating always visible **below** the poster. Save and watched become two 36px round icon buttons, top-right, shown on hover or focus-within and **always shown on touch** (`@media (hover:none)`). A plain link opens the film on the first tap. Drop `cardGradient` and the teal border. Keep the hover poster crossfade, which is a nice touch. |
| `mySlider/*` + react-slick | Replace with a CSS scroll-snap rail (`grid-auto-flow: column; scroll-snap-type: x mandatory`), with 36px prev and next buttons in the section header on desktop and swipe on touch. This removes the `left: -14% !important` hack (`globals.css:159-167`), the remount key trick (`MySlider.tsx:56-65`) and about 40KB of JS. |
| `header/*` | Sticky 64px bar at `bg/92%` with a 1px bottom line. Wordmark in the display font. Search field at `rounded-ui bg-surface` with the icon on the left and a real `<label>`. Nav items: Browse, Library, Sign in (or first name), then the primary button "Take the quiz" with a "5 left" counter. Active page gets a 2px amber underline plus `aria-current`. Use the same labels on mobile. |
| `footer/Footer.tsx` | Three plain columns (brand, Find a film, Account) and a legal row. Remove the 154px camera icon (line 39) and the `isClient`/`useDeviceType` hydration switch (lines 14-19, 38). Use CSS breakpoints. Update the year (line 49). |
| `ui/SharedInput.tsx` | Replace the floating label (lines 92-100) with a static label above the field. Drop `font-mono tracking-widest text-xl` (line 83). Use `h-11 rounded-ui bg-surface border-line`, an amber focus ring, and `aria-invalid` plus an error message under the field linked by `aria-describedby`. Remove `aria-label={\`input ${label}\`}` (line 74), since the `<label>` already names the field. |
| Background blobs | Delete all `*_bg-ellips.svg` images and the `blur-*` utilities. |

---

## 3. Page by page

Scores are 1-10, in this order: **Hierarchy / Type / Color / Spacing / Consistency / Motion / Mobile / Character**.

### Root `src/app/page.tsx`
Redirects to `/home`, so nothing renders. **Low:** the unreachable JSX (lines 7-12) can go. Consider serving home at `/` so the canonical URL is the short one.

### Home: `src/app/(admin)/home/page.tsx`
**Scores: 4 / 4 / 4 / 5 / 5 / 3 / 5 / 3 (avg 4.1)**

Problems
- `hero/Hero.tsx:20-28`: a centered-left generic hero ("Discover Your Perfect Movie with ReelReveal!", "Look no further!") next to a tilted collage PNG (`/images/hero-image.webp`) with a glow blob behind it. The collage has a white edge and baked-in drop shadows that clash with the navy.
- `home/page.tsx:33-35`: the quiz comes third. The hero button just links to `/quiz`, which renders the same quiz again.
- `howItWorks/HowItWorks.tsx`: a three-icon block that restates the hero.
- `home/page.tsx:37`: "Upcoming 20 movies in 2025" is out of date and reads like a label. Line 43 "TOP 20 rated movies" mixes case.
- `genres/Genres.tsx:29-32`: 20 icon tiles, each animated with a staggered delay, `p` inherits weight 100.
- `sliderCarousel/SliderCarousel.tsx:30-34`: an 11-slide autoplaying strip of stills in a film-frame SVG. It is motion with no purpose, and `w-[864px]` (line 63) forces overflow on small screens.
- `quiz/Quiz.tsx:107,126`: decorative `bg-borderIcon` strips at `w-lvw` can cause horizontal scroll where scrollbars take up width.

Recommendations
- **High:** Make the hero the quiz. Use a full-width still (backdrop of a current film, 78vh), the headline "What are we watching tonight?" in display-xl, one line of lede, and **question 1 inline** in a panel overlapping the still's bottom edge, with four large answer tiles. Picking an answer continues on `/quiz` with that answer kept (a query param or the existing signal). See `home.html`.
- **High:** Delete `Hero`, the blob images and `HowItWorks` from the home page. Keep the three steps as one short numbered row inside the quiz panel (it really is a sequence).
- **High:** Rails: "Coming to cinemas" and "Highest rated of all time", with left-aligned section heads, "See all", prev and next buttons, and scroll-snap.
- **Medium:** Replace genre icons with a letterboard: genre names as display-type links wrapping across the width (`text-[clamp(40px,6vw,80px)] font-display`), with every third one in `ink-muted` for rhythm.
- **Medium:** Replace "Stuck on Movie Choices?" with a "Know the scene but not the title?" band that opens the AI chat, next to a small sample exchange. This promotes the new feature using real product UI.
- **Low:** The only load animation is the letterbox (`@keyframes open { to { transform: scaleY(0) } }` on two black bars).

### Movies list: `src/app/(admin)/movies/page.tsx`
**Scores: 5 / 4 / 5 / 5 / 5 / 5 / 5 / 3 (avg 4.6)**

Problems
- `movieSearch/MovieSearch.tsx:109-115`: "Found **N** movies based on your search" is an h2 with a teal span. There is no h1 on the page.
- `MovieSearchFilter.tsx:90-117`: three 120px multi-selects with placeholder-only labels and an explicit "apply" button. Filters are not sticky, and the user can't see which filters are active once they scroll.
- `MovieSearch.tsx:149-155`: a scroll-to-top button that slides in from `-right-[210px]` at 60% teal. It overlaps the chat launcher's area (`bottom-28`).
- `MovieSearch.tsx:157`: a full-screen modal loader for "load more" blocks the page you are reading.
- There is no empty state for zero results.
- `page.tsx:22`: the genre icon grid is repeated under the results.

Recommendations
- **High:** Add an h1 "Browse" (or "Results for “inception”") with a lede. Put the filters in a sticky bar under the header with visible labels: Genre and Released as selects, Rating as a segmented control (Any / 7+ / 8+), and Sort. Apply changes immediately instead of with a button.
- **High:** Add a result line ("1,284 films. Showing 18.", `aria-live`) and removable filter chips plus "Clear all".
- **High:** Show skeleton posters inline for loading and load-more (keep the grid in place). Add an empty state: "Nothing matches all three filters." with "Clear filters" and "Describe a film instead".
- **Medium:** Grid `repeat(auto-fill, minmax(150px, 1fr))`, 6 columns at ≥1100px, `gap-x-5 gap-y-8`. The button reads "Show 18 more".
- **Low:** Remove the duplicated genre block and the custom scroll-to-top button (the sticky filter bar plus the Home key is enough).

### Movie detail: `src/app/(admin)/movies/[movieId]/page.tsx`
**Scores: 6 / 5 / 5 / 5 / 6 / 6 / 4 / 5 (avg 5.3)**

Problems
- `movieInfo/MovieInfo.tsx:17`: fixed `h-[1160px] sm:h-[960px]` plus aspect ratios. On mobile the poster and text get squeezed or leave empty space, and a long overview overflows.
- `MovieInfo.tsx:25,44`: the title is truncated to 35 characters with `cutingString`, so long titles lose words. Line 65 cuts the overview at 300 characters with no way to expand it.
- `MovieInfo.tsx:31`: the poster loads at `original` size (often over 2MB) for a 285px slot. Use `w342`/`w500`.
- `DateGenresDurationList.tsx:46`: year, runtime and genres are identical pills, so the kinds of information blur together. "TMDB 8" (`MovieInfo.tsx:55`) floors 8.1 to 8.
- `MovieInfoCastCard.tsx:28`: square cast photos at `rounded-xl` with `text-xl leading-9` names. It's heavy for a secondary rail.
- The trailer is a separate full-width section with no heading or context.

Recommendations
- **High:** Hero at `min-h-[min(86vh,820px)]` with content aligned to the bottom (no fixed heights): backdrop, bottom and left scrims, poster (w342, `rounded-poster shadow-2xl`) beside the text, title in display-xl with `text-balance` and no truncation, and the tagline in italic muted text.
- **High:** Replace the pills with a facts list (`<dl>`): Released / Runtime / TMDB rating (one decimal) / Genre (links), with values in display type and labels in 13px `ink-dim`.
- **High:** Actions: "Watch trailer" (primary, scrolls to the trailer or opens it), "Save" (ghost, toggles to "Saved"), "Mark as watched" (ghost, toggles to "Watched"). The pressed state is an amber border and text. The existing `MovieInfoActions` logic already fits this.
- **Medium:** Cast as a rail of 3:4 portraits with 25% grayscale that clears on hover, name in 600 weight and character in muted text. Trailer in a split layout with a details column (director, source, language, budget).
- **Medium:** Title the similar films rail "If you liked Dune: Part Two".
- **Low:** Mobile: the poster shrinks to 132px above the title, and the actions wrap.

### Actor detail: `src/app/(admin)/actors/[actorId]/page.tsx`
**Scores: 6 / 5 / 5 / 6 / 5 / 6 / 6 / 5 (avg 5.5)**

Problems
- `actorInfo/ActorInfo.tsx:93`: fact labels are pills with a hard-coded `bg-[#20263D]` (also line 81) instead of a token.
- `ActorBiography.tsx:32`: `indent-8` plus up to 28px text at weight 400 makes a long, heavy block with no measure limit.
- `page.tsx:84-89`: "Starring at" (wrong preposition) is shown as a slider, so the filmography has no dates or roles.
- `page.tsx:90`: the "Stuck on Movie Choices?" carousel is unrelated to the actor.

Recommendations
- **High:** Show the backdrop in grayscale at 28% opacity under a scrim, a 3:4 portrait, the name in display-xl, and facts as a two-column `<dl>` (Born with age, Birthplace, Known for with credit count).
- **High:** Biography at 19px/1.7 with `max-w-[66ch]`, a height clamp with a fade, and "Read the full biography" / "Show less" (keep the current overflow detection).
- **High:** A filmography list ordered by year (newest first), with each row showing year (display), 44px thumbnail, title link, role and rating. Add "Show all N credits". Put a "Known for" 2x2 poster grid beside the biography.
- **Low:** Remove the unrelated carousel.

### Quiz: `src/app/(admin)/quiz/page.tsx`
**Scores: 5 / 4 / 5 / 5 / 5 / 4 / 5 / 4 (avg 4.6)**

Problems
- `QuizQuestions.tsx:47-50`: "Q1/8" in teal glued to ": How are you feeling today?" (the colon lives in the data). The counter reads like a code.
- `QuizButtons.tsx:28-35`: the class string contains stray quotes and commas (`"flex ...",`), so some classes never apply. Also: `aspect-[285/200]` tiles, radial gradient, teal hover. There is no back button, and a tap commits the answer immediately with no feedback.
- `QuizProgresBar.tsx`: 8 dots with 2px borders and no text equivalent.
- `Quiz.tsx:96`: "Somthing went wrong" is misspelled and doesn't say what to do.
- `Quiz.tsx:128-131`: the limit popup slides in from `-left-[1280px]` over 1 second.
- `Popup.tsx:32-38`: a stock iPhone mockup. Line 47-52: a list whose bullets are rotated "cross" icons (so they read as "x"), and each item is an `h5`.
- `QuizListMovies.tsx:56`: "Have you seen these?" gives no hint of why these films were picked.
- `quiz/page.tsx:12-13`: HowItWorks and the carousel under the quiz pull attention away from it.
- `public/quiz-data/quizDataList.ts:12`: "Mysteryous" is misspelled (and sent as a value).

Recommendations
- **High:** A focused stage: "Question 3 of 8" in text plus an 8-segment track (done segments amber, current segment `ink`). Question in display-l with `max-w-[16ch]`. Answers as tiles (4 columns, 2 on mobile, `min-h-[132px]`), each with a keyboard hint (1-8, hidden on touch). Picking fills the tile amber for 180ms, then the next question appears. Add a "Previous question" button and a row of chosen answers as chips.
- **High:** A "working" state with a spinning reel and the copy "Picking eight films. This takes about ten seconds.", instead of a modal loader.
- **High:** Results titled "Your eight films" with a summary line of the answers ("For a sad evening with friends, something recent"), plus one short reason under each poster (ask the model for it, it is cheap). Buttons: "Change answers" and "New quiz (4 left)".
- **High:** The limit dialog is a centered 520px panel with no device mockup. Title "You've used today's five free requests", then when they reset, the price in display type, three checkmarks, and the buttons "Buy 100 requests" and "Wait until tomorrow". The guest version says "Sign in for five a day".
- **Medium:** Fix the data: store `title` without the leading colon, and fix "Mysterious". Error copy: "The quiz couldn't load films. Check your connection and try again." with a "Try again" button.
- **Low:** Remove HowItWorks and the carousel from `/quiz`.

### Auth: `src/app/(admin)/auth/page.tsx`
**Scores: 4 / 4 / 5 / 5 / 4 / 5 / 6 / 2 (avg 4.4)**

Problems
- `auth/Auth.tsx:33`: the page heading is an `h3` saying "Please enter email", which is an instruction, not a title, and there is no h1.
- `SharedInput.tsx`: floating labels that jump to `-top-6`, monospaced `text-xl` input text, and the border turns teal once the value is longer than one character (`onInputHandler` line 46). Error styling only changes the border and text color, with no message.
- `AuthLogin.tsx:93`: the social button is an uppercase pill. The "or" divider uses `bg-gray-400/500` (not tokens).
- The page is an empty centered column with no imagery and no reason to sign in.

Recommendations
- **High:** A split layout. Left: a tilted poster wall (three columns, 55% opacity, fading into the bg) with the line "Keep a list of everything worth watching." Right: a 400px form column. Stack to a 200px strip on mobile.
- **High:** Title "Sign in or create an account" (h1), a one-line benefit ("Save films, mark what you've seen, and get five AI requests a day instead of one."), "Continue with Google" as a light button, an "or with email" divider, a labeled Email field, and "Continue".
- **High:** Step 2 shows the email as a chip with "Change", then the password field. Errors appear under the field: "That password doesn't match this email. Try again or reset it." Register shows name and password with a hint line.
- **Low:** The legal note moves under the button at 13px `ink-dim`.

### Profile: `src/app/(admin)/profile/page.tsx`
**Scores: 3 / 4 / 5 / 4 / 3 / 4 / 5 / 2 (avg 3.8)**

Problems
- `userProfile/UserProfile.tsx:35`: "User Profile" is an h2. Line 67 has the typo "Edit pfile", and `tranisition-all` (lines 58, 64, ...) is misspelled, so no transition applies.
- Line 34: `mr-auto` pins the block to the left while its content is centered. A 183px avatar sits next to a list of three text actions with `gap-12`.
- Delete account has the same styling as Edit and Sign out, with no warning.
- The AI quota and credits, which users pay for, don't appear here.

Recommendations
- **High:** Merge profile into **Library** (`/saved`), with the account header on top: initial avatar in amber, "Serhii's library", email and sign-in method, and a usage card ("3 of 5 free AI requests left today" with a bar, "0 paid requests", "Buy 100 for €5"). Keep `/profile` as a redirect.
- **High:** An account section at the bottom with a top rule: "Sign out" (ghost) and "Delete account" (danger, with a confirmation dialog). A short note says what deletion removes.

### Saved: `src/app/(admin)/saved/page.tsx`
**Scores: 5 / 4 / 5 / 5 / 5 / 5 / 5 / 3 (avg 4.6)**

Problems
- `savedMovies/SavedMovies.tsx:68-71`: "Saved **N** movies" as an h1 with a teal number.
- Watched films are tracked (`toggleWatched`) but can't be seen anywhere.
- Line 49: the empty state uses a popcorn PNG, and its buttons are all lowercase ("search movie", "start quiz").
- Line 76: a full-screen modal loader.

Recommendations
- **High:** Tabs "Saved 10" and "Watched 4" (`role="tablist"`, arrow keys work) in display type with an amber underline, plus a sort select (Date added, Rating, Title).
- **Medium:** Empty state: three dashed poster outlines, "Nothing saved yet", "Press the heart on any poster to keep it here.", and the buttons "Take the quiz" and "Browse movies".
- **Medium:** Use skeleton posters while loading.

### Payment: `src/app/(admin)/payment/page.tsx` + `components/checkout/Checkout.tsx`
**Scores: 5 / 4 / 3 / 5 / 2 / 5 / 6 / 2 (avg 4.0)**

Problems
- `Checkout.tsx:66`: a white `bg-white rounded-lg` card with a black button (line 72) on the navy page.
- `Checkout.tsx:81`: the error is an `h3` in `text-red-500`.
- `payment/page.tsx:27-30`: the heading "100 AI requests" and the lede are centered at the default size. There is no order summary or VAT line.

Recommendations
- **High:** Two columns. Left: "One-time purchase", **100** in display at 160px, "AI requests", a lede about when they're used, and a summary `<dl>` (item, VAT included, total). Right: the Payment Element on a `surface` panel.
- **High:** Theme Stripe to match instead of wrapping it in white:
  ```ts
  appearance: { theme: "night", variables: {
    colorPrimary: "#F4B942", colorBackground: "#22151F", colorText: "#F3EEE7",
    colorDanger: "#FF6B57", borderRadius: "10px", fontFamily: "Instrument Sans, system-ui, sans-serif" },
    rules: { ".Input": { border: "1px solid #4E3647" } } }
  // Elements options: fonts: [{ cssSrc: "https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600" }]
  ```
- **Medium:** The button reads "Pay €5.00" (primary, full width), with a line under it: "Payments are processed by Stripe. Reel Reveal never sees your card number." Show errors inline in `danger` text.

### Success: `src/app/(admin)/success/page.tsx` + `components/successPayment/SuccessPayment.tsx`
**Scores: 4 / 4 / 3 / 4 / 2 / 5 / 5 / 2 (avg 3.6)**

Problems
- Line 124: another white card. Lines 133-134: `text-bgColor` headings. Lines 144/150: 32px-tall black buttons (below the 44px touch target).
- Line 158-167: the raw payment intent id is shown in teal as if it were important.

Recommendations
- **High:** A receipt page on the dark theme: a green "Payment received" mark, "100 requests added" in display-l, a lede with the new total ("103 AI requests available today: 3 free and 100 paid"), and a receipt `<dl>` (amount, date, reference in `tabular-nums`, broken to wrap). Buttons: "Take the quiz" and "Describe a film".
- **High:** The failure version says "Your bank declined the card", "Nothing was charged.", with "Try another card" and "Back to home". See the state switcher in `payment.html`.

### Privacy policy and Terms: `src/app/(admin)/privacy-policy/page.tsx`, `terms-and-conditions/page.tsx`
**Scores: 4 / 3 / 5 / 4 / 4 / n/a / 6 / 3 (avg 4.1)**

Problems
- Both inherit `p` at weight 100 with widest tracking. For 1,500 lines of legal text that is the worst case for readability.
- `terms-and-conditions/page.tsx:7,9`: headings in all caps, and the subtitle "Last updated" is an `h5`.
- `md:w-[700px]` on `page-wrapper` works against its own `max-w` and padding.
- There is no table of contents. Links inside the text look like the surrounding text (`a` is `text-current`, no underline).

Recommendations
- **High:** A shared `<LegalLayout>` with prose styles: `max-w-[68ch]`, body 17px/1.7 weight 400, h2 in display 32px with `mt-14`, h3 20px 600 with `mt-8`, lists with real bullets, links underlined (`underline decoration-line underline-offset-4 hover:decoration-accent`).
- **Medium:** A sticky table of contents on the left at ≥1100px, generated from the h2s. Put "Last updated 15 January 2025" in a paragraph under the h1. Convert the all-caps headings to sentence case.

### AI chat: `src/app/components/aiChat/`
**Scores: 6 / 5 / 4 / 6 / 5 / 6 / 5 / 3 (avg 5.0)**

Problems
- `AiChat.tsx:180-181`: a 400x600 floating card with a teal glow, anchored above a round glowing bubble (328-336). The icon-only launcher doesn't say what it does. On mobile the card's `left-4 right-4` leaves thin gutters and the page scrolls underneath.
- Lines 185-192: the header mixes quota, paid credits and "tokens today", joined by a middle dot. Token counts mean nothing to users. The same goes for the per-message "N tokens" in 10px grey (line 230, 3.4:1 contrast).
- Lines 220-227: both sides are chat bubbles, and the user bubble is `accentClicked` (teal at 50%), so it reads as highlighted.
- Line 248-251: "Searching movies…" pulses. Errors (253-275) are red text with an underlined link.
- Lines 283-301: a 2-row textarea that doesn't grow, a "Send" button next to it, and a `0/500` counter that is always visible.
- `role="dialog"` without focus containment or returning focus to the launcher when it closes.
- There are no starter prompts, so an empty panel gives no hint of what to ask.

Recommendations
- **High:** A right-side drawer on desktop (`w-[min(440px,100%)]`, full height, `bg-surface border-l border-line`, slides in over 280ms) and a bottom sheet on mobile (`h-[88dvh] rounded-t-panel`). The launcher becomes a light pill with a label, "Describe a film", and hides while the chat is open. Esc closes the chat and focus returns to the launcher.
- **High:** Header: "Describe a film" in display type plus one quota line: "3 of 5 free requests left today" with a 4px amber bar. Remove token counts from the UI (keep them in analytics).
- **High:** An empty state: "Tell me what you remember: a scene, an actor, the mood. I'll find the film." plus three starter prompts as outlined buttons.
- **High:** Messages: user messages in a `raised` block aligned right, and assistant replies as plain text (no bubble) at full width. Results as compact rows: 56px poster, title plus year in `ink-dim`, a two-line reason. The whole row is a link with a `raised` hover.
- **Medium:** Loading shows three tiny film frames flashing amber in sequence plus "Looking through the archive". Errors are an inline note with a red left rule and a real button ("Buy 100 for €5", "Sign in", "Retry").
- **Medium:** Composer: a textarea that grows (up to 140px) with the send button inside a single bordered box that turns amber when focused. Show the character counter only after 400 characters ("100 characters left"). A hint reads "Enter to send, Shift+Enter for a new line".

### Global chrome (header, footer, cookie banner)
- **Medium:** `consentCoockie/ConsentCookie.tsx:37-53`: a full-width bar on `bgSelectItemHover` with `rounded-md` teal and grey buttons. Make it a 360px card in the bottom-left (clear of the chat launcher) with "Accept" (primary) and "Decline" (ghost), both 44px tall.
- **Low:** Delete `flashlight/Flashlight.tsx`. It is unused, has yellow Tailwind defaults, a popcorn emoji and a pulsing red button.

---

## 4. Score summary

| Page | Hier. | Type | Color | Space | Consist. | Motion | Mobile | Character | Avg |
|---|---|---|---|---|---|---|---|---|---|
| Home | 4 | 4 | 4 | 5 | 5 | 3 | 5 | 3 | 4.1 |
| Movies | 5 | 4 | 5 | 5 | 5 | 5 | 5 | 3 | 4.6 |
| Movie detail | 6 | 5 | 5 | 5 | 6 | 6 | 4 | 5 | 5.3 |
| Actor | 6 | 5 | 5 | 6 | 5 | 6 | 6 | 5 | 5.5 |
| Quiz | 5 | 4 | 5 | 5 | 5 | 4 | 5 | 4 | 4.6 |
| Auth | 4 | 4 | 5 | 5 | 4 | 5 | 6 | 2 | 4.4 |
| Profile | 3 | 4 | 5 | 4 | 3 | 4 | 5 | 2 | 3.8 |
| Saved | 5 | 4 | 5 | 5 | 5 | 5 | 5 | 3 | 4.6 |
| Payment | 5 | 4 | 3 | 5 | 2 | 5 | 6 | 2 | 4.0 |
| Success | 4 | 4 | 3 | 4 | 2 | 5 | 5 | 2 | 3.6 |
| Legal (x2) | 4 | 3 | 5 | 4 | 4 | n/a | 6 | 3 | 4.1 |
| AI chat | 6 | 5 | 4 | 6 | 5 | 6 | 5 | 3 | 5.0 |

---

## 5. Top 5 changes by impact

1. **Replace the visual foundation.** Swap in the "Late show" tokens (plum-black base, tungsten amber accent, Big Shoulders Display with Instrument Sans). Delete the glow blobs, neon shadows, uppercase pills and weight-100 body text. This one change in `tailwind.config.js`, `globals.css` and `layout.tsx` fixes most of the generic look and the readability problem on every page.
2. **Make the home page quiz-first.** Show a full-width still with "What are we watching tonight?" and question 1 answerable in the hero. Remove the generic hero, "How it works" and the autoplay carousel.
3. **Rebuild the poster card and rails.** Title, year and rating always visible, save and watched buttons that work on touch, a 3px poster radius, and CSS scroll-snap rails instead of react-slick. This affects every list page.
4. **Rebuild the quiz flow.** Focused stage, keyboard answers, a back button, a working state, results with a reason per film, and an honest limit dialog in place of the phone mockup.
5. **Bring payment, success and the AI chat into the system.** A dark themed Stripe element with an order summary and a real receipt; the chat as a labeled drawer or sheet with starter prompts, poster result rows and no token jargon.

Suggested order: 1, then 3 (shared components), then 2, 4, 5. Then the remaining pages (movie, actor, auth, library, legal) mostly become layout work on top of the new components.

---

## 6. Prototypes

All are static and self-contained (inline CSS and JS, Google Fonts, TMDB images with a titled placeholder if an image fails to load). They are responsive down to 360px, have visible focus rings and hover states, and respect reduced motion. Pages with several states have a switcher in the bottom-left corner.

| File | Covers |
|---|---|
| `index.html` | Palette and links to everything |
| `home.html` | Home |
| `movies.html` | Movies list (results / loading / empty) |
| `movie.html` | Movie detail |
| `actor.html` | Actor detail |
| `quiz.html` | Quiz (working question flow, working state, results, out-of-requests dialog) |
| `auth.html` | Auth (email / password with error / register) |
| `library.html` | Saved + profile (saved, watched tab, empty) |
| `payment.html` | Payment + success (checkout / success / declined) |
| `ai-chat.html` | AI chat (empty / conversation / out of requests / network error); the launcher and working chat are also on every other prototype |
