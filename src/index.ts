import express from 'express';
import { DbConnection } from './config/db.js';
import dotenv from 'dotenv';
import { clerkMiddleware } from '@clerk/express';
import ngrok from '@ngrok/ngrok';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import swaggerUi from 'swagger-ui-express';
import { globalErrorHandler } from './middlewares/globalErrorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(clerkMiddleware());
app.use(
  cors({
    // for developmet setting origin as *
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);
app.use(globalErrorHandler);

app.get('/', (req, res) => {
  res.send('Server is Up and Running');
});

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

// ngrok connection
ngrok
  .connect({ addr: PORT, authtoken_from_env: true })
  .then((listener) => console.log(`Ingress established at: ${listener.url()}`));

// import routes here
import userRoutes from './modules/user/user.route.js';
import productRoutes from './modules/products/product.route.js';

// using routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products', productRoutes);
