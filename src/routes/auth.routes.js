const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

const {
  registerValidator,
  loginValidator
} = require("../validators/auth.validator");


/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoints de autenticação
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           example: usuario@email.com
 *           description: Deve ser um email válido
 *         password:
 *           type: string
 *           example: "123456"
 *           minLength: 6
 *           description: Deve ter no mínimo 6 caracteres
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           example: usuario@email.com
 *         password:
 *           type: string
 *           example: "123456"
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar novo usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso
 *       400:
 *         description: Erro de validação
 *       409:
 *         description: Usuário já existe
 */
router.post("/register", registerValidator, authController.register);



/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login do usuário e retorno do token JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       400:
 *         description: Erro de validação
 *       401:
 *         description: Credenciais inválidas
 */
router.post("/login", loginValidator, authController.login);

module.exports = router;