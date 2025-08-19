// IMPORTANTE: Mock DEVE vir antes de qualquer import
const mockUserRepository = {
    getAllUsers: jest.fn(),
    getUserById: jest.fn(),
    createUser: jest.fn(),
    findUserByEmail: jest.fn(),
    deleteUser: jest.fn(),
    updateUser: jest.fn(),
    findUserFollowedTeams: jest.fn(),
    deleteAllUsers: jest.fn(),
};

// Mock do módulo UserRepository
jest.mock('../../../src/repositories/user.repository', () => ({
    UserRepository: jest.fn(() => mockUserRepository)
}));

// Agora importa o service (DEPOIS do mock)
import * as userService from '../../../src/services/user.service';
import { mockUser } from '../../mocks';
import { Types } from 'mongoose';

describe('User Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllUsers', () => {
        it('should return all users', async () => {
            const expectedUsers = [mockUser];
            mockUserRepository.getAllUsers.mockResolvedValue(expectedUsers);

            const result = await userService.getAllUsers();

            expect(result).toEqual(expectedUsers);
            expect(mockUserRepository.getAllUsers).toHaveBeenCalledTimes(1);
        });
    });

    describe('getUserById', () => {
        it('should return user by id', async () => {
            const userId = new Types.ObjectId();
            mockUserRepository.getUserById.mockResolvedValue(mockUser);

            const result = await userService.getUserById(userId);

            expect(result).toEqual(mockUser);
            expect(mockUserRepository.getUserById).toHaveBeenCalledWith(userId);
        });

        it('should return null when user not found', async () => {
            const userId = new Types.ObjectId();
            mockUserRepository.getUserById.mockResolvedValue(null);

            const result = await userService.getUserById(userId);

            expect(result).toBeNull();
            expect(mockUserRepository.getUserById).toHaveBeenCalledWith(userId);
        });
    });

    describe('createUser', () => {
        it('should create a new user', async () => {
            mockUserRepository.createUser.mockResolvedValue(mockUser);

            const result = await userService.createUser(mockUser as any);

            expect(result).toEqual(mockUser);
            expect(mockUserRepository.createUser).toHaveBeenCalledWith(mockUser);
        });
    });

    describe('findUserByEmail', () => {
        it('should find user by email', async () => {
            const email = 'joao@email.com';
            mockUserRepository.findUserByEmail.mockResolvedValue(mockUser);

            const result = await userService.findUserByEmail(email);

            expect(result).toEqual(mockUser);
            expect(mockUserRepository.findUserByEmail).toHaveBeenCalledWith(email);
        });
    });

    describe('deleteUser', () => {
        it('should delete user by email', async () => {
            const email = 'joao@email.com';
            const mockUserWithId = { ...mockUser, _id: new Types.ObjectId() };
            
            // Mock para encontrar o usuário
            mockUserRepository.findUserByEmail.mockResolvedValue(mockUserWithId);
            // Mock para deletar o usuário
            mockUserRepository.deleteUser.mockResolvedValue(mockUserWithId);

            const result = await userService.deleteUser(email);

            expect(result).toEqual(mockUserWithId);
            expect(mockUserRepository.findUserByEmail).toHaveBeenCalledWith(email);
            expect(mockUserRepository.deleteUser).toHaveBeenCalledWith(mockUserWithId._id);
        });

        it('should throw error when user not found', async () => {
            const email = 'notfound@email.com';
            mockUserRepository.findUserByEmail.mockResolvedValue(null);

            await expect(userService.deleteUser(email)).rejects.toThrow('User not found');
            expect(mockUserRepository.findUserByEmail).toHaveBeenCalledWith(email);
            expect(mockUserRepository.deleteUser).not.toHaveBeenCalled();
        });
    });

    describe('updateUser', () => {
        it('should update user by email', async () => {
            const email = 'joao@email.com';
            const updateData = { name: 'João Silva Updated' };
            const mockUserWithId = { ...mockUser, _id: new Types.ObjectId() };
            const updatedUser = { ...mockUserWithId, ...updateData };

            // Mock para encontrar o usuário
            mockUserRepository.findUserByEmail.mockResolvedValue(mockUserWithId);
            // Mock para atualizar o usuário
            mockUserRepository.updateUser.mockResolvedValue(updatedUser);

            const result = await userService.updateUser(email, updateData as any);

            expect(result).toEqual(updatedUser);
            expect(mockUserRepository.findUserByEmail).toHaveBeenCalledWith(email);
            expect(mockUserRepository.updateUser).toHaveBeenCalledWith(mockUserWithId._id, updateData);
        });

        it('should throw error when user not found for update', async () => {
            const email = 'notfound@email.com';
            const updateData = { name: 'Updated Name' };
            mockUserRepository.findUserByEmail.mockResolvedValue(null);

            await expect(userService.updateUser(email, updateData as any)).rejects.toThrow('User not found');
            expect(mockUserRepository.findUserByEmail).toHaveBeenCalledWith(email);
            expect(mockUserRepository.updateUser).not.toHaveBeenCalled();
        });
    });
});