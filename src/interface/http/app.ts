import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './middlewares/errorHandler';
// Routes
import { authRouter } from './routes/auth.routes';
import { drawsRouter } from './routes/draws.routes';
import { participantsRouter } from './routes/participants.routes';
import { prizesRouter } from './routes/prizes.routes';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRouter);
app.use('/api', drawsRouter);
app.use('/api', participantsRouter);
app.use('/api', prizesRouter);


// Error Handler
app.use(errorHandler);

export default app;
