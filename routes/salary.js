const express = require('express');
const router = express.Router();
const db = require('../config/database').db;

router.get("/",(req,res)=>{
    let qry = "select fullname,salary from employee_db.employee_details";
    db.query(qry,(err,rows)=>{
        if(err) throw err
        else
        res.render("salary", { rows });
    });      
});


module.exports = router;