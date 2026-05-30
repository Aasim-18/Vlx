import express from 'express';
import { DbConnection } from './config/db.js';
import dotenv from 'dotenv';
import { clerkMiddleware } from '@clerk/express';
import ngrok from '@ngrok/ngrok';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

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

app.get('/', (req, res) => {
  res.send('Server is Up and Running');
});

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
import userRoute from './modules/user/user.route.js';

// using routes
app.use('/api/v1/users', userRoute);
