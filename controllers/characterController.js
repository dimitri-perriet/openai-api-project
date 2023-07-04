import characterModel from '../models/characterModel.js';

export const createCharacter = async (req, res) => {
    const {game_id, name} = req.body
    try {
        const id = await characterModel.createCharacter(game_id, name)
        res.status(201).json({message: 'Character created', id})
    } catch (error) {
        if (error === 'Character already exists') {
            res.status(409).json({message: error})
        } else {
            res.status(500).json({message: 'Internal server error'})
        }
    }
}

export const getCharacter = async (req, res) => {
    const {id} = req.params
    try {
        const character = await characterModel.getCharacter(id)
        res.status(200).json(character)
    } catch (error) {
        if (error === "Character not found") {
            return res.status(404).json({message: error})
        } else {
            return res.status(500).json({message: 'Internal server error'})
        }
    }
}

export const getCharacters = async (req, res) => {
    try {
        const characters = await characterModel.getCharacters()
        res.status(200).json(characters)
    } catch (error) {
        res.status(500).json({message: 'Internal server error'})
    }
}

export const getCharactersFromGame = async (req, res) => {
    const {id} = req.params
    try {
        const characters = await characterModel.getCharactersFromGame(id)
        res.status(200).json(characters)
    } catch (error) {
        if (error === 'Game not found') {
            return res.status(404).json({message: error})
        } else {
            return res.status(500).json({message: 'Internal server error'})
        }
    }
}

export const updateCharacter = async (req, res) => {
    const {id} = req.params
    const {name} = req.body
    try {
        await characterModel.updateCharacter(id, name)
        res.status(200).json({message: 'Character updated'})
    } catch (error) {
        if (error === 'Character not found') {
            return res.status(404).json({message: error})
        } else {
            return res.status(500).json({message: 'Internal server error'})
        }
    }
}

export const deleteCharacter = async (req, res) => {
    const {id} = req.params
    try {
        await characterModel.deleteCharacter(id)
        res.status(200).json({message: 'Character deleted'})
    } catch (error) {
        if (error === 'Character not found') {
            return res.status(404).json({message: error})
        } else {
            return res.status(500).json({message: 'Internal server error'})
        }
    }
}
