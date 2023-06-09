import express from 'express';
import cors from 'cors';
import {router as authRoute} from "./routes/auth"
//IMPORT ROUTES

const app = express();

const corsOptions = {
  origin: `http://localhost:4200`
  };
  
app.use(cors(corsOptions));

const port = 3000;
app.use(express.json());

//API
app.use("/api/auth", authRoute);

app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
  });