import express from 'express';
import cors from 'cors';
import path from 'path';
import {router as authRoute} from "./routes/auth"
import {router as userRoute} from "./routes/user"
//IMPORT ROUTES

const app = express();

const corsOptions = {
  origin: `http://localhost:4200`
  };
  
app.use(cors(corsOptions));

const port = 3000;
app.use(express.json());
app.use('/profilePictures', express.static(path.join(__dirname, 'profilePictures')));

//API
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute)

app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
  });