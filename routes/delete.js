const express=require('express');
const router=express.Router();
const db = require('../config/database').db;
router.get("/deleteuser/:id", (req,res)=>{
    let qry3 = " delete from employee_db.employee_details where Id = ?";
    db.query(qry3, [req.params.id] ,(err,row)=>{
        if(err) throw err
        res.render("view", {msg: true});
    });
    })
module.exports=router;