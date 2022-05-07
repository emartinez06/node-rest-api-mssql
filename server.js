// Imports
const express =require("express");
const cors =require('cors');
const helmet =require('helmet');
const http =require('http');

// Route imports
const usersRoute =require('./routes/users');

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet.hidePoweredBy());
app.use(cors());

// API routes
app.use('/api/users', usersRoute);

// Server
const server = http.createServer(app);
server.listen(port);

// Output of server
console.log(`Server running at port ${port}`);