const express=require('express');
const router=express.Router();
const db = require('../config/database').db;
router.get("/",(req,res)=>{
    const {email,password} = req.query;
    if (email == "admin@admin.com" && password == "admin")
    {
        res.render("welcome")    
    } 
    else 
    {   
        res.render("login",{msg: true})
    }
});
module.exports = router;