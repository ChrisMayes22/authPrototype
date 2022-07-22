const express = require('express');
const bcrypt = require('bcrypt');

const app = express();


app.use(express.json())

app.post('/users/create', async (req, res) => {
    const password = req.body['password'];
    const saltRounds = 5;
    let newHash;

    bcrypt.hash(password, saltRounds, function(err, hash) {
       console.log('hash1:', hash);
       newHash = hash;
       res.send(newHash);
    });
})

app.post('/users/login', (req, res) => {
    bcrypt.compare('passwod', "$2b$05$OakBT1OqHuXnayCaQs2T1e2aIgfc.4IDvoLDpklQn3qDqhsvOJd4.", function(err, result) {
        console.log(result);
        res.send(result);
    });
})

const PORT = 5000;

app.listen(PORT, e => {
    if(e) console.error(e);
    console.log(`Auth layer listening at port ${PORT}`)
})