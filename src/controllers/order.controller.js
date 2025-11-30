module.exports = {

    createOrder: (req, res) => {
        // Criar um pedido
        res.status(201).send('Pedido criado');
    },

    getAllOrders: (req, res) => {
        // Obter todos os pedidos
        res.status(200).send('Lista de todos os pedidos');
    },

    getOrderById: (req, res) => {
        const orderId = req.params.id;  
        // Obter um pedido pelo número
        res.status(200).send(`Detalhes do pedido com ID: ${orderId}`);
    },

    updateOrder: (req, res) => {
        const orderId = req.params.id;
        // Atualizar um pedido pelo número
        res.status(200).send(`Pedido com ID: ${orderId} atualizado`);
    },

    deleteOrder: (req, res) => {
        const orderId = req.params.id;
        // Deletar um pedido pelo número
        res.status(200).send(`Pedido com ID: ${orderId} deletado`);
    }
}