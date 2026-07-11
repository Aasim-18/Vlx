import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { clerkMiddleware } from '@clerk/express';
import ngrok from '@ngrok/ngrok';
import { DbConnection } from './config/db.js';
import { globalErrorHandler } from './middlewares/globalErrorHandler.js';
import { rateLimit } from './middlewares/rateLimiter.js';
import { globalLimiter } from './lib/globalLimiters.js';
// import Routes here
import userRoutes from './modules/user/user.route.js';
import productRoutes from './modules/products/product.route.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

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
app.get('/health', (_req, res) => {
  res.send('Server is Up and Running');
});

app.use('/api/v1', rateLimit(globalLimiter));
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products', productRoutes);

// Error Handler
app.use(globalErrorHandler);

// Start Server
DbConnection.connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log('DB Connected successfully');
      console.log(`Server is running on port ${PORT}`);
      // ngrok Tunnel
      ngrok
        .connect({ addr: PORT, authtoken_from_env: true })
        .then((listener) => console.log(`Ingress established at: ${listener.url()}`))
        .catch((error) => console.error('Failed to establish ngrok tunnel:', error));
    });
  })
  .catch((error) => {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  });
