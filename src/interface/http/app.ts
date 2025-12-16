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
import cronRoutes from './routes/cron.routes';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "https://cdn.redoc.ly"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
        }
    }
}));
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRouter);
app.use('/api', drawsRouter);
app.use('/api', participantsRouter);
app.use('/api', prizesRouter);
app.use('/api/cron', cronRoutes);

// API Documentation with Redoc
import * as path from 'path';
import * as fs from 'fs';
import * as yaml from 'js-yaml';

const openapiPath = path.join(__dirname, '../../../docs/openapi.yaml');
const openapiSpec = yaml.load(fs.readFileSync(openapiPath, 'utf8'));

// Serve OpenAPI spec as JSON
app.get('/api-docs/openapi.json', (req, res) => {
    res.json(openapiSpec);
});

// Serve Redoc HTML
app.get('/api-docs', (req, res) => {
    const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Tirage au Sort API Documentation</title>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700|Roboto:300,400,700" rel="stylesheet">
    <style>
        body {
            margin: 0;
            padding: 0;
        }
    </style>
</head>
<body>
    <redoc spec-url='/api-docs/openapi.json' theme='{"colors": {"primary": {"main": "#10b981"}}}'></redoc>
    <script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"></script>
</body>
</html>
    `;
    res.send(html);
});


// Error Handler
app.use(errorHandler);

export default app;
