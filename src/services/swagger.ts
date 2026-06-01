import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import swaggerAutogen from 'swagger-autogen';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = Number(process.env.PORT ?? 5000);

const doc = {
  info: {
    title: 'Vlx API',
    description: 'Hyper-local college marketplace API',
  },
  servers: [{ url: `http://localhost:${port}` }],
  components: {
    securitySchemes: {
      ClerkAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [{ ClerkAuth: [] }],
};

const outputFile = path.resolve(__dirname, 'swagger-output.json');
const routes = [
  path.resolve(__dirname, '..', 'index.ts'),
  path.resolve(__dirname, '..', 'modules', 'user', 'user.route.ts'),
];

swaggerAutogen({ openapi: '3.0.0' })(outputFile, routes, doc);
