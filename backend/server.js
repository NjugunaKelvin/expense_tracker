const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const cors = require('cors');
const bcrypt = require('bcrypt');

// declare an app on the express package
const app = express();

// use the app
app.use(express.json());
app.use(cors());
dotenv.config();

// connect to database
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

// check if connection is succesfull
connection.connect((err)=>{
    if(err) return console.log(err);
    console.log('Database Server connected succesfully..');

    // Create Database
    connection.query('CREATE DATABASE IF NOT EXISTS Web_Module_Project', (err, result)=>{
        if(err) return console.log(err);
        console.log('Database Web_Module_Project successfully created');
    });

    // select database
    connection.query('USE Web_Module_Project', (err, result)=>{
        if(err) return console.log(err);
        console.log('Database changed to Web_Module_Project');
    });

    // create table
    const UserTableQuery = `CREATE TABLE IF NOT EXISTS Users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(50) NOT NULL UNIQUE,
        username VARCHAR(10) NOT NULL UNIQUE,
        password VARCHAR(20) NOT NULL
    )`;

    // check table creation
    connection.query(UserTableQuery, (err, result)=>{
        if(err) return console.log(err);
        console.log('Users table succesfully created');

    });

});

// user registration route
app.post('/backend/register', async(req, res)=>{
    try{
        const users = `SELECT * FROM Users WHERE email = ?`;
        // check if user exists
        connection.query(Users, [req.body.email], (err, data)=>{
            
            // if we find the user
            if(data.length > 0) return res.status(409).json("User already exists");

            // if we don't find the user
            // encrypting password
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(req.body.password, salt);

            // create new user
            const newUser = `INSERT INTO Users(email, username, password) VALUES (?,?,?)`
            value = [ req.body.email, req.body.username, hashedPassword ]

            connection.query(newUser, value, (err, data)=>{
                if(err) return res.status(400).json("Something went wrong");

                return res.status(201).json("User created successfully");
            });
        });

    }
    catch(err){
        res.status(500).json("Internal Server Error");
    }

});

// customize port
app.listen(5500, ()=>{
    console.log('Server is running on port 5500..');
});