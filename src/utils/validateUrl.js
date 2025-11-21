// src/utils/validateUrl.js

/*
|--------------------------------------------------------------------------
| isValidUrl(url)
| Safely validates whether a string is a valid URL
|--------------------------------------------------------------------------
| Returns: true  → valid URL
|          false → invalid URL
|--------------------------------------------------------------------------
*/

export function isValidUrl(url) {
  try {
    new URL(url); // Throws if invalid
    return true;
  } catch {
    return false;
  }
}
