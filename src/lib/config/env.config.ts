import { z } from 'zod'

/**
 * Environment variable schema using Zod for validation
 * Validates all environment variables at application startup
 */
const envSchema = z.object({
  // Node Environment
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  NEXT_PHASE: z.string().optional(),
  PORT: z.string().default('3000'),

  // Database Configuration
  POSTGRES_HOST: z.string().min(1, 'POSTGRES_HOST is required'),
  POSTGRES_PORT: z
    .string()
    .default('5432')
    .transform((val) => parseInt(val, 10)),
  POSTGRES_USER: z.string().min(1, 'POSTGRES_USER is required'),
  POSTGRES_PASSWORD: z.string().min(1, 'POSTGRES_PASSWORD is required'),
  POSTGRES_DATABASE: z.string().min(1, 'POSTGRES_DATABASE is required'),
  POSTGRES_SSL: z
    .string()
    .optional()
    .transform((val) => val === 'true'),

  // SMTP Configuration
  SMTP_SERVER_HOST: z.string().min(1, 'SMTP_SERVER_HOST is required'),
  SMTP_SERVER_USERNAME: z.string().min(1, 'SMTP_SERVER_USERNAME is required'),
  SMTP_SERVER_PASSWORD: z.string().min(1, 'SMTP_SERVER_PASSWORD is required'),
  SITE_MAIL_RECEIVER: z
    .string()
    .email('SITE_MAIL_RECEIVER must be a valid email'),
  SMTP_SERVER_PORT: z
    .string()
    .min(1, 'SMTP_SERVER_PORT is required')
    .transform((val) => parseInt(val, 10)),
  SMTP_SERVER_SECURE: z
    .string()
    .default('false')
    .transform((val) => val === 'true'),
  SMTP_SIMULATOR: z
    .string()
    .default('true')
    .transform((val) => val === 'true'),

  // NextAuth Configuration
  NEXTAUTH_SECRET: z.string().min(1, 'NEXTAUTH_SECRET is required'),

  // Build Configuration
  BUILD_TYPE: z.enum(['static', 'standalone', 'default']).optional(),
  SERVER_ACTIONS_BODY_SIZE_LIMIT: z.string().optional()
})

/**
 * Validated environment configuration
 * Throws error if validation fails at startup
 */
export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PHASE: process.env.NEXT_PHASE,
  PORT: process.env.PORT,
  POSTGRES_HOST: process.env.POSTGRES_HOST,
  POSTGRES_PORT: process.env.POSTGRES_PORT,
  POSTGRES_USER: process.env.POSTGRES_USER,
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
  POSTGRES_DATABASE: process.env.POSTGRES_DATABASE,
  POSTGRES_SSL: process.env.POSTGRES_SSL,
  SMTP_SERVER_HOST: process.env.SMTP_SERVER_HOST,
  SMTP_SERVER_USERNAME: process.env.SMTP_SERVER_USERNAME,
  SMTP_SERVER_PASSWORD: process.env.SMTP_SERVER_PASSWORD,
  SITE_MAIL_RECEIVER: process.env.SITE_MAIL_RECEIVER,
  SMTP_SERVER_PORT: process.env.SMTP_SERVER_PORT,
  SMTP_SERVER_SECURE: process.env.SMTP_SERVER_SECURE,
  SMTP_SIMULATOR: process.env.SMTP_SIMULATOR,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  BUILD_TYPE: process.env.BUILD_TYPE,
  SERVER_ACTIONS_BODY_SIZE_LIMIT: process.env.SERVER_ACTIONS_BODY_SIZE_LIMIT
})

/**
 * Type-safe environment configuration
 */
export type EnvConfig = z.infer<typeof envSchema>
