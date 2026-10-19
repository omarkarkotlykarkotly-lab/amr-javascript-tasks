import type { Preview } from "@storybook/react";
import "../src/accordion/accordion.css";

const preview: Preview = {
  parameters: {
    controls: { expanded: true },
    actions: { argTypesRegex: "^on[A-Z].*" },
  },
};

export default preview;
