const db = require("../database/db");
const bcrypt = require("bcrypt");
const e = require("express");
const jwt = require("jsonwebtoken");

exports.register = async (email, password) => {

    const [[userExists]] = await db.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
    );

    if (userExists) {
        throw new Error("Usuário já existe");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await db.query(
        "INSERT INTO users (email, password) VALUES (?, ?)",
        [email, passwordHash]
    );

    return { email };
};

exports.login = async (email, password) => {

    const [[user]] = await db.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
    );

    if (!user) {
        throw new Error("Usuário não encontrado");
    }

    const passwordValida = await bcrypt.compare(password, user.password);
    if (!passwordValida) {
        throw new Error("Senha inválida");
    }

    const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES }
    );

    return { token };
};
