SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

CREATE DATABASE IF NOT EXISTS `club` DEFAULT CHARACTER SET utf8 COLLATE utf8_spanish_ci;
USE `club`;

CREATE TABLE IF NOT EXISTS usuarios (
    id int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
    name varchar(100)  NOT NULL,
    password varchar(100) NOT NULL,
    sexo varchar(20) NOT NULL,
    movil varchar(20) NOT NULL,
    dni varchar(20) NOT NULL,
    fecha date NOT NULL,
    email varchar(100) NOT NULL,
    tipo int(1) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE (dni),
    UNIQUE (email)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS torneos (
     id int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
     name varchar(100)  NOT NULL,
     localidad varchar(100) NOT NULL,
     PRIMARY KEY (id)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS inscribir (
     torneo_id int(10) UNSIGNED NOT NULL,
     usuario_id int(10) UNSIGNED NOT NULL,
     PRIMARY KEY (torneo_id,usuario_id),
     CONSTRAINT `fk_inscribir_usuarios`
        FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
        ON UPDATE CASCADE,
    CONSTRAINT `fk_inscribir_torneos`
        FOREIGN KEY (torneo_id) REFERENCES torneos (id)
        ON UPDATE CASCADE
) ENGINE = InnoDB;


CREATE TABLE IF NOT EXISTS pistas (
     id int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
     name varchar(100)  NOT NULL,
     descripcion varchar(100)  NOT NULL,
     PRIMARY KEY (id)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS reservas (
     fecha datetime NOT NULL,
     pista_id int(10) UNSIGNED NOT NULL,
     usuario_id int(10) UNSIGNED NOT NULL
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS contactos(
     id int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
     name varchar(100)  NOT NULL,
     email varchar(100)  NOT NULL,
     mensaje varchar(255)  NOT NULL,
     PRIMARY KEY (id)
) ENGINE = InnoDB;

ALTER TABLE reservas
ADD CONSTRAINT `fk_reservas_pistas`
        FOREIGN KEY (pista_id) REFERENCES pistas (id)
        ON UPDATE CASCADE;

ALTER TABLE reservas
ADD CONSTRAINT `fk_reservas_usuarios`
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
        ON UPDATE CASCADE;
