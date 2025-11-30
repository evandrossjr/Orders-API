const express = require('express'); 
const app = express();
const swaggerDocs = require('./config/swagger');



//Permissão para JSON
app.use(express.json());


//Importando as rotas
const orderRoutes = require('./routes/order.routes');

//Usando as rotas
app.use('/order', orderRoutes);


//Rota de teste
app.get('/', (req, res) => {
    res.send('Estou funcionando!');
});

//Documentação com Swagger
swaggerDocs(app);

module.exports = app;