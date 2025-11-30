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
                    'INSERT INTO items (orderId, productId, quantity, price) VALUES (?, ?, ?, ?)',
                    [orderMapped.orderId, transformedItem.productId, transformedItem.quantity, transformedItem.price]
                );

            }

            res.status(201).json({ message: 'Pedido criado com sucesso.', order: orderMapped });
        } catch (error) {
            console.error('Erro ao criar o pedido:', error);
            res.status(500).json({ message: 'Erro ao criar o pedido.' });
        }
    };





    exports.getAllOrders = async (req, res) => {
        try {
            const [orders] = await db.query('SELECT o.orderId, o.value, o.creationDate, i.productId, i.quantity, i.price FROM orders o LEFT JOIN items i ON o.orderId = i.orderId');

            const ordersMap = {};

            orders.forEach(r => {
                if(!ordersMap[r.orderId]){
                    ordersMap[r.orderId] = {
                        orderId: r.orderId,
                        value: r.value,
                        creationDate: r.creationDate,
                        items: []
                    };
                }

                if (r.productId != null){
                    ordersMap[r.orderId].items.push({
                        productId: r.productId,
                        quantity: r.quantity,
                        price: r.price
                    });
                }
            });

            res.json(Object.values(ordersMap));

        }catch (err){
            console.error(err);
            res.status(500).json({ error: "Erro ao listar os pedidos"});
        }

    };


   exports.getOrderById = async (req, res) => {
         const orderId = req.params.id;

         const [[ order ]] = await db.query("SELECT * FROM orders WHERE orderId = ?", [orderId]);

         if (!order) {
             return res.status(404).json({ message: 'Pedido não encontrado.' });
         }

         const [ items ] = await db.query("SELECT * FROM items WHERE orderId = ?", [orderId]);

         res.status(200).json({ ...order, items });
     };
    







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
