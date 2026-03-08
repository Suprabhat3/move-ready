import express, { Express, NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fromNodeHeaders, toNodeHandler } from 'better-auth/node';
import { prisma } from './lib/prisma';
import { auth } from './auth';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 4000;
const frontendOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(
  cors({
    origin: frontendOrigin,
    credentials: true,
  }),
);
app.use(helmet({
  contentSecurityPolicy: false, // Often needed if you have external scripts/fonts and don't want to configure CSP fully yet
}));
app.use(morgan('dev'));

// Better Auth should handle body parsing for auth endpoints.
const authHandler = toNodeHandler(auth.handler);
app.all('/api/auth/*splat', authHandler);
app.all('/api/auth', authHandler);

app.use(express.json());

import imagekitRoutes from './routes/imagekit';
app.use('/api/imagekit', imagekitRoutes);

import listingsRoutes from './routes/listings';
app.use('/api/listings', listingsRoutes);

import ticketsRoutes from './routes/tickets';
app.use('/api/tickets', ticketsRoutes);

import visitsRoutes from './routes/visits';
app.use('/api/visits', visitsRoutes);

import moveInRoutes from './routes/move-in';
app.use('/api/move-in', moveInRoutes);

app.get('/api/health', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      status: 'ok',
      message: 'Server is up & DB connection is established',
      db: 'connected',
      time: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server is up but DB connection failed',
      db: 'disconnected',
      time: new Date().toISOString(),
    });
  }
});

app.get('/api/me', async (req: Request, res: Response) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  return res.status(200).json(session);
});

// Serve static files from the React app
const frontendPath = path.join(__dirname, '../../frontend/dist');
app.use(express.static(frontendPath));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Health check: http://localhost:${port}/api/health`);
  console.log(`Auth base: http://localhost:${port}/api/auth`);
});
