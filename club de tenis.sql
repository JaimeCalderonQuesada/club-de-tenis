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
     imagen longblob NOT NULL,
     PRIMARY KEY (id)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS inscribir (
     torneo_id int(10) UNSIGNED NOT NULL,
     usuario_id int(10) UNSIGNED NOT NULL,
     PRIMARY KEY (torneo_id,usuario_id),
     CONSTRAINT `fk_inscribir_usuarios`
        FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT `fk_inscribir_torneos`
        FOREIGN KEY (torneo_id) REFERENCES torneos (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS clases (
     id int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
     fecha datetime NOT NULL,
     tipo varchar(100)  NOT NULL,
     pista_id int(10) UNSIGNED NOT NULL,
     PRIMARY KEY (id),
     CONSTRAINT `fk_clases_pistas`
        FOREIGN KEY (pista_id) REFERENCES pistas (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS registrar (
     clase_id int(10) UNSIGNED NOT NULL,
     usuario_id int(10) UNSIGNED NOT NULL,
     PRIMARY KEY (clase_id,usuario_id),
     CONSTRAINT `fk_registrar_usuarios`
        FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT `fk_registrar_clases`
        FOREIGN KEY (clase_id) REFERENCES clases (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS pistas (
     id int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
     name varchar(100)  NOT NULL,
     descripcion varchar(100)  NOT NULL,
     imagen longblob NOT NULL,
     PRIMARY KEY (id)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS reservas (
     fecha datetime NOT NULL,
     pista_id int(10) UNSIGNED NOT NULL,
     usuario_id int(10) UNSIGNED NOT NULL,
     PRIMARY KEY (fecha),
     CONSTRAINT `fk_reservas_pistas`
        FOREIGN KEY (pista_id) REFERENCES pistas (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
     CONSTRAINT `fk_reservas_usuarios`
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS contactos(
     id int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
     name varchar(100)  NOT NULL,
     email varchar(100)  NOT NULL,
     mensaje varchar(255)  NOT NULL,
     PRIMARY KEY (id)
) ENGINE = InnoDB;

INSERT INTO `clases` (`fecha`, `tipo`, `pista_id`) 
VALUES 
 ('2022-06-01 17:00:00', 'Benjamin', '1'),
 ('2022-06-01 18:00:00', 'Infantil/Cadete', '1'),
 ('2022-06-01 19:00:00', 'Adultos', '1'),
 ('2022-06-02 17:00:00', 'Alevin', '1'),
 ('2022-06-02 18:00:00', 'Juvenil', '1'),
 ('2022-06-02 19:00:00', 'Adultos', '1'),
 ('2022-06-03 17:00:00', 'Benjamin', '1'),
 ('2022-06-03 18:00:00', 'Alevin', '1'),
 ('2022-06-03 19:00:00', 'Juvenil', '1'),

 ('2022-06-06 17:00:00', 'Benjamin', '1'),
 ('2022-06-06 18:00:00', 'Infantil/Cadete', '1'),
 ('2022-06-06 19:00:00', 'Adultos', '1'),
 ('2022-06-07 17:00:00', 'Alevin', '1'),
 ('2022-06-07 18:00:00', 'Infantil/Cadete', '1'),
 ('2022-06-07 19:00:00', 'Juvenil', '1'),
 ('2022-06-08 17:00:00', 'Benjamin', '1'),
 ('2022-06-08 18:00:00', 'Infantil/Cadete', '1'),
 ('2022-06-08 19:00:00', 'Adultos', '1'),
 ('2022-06-09 17:00:00', 'Alevin', '1'),
 ('2022-06-09 18:00:00', 'Juvenil', '1'),
 ('2022-06-09 19:00:00', 'Adultos', '1'),
 ('2022-06-10 17:00:00', 'Benjamin', '1'),
 ('2022-06-10 18:00:00', 'Alevin', '1'),
 ('2022-06-10 19:00:00', 'Juvenil', '1'),

 ('2022-06-13 17:00:00', 'Benjamin', '1'),
 ('2022-06-13 18:00:00', 'Infantil/Cadete', '1'),
 ('2022-06-13 19:00:00', 'Adultos', '1'),
 ('2022-06-14 17:00:00', 'Alevin', '1'),
 ('2022-06-14 18:00:00', 'Infantil/Cadete', '1'),
 ('2022-06-14 19:00:00', 'Juvenil', '1'),
 ('2022-06-15 17:00:00', 'Benjamin', '1'),
 ('2022-06-15 18:00:00', 'Infantil/Cadete', '1'),
 ('2022-06-15 19:00:00', 'Adultos', '1'),
 ('2022-06-16 17:00:00', 'Alevin', '1'),
 ('2022-06-16 18:00:00', 'Juvenil', '1'),
 ('2022-06-16 19:00:00', 'Adultos', '1'),
 ('2022-06-17 17:00:00', 'Benjamin', '1'),
 ('2022-06-17 18:00:00', 'Alevin', '1'),
 ('2022-06-17 19:00:00', 'Juvenil', '1'),

 ('2022-06-20 17:00:00', 'Benjamin', '1'),
 ('2022-06-20 18:00:00', 'Infantil/Cadete', '1'),
 ('2022-06-20 19:00:00', 'Adultos', '1'),
 ('2022-06-21 17:00:00', 'Alevin', '1'),
 ('2022-06-21 18:00:00', 'Infantil/Cadete', '1'),
 ('2022-06-21 19:00:00', 'Juvenil', '1'),
 ('2022-06-22 17:00:00', 'Benjamin', '1'),
 ('2022-06-22 18:00:00', 'Infantil/Cadete', '1'),
 ('2022-06-22 19:00:00', 'Adultos', '1'),
 ('2022-06-23 17:00:00', 'Alevin', '1'),
 ('2022-06-23 18:00:00', 'Juvenil', '1'),
 ('2022-06-23 19:00:00', 'Adultos', '1'),
 ('2022-06-24 17:00:00', 'Benjamin', '1'),
 ('2022-06-24 18:00:00', 'Alevin', '1'),
 ('2022-06-24 19:00:00', 'Juvenil', '1'),

 ('2022-06-27 17:00:00', 'Benjamin', '1'),
 ('2022-06-27 18:00:00', 'Infantil/Cadete', '1'),
 ('2022-06-27 19:00:00', 'Adultos', '1'),
 ('2022-06-28 17:00:00', 'Alevin', '1'),
 ('2022-06-28 18:00:00', 'Infantil/Cadete', '1'),
 ('2022-06-28 19:00:00', 'Juvenil', '1'),
 ('2022-06-29 17:00:00', 'Benjamin', '1'),
 ('2022-06-29 18:00:00', 'Infantil/Cadete', '1'),
 ('2022-06-29 19:00:00', 'Adultos', '1'),
 ('2022-06-30 17:00:00', 'Alevin', '1'),
 ('2022-06-30 18:00:00', 'Juvenil', '1'),
 ('2022-06-30 19:00:00', 'Adultos', '1');