import crypto from 'node:crypto';

const COOKIE_NAME = 'ejs_admin_session';
const MAX_AGE = 60 * 60 * 8;

function secret() {
  return process.env.ADMIN_SESSION_SECRET || 'ejs-change-this-session-secret-in-vercel';
}

function sign(value) {
  return crypto.createHmac('sha256', secret()).update(value).digest('base64url');
}

export function createSessionCookie() {
  const expires = Math.floor(Date.now() / 1000) + MAX_AGE;
  const payload = `admin.${expires}`;
  const token = `${payload}.${sign(payload)}`;
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=${MAX_AGE}`;
}

export function clearSessionCookie() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=0`;
}

function parseCookies(header = '') {
  return Object.fromEntries(header.split(';').map(v => v.trim()).filter(Boolean).map(v => {
    const idx = v.indexOf('=');
    return idx === -1 ? [v, ''] : [v.slice(0, idx), v.slice(idx + 1)];
  }));
}

export function isAuthenticated(req) {
  const token = parseCookies(req.headers.cookie || '')[COOKIE_NAME];
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  const [role, exp, signature] = parts;
  if (role !== 'admin' || !/^\d+$/.test(exp)) return false;
  if (Number(exp) < Math.floor(Date.now() / 1000)) return false;
  const payload = `${role}.${exp}`;
  const expected = sign(payload);
  try {
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function validCredentials(user, password) {
  const expectedUser = process.env.ADMIN_USER || 'barriga@123456';
  const expectedPassword = process.env.ADMIN_PASSWORD || 'ejs@2026';
  return user === expectedUser && password === expectedPassword;
}
