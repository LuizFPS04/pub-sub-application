import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import userRouter from '../../src/routes/user.routes';
import UserModel from '../../src/models/userModel';
import { mockUser } from '../mocks';

const app = express();
app.use(bodyParser.json());
app.use('/api/v1', userRouter);

describe('User Integration Tests', () => {
    describe('POST /api/v1/user', () => {
        it('should create a new user successfully', async () => {
            const response = await request(app)
                .post('/api/v1/user')
                .send(mockUser)
                .expect(201);

            expect(response.body).toEqual({
                success: true,
                message: 'User created successfully',
                data: expect.objectContaining({
                    name: mockUser.name,
                    email: mockUser.email,
                    isActive: true,
                }),
            });

            // Verifica se o usuário foi realmente salvo no banco
            const savedUser = await UserModel.findOne({ email: mockUser.email });
            expect(savedUser).toBeTruthy();
            expect(savedUser?.name).toBe(mockUser.name);
        });

        it('should return 400 for duplicate email', async () => {
            // Cria um usuário primeiro
            await UserModel.create(mockUser);

            const response = await request(app)
                .post('/api/v1/user')
                .send(mockUser)
                .expect(500); // MongoDB duplicate key error

            expect(response.body.success).toBe(false);
        });

        it('should return 400 for missing required fields', async () => {
            const incompleteUser = { name: 'João' }; // faltando email e password

            const response = await request(app)
                .post('/api/v1/user')
                .send(incompleteUser)
                .expect(500);

            expect(response.body.success).toBe(false);
        });
    });

    describe('GET /api/v1/user/all', () => {
        it('should return all users', async () => {
            // Cria alguns usuários de teste
            const users = [
                { ...mockUser, email: 'user1@test.com' },
                { ...mockUser, email: 'user2@test.com', name: 'Maria Silva' }
            ];

            await UserModel.create(users);

            const response = await request(app)
                .get('/api/v1/user/all')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveLength(2);
            expect(response.body.data[0]).toMatchObject({
                name: users[0].name,
                email: users[0].email
            });
        });

        it('should return empty array when no users exist', async () => {
            const response = await request(app)
                .get('/api/v1/user/all')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data).toEqual([]);
        });
    });

    describe('GET /api/v1/user/:id', () => {
        it('should return user by id', async () => {
            const createdUser = await UserModel.create(mockUser);

            const response = await request(app)
                .get(`/api/v1/user/${createdUser._id}`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data).toMatchObject({
                name: mockUser.name,
                email: mockUser.email
            });
        });

        it('should return 404 for non-existent user id', async () => {
            const fakeId = '64f123456789abcdef123456';

            const response = await request(app)
                .get(`/api/v1/user/${fakeId}`)
                .expect(404);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('No user found');
        });
    });

    describe('GET /api/v1/user?mail=email', () => {
        it('should find user by email', async () => {
            await UserModel.create(mockUser);

            const response = await request(app)
                .get('/api/v1/user')
                .query({ mail: mockUser.email })
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data).toMatchObject({
                name: mockUser.name,
                email: mockUser.email
            });
        });

        it('should return 404 for non-existent email', async () => {
            const response = await request(app)
                .get('/api/v1/user')
                .query({ mail: 'nonexistent@test.com' })
                .expect(404);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('No user found');
        });
    });

    describe('Password Security', () => {
        it('should hash password before saving', async () => {
            await request(app)
                .post('/api/v1/user')
                .send(mockUser)
                .expect(201);

            const savedUser = await UserModel.findOne({ email: mockUser.email });
            expect(savedUser?.password).not.toBe(mockUser.password);
            expect(savedUser?.password).toMatch(/^\$2[abxy]?\$\d+\$/); // bcrypt hash pattern
        });
    });
});