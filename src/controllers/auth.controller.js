const authService = require("../services/auth.service");
const { validationResult } = require("express-validator");


exports.register = async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    try {
        const { email, password } = req.body;

        const result = await authService.register(email, password);

        return res.status(201).json({
            message: "Usuário registrado com sucesso",
            usuario: result
        });

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

exports.login = async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    
    try {
        const { email, password } = req.body;

        const result = await authService.login(email, password);

        return res.status(200).json({
            message: "Login realizado com sucesso",
            token: result.token
        });

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
