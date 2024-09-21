let db = require('./config/database').db;
let express = require('express');
let port = 7000;
let app = express();
const manage = require('./routes/manage');
const index = require('./routes/index');
const login = require('./routes/login');
const adduser = require("./routes/adduser");
const deleteuser = require("./routes/delete");
const department = require("./routes/department");
const salary = require("./routes/salary");
const facelogin = require("./routes/facelogin")
const path = require('path');
const hbs = require('handlebars');
const { handlebars } = require('hbs');
const {engine} = require('express-handlebars');
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './view');
app.use(express.static(__dirname + "/public"));

app.use("/",index);
app.use("/welcome",login);
app.use("/adduser",adduser);
app.use("/manageuser",manage);
app.use("/manageuser/deleteuser/:email",manage);
app.use("/department",department);
app.use("/salary",salary);
app.use("/manageuser/update/:email",manage);
app.use("/manageuser/updateuser/:email",manage);
app.use("/facelogin",facelogin);


app.listen(port,(err)=>{
    if(err) 
        throw err
    else
    console.log(`server started on ${port}`);
});