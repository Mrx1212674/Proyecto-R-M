CREATE DATABASE rick_and_morty;
use rick_and_morty;

CREATE TABLE personaje(
id INT PRIMARY KEY,
nombre VARCHAR(50),
estado VARCHAR(10),
especie VARCHAR(30),
genero VARCHAR(10),
origen VARCHAR(50),
localización VARCHAR(50),
imagen VARCHAR(255),
episodio VARCHAR(50)
);

CREATE TABLE localizaciones(
id INT PRIMARY KEY,
nombre VARCHAR(50),
tipo VARCHAR(30),
dimension VARCHAR(30),
residentes int
);

CREATE TABLE episodios(
id INT PRIMARY KEY,
nombre VARCHAR(50),
fecha VARCHAR(10),
episodio VARCHAR(10),
residentes int
);