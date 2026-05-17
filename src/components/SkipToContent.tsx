/**
 * Skip-to-content-länk. Synlig endast vid keyboard-focus.
 *
 * Placeras högst upp i Layout. Sätt id="main" på `<main>`.
 * Detta täcker WCAG 2.4.1 (Bypass Blocks).
 */
const SkipToContent = () => (
  <a
    href="#main"
    className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
  >
    Hoppa till innehåll
  </a>
);

export default SkipToContent;
