import { expect } from 'chai';
import sinon from 'sinon';
import { createCharacter, getCharacter, getCharacters, getCharactersFromGame, updateCharacter, deleteCharacter } from '../controllers/characterController.js';
import characterModel from '../models/characterModel.js';

describe('Character Controller', () => {
    describe('createCharacter', () => {
        it('should create a new character', async () => {
            const req = {
                body: { game_id: '1', name: 'John Doe' }
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };
            const createCharacterStub = sinon.stub(characterModel, 'createCharacter').resolves('1');

            await createCharacter(req, res);

            expect(res.status.calledWith(201)).to.be.true;
            expect(res.json.calledWith({ message: 'Character created', id: '1' })).to.be.true;
            expect(createCharacterStub.calledOnceWith('1', 'John Doe')).to.be.true;

            createCharacterStub.restore();z
        });
    });

    describe('getCharacter', () => {
        it('should get a character by ID', async () => {
            const req = {
                params: { id: '1' }
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };
            const getCharacterStub = sinon.stub(characterModel, 'getCharacter').resolves({ id: '1', name: 'John Doe' });

            await getCharacter(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith({ id: '1', name: 'John Doe' })).to.be.true;
            expect(getCharacterStub.calledOnceWith('1')).to.be.true;

            getCharacterStub.restore();
        });
    });

    describe('getCharacters', () => {
        it('should get all characters', async () => {
            const req = {};
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };
            const charactersData = [{ id: '1', name: 'John Doe' }, { id: '2', name: 'Jane Smith' }];
            const getCharactersStub = sinon.stub(characterModel, 'getCharacters').resolves(charactersData);

            await getCharacters(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith(charactersData)).to.be.true;
            expect(getCharactersStub.calledOnce).to.be.true;

            getCharactersStub.restore();
        });

    });

    describe('getCharactersFromGame', () => {
        it('should get characters from a game', async () => {
            const req = {
                params: { id: '1' }
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };
            const gameId = '1';
            const charactersData = [{ id: 'character-1', name: 'John Doe' }, { id: 'character-2', name: 'Jane Smith' }];
            const getCharactersFromGameStub = sinon.stub(characterModel, 'getCharactersFromGame').resolves(charactersData);

            await getCharactersFromGame(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith(charactersData)).to.be.true;
            expect(getCharactersFromGameStub.calledOnceWith(gameId)).to.be.true;

            getCharactersFromGameStub.restore();
        });
    });

    describe('updateCharacter', () => {
        it('should update a character', async () => {
            const req = {
                params: { id: '1' },
                body: { name: 'Updated Name' }
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };
            const updateCharacterStub = sinon.stub(characterModel, 'updateCharacter');

            await updateCharacter(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith({ message: 'Character updated' })).to.be.true;
            expect(updateCharacterStub.calledOnceWith('1', 'Updated Name')).to.be.true;

            updateCharacterStub.restore();
        });

    });

    describe('deleteCharacter', () => {
        it('should delete a character', async () => {
            const req = {
                params: { id: '1' }
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };
            const deleteCharacterStub = sinon.stub(characterModel, 'deleteCharacter');

            await deleteCharacter(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith({ message: 'Character deleted' })).to.be.true;
            expect(deleteCharacterStub.calledOnceWith('1')).to.be.true;

            deleteCharacterStub.restore();
        });

    });
});
