import { betterAuth } from 'better-auth';
import { prismaAdapter } from '@better-auth/prisma-adapter';
import { prisma } from './lib/prisma';

const defaultTrustedOrigins = ['http://localhost:5173', 'http://localhost:3000'];

const trustedOrigins = process.env.TRUSTED_ORIGINS
  ? process.env.TRUSTED_ORIGINS.split(',').map((origin) => origin.trim())
  : defaultTrustedOrigins;

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  user: {
    modelName: 'User',
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "TENANT"
      }
    }
  },
  session: {
    modelName: 'Session',
  },
  account: {
    modelName: 'Account',
  },
  verification: {
    modelName: 'Verification',
  },
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins,
});
