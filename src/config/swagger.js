const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');


const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Orders API',
            version: '1.0.0',
            description: "Documentação da API de pedidos com Swagger",
        },
    
        servers: [{ url: 'http://localhost:3000',
        description: 'Servidor Local' }],           
    },
    apis: [
        path.join(__dirname, "..", "routes", "*.js"),
    ],
};

const swaggerSpec = swaggerJSDoc(options);

function swaggerDocs(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = swaggerDocs;