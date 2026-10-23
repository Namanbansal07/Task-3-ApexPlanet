# SkillSpark — Learn, Play & Explore

SkillSpark is a responsive, single-page learning and discovery website created for the ApexPlanet Task 3 internship assignment. It combines a web-development quiz, an accessible image carousel, a theme switcher, and country lookup in one approachable interface.

## Assignment objectives and features

- Practice semantic HTML5, responsive CSS3, and vanilla JavaScript.
- Use mobile navigation, light/dark themes, persistent quiz best scores, and a shuffled multiple-choice quiz.
- Explore five captioned image slides with keyboard and autoplay controls.
- Search live country details through a public no-key data API.
- Keep CSS and JavaScript separate, with one ES-module entry point and feature-focused files.

## Technologies

- HTML5 and CSS3 (custom properties, Grid, Flexbox, and media queries).
- Vanilla JavaScript ES modules; no framework or build step.
- `fetch` and async/await for country search.
- Browser `localStorage` for theme and best-score preferences.

## Folder structure

```text
skillspark/
├── index.html
├── css/
│   ├── styles.css
│   └── responsive.css
├── js/
│   ├── main.js
│   ├── navigation.js
│   ├── theme.js
│   ├── quiz-data.js
│   ├── quiz.js
│   ├── carousel.js
│   └── api.js
├── assets/
│   ├── images/fallback.svg
│   └── favicon.svg
├── README.md
├── TESTING.md
└── .gitignore
```

## Run locally

1. Open the `skillspark` folder in VS Code.
2. Install the **Live Server** extension if it is not already available.
3. Right-click `index.html` and choose **Open with Live Server**.
4. Browse to the local URL opened by the extension.

Serve the project over HTTP rather than opening the HTML file directly: ES modules are subject to browser origin/CORS rules, and `file://` can prevent module imports and network requests from working correctly.

## API details and current compatibility note

The country search requests:

```text
GET https://countriesnow.space/api/v0.1/countries/info?returns=currency,capital,flag,unicodeFlag
```

The verified response format is an object with `error: false` and a `data` array. Each country record can contain `name`, `capital`, `currency`, `flag`, and `unicodeFlag`. The page checks HTTP status and response shape, finds case-insensitive partial name matches, displays up to 12 results, and creates DOM nodes instead of interpolating API content as HTML. Missing values are identified instead of guessed. Empty input, no matches, loading, network/API failure, and retry states are handled.

**API choice and limitation:** The assignment named REST Countries and requested no API key. On 15 October 2026, the official REST Countries `/v3.1` endpoint returned a deprecation response, and its documented `/v5` search returned HTTP 401 without authentication. Following the requested no-key behavior, this project uses the separate CountriesNow API instead; it is **not REST Countries**. The verified endpoint supplies country name, flag, capital, and currency, but not region, population, or languages. Those fields are marked “Not provided by this source”. This third-party API may change or be unavailable.

## How it works

- **Quiz:** `quiz-data.js` contains 12 source questions. Each attempt shuffles the list and selects 10. `quiz.js` tracks one answer per question, shows feedback and explanations, calculates the result, builds the review with DOM APIs, and saves the best percentage to local storage.
- **Carousel:** `carousel.js` builds five slides from remote Unsplash image URLs, updates slide text and indicators, supports previous/next buttons and arrow keys, pauses on hover/focus, and suppresses autoplay for reduced-motion preferences. An image load failure switches to the included local landscape SVG.
- **Theme:** `theme.js` uses a saved `skillspark-theme` preference when available and otherwise follows the operating system preference. The toggle saves future changes to local storage.
- **Navigation:** `navigation.js` opens/closes the small-screen menu, closes it after a link choice or Escape, and resets it at wider viewport sizes.
- **Country search:** `api.js` fetches the no-key CountriesNow country list on button submit or Enter, filters it by name, prevents duplicate requests while loading, renders up to 12 matches, and reports empty input, no results, malformed responses, and network/API failures.

## Responsive breakpoints

- **Mobile:** up to 640px.
- **Tablet:** 641px and wider; quiz answers use a two-column layout from this breakpoint.
- **Split hero and country layouts:** 900px and wider, so these sections retain comfortable column widths on small tablets.
- **Desktop:** 1024px and wider.

Fluid widths, `clamp()` typography, and a mobile-first base layout supplement the explicit breakpoints.

## Accessibility

- Semantic landmarks, a skip link, labelled controls, visible focus styles, and keyboard-operable buttons.
- Quiz answers use native radio inputs and fieldsets; feedback, results, and API status use live regions.
- Carousel slides have meaningful alt text, labels, current-slide indicators, arrow-key controls, and a labelled play/pause button.
- Reduced-motion preference disables carousel autoplay and reduces CSS transitions.
- API response strings are rendered as text nodes, never interpreted as markup.

## Suggested 9-day development plan

1. Confirm requirements; sketch the sections and visual style.
2. Build semantic page structure and navigation.
3. Add mobile-first design tokens, typography, and hero layout.
4. Complete tablet/desktop breakpoints and theme persistence.
5. Add quiz data, question flow, scoring, and answer feedback.
6. Add quiz review, restart, shuffling, and saved best score.
7. Build carousel controls, keyboard support, autoplay, and image fallback.
8. Integrate country search, API states, and safe rendering.
9. Test responsive layouts/accessibility, fix issues, and complete documentation.

## Third-party services and limitations

- Country data: CountriesNow, a public no-key API (not REST Countries).
- Carousel photography: Unsplash image URLs; internet access is needed to load remote photos. The bundled SVG is the graceful fallback if an image fails.
- Fonts: Google Fonts (DM Sans and Manrope); system sans-serif fallback is used if the font service is unavailable.
- The API and remote images require internet access. Browser extensions, network policy, or service changes can block them. There is no backend, bundler, framework, or other JavaScript dependency.
- Older Safari versions may not support every modern CSS enhancement; solid-color and selected-answer fallbacks are included, and the carousel supports both modern and legacy media-query change listeners. ES modules and `fetch()` should be run from Live Server or another local HTTP server, not a `file://` URL.
