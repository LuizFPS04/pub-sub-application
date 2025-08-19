import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

import connectToDatabase from './config/database';
import routes from './routes/index';
import { runTasks } from './tasks';
import './events/eventEmitter';

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api", routes);

async function startApp() {
    await connectToDatabase();
    await runTasks();
}

startApp();

export default app;