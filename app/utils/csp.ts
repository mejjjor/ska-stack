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
