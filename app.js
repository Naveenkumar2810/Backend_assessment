const express = require('express');
const backend_server = express();
const path = require('path')
const env = require('dotenv')
const cors = require('cors')

// Middleware
backend_server.use(express.json()); // Parses JSON bodies
backend_server.use(express.urlencoded({ extended: true })); // Parses URL-encoded form data

env.config({path:path.join(__dirname,'config','conf.env')})

backend_server.use(cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true
}));

const details = require('./details')
const login = require('./login_auth')
const signup = require('./signup_auth')

backend_server.use('/backend/',details)
backend_server.use('/login/',login)
backend_server.use('/signup/',signup)

backend_server.listen(process.env.PORT,()=>{
    console.log(`test server is running successfully on ${process.env.PORT}`)
});
