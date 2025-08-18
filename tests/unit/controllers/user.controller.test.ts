import { Request, Response } from 'express';
import * as userController from '../../../src/controllers/user.controller';
import * as userService from '../../../src/services/user.service';
import { mockUser } from '../../mocks';
import { Types } from 'mongoose';

// Mock do service
jest.mock('../../../src/services/user.service');
const mockedUserService = userService as jest.Mocked<typeof userService>;

// Helper para criar mocks de Request e Response
const mockRequest = (body?: any, params?: any, query?: any): Partial<Request> => ({
    body,
    params,
    query,
});

const mockResponse = (): Partial<Response> => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
};

describe('User Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('insertUser', () => {
        it('should create user successfully', async () => {
            const req = mockRequest(mockUser);
            const res = mockResponse();

            mockedUserService.createUser.mockResolvedValue(mockUser as any);

            await userController.insertUser(req as Request, res as Response);

            expect(mockedUserService.createUser).toHaveBeenCalledWith(mockUser);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.send).toHaveBeenCalledWith({
                success: true,
                message: 'User created successfully',
                data: mockUser,
            });
        });

        it('should handle service returning null', async () => {
            const req = mockRequest(mockUser);
            const res = mockResponse();

            mockedUserService.createUser.mockResolvedValue(null as any);

            await userController.insertUser(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({
                success: false,
                message: 'Failed to create user',
            });
        });

        it('should handle service errors', async () => {
            const req = mockRequest(mockUser);
            const res = mockResponse();

            const error = new Error('Database error');
            mockedUserService.createUser.mockRejectedValue(error);

            await userController.insertUser(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith({
                success: false,
                message: 'Database error',
            });
        });
    });

    describe('getAllUsers', () => {
        it('should return all users', async () => {
            const req = mockRequest();
            const res = mockResponse();
            const users = [mockUser];

            mockedUserService.getAllUsers.mockResolvedValue(users as any);

            await userController.getAllUsers(req as Request, res as Response);

            expect(mockedUserService.getAllUsers).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({
                success: true,
                message: 'Users fetched successfully',
                data: users,
            });
        });

        it('should handle no users found', async () => {
            const req = mockRequest();
            const res = mockResponse();

            mockedUserService.getAllUsers.mockResolvedValue(null as any);

            await userController.getAllUsers(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith({
                success: false,
                message: 'No users found',
            });
        });
    });

    describe('getUserById', () => {
        it('should return user by id', async () => {
            const userId = new Types.ObjectId().toString();
            const req = mockRequest(undefined, { id: userId });
            const res = mockResponse();

            mockedUserService.getUserById.mockResolvedValue(mockUser as any);

            await userController.getUserById(req as Request, res as Response);

            expect(mockedUserService.getUserById).toHaveBeenCalledWith(userId);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({
                success: true,
                message: 'User fetched successfully',
                data: mockUser,
            });
        });

        it('should handle user not found', async () => {
            const userId = new Types.ObjectId().toString();
            const req = mockRequest(undefined, { id: userId });
            const res = mockResponse();

            mockedUserService.getUserById.mockResolvedValue(null);

            await userController.getUserById(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith({
                success: false,
                message: 'No user found',
            });
        });
    });

    describe('findUserByEmail', () => {
        it('should find user by email', async () => {
            const email = 'joao@email.com';
            const req = mockRequest(undefined, undefined, { mail: email });
            const res = mockResponse();

            mockedUserService.findUserByEmail.mockResolvedValue(mockUser as any);

            await userController.findUserByEmail(req as Request, res as Response);

            expect(mockedUserService.findUserByEmail).toHaveBeenCalledWith(email);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({
                success: true,
                message: 'User fetched successfully',
                data: mockUser,
            });
        });

        it('should handle user not found by email', async () => {
            const email = 'notfound@email.com';
            const req = mockRequest(undefined, undefined, { mail: email });
            const res = mockResponse();

            mockedUserService.findUserByEmail.mockResolvedValue(null);

            await userController.findUserByEmail(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith({
                success: false,
                message: 'No user found',
            });
        });
    });
});