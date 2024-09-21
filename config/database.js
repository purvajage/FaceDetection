const mysql = require('mysql');
const db = mysql.createConnection({
    host:'localhost',
    database:'employee_db',
    user:'root',
    password:'purva@123',
    port:'3306',
});

db.connect(err=>{
    if(err)
    {
       console.log('Error occured '+err);
    }
    else
    {
       console.log('Connected successful')
    }
});
module.exports.db=db;