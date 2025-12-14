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

import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger';

// Swagger UI only works in development (express.static doesn't work on Vercel serverless)
if (process.env.NODE_ENV !== 'production') {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
} else {
    // In production, serve only the JSON spec
    app.get('/api-docs/swagger.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });

    app.get('/api-docs', (req, res) => {
        res.json({
            message: 'API Documentation',
            spec: '/api-docs/swagger.json',
            note: 'Use tools like Postman or Swagger Editor to view the spec'
        });
    });
}

// Error Handler
app.use(errorHandler);

export default app;
