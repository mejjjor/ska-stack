import { z } from 'zod';

const envSchema = z.object({
  COOKIE_SECRET: z.string().min(1),
  SESSION_MAX_AGE: z.number(),
  POSTGRESQL_ADDON_URI: z.string().min(1),
  NODE_ENV: z.enum(['production', 'development']),
});

export const env = envSchema.parse({
  ...process.env,
  SESSION_MAX_AGE: Number.parseInt(process.env.SESSION_MAX_AGE ?? '10', 10),
});
