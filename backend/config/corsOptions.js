import { allowedOrigins } from './allowedOrigins.js';

export const corsOptions = {
  origin(origin, callback) {
    // Allow requests from tools like Postman because they do not send an origin.
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    // Block browser requests from unknown frontend domains.
    callback(new Error('Not allowed by CORS'));
  },
  // Needed when frontend sends auth headers/cookies.
  credentials: true
};
