const { body } = require("express-validator");

exports.registerValidator = [
  body("email")
    .notEmpty().withMessage("Email é obrigatório")
    .isEmail().withMessage("Email inválido"),

  body("password")
    .notEmpty().withMessage("Senha é obrigatória")
    .isLength({ min: 6 }).withMessage("A senha deve ter no mínimo 6 caracteres"),
];

exports.loginValidator = [
  body("email")
    .notEmpty().withMessage("Email é obrigatório")
    .isEmail().withMessage("Email inválido"),

  body("password")
    .notEmpty().withMessage("Senha é obrigatória"),
];
