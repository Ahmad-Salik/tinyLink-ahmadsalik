// src/utils/generateCode.js

/*
|--------------------------------------------------------------------------
| generateCode()
| Generates a random 6-character alphanumeric short code
|--------------------------------------------------------------------------
| Used when the user does NOT provide a custom code.
| Controller will attempt regeneration if a collision occurs.
|--------------------------------------------------------------------------
*/

export function generateCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";

  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }

  return code;
}
