const db = require('../database/db');


 class OrderService {
    
     async createOrder(data) {
        const { numeroPedido, valorTotal, dataCriacao, items } = data;

        const orderMapped = {
            orderId: numeroPedido,
            value: valorTotal,
            creationDates: new Date(dataCriacao).toISOString().slice(0, 19).replace('T', ' '),
        };

        await db.query(
            'INSERT INTO orders (orderId, value, creationDate) VALUES (?, ?, ?)',
            [orderMapped.orderId, orderMapped.value, orderMapped.creationDates]
        );

        for (const item of items) {
            await db.query(
                'INSERT INTO items (orderId, productId, quantity, price) VALUES (?, ?, ?, ?)',
                [orderMapped.orderId, Number(item.idItem), item.quantidadeItem, item.valorItem]
            );
        }

        return orderMapped;
    }


    async getAllOrders() {
        const [orders] = await db.query(`
            SELECT o.orderId, o.value, o.creationDate, 
                   i.productId, i.quantity, i.price 
            FROM orders o 
            LEFT JOIN items i ON o.orderId = i.orderId
        `);

        const ordersMap = {};

        orders.forEach(r => {
            if (!ordersMap[r.orderId]) {
                ordersMap[r.orderId] = {
                    orderId: r.orderId,
                    value: r.value,
                    creationDate: r.creationDate,
                    items: []
                };
            }

            if (r.productId != null) {
                ordersMap[r.orderId].items.push({
                    productId: r.productId,
                    quantity: r.quantity,
                    price: r.price
                });
            }
        });

        return Object.values(ordersMap);
    }


    async getOrderById(orderId) {
        const [[order]] = await db.query(
            "SELECT * FROM orders WHERE orderId = ?", 
            [orderId]
        );

        if (!order) return null;

        const [items] = await db.query(
            "SELECT * FROM items WHERE orderId = ?", 
            [orderId]
        );

        return { ...order, items };
    }


    async updateOrder(orderId, data) {
        const { valorTotal, dataCriacao, items } = data;

        const [rows] = await db.query(
            'SELECT * FROM orders WHERE orderId = ?', 
            [orderId]
        );

        if (rows.length === 0) return null;

        const updatedOrder = {
            value: valorTotal,
            creationDate: new Date(dataCriacao).toISOString().slice(0, 19).replace('T', ' '),
        };

        await db.query(
            'UPDATE orders SET value = ?, creationDate = ? WHERE orderId = ?',
            [updatedOrder.value, updatedOrder.creationDate, orderId]
        );

        await db.query('DELETE FROM items WHERE orderId = ?', [orderId]);

        for (const item of items) {
            await db.query(
                'INSERT INTO items (orderId, productId, quantity, price) VALUES (?, ?, ?, ?)',
                [orderId, Number(item.idItem), item.quantidadeItem, item.valorItem]
            );
        }

        return updatedOrder;
    }


    async deleteOrder(orderId) {
        const [[order]] = await db.query(
            'SELECT * FROM orders WHERE orderId = ?', 
            [orderId]
        );

        if (!order) return null;

        await db.query('DELETE FROM items WHERE orderId = ?', [orderId]);
        await db.query('DELETE FROM orders WHERE orderId = ?', [orderId]);

        return true;
    }
}

module.exports = new OrderService();