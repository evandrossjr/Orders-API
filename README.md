# Orders API --- Documentação Completa

Uma API REST completa para **gestão de pedidos**, com **autenticação
JWT**, **validações**, **Swagger**, **MySQL** e arquitetura organizada
em camadas. O projeto também foi gerenciado com o Azure DevOps e em cada commit há o código da referida task.

------------------------------------------------------------------------

# Sumário

-   [Descrição](#descrição)
-   [Tecnologias](#tecnologias)
-   [Arquitetura](#arquitetura)
-   [Instalação](#instalação)
-   [.env](#env)
-   [SQL](#sql)
-   [Autenticação JWT](#autenticação-jwt)
-   [Rotas Detalhadas](#rotas-detalhadas)
    -   [/auth/register](#post-authregister)
    -   [/auth/login](#post-authlogin)
    -   [/orders](#post-orders)
    -   [/orders/list](#get-orderslist)
    -   [/orders/{id}](#get-ordersid)
    -   [/orders/{id} - PUT](#put-ordersid)
    -   [/orders/{id} - DELETE](#delete-ordersid)
-   [.gitignore](#gitignore)

------------------------------------------------------------------------

# Descrição

A **Orders API** gerencia pedidos e itens relacionados, com controle de
usuários, autenticação JWT e acesso seguro às rotas de pedidos.

Ela oferece:

✔ CRUD completo de pedidos\
✔ Registro e login de usuários\
✔ Tokens JWT com expiração configurável\
✔ Rotas protegidas\
✔ Validação com express-validator\
✔ Documentação automática via Swagger\
✔ Persistência com MySQL

------------------------------------------------------------------------

# Tecnologias

-   Node.js\
-   Express\
-   MySQL (mysql2/promise)\
-   JWT\
-   bcrypt\
-   express-validator\
-   Swagger\
-   dotenv

------------------------------------------------------------------------

# Arquitetura

    src/
     ├── app.js
     ├── config/
     │    └── swagger.js
     ├── controllers/
     │    ├── auth.controller.js
     │    └── order.controller.js
     ├── database/
     │    └── db.js
     ├── middlewares/
     │    └── auth.middleware.js
     ├── validators/
     │    └── auth.validator.js
     ├── routes/
     │    ├── auth.routes.js
     │    └── order.routes.js
     └── services/
          ├── auth.service.js
          └── order.service.js

------------------------------------------------------------------------

# Instalação

``` bash
npm install
npm run dev
```

------------------------------------------------------------------------

# .env

``` env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD="sua senha"
DB_NAME=orders_db

JWT_SECRET=super_senha_segura
JWT_EXPIRES=1d
```

------------------------------------------------------------------------

# SQL
## Darabase: orders_db

``` sql
CREATE DATABASE orders_db;
```

## Tabela: orders

``` sql
CREATE TABLE `orders` (
  `orderId` varchar(50) NOT NULL,
  `value` decimal(10,2) NOT NULL,
  `creationDate` datetime NOT NULL,
  PRIMARY KEY (`orderId`)
);
```

## Tabela: items

``` sql
CREATE TABLE `items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `orderId` varchar(50) DEFAULT NULL,
  `productId` int DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `orderId` (`orderId`),
  CONSTRAINT `items_ibfk_1`
      FOREIGN KEY (`orderId`) REFERENCES `orders` (`orderId`)
);
```

## Tabela: users

``` sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);
```

------------------------------------------------------------------------

# Autenticação JWT

Após login, envie o token:

    Authorization: Bearer TOKEN_AQUI

Se o token faltar ou for inválido:

    401 Unauthorized

------------------------------------------------------------------------

# Rotas Detalhadas

# POST /auth/register

### Descrição

Cria um novo usuário com senha criptografada (`bcrypt`).

### Body

``` json
{
  "email": "user@email.com",
  "password": "123456"
}
```

### Resposta 201 - Usuário Criado

``` json
{
  "message": "Usuário registrado com sucesso",
  "usuario": {
    "email": "user@email.com"
  }
}
```

### Erros

| Código | Motivo            |
|--------|-------------------|
| 400    | Validação falhou  |
| 409    | Usuário já existe |
| 500    | Erro interno      |
------------------------------------------------------------------------

# POST /auth/login

### Descrição

Retorna um token JWT válido por 1 dia.

### Body

``` json
{
  "email": "user@email.com",
  "password": "123456"
}
```

### Resposta 200 - OK

``` json
{
  "message": "Login realizado com sucesso",
  "token": "xxx.yyy.zzz"
}
```

### Erros

| Código | Motivo               |
|--------|----------------------|
| 400    | Campo faltando       |
| 401    | Senha inválida       |
| 404    | Usuário não encontrado |
| 500    | Erro interno         |
------------------------------------------------------------------------

# POST /orders

### Protegida por JWT

### Descrição

Cria  pedido com itens.

### Body

``` json
{
  "numeroPedido": "1234ABC",
  "valorTotal": 1500,
  "dataCriacao": "2025-02-05T12:30:00Z",
  "items": [
    { "idItem": "2525", "quantidadeItem": 2, "valorItem": 500 },
    { "idItem": "2837", "quantidadeItem": 1, "valorItem": 500 }
  ]
}
```

### Resposta 201 - Criado  

``` json
{
  "message": "Pedido criado com sucesso.",
  "data": {
    "orderId": "1234ABC",
    "value": 1500,
    "creationDates": "2025-02-05 12:30:00"
  }
}
```

### Erros

| Código | Motivo                    |
|--------|---------------------------|
| 400    | Body inválido             |
| 401    | Token ausente ou inválido |
| 500    | Falha ao inserir no banco |
------------------------------------------------------------------------

# GET /orders/list

### Descrição

Retorna todos os pedidos com os seus respectivos itens.

### Resposta 200 - OK

``` json
[
  {
    "orderId": "ABC123",
    "value": 1500,
    "creationDate": "2025-02-01 12:30:00",
    "items": [
      { "productId": 2525, "quantity": 2, "price": 500 }
    ]
  }
]
```

### Erros

| Código | Motivo                        |
|--------|-------------------------------|
| 401    | Token não enviado ou inválido |
| 500    | Erro no banco                 |
------------------------------------------------------------------------

# GET /orders/{orderId}

### Descrição

Retorna um pedido específico de acordo com o número do pedido

### Resposta 200 - OK

```json
{
  "orderId": "ABC123",
  "value": 1500,
  "creationDate": "2025-02-01 12:30:00",
  "items": [
    { "productId": 2525, "quantity": 2, "price": 500 }
  ]
}
```

### Erros

| Código | Motivo                |
|--------|------------------------|
| 401    | Token inválido        |
| 404    | Pedido não encontrado |
| 500    | Erro interno          |
------------------------------------------------------------------------

# PUT /orders/{orderId}

### Descrição

Atualiza um pedido inteiro (pedido com os seus itens).

### Resposta 200 - Atualizado

```json
{
  "message": "Pedido atualizado com sucesso.",
  "data": {
    "value": 1500,
    "creationDate": "2025-02-05 12:30:00"
  }
}
```

### Erros

| Código | Motivo                |
|--------|------------------------|
| 400    | Body inválido         |
| 401    | Token inválido        |
| 404    | Pedido não encontrado |
| 500    | Erro interno          |
------------------------------------------------------------------------

# DELETE /orders/{orderId}

### Descrição

Deleta o pedido e todos os itens associados.

### Resposta 200 - OK

```json
{
  "message": "Pedido deletado com sucesso."
}

```

### Erros

| Código | Motivo             |
|--------|--------------------|
| 401    | Token inválido     |
| 404    | Pedido não existe  |
| 500    | Erro interno       |
------------------------------------------------------------------------

# .gitignore

``` gitignore
node_modules/
.env
dist/
logs/
```



