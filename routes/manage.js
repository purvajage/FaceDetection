const express = require('express');
const router = express.Router();
const db = require('../config/database').db;

// Middleware to parse URL-encoded form data
router.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON (if you're sending JSON data in requests)
router.use(express.json());
router.get("/",(req,res)=>{
    let qry = "select * from employee_db.employee_details";
    db.query(qry,(err,rows)=>{
        if(err) throw err
        else
        res.render("manage", { rows });
    });      
});

router.get("/deleteuser/:email", (req,res)=>{
    let qry3 = " delete from employee_db.employee_details where email = ?";
    db.query(qry3, [req.params.email] ,(err,row)=>{
        if(err) throw err
        res.render("delete", {msg: true});
    });
    })

// Route to show the form with pre-filled employee data
router.get("/updateuser/:email", (req, res) => {
    let qry = "SELECT * FROM employee_db.employee_details WHERE email = ?";
    db.query(qry, [req.params.email], (err, rows) => {
        if (err) throw err;
        res.render("update", { rows });  // Render the form with employee data
    });
});

// Route to handle form submission and update employee data
router.post("/updateuser/:email", (req, res) => {
    let { name, department, salary } = req.body;

    // Ensure all form fields are properly captured
    if (!name || !department || !salary) {
        return res.render("update", { mesg: "All fields are required", rows: [{ fullname: name, department, salary }] });
    }

    // SQL query to update the employee record
    let qry2 = "UPDATE employee_db.employee_details SET fullname = ?, department = ?, salary = ? WHERE email = ?";

    // Execute the query with form data and the email as the identifier
    db.query(qry2, [name, department, salary, req.params.email], (err, results) => {
        if (err) {
            console.error(err);
            return res.render("update", { mesg: "Error updating data!", rows: [{ fullname: name, department, salary }] });
        }

        if (results.affectedRows > 0) {
            // After successful update, fetch the updated data to show in the form
            db.query("SELECT * FROM employee_db.employee_details WHERE email = ?", [req.params.email], (err, updatedRows) => {
                if (err) throw err;
                res.render("update", { mesg: "Data Updated!", rows: updatedRows });
            });
        } else {
            res.render("update", { mesg: "Update failed. No changes made.", rows: [{ fullname: name, department, salary }] });
        }
    });
});





module.exports = router;     