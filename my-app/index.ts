import express, { 
    Express, 
    Request, 
    Response, 
    NextFunction 
  } from 'express';
  import dotenv from 'dotenv';
  import cors from 'cors';
  
  // Configure dotenv
  dotenv.config();
  
  // Create Express app with explicit typing
  const app: Express = express();
  
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
  app.use(express.json());
  app.use(cors());
  
  // Interface for form inputs
  interface FormInputs {
    email: string;
    password: string;
  }
  
  // Interface for user
  interface User {
    id: number;
    name: string;
    email: string;
    password: string;
  }
  
  // Array of example users for testing purposes
  const users: User[] = [
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
  
  // Explicit type for route handler
  type RouteHandler = (req: Request, res: Response, next: NextFunction) => void;
  
  // Root route
  const rootHandler: RouteHandler = (req, res) => {
    res.send('Hello World From the Typescript Server!');
  };
  app.get('/', rootHandler);
  
  // Login route
  const loginHandler: RouteHandler = (req, res) => {
    // Type assertion for request body
    const { email, password } = req.body as FormInputs;
    
    const user = users.find(u => 
      u.email === email && u.password === password
    );
    
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