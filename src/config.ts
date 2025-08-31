import { z } from 'zod';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Environment schema validation
const configSchema = z.object({
  TELEGRAM_BOT_TOKEN: z.string().min(1, 'Telegram bot token is required'),
  TELEGRAM_CHANNEL_ID: z.string().optional(),
  TELEGRAM_GROUP_ID: z.string().optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  POST_DIRECTORY: z.string().default('posts'),
});

// Parse and validate configuration
const parseConfig = (): z.infer<typeof configSchema> => {
  try {
    return configSchema.parse(process.env);
  } catch (error) {
    console.error('❌ Configuration error:', error);
    process.exit(1);
  }
};

export const config = parseConfig();

export type Config = typeof config;
