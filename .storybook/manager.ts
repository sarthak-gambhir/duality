import { addons } from "storybook/manager-api";
import { create } from "storybook/theming";

// Brand lockup: the Duality mark plus the wordmark. The manager UI is not part
// of the runtime --fg/--bg theme, so this uses fixed tones (black/white) that
// read on the light manager chrome.
const brandSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="104" height="24" viewBox="0 0 104 24">
  <path fill="#000000" d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
  <path fill="#ffffff" d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-5-4.68a8.965 8.965 0 0 0 5.707-2.613A8.965 8.965 0 0 0 15.32 7 6 6 0 1 1 7 15.32z"/>
  <text x="30" y="17" font-family="ui-sans-serif, system-ui, -apple-system, sans-serif" font-size="16" font-weight="700" fill="#000000">Duality</text>
</svg>`;

addons.setConfig({
  theme: create({
    base: "light",
    brandTitle: "Duality",
    brandUrl: "/",
    brandTarget: "_self",
    brandImage: `data:image/svg+xml,${encodeURIComponent(brandSvg)}`,
  }),
});
