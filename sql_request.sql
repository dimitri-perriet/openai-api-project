-- UTILISATEUR ADMINISTRATEUR
CREATE USER 'god_user'@'localhost' IDENTIFIED BY 'test';
GRANT ALL PRIVILEGES ON openai.* TO 'god_user'@'localhost';
FLUSH PRIVILEGES;

-- UTILISATEUR LECTURE SEULE
CREATE USER 'read_user'@'localhost' IDENTIFIED BY 'test';
GRANT SELECT ON openai.* TO 'read_user'@'localhost';
FLUSH PRIVILEGES;


-- -- CREATION DE 2 VUES - Déjà présente dans le script de création de la base de données.


-- Vue simple pour obtenir tous les utilisateurs
/*CREATE VIEW all_users AS
SELECT ID, mail, lastname, firstname
FROM user;


-- Vue avec une jointure pour obtenir tous les jeux et leurs caractères respectifs
CREATE VIEW game_characters AS
SELECT games.name AS game_name, game_character.name AS character_name
FROM games
    JOIN game_character ON games.ID = game_character.game_id;*/


-- -- 3 REQUETES SUR LA BASE DE DONNEES


-- Jointure pour obtenir tous les utilisateurs et leurs jeux
SELECT user.firstname, user.lastname, games.name
FROM user
         JOIN games ON user.ID = games.user_id;

-- Group by avec une fonction de regroupement pour obtenir le nombre de personnages par jeu
SELECT games.name, COUNT(game_character.ID) AS nombre_character
FROM games
         JOIN game_character ON games.ID = game_character.game_id
GROUP BY games.name;

-- Requête avec HAVING pour obtenir les jeux qui ont plus de 2 personnages
SELECT games.name, COUNT(game_character.ID) AS nombre_character
FROM games
         JOIN game_character ON games.ID = game_character.game_id
GROUP BY games.name
HAVING character_count > 2;

-- --REQUETES CORRELEES

-- Sous-requête dans le SELECT pour obtenir le nombre de jeux par utilisateur
SELECT firstname, lastname,
       (SELECT COUNT(*) FROM games WHERE user.ID = games.user_id) AS nombre_jeu
FROM user;


-- Sous-requête dans le FROM pour obtenir le nombre moyen de caractères par jeu
SELECT AVG(character_count) AS avg_characters_per_game
FROM
    (
        SELECT games.name, COUNT(game_character.ID) AS character_count
        FROM games
                 JOIN game_character ON games.ID = game_character.game_id
        GROUP BY games.name
    ) AS game_character_counts;


-- -- Requêtes utilisant IF et CASE dans un SELECT
SELECT name,
       IF((SELECT COUNT(*) FROM game_character WHERE games.ID = game_character.game_id) > 5, 'Elevé', 'Bas') AS nombre_character
FROM games;

-- Utilisation de CASE dans un SELECT pour attribuer un libellé en fonction de l'heure de création d'un utilisateur :
SELECT firstname, lastname,
       CASE
           WHEN HOUR(created) < 12 THEN 'Matin'
    WHEN HOUR(created) < 18 THEN 'Après-midi'
    ELSE 'Soir'
END AS moment_de_la_journee
FROM user;



