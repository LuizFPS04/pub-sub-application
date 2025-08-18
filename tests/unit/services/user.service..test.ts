import * as userService from '../../../src/services/user.service';
import { UserRepository } from '../../../src/repositories/user.repository';
import { mockUser } from '../../mocks';
import { Types } from 'mongoose';

// Mock do repositório
jest.mock('../../../src/repositories/user.repository');
const MockedUserRepository = UserRepository as jest.MockedClass<typeof UserRepository>;

describe('User Service', () => {
    let userRepo: jest.Mocked<UserRepository>;

    beforeEach(() => {
        jest.clearAllMocks();
        userRepo = new MockedUserRepository() as jest.Mocked<UserRepository>;
        (UserRepository as any).mockImplementation(() => userRepo);
    });

    describe('getAllUsers', () => {
        it('should return all users', async () => {
            const expectedUsers = [mockUser];
            userRepo.getAllUsers.mockResolvedValue(expectedUsers as any);

            const result = await userService.getAllUsers();

            expect(result).toEqual(expectedUsers);
            expect(userRepo.getAllUsers).toHaveBeenCalledTimes(1);
        });
    });

    describe('getUserById', () => {
        it('should return user by id', async () => {
            const userId = new Types.ObjectId();
            userRepo.getUserById.mockResolvedValue(mockUser as any);

            const result = await userService.getUserById(userId);

            expect(result).toEqual(mockUser);
            expect(userRepo.getUserById).toHaveBeenCalledWith(userId);
        });

        it('should return null when user not found', async () => {
            const userId = new Types.ObjectId();
            userRepo.getUserById.mockResolvedValue(null);

            const result = await userService.getUserById(userId);

            expect(result).toBeNull();
            expect(userRepo.getUserById).toHaveBeenCalledWith(userId);
        });
    });

    describe('createUser', () => {
        it('should create a new user', async () => {
            userRepo.createUser.mockResolvedValue(mockUser as any);

            const result = await userService.createUser(mockUser as any);

            expect(result).toEqual(mockUser);
            expect(userRepo.createUser).toHaveBeenCalledWith(mockUser);
        });
    });

    describe('findUserByEmail', () => {
        it('should find user by email', async () => {
            const email = 'joao@email.com';
            userRepo.findUserByEmail.mockResolvedValue(mockUser as any);

            const result = await userService.findUserByEmail(email);

            expect(result).toEqual(mockUser);
            expect(userRepo.findUserByEmail).toHaveBeenCalledWith(email);
        });
    });

    describe('deleteUser', () => {
        it('should delete user by email', async () => {
            const email = 'joao@email.com';
            userRepo.findUserByEmail.mockResolvedValue(mockUser as any);
            userRepo.deleteUser.mockResolvedValue(mockUser as any);

            const result = await userService.deleteUser(email);

            expect(result).toEqual(mockUser);
            expect(userRepo.findUserByEmail).toHaveBeenCalledWith(email);
            expect(userRepo.deleteUser).toHaveBeenCalledWith(mockUser.email);
        });

        it('should throw error when user not found', async () => {
            const email = 'notfound@email.com';
            userRepo.findUserByEmail.mockResolvedValue(null);

            await expect(userService.deleteUser(email)).rejects.toThrow('User not found');
            expect(userRepo.findUserByEmail).toHaveBeenCalledWith(email);
            expect(userRepo.deleteUser).not.toHaveBeenCalled();
        });
    });

    describe('updateUser', () => {
        it('should update user by email', async () => {
            const email = 'joao@email.com';
            const updateData = { name: 'João Silva Updated' };
            const updatedUser = { ...mockUser, ...updateData };

            userRepo.findUserByEmail.mockResolvedValue(mockUser as any);
            userRepo.updateUser.mockResolvedValue(updatedUser as any);

            const result = await userService.updateUser(email, updateData as any);

            expect(result).toEqual(updatedUser);
            expect(userRepo.findUserByEmail).toHaveBeenCalledWith(email);
            expect(userRepo.updateUser).toHaveBeenCalledWith(mockUser.email, updateData);
        });

        it('should throw error when user not found for update', async () => {
            const email = 'notfound@email.com';
            const updateData = { name: 'Updated Name' };
            userRepo.findUserByEmail.mockResolvedValue(null);

            await expect(userService.updateUser(email, updateData as any)).rejects.toThrow('User not found');
            expect(userRepo.findUserByEmail).toHaveBeenCalledWith(email);
            expect(userRepo.updateUser).not.toHaveBeenCalled();
        });
    });
});