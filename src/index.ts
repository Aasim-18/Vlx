import express from 'express';
import { DbConnection } from './config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  res.send('Server is Up and Running');
});

DbConnection.connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log("DB Connected successfully")
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to the database:', error);
  });


  // import routes here
  import userRoute from "./modules/user/user.route.js";



  // using routes
  app.use('/api/v1/users', userRoute);