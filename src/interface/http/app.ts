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

// Swagger UI configuration with custom assets for Vercel compatibility
const swaggerUiOptions = {
    customCssUrl: '/swagger-ui/swagger-ui.css',
    customJs: '/swagger-ui/swagger-ui-bundle.js',
    swaggerOptions: {
        url: '/api-docs/swagger.json',
    }
};

// Serve Swagger spec as JSON
app.get('/api-docs/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

// Serve Swagger UI with custom assets
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

// Error Handler
app.use(errorHandler);

export default app;
