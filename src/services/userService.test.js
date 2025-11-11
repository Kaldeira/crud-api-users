const userService = require('../services/userService');
const userModel = require('../models/UserModel');

jest.mock('../models/UserModel', () => ({
  getAllUsers: jest.fn(),
  saveUsers: jest.fn(),
}));

describe('Testes do userService', () => {
  beforeEach(() => jest.clearAllMocks());

  test('listUsers deve retornar todos os usuários', () => {
    userModel.getAllUsers.mockReturnValue([{ id: 1, name: 'João' }]);
    const result = userService.listUsers();
    expect(result).toEqual([{ id: 1, name: 'João' }]);
  });

  test('getUserById deve retornar o usuário correto', () => {
    userModel.getAllUsers.mockReturnValue([{ id: 1, name: 'João' }]);
    const result = userService.getUserById(1);
    expect(result).toEqual({ id: 1, name: 'João' });
  });

  test('getUserById deve retornar undefined se não encontrar', () => {
    userModel.getAllUsers.mockReturnValue([{ id: 1, name: 'João' }]);
    const result = userService.getUserById(2);
    expect(result).toBeUndefined();
  });

  test('createUser deve adicionar e retornar novo usuário', () => {
    userModel.getAllUsers.mockReturnValue([{ id: 1, name: 'João' }]);
    const newUser = { name: 'Maria' };
    const result = userService.createUser(newUser);
    expect(result).toHaveProperty('id', 2);
    expect(userModel.saveUsers).toHaveBeenCalled();
  });

  test('updateUser deve atualizar e retornar o usuário atualizado', () => {
    userModel.getAllUsers.mockReturnValue([{ id: 1, name: 'João' }]);
    const result = userService.updateUser(1, { name: 'Pedro' });
    expect(result.name).toBe('Pedro');
    expect(userModel.saveUsers).toHaveBeenCalled();
  });

  test('updateUser deve lançar erro se usuário não existir', () => {
    userModel.getAllUsers.mockReturnValue([{ id: 1, name: 'João' }]);
    expect(() => userService.updateUser(99, { name: 'Teste' }))
      .toThrow('Usuário não encontrado.');
  });

  test('deleteUser deve remover o usuário com ID existente', () => {
    userModel.getAllUsers.mockReturnValue([{ id: 1, name: 'João' }]);
    userService.deleteUser(1);
    expect(userModel.saveUsers).toHaveBeenCalled();
  });

  test('deleteUser deve lançar erro se usuário não existir', () => {
    userModel.getAllUsers.mockReturnValue([{ id: 1, name: 'João' }]);
    expect(() => userService.deleteUser(99))
      .toThrow('Usuário não encontrado.');
  });
});
