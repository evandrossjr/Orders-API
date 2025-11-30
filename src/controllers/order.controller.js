const db = require('../database/db');



    exports.createOrder = async (req, res)  => {
        try {
            const { numeroPedido, valorTotal, dataCriacao, items } = req.body;

            if (!numeroPedido || !valorTotal || !dataCriacao || !items || !items) {
                return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
            }

            const orderMapped = {
                orderId: numeroPedido,
                value: valorTotal,
                creationDates: new Date(dataCriacao).toISOString().slice(0, 19).replace('T', ' '),
            };

            await db.query (
                'INSERT INTO orders (orderId, value, creationDate) VALUES (?, ?, ?)',
                [orderMapped.orderId, orderMapped.value, orderMapped.creationDates]
            );

            for (const item of items) {
                const transformedItem = {
                    productId: Number(item.idItem),
                    quantity: item.quantidadeItem,
                    price: item.valorItem
                };

                await db.query(
                    'INSERT INTO items (productId, quantity, price) VALUES (?, ?, ?)',
                    [transformedItem.productId, transformedItem.quantity, transformedItem.price]
                );

            }

            res.status(201).json({ message: 'Pedido criado com sucesso.', order: orderMapped });
        } catch (error) {
            console.error('Erro ao criar o pedido:', error);
            res.status(500).json({ message: 'Erro ao criar o pedido.' });
        }
    };





//    //===================
//    getAllOrders: (req, res) => {
//        // Obter todos os pedidos
//        res.status(200).send('Lista de todos os pedidos');
//        
//    getOrderById: (req, res) => {
//        const orderId = req.params.id;  
//        // Obter um pedido pelo número
//        res.status(200).send(`Detalhes do pedido com ID: ${orderId}`);
//    },
//
//    updateOrder: (req, res) => {
//        const orderId = req.params.id;
//        // Atualizar um pedido pelo número
//        res.status(200).send(`Pedido com ID: ${orderId} atualizado`);
//    },
//
//    deleteOrder: (req, res) => {
//        const orderId = req.params.id;
//        // Deletar um pedido pelo número
//        res.status(200).send(`Pedido com ID: ${orderId} deletado`);
//    }
