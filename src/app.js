const express = require('express'); 
const app = express();


//Permissão para JSON
app.use(express.json());


//Importando as rotas
const orderRoutes = require('./routes/order.routes');

//Usando as rotas
app.use('/order', orderRoutes);



app.get('/', (req, res) => {
    res.send('Estou funcionando!');
});


module.exports = app;