const request = require('supertest');
const app = require('../app');

let server;

beforeAll(async () => {
    // Start the server before all tests
    server = app.listen(3001); // Use a different port for testing
});

afterAll(async () => {
    // Close the server after all tests
    await server.close();
});

beforeEach(async () => {
    // Register a test user before each test
    await request(server)
        .post('/register')
        .send({ username: 'testuser', password: 'testpass' });
});

describe('Task API', () => {
    it('should create a new project', async () => {
        const response = await request(server)
            .post('/projects')
            .set('username', 'testuser')
            .set('password', 'testpass')
            .send({
                name: 'Sample Project',
                description: 'This is a sample project',
                duration: '2 months'
            });
        expect(response.statusCode).toBe(201);
        expect(response.body.name).toBe('Sample Project');
    });

    it('should create a new task within a project', async () => {
        // First, create the project
        await request(server)
            .post('/projects')
            .set('username', 'testuser')
            .set('password', 'testpass')
            .send({
                name: 'Sample Project',
                description: 'This is a sample project',
                duration: '2 months'
            });

        // Now, create a new task within that project
        const response = await request(server)
            .post('/projects/Sample Project/tasks')
            .set('username', 'testuser')
            .set('password', 'testpass')
            .send({
                title: 'Sample Task',
                description: 'This is a sample task',
                dueDate: '2024-10-10',
                assignee: 'testuser2'
            });
        expect(response.statusCode).toBe(201);
        expect(response.body.title).toBe('Sample Task');
    });
});
