export function hexToRgb(hex: string) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

export function generateHash(length: Number) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

interface config {
  nonce: String;
  strictDynamic?: Boolean;
}

export function getContentSecurityPolicy({
  nonce,
  strictDynamic = false,
}: config) {
  const externalImg = ["*.githubusercontent.com"];

  const _strictDynamic = strictDynamic ? "'strict-dynamic'" : "";
  const _unsafeInline = "'unsafe-inline'";
  const _https = strictDynamic ? "https:" : "";

  console.log(_strictDynamic);
  return (
    "default-src 'self'; " +
    `script-src 'self' ${_strictDynamic} 'nonce-${nonce}' ${_unsafeInline} ${_https}; ` +
    `style-src 'self' ${_strictDynamic} ${_unsafeInline}; ` +
    `img-src 'self' data: ${externalImg.join(" ")}; ` +
    "font-src 'self'; " +
    `connect-src 'self' ${externalImg.join(" ")} https:; ` +
    "media-src 'self'; " +
    "object-src 'none'; " +
    "prefetch-src 'self'; " +
    "child-src 'self'; " +
    "frame-src 'self'; " +
    "worker-src 'self' blob:; " +
    "frame-ancestors 'none'; " +
    "form-action 'self'; " +
    "block-all-mixed-content; " +
    "base-uri 'self'; " +
    "manifest-src 'self'; " +
    "script-src-attr 'none'; " +
    "upgrade-insecure-requests; "
  );
}
