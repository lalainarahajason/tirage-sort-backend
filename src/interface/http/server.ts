import 'dotenv/config';
import app from './app';
import { logger } from '../../shared/utils/logger';

const PORT = process.env.PORT || 3000;

// For local development
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        logger.info(`Server is running on port ${PORT}`);
    });
}

// Export for Vercel
export default app;
