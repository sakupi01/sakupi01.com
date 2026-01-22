export const CodeSandboxTransformer = {
  name: "CodeSandbox",
  // shouldTransform can also be async
  shouldTransform(url: string | URL) {
    const { host, pathname } = new URL(url);

    return (
      ["codesandbox.io", "www.codesandbox.io"].includes(host) &&
      pathname.includes("/s/")
    );
  },
  // getHTML can also be async
  getHTML(url: string) {
    const iframeUrl = url.replace("/s/", "/embed/");

    return `<iframe title='codesandbox' src="${iframeUrl}" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking" sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin"></iframe>`;
  },
};
