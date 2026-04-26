/**
 * Helper to generate the SSO Login URL.
 * This is a local implementation because the sso-sumut-client package 
 * seems to be missing the frontend export in this version.
 */
export function getLoginUrl(serverUrl: string, redirectUrl: string): string {
  try {
    const url = new URL(serverUrl);
    // Standard pattern for many SSO systems: append the redirect URL as a query parameter
    url.searchParams.set('redirect', redirectUrl);
    return url.toString();
  } catch (error) {
    console.error('Invalid URL provided to getLoginUrl:', error);
    return `${serverUrl}?redirect=${encodeURIComponent(redirectUrl)}`;
  }
}
