import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Teste para Programador Senior',
      version: '1.0.0',
      description: 'API Documentation',
    },
  },
  apis: ['./src/controller/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
