const userController = require('../controllers/UserController');
const userModel = require('../models/UserModel');

jest.mock('../models/UserModel');

describe('Testes do userController', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {};
    res = { status: jest.fn().mockReturnThis(), json: jest.fn(), send: jest.fn() };
    jest.clearAllMocks();
  });

  test('listUsers deve retornar lista de usuários com status 200', async () => {
    const users = [{ id: 1, name: 'João' }];
    userModel.getAllUsers.mockResolvedValue(users);

    await userController.listUsers(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(users);
  });

  test('listUsers deve retornar 500 em caso de erro', async () => {
    userModel.getAllUsers.mockRejectedValue(new Error('Erro interno'));
    await userController.listUsers(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erro interno' });
  });

  test('getUserById deve retornar usuário com status 200', async () => {
    const user = { id: 1, name: 'Maria' };
    req.params = { id: '1' };
    userModel.getUserById.mockResolvedValue(user);

    await userController.getUserById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(user);
  });

  test('getUserById deve retornar 404 se usuário não encontrado', async () => {
    req.params = { id: '99' };
    userModel.getUserById.mockResolvedValue(null);

    await userController.getUserById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Usuário não encontrado.' });
  });

  test('createUser deve retornar 201 e novo usuário', async () => {
    const newUser = { id: 1, name: 'João' };
    req.body = { name: 'João' };
    userModel.createUser.mockResolvedValue(newUser);

    await userController.createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(newUser);
  });

  test('updateUser deve retornar 200 e usuário atualizado', async () => {
    const updatedUser = { id: 2, name: 'Pedro' };
    req.params = { id: '2' };
    req.body = { name: 'Pedro' };
    userModel.updateUser.mockResolvedValue(updatedUser);

    await userController.updateUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(updatedUser);
  });

  test('deleteUser deve retornar 204 ao excluir com sucesso', async () => {
    req.params = { id: '2' };
    userModel.deleteUser.mockResolvedValue();

    await userController.deleteUser(req, res);

    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  // ---- Testes de erro ----

  test('getUserById deve retornar 500 em caso de erro inesperado', async () => {
    let req = {};
    let res = { status: jest.fn().mockReturnThis(), json: jest.fn(), send: jest.fn() };

    req.params = { id: '1' };
    userModel.getUserById.mockRejectedValue(new Error('Erro inesperado'));

    await userController.getUserById(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erro inesperado' });
  });

  test('createUser deve retornar 500 em caso de erro', async () => {
    let req = {};
    let res = { status: jest.fn().mockReturnThis(), json: jest.fn(), send: jest.fn() };

    req.body = { name: 'Maria' };
    userModel.createUser.mockRejectedValue(new Error('Falha ao criar'));

    await userController.createUser(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Falha ao criar' });
  });

  test('updateUser deve retornar 500 em caso de erro', async () => {
    let req = {};
    let res = { status: jest.fn().mockReturnThis(), json: jest.fn(), send: jest.fn() };

    req.params = { id: '2' };
    req.body = { name: 'Teste' };
    userModel.updateUser.mockRejectedValue(new Error('Erro ao atualizar'));

    await userController.updateUser(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao atualizar' });
  });

  test('deleteUser deve retornar 500 em caso de erro', async () => {
    let req = {};
    let res = { status: jest.fn().mockReturnThis(), json: jest.fn(), send: jest.fn() };

    req.params = { id: '2' };
    userModel.deleteUser.mockRejectedValue(new Error('Erro ao deletar'));

    await userController.deleteUser(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao deletar' });
  });
});
