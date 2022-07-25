/** Class used to encapsulate data and methods related to DB control */

const sqlite3 = require('sqlite3').verbose();

class DB {
    constructor(dbUrl){
        this._dbUrl = dbUrl; 
        this._db = null;
    }

    _initDb(){
        /** loads the database from disc into memory */
        this._db = new sqlite3.Database(this._dbUrl, sqlite3.OPEN_READWRITE, err => {
            if(err) return console.error(err)
        })
    }

    resetDB(){
        /** Drops the clients table, then recreates an empty clients table */
        this._initDb();
        this._db.run('DROP TABLE clients', (err, _) => {
            if(err) return console.error(err);
            this._db.run('CREATE TABLE clients(username, password)')
            this._db.close();
        });
    }

    insertClient(username, password, sql, cb) {
        /** Inserts a client into the database
         * 
         * @param {string} username: represents client's username
         * @param {string} password: represents a HASHED AND SALTED password
         * @param {string} sql: represents a sql query
         * @param {function} cb: callback function to be run after insertClient
         */

        this._initDb();

        // First, check if username is already in use (query the username)
        this._db.get(`SELECT * 
            FROM clients 
            WHERE username='${username}'`, (err, row) => {
            if(err) {
                cb(err);
            }

            // Either create new user or send error based on results of query.
            if(!row){
                this._db.run(sql, [username, password])
                cb(null, 'Client added successfully');
            } else {
                cb('error: a client with that username already exists.');
            }

            this._db.close();
        })
    }

    getAllRows(){
        /** Print a list of all clients to the console */

        this._initDb();
        this._db.all('SELECT * from clients', (err, row) => {
            if(err) return console.error(err);

            row.forEach(row => {
                console.log(row);
            })
            this._db.close();
        })
    }

    getClientByUsername(username, cb){
        /** Gets a client based on the username 
         * 
         * @param {string} username: A string representing the client's username
         * @param {function} cb: The callback function to be run after the query
        */

        this._initDb();
        this._db.get(`SELECT * 
            FROM clients 
            WHERE username='${username}'`, (err, row) => {
            if(err) cb(err);

            cb(null, row);
            this._db.close();
        })
    }
}

module.exports = {
    DB
}
