const express = require('express');
const bcrypt = require('bcrypt');
const { DB } = require('./db/db');
const { queries } = require('./db/queries');

const db = new DB('./clients.db');
const app = express();

// Server will expect JSON in HTTP Post body
app.use(express.json())

const validateBody = (body) => {
    ['username', 'password'].forEach(key => {
        if(typeof(body[key] !== 'string ' || body[key] === null)){
            return false;
        }
    })
    return true;
}

// Create User route
app.post('/users/create', async (req, res, next) => {
    /** This route attempts to create a new user using the
     * password and username passed in the HTTP body (JSON).
     * 
     * If the username is already in use, or if the body is empty,
     * an error will be sent in response.
     */

    if(!validateBody(req.body)){
        res.status(400).json({result: 'Inappropriate username or password. Please ensure both are valid strings.'});
        return;
    }
    
    // Hash password using bcrypt. This will ensure only salted hashes are stored
    // to database and not plaintext passwords.
    const saltRounds = 5;
    bcrypt.hash(req.body['password'], saltRounds, (err, hash) => {
        if(err){
            res.status(500).json({'error': err});
            return
        }

        // Insert new client
        db.insertClient(req.body['username'], hash, queries.insert.client, (err, result) => {
            if(err) {
                res.status(500).json({'error': err});
                return
            }

            res.json({result: result});
        });
    });
})

// Login Route
app.post('/users/login', (req, res) => {
    /** This route will attempt to authenticate users based on a username and password
     *  in the HTTP body. If a valid username and password are provided, ~secret data~
     *  is provided in the response. Otherwise, an error is sent.
     */

    // Find a matching username from the db if that username exists
    db.getClientByUsername(req.body['username'], (err, user) => {
        if(err){
            res.status(500).json({result: err});
            return;
        }
        if(!user){ // i.e. username not found
            res.status(409).json({result: 'Error: Username not found or password does not match'})
            return;
        }

        // Compares stored hash with provided password. 
        // doesMatch callback param will be true if the passwords match and false if not
        bcrypt.compare(req.body['password'], user.password, (err, doesMatch) => {
            if(err){
                res.status(500).json({result: err});
                return;
            }
            if(!doesMatch){
                res.status(409).json({result: 'Error: Username not found or password does not match'});
                return;
            }
            res.json({result: 'Password matched, here is ~secret data~'});
        });
    });
})

const PORT = process.env.NODE_ENV || 5000;

app.listen(PORT, e => {
    if(e) console.error(e);
    console.log(`Auth layer listening at port ${PORT}`)
})