const express = require('express');
const app = express();
app.use(express.json());

let users = [];
let projects = [];

// Middleware for authentication
const authenticate = (req, res, next) => {
    const user = users.find(u => u.username === req.headers.username && u.password === req.headers.password);
    if (user) {
        req.user = user;
        next();
    } else {
        res.status(401).send({ message: 'Unauthorized' });
    }
};

// User Registration
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    users.push({ username, password });
    res.status(201).send({ message: 'User registered successfully' });
});

// User Login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        res.status(200).send({ message: 'Login successful' });
    } else {
        res.status(400).send({ message: 'Invalid credentials' });
    }
});

// Project Creation
app.post('/projects', authenticate, (req, res) => {
    const { name, description, duration } = req.body;
    const project = { name, description, duration, owner: req.user.username, tasks: [] };
    projects.push(project);
    res.status(201).send(project);
});

// Task Creation and Assignment
app.post('/projects/:name/tasks', authenticate, (req, res) => {
    const project = projects.find(p => p.name === req.params.name && p.owner === req.user.username);
    if (project) {
        const { title, description, dueDate, assignee } = req.body;
        const task = { title, description, dueDate, assignee, status: 'Not Started' };
        project.tasks.push(task);
        res.status(201).send(task);
    } else {
        res.status(404).send({ message: 'Project not found or you are not the owner' });
    }
});

// Task Status Update
app.put('/projects/:name/tasks/:title', authenticate, (req, res) => {
    const project = projects.find(p => p.name === req.params.name && p.owner === req.user.username);
    if (project) {
        const task = project.tasks.find(t => t.title === req.params.title);
        if (task) {
            task.status = req.body.status;
            res.send(task);
        } else {
            res.status(404).send({ message: 'Task not found' });
        }
    } else {
        res.status(404).send({ message: 'Project not found or you are not the owner' });
    }
});

app.listen(3000, () => console.log('Server started on port 3000'));
