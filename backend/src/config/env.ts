import { z } from "zod";

const envSchema = z.object({
  // Server
  NODE_ENV: z.enum(["development", "staging", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(3000),
  APP_BASE_URL: z.string().url().default("http://localhost:3000"),

  // Database
  MONGODB_URI: z.string().default("mongodb://localhost:27017/avrum"),
  MONGODB_DB_NAME: z.string().default("avrum"),

  // JWT
  JWT_ACCESS_SECRET: z.string().default("dev-access-secret-key-change-in-production"),
  JWT_REFRESH_SECRET: z.string().default("dev-refresh-secret-key-change-in-production"),
  JWT_ACCESS_TTL: z.string().default("15m"),
  JWT_REFRESH_TTL: z.string().default("30d"),

  // Password Hashing
  PASSWORD_PEPPER: z.string().optional(),
  BCRYPT_ROUNDS: z.coerce.number().default(12),

  // CORS
  CORS_ALLOWED_ORIGINS: z
    .string()
    .default("http://localhost:5173,http://localhost:3000")
    .transform((val) => val.split(",")),

  // Email
  EMAIL_PROVIDER_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().email().default("noreply@avrum.ai"),

  // AWS S3
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_REGION: z.string().default("us-east-1"),
  AWS_S3_BUCKET: z.string().optional(),

  // External Services
  OPENWEATHER_API_KEY: z.string().optional(),
  AI_SERVICE_URL: z.string().url().default("http://localhost:5000"),
  AI_SERVICE_TOKEN: z.string().optional(),

  // Observability
  SENTRY_DSN: z.string().optional(),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),

  // Rate Limiting
  RATE_LIMIT_REQUESTS_PER_MINUTE: z.coerce.number().default(1000),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(60000),

  // API Key Management
  API_KEY_HASH_SECRET: z.string().optional(),

  // Webhook
  WEBHOOK_SIGNING_ALGO: z.string().default("sha256"),
});

export type Environment = z.infer<typeof envSchema>;

let env: Environment | null = null;

export function loadEnvironment(): Environment {
  if (env) return env;

  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    console.error("❌ Invalid environment variables:", errors);
    process.exit(1);
  }

  env = result.data;
  return env;
}

export function getEnv(): Environment {
  if (!env) {
    throw new Error("Environment not loaded. Call loadEnvironment() first.");
  }
  return env;
}
