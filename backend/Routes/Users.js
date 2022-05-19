const mysql = require('mysql');
const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

const multer = require('multer');

// config data
const DB_NAME = require('./config/data').DB_NAME;
const HOST = require('./config/data').HOST;
const DB_SECRET = require('./config/data').DB_SECRET;
const USER_NAME = require('./config/data').USER_NAME;
// end of config data

// connect to database
const con = mysql.createConnection({
    host:HOST,
    user:USER_NAME,
    password:DB_SECRET,
    database:DB_NAME,
    connectionLimit:50,
    queueLimit:50,
    waitForConnection:true
})

con.connect(function(err){
    if(err) throw err;
})

con.on('error', ()=>console.log('err'));

var del = con._protocol._delegateError;
  con._protocol._delegateError = function(err, sequence){
    if (err.fatal) {
      console.trace('fatal error: ' + err.message);
    }
    return del.call(this, err, sequence);
  };

// for image uploaded / settings
const MIME_TYPE_MAP = {
    "image/png":"png",
    "image/jpeg":"jpg",
    "image/jpg":"jpg"
};

const storage = multer.diskStorage({
    destination:(req,file,cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("Invalid mime type");
        if(isValid) {error = null}
        cb(error, "images");
    }, filename: (req,file,cb) =>{
        const name = file.originalname
        .toLocaleLowerCase()
        .split(" ")
        .Join(".");
    const ext = MIME_TYPE_MAP(file.mimetype);
    cb(null, name+"-"+Data.now()+"."+ext)
    }
})



// select or create the Users table
function SelectOrCreateTable(){
    con.query('SELECT * FROM users', function(err, result, field){
        if(err) {
            const sql = 'CREATE TABLE users (id INT Auto_INCREMENT PRIMARY KEY, name VARCHAR(255), password VARCHAR(255), pic VARCHAR(255), email VARCHAR(255) Not Null UNIQUE, address VARCHAR(255) )';
            con.query(sql, function(err, result){
                if(err) throw err;
            });
        }
    })
}

SelectOrCreateTable();

// create a new user
router.post('/Register', async (req, res)=>{
    const email = req.body.Data.email;
    const pass = req.body.Data.password;
    const name = req.body.Data.name;

    con.query(`SELECT * FROM users WHERE email = '${email}'`, function(err, result){
        if(err) {
            res.send({err: 'err'})
        }
        if(result.length === 0){
            var sql = `INSERT INTO users (name, email, password) VALUES ('${name}', '${email}', '${pass}')`
            con.query(sql, function(err, result){
                if(err) throw err;
                res.status(200).send({result})
                console.log(result);
            } 

            )
        } else {
            return res.status(201).send({message:'this email is already taken'})
        }
    })
})

const JwtPrivateSecret = 'Jiaxi';

// login in
router.post('/Login', async(req, res)=>{
    const email = req.body.Data.email;
    const pass = req.body.Data.password;

    // const email = req.body.email;
    // const pass = req.body.password;

    con.query(`SELECT * FROM users WHERE email = '${email}' AND password = '${pass}'`, 
    async function( err, result){
        if(result.length !== 0){
            jwt.sign({UserEmail: email}, JwtPrivateSecret, 
                (err,token) => {
                    res.status(200).send({token:token})
                })
        }
        if(result.length === 0){
            res.status(400).send({message:'error not found'})
        }
    })
})

// get user data
router.get('/GetUserData', async (req,res)=>{
    const Token = req.headers['authorization'];
    var decoded = jwt.decode(Token, {complete:true});
    const UserE = decoded.payload.UserEmail;

    const theSQL = `SELECT * FROM users WHERE email = '${UserE}'`;
    con.query(theSQL, function(err, result){
        if(err) throw err;
        res.status(200).send({result});
    })
})

// update user data name pic address

const upload = multer({
    storage: storage, limits:{fieldSize:12*1024*1024}
}).single("image");

router.put('/edit/:id',upload,(req,res, next)=>{
    if(req.file && req.file !== ''){
        const Id = req.params.id;
        const URL = req.protocol + "://" + req.get("host");
        const pic = URL + "/images/" +req.file.filename;

        const name = req.body.name;
        const address = req.body.address;
        // update with mysql
        const sqql = `UPDATE users set name = '${name}', address = '${address}', pic = '${pic}' WHERE id = '${Id}'`;
        con.query(sqql, function(err, result){
            if(err) throw err;
            res.status(200).send({message:"successfully", result})
        })
    } else {
        const Id = req.params.id;
        const name = req.body.name;
        const address = req.body.address;
        // update with mysql
        const sqql = `UPDATE users SET name = '${name}', address='${address}' WHERE id = '${Id}'`;
        con.query(sqql, function(err,result){
            if(err) throw err;
            res.status(200).send({message: 'updated', result});
        })
    }
})

// delete one user
router.delete('/delete/:id/:password', (req,res,next)=>{
    const Id = req.params.id;
    const Pass = req.params.password;

    con.query(`SELECT * FROM users WHERE id = '${Id}' AND password = '${Pass}'`, 
    async function(err, result){
        if(result.length !== 0){
            // password correct
            con.query(`DELETE FROM users WHERE id = '${Id}'`,
            async function(err, result){
                if(err) throw err;
                res.status(200).send({message: result})
            })
        }
        if(result.length === 0){
            res.status(400).send({message:'err the password is not correct'})
        }
    })
})

module.exports = router;