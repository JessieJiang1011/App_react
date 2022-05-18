const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// user
const Users = require('./Routes/Users');

const app = express();

app.use(cors({origin:'*'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// connect to database
const con = mysql.createConnection({
    host:'127.0.0.1',
    user:'root',
    password:'',
    database:'app_react_node'
})

con.connect(function(err){
    if(err) throw err;
})

//this function allow users to visit this path
app.use('/images',express.static(path.join(__dirname,'images')))
app.use('/',express.static(path.join(__dirname,'react')))

// api
app.use('/api/users', Users);

// port
const port = process.env.PORT || 4000;

// run the server
app.listen(port, ()=> console.log(` port listen on port ${port}`) )
