const orderService = require('../services/order.service');

exports.createOrder = async (req, res) => {
    try {
        const data = await orderService.createOrder(req.body);
        res.status(201).json({ message: "Pedido criado com sucesso.", data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const data = await orderService.getAllOrders();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const data = await orderService.getOrderById(req.params.id);
        if (!data) return res.status(404).json({ message: "Pedido não encontrado." });
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateOrder = async (req, res) => {
    try {
        const data = await orderService.updateOrder(req.params.orderId, req.body);
        if (!data) return res.status(404).json({ message: "Pedido não encontrado." });
        res.status(200).json({ message: "Pedido atualizado com sucesso.", data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        const ok = await orderService.deleteOrder(req.params.id);
        if (!ok) return res.status(404).json({ message: "Pedido não encontrado." });
        res.status(200).json({ message: "Pedido deletado com sucesso." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
