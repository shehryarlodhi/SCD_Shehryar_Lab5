const request = require('supertest');
const app = require('../app');

describe('Task API', () => {
    it('should create a new project', async () => {
        const response = await request(app)
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
        const response = await request(app)
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
