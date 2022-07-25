const queries = {
    createTable: {
        client: 'CREATE TABLE clients(username, password)'
    },

    insert: {
        client: `INSERT INTO clients(userName, password)
            VALUES(?, ?)`
    },
}

module.exports = {
    queries
}