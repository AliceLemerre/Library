"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
// Configure dotenv
dotenv_1.default.config();
// Create Express app with explicit typing
const app = (0, express_1.default)();
// Middleware with detailed logging
app.use((req, res, next) => {
    console.log('Incoming request:');
    console.log('Method:', req.method);
    console.log('Path:', req.path);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    next();
});
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Array of example users for testing purposes
const users = [
    {
        id: 1,
        name: 'Maria Doe',
        email: 'maria@example.com',
        password: 'maria123'
    },
    {
        id: 2,
        name: 'Juan Doe',
        email: 'juan@example.com',
        password: 'juan123'
    }
];
// Root route
const rootHandler = (req, res) => {
    res.send('Hello World From the Typescript Server!');
};
app.get('/', rootHandler);
// Login route
const loginHandler = (req, res) => {
    // Type assertion for request body
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
        return res.status(404).json({ message: 'User Not Found!' });
    }
    return res.status(200).json(user);
};
app.post('/login', loginHandler);
// Start the server
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
