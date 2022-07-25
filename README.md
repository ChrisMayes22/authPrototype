Chris Mayes
CS 361 – Summer 2022

# DEPENDENCIES

The runtime environment should include node v. 14 or later. 
Yarn or npm may be used as package managers, but the .lock file present was created with yarn
See package.json for other dependencies

# INTERFACES

This project has two main interfaces: The server API and the scripts in the `scripts` directory.

The server provides a way for users to add themselves to the database of clients through HTTP pipelines
The scripts provide a way for the db-admin users to manually reset the database and view local data.

# USAGE

## Server

To run the server, run app.js as a node script using the following syntax in the console:

`node app.js`

If all is well, you shoulde see `Auth layer listening at port 5000` written to the console.

Once running, the server will expect HTTP POST requests. The POST body should have the following structure:

```
{
    "username": "foo-username",
    "password": "foo-password"
}
```

The HTTP request should have a Content-Type header of json.
By default, the server will listen at localhost:5000 or at process.env.NODE_ENV if it is defined.
An example POST request using the fetch API might look like the following:

```
const params = {
    username: "EleanorGatsby",
    password: "NotSecure"; 
};
const options = {
    method: 'POST',
    body: JSON.stringify( params )  
};
fetch('http://127.0.0.1/5000/users/create', options )
    .then( response => response.json() )
    .then( response => {
        // Do something with response.
});
```

## Scripts

Scripts can be run directly from the console using the following syntax:

`node ./scripts/[script filename]`

scripts/getAllClients.mjs will print all rows from the database to the console.
scripts/ResetDB.mjs will drop and then re-create the clients table from the db

# CAVEATS - NOT SECURE

Note that this service is a prototype. 
Because TLS is not implemented, this authentication service is NOT secure.
Additional input sanitation would also be needed for production.