-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : ven. 27 jan. 2023 à 15:47
-- Version du serveur : 5.7.36
-- Version de PHP : 7.4.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `openai`
--

-- --------------------------------------------------------

--
-- Structure de la table `games`
--

DROP TABLE IF EXISTS `games`;
CREATE TABLE IF NOT EXISTS `games` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `games`
--

INSERT INTO `games` (`ID`, `user_id`, `name`) VALUES
(6, 1, 'The Last of Us'),
(4, 1, 'Modern Warfare'),
(7, 1, 'Dead By Daylight');

-- --------------------------------------------------------

--
-- Structure de la table `game_character`
--

DROP TABLE IF EXISTS `game_character`;
CREATE TABLE IF NOT EXISTS `game_character` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `game` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `details` longtext,
  PRIMARY KEY (`ID`)
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `game_character`
--

INSERT INTO `game_character` (`ID`, `game`, `name`, `details`) VALUES
(10, 4, 'Mason', '1. Nom: Mason\n2. Apparence: Un homme de taille moyenne avec des cheveux noirs et des yeux bleus\n3. Personnalité: Déterminé, courageux et loyal\n4. Compétences: Excellente maîtrise des armes à feu et des arts martiaux\n5. Histoire: Un ancien soldat qui a été recruté pour une mission secrète et qui a été forcé de se battre pour sa survie et celle de ses compagnons');

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `mail` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `firstname` varchar(255) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `user`
--

INSERT INTO `user` (`ID`, `mail`, `password`, `lastname`, `firstname`) VALUES
(1, 'test@test.fr', '1234', 'Di', 'Pe');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
