import morgan from 'morgan';
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import AppError from './utils/appError.js';
import userRouter from './routes/user-routes.js';

const app = express();

app.use(cors());
app.use(express.json({}));
app.use(morgan('dev'));
app.use('/users', userRouter);

app.get('/', (_, res) => res.send('Welcome to ALU-Globe API!'));

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use((err, _, res) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.statusText,
    });
  }

  res.status(500).json({
    status: 'error',
    message: 'Something went wrong!',
  });
});

export default app;
