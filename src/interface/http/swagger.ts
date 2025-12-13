import swaggerJsDoc from 'swagger-jsdoc';

const options: swaggerJsDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Tirage au Sort API',
            version: '1.0.0',
            description: 'API for managing draws, participants, and prizes.',
        },
        servers: [
            {
                url: 'http://localhost:3000/api',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./src/interface/http/routes/*.ts', './src/interface/http/controllers/*.ts'], // Path to the API docs
};

export const swaggerSpec = swaggerJsDoc(options);
