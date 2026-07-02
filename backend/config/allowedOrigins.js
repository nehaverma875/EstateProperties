import { env } from './env.js';

// Frontend URL allowed to call this backend.
// In local development this is http://localhost:3000.
export const allowedOrigins = [env.clientOrigin];
