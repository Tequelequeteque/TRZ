import 'reflect-metadata';
import express from 'express';
import 'express-async-errors';
import './database/db.connection';
import './containers';
import cors from 'cors';
import routes from './routes';
import GlobalExceptionHandler from './controllers/GlobalExceptionHandler.controller';

const app = express();

app.use(express.json());
app.use(cors());

app.use(routes);

app.use(GlobalExceptionHandler);

export default app;
