const express = require('express');
const router = express.Router();
const db = require('../config/database').db;

router.get("/",(req,res)=>{
    let qry = "select fullname,department from employee_db.employee_details";
    db.query(qry,(err,rows)=>{
        if(err) throw err
        else
        res.render("department", { rows });
    });      
});


module.exports = router;