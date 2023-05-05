import crypto from "node:crypto";

export function base64URLEncode(str = "") {
  if (!str) str = crypto.randomBytes(32)
  return str
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

export function sha256(buffer) {
  return crypto.createHash("sha256").update(buffer).digest();
}

export function generateState() {
  const n = crypto.randomInt(0, 1000000);
  return n.toString().padStart(6, "0");
  
}