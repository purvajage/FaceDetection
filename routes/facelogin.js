const express=require('express');
const router=express.Router();
router.get("/",(req,res)=>{
    // Python Face Recog
let { PythonShell } = require('python-shell');
var pyshell = new PythonShell('main.py');

pyshell.on('message',(message)=> {
    // received a message sent from the Python script (a simple "print" statement)
    // res.send(message);
    if(message == 'Pass'){
        res.render("welcome");
    }
  });

});

module.exports = router;