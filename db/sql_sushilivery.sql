-- Criação do banco de dados (opcional, caso ainda não tenha criado)
CREATE DATABASE IF NOT EXISTS sushi_delivery;
USE sushi_delivery;

-- Tabela de Categorias
CREATE TABLE IF NOT EXISTS categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
);

-- Tabela de Produtos
CREATE TABLE IF NOT EXISTS produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10, 2) NOT NULL,
    imagem_url VARCHAR(255),
    categoria_id INT,
    disponivel BOOLEAN DEFAULT TRUE,
    exc_produto BOOLEAN DEFAULT FALSE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE SET NULL
);

-- Inserindo categorias básicas
INSERT INTO categorias (nome) VALUES 
('Entradas'),
('Sushis'),
('Temakis'),
('Combos'),
('Bebidas');

-- Inserindo produtos de exemplo
INSERT INTO produtos (nome, descricao, preco, imagem_url, categoria_id) VALUES 
('Sunomono', 'Saladinha de pepino japonês com gergelim.', 15.00, 'https://via.placeholder.com/150', 1),
('Nigiri de Salmão', '2 unidades de fatia de salmão sobre o arroz.', 18.00, 'https://via.placeholder.com/150', 2),
('Uramaki Filadélfia', '8 unidades com salmão, cream cheese e cebolinha.', 28.00, 'https://via.placeholder.com/150', 2),
('Hot Roll', '8 unidades de sushi empanado e frito, recheado com salmão e cream cheese.', 30.00, 'https://via.placeholder.com/150', 2),
('Temaki de Salmão Completo', 'Cone de alga com arroz, salmão em cubos, cream cheese e cebolinha.', 35.00, 'https://via.placeholder.com/150', 3),
('Combo Salmão Lovers', '15 peças: 5 sashimis, 4 nigiris, 4 uramakis e 2 jyo.', 65.00, 'https://via.placeholder.com/150', 4),
('Coca-Cola Lata', 'Refrigerante lata 350ml.', 6.00, 'https://via.placeholder.com/150', 5);

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    total DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Em preparo',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS itens_pedido (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT,
    produto_id INT,
    quantidade INT,
    preco_unitario DECIMAL(10, 2),
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
    FOREIGN KEY (produto_id) REFERENCES produtos(id)
);