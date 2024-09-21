const express=require('express');
const router=express.Router();
const db = require('../config/database').db;
router.get("/",(req,res)=>{
    res.render("login");
});

router.get("/wel",(req,res)=>{
    res.render("wel");
})

router.get("/dashboard",(req,res)=>{
    res.render("dashboard")
});

router.get("/createuser",(req,res)=>{
    res.render("user")
});


module.exports = router;