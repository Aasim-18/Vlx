import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { clerkMiddleware } from '@clerk/express';
import ngrok from '@ngrok/ngrok';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import swaggerUi from 'swagger-ui-express';

import { DbConnection } from './config/db.js';
import { globalErrorHandler } from './middlewares/globalErrorHandler.js';
// import Routes here
import userRoutes from './modules/user/user.route.js';
import productRoutes from './modules/products/product.route.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(clerkMiddleware());
app.use(
  cors({
    // for development setting origin as *
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

// Routes
app.get('/', (_req, res) => {
  res.send('Server is Up and Running');
});

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products', productRoutes);

// Error Handler
app.use(globalErrorHandler);

// Swagger Docs
const swaggerPath = path.join(__dirname, 'services', 'swagger-output.json');
let swaggerDocument: Record<string, unknown> | null = null;

try {
  const raw = fs.readFileSync(swaggerPath, 'utf-8').trim();
  if (raw) {
    swaggerDocument = JSON.parse(raw) as Record<string, unknown>;
  }
} catch {
  console.warn('Swagger output missing or invalid. Run "npm run swagger" to generate it.');
}

if (swaggerDocument) {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

// Start Server
DbConnection.connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log('DB Connected successfully');
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to the database:', error);
  });

// ngrok Tunnel
ngrok
  .connect({ addr: PORT, authtoken_from_env: true })
  .then((listener) => console.log(`Ingress established at: ${listener.url()}`));
