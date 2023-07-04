import config from "../config/config.js";
import * as GameModel from "../models/gamesModel.js";

async function getGamesInfo(name) {
    return await fetch("https://api.igdb.com/v4/games/", {
        method: 'POST',
        headers: {
            "Client-ID": config.client_igdb,
            "Authorization": "Bearer " + config.secret_igdb,
        },
        body: "search \"" + name + "\"; fields name, cover, first_release_date; where version_parent = null;"
    })
        .then(response => response.json())
        .then(data => {
            return data
        })
        .catch(err => {
            return err
        })
}

async function getGamesCover(coverid) {
    return await fetch("https://api.igdb.com/v4/covers", {
        method: 'POST',
        headers: {
            "Client-ID": config.client_igdb,
            "Authorization": "Bearer " + config.secret_igdb,
        },
        body: "fields url; where id = (" + coverid + ");"
    })
        .then(response => response.json())
        .then(data => {
            return data
        })
        .catch(err => {
            return err
        })
}

export const createGame = async (req, res) => {
    const {name, cover} = req.body;
    const user_id = req.user.id;

    try {
        const result = await GameModel.selectGame(user_id, name);

        if (result.length > 0) {
            return res.status(409).json({message: 'Game already exists'});
        }

        const insertResult = await GameModel.insertGame(user_id, name, cover);
        res.status(201).json({message: 'Game created', id: insertResult.insertId});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};

export const searchGame = async (req, res) => {
    const {name} = req.params;

    try {
        let game = await getGamesInfo(name);

        if (game instanceof Error) {
            return res.status(500).json({message: 'Internal server error'});
        } else if (game.length === 0) {
            return res.status(404).json({message: 'Game not found'});
        } else {
            let imgurl = await getGamesCover(game[0].cover);

            if (imgurl instanceof Error) {
                return res.status(500).json({message: 'Internal server error'});
            }

            let date = new Date(game[0].first_release_date * 1000);
            game[0].first_release_date = date.toLocaleDateString("fr");
            imgurl[0].url = imgurl[0].url.replace("thumb", "cover_big");
            game[0].cover = imgurl[0].url;

            res.status(200).json(game[0]);
        }
    } catch(err) {
        res.status(500).json({message: err.message});
    }
};

export const getGame = async (req, res) => {
    const {id} = req.params;

    try {
        const result = await GameModel.selectGameByID(id);

        if (result.length === 0) {
            return res.status(404).json({message: 'Game not found'});
        }

        res.status(200).json(result[0]);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};

export const getGames = async (req, res) => {
    try {
        const result = await GameModel.selectAllGames();

        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};

export const updateGame = async (req, res) => {
    const {id} = req.params;
    const {name} = req.body;
    const user_id = req.user.id;

    try {
        const existingGame = await GameModel.selectGame(user_id, name);

        if (existingGame.length > 0) {
            return res.status(400).json({message: 'Game already exists'});
        }

        const updateResult = await GameModel.updateGameByID(name, id);

        if (updateResult.affectedRows === 0) {
            return res.status(404).json({message: 'Game not found'});
        }

        res.status(200).json({message: 'Game updated', rowsAffected: updateResult.affectedRows});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};

export const deleteGame = async (req, res) => {
    const {id} = req.params;

    try {
        const deleteResult = await GameModel.deleteGameByID(id);

        if (deleteResult.affectedRows === 0) {
            return res.status(404).json({message: 'Game not found'});
        }

        res.status(200).json({message: 'Game deleted', rowsAffected: deleteResult.affectedRows});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};

export const getGamesOwner = async (req, res) => {
    const {id} = req.params;

    try {
        const result = await GameModel.selectGamesByUserID(id);

        if (result.length === 0) {
            return res.status(404).json({message: 'Games not found or incorrect user id'});
        }

        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};
