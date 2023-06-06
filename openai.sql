-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:8889
-- Généré le : mar. 06 juin 2023 à 07:37
-- Version du serveur : 5.7.39
-- Version de PHP : 7.4.33

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
CREATE DATABASE IF NOT EXISTS `openai` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `openai`;

-- --------------------------------------------------------

--
-- Structure de la table `chat`
--

CREATE TABLE `chat` (
                        `ID` int(11) NOT NULL,
                        `character_id` int(11) DEFAULT NULL,
                        `user_id` int(11) DEFAULT NULL,
                        `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        `updated` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `conversation`
--

CREATE TABLE `conversation` (
                                `ID` int(11) NOT NULL,
                                `type` varchar(255) DEFAULT NULL,
                                `chat_id` int(11) DEFAULT NULL,
                                `message` longtext,
                                `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                `updated` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `games`
--

CREATE TABLE `games` (
                         `ID` int(11) NOT NULL,
                         `user_id` int(11) DEFAULT NULL,
                         `name` varchar(255) DEFAULT NULL,
                         `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
                         `updated` datetime DEFAULT NULL,
                         `cover` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `game_character`
--

CREATE TABLE `game_character` (
                                  `ID` int(11) NOT NULL,
                                  `game_id` int(11) DEFAULT NULL,
                                  `name` varchar(255) DEFAULT NULL,
                                  `details` longtext,
                                  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                  `updated` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

CREATE TABLE `user` (
                        `ID` int(11) NOT NULL,
                        `mail` varchar(255) DEFAULT NULL,
                        `password` varchar(255) DEFAULT NULL,
                        `lastname` varchar(255) DEFAULT NULL,
                        `firstname` varchar(255) DEFAULT NULL,
                        `created` datetime DEFAULT CURRENT_TIMESTAMP,
                        `updated` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `chat`
--
ALTER TABLE `chat`
    ADD PRIMARY KEY (`ID`),
    ADD UNIQUE KEY `character_id` (`character_id`),
    ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `conversation`
--
ALTER TABLE `conversation`
    ADD PRIMARY KEY (`ID`),
    ADD KEY `chat_id` (`chat_id`);

--
-- Index pour la table `games`
--
ALTER TABLE `games`
    ADD PRIMARY KEY (`ID`),
    ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `game_character`
--
ALTER TABLE `game_character`
    ADD PRIMARY KEY (`ID`),
    ADD KEY `game_id` (`game_id`);

--
-- Index pour la table `user`
--
ALTER TABLE `user`
    ADD PRIMARY KEY (`ID`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `chat`
--
ALTER TABLE `chat`
    MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `conversation`
--
ALTER TABLE `conversation`
    MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `games`
--
ALTER TABLE `games`
    MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `game_character`
--
ALTER TABLE `game_character`
    MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `user`
--
ALTER TABLE `user`
    MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `chat`
--
ALTER TABLE `chat`
    ADD CONSTRAINT `Character ID` FOREIGN KEY (`character_id`) REFERENCES `game_character` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT `User ID` FOREIGN KEY (`user_id`) REFERENCES `user` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `conversation`
--
ALTER TABLE `conversation`
    ADD CONSTRAINT `Chat ID` FOREIGN KEY (`chat_id`) REFERENCES `chat` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `games`
--
ALTER TABLE `games`
    ADD CONSTRAINT `User_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `game_character`
--
ALTER TABLE `game_character`
    ADD CONSTRAINT `Game_id` FOREIGN KEY (`game_id`) REFERENCES `games` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
