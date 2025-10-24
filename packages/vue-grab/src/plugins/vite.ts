export interface VueGrabPluginOptions {
  adapter?: "cursor";
  enabled?: boolean;
  scriptSrc?: string;
}

export const vueGrab = (options: VueGrabPluginOptions = {}) => {
  const {
    adapter,
    enabled = true,
    scriptSrc = "//unpkg.com/vue-grab/dist/index.global.js",
  } = options;

  const dataAttrs: string[] = [];

  if (enabled !== undefined) {
    dataAttrs.push(`data-enabled="${enabled}"`);
  }

  if (adapter !== undefined) {
    dataAttrs.push(`data-adapter="${adapter}"`);
  }

  const scriptTag = `<script
      src="${scriptSrc}"
      crossorigin="anonymous"
      ${dataAttrs.join("\n      ")}
    ></script>`;

  return {
    apply: "serve" as const,
    name: "vite-plugin-vue-grab",
    transformIndexHtml: {
      handler(html: string) {
        return html.replace(
          "<head>",
          `<head>
    ${scriptTag}`,
        );
      },
      order: "pre" as const,
    },
  };
};
