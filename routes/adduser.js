const express = require('express');
const router = express.Router();
const db = require('../config/database').db;
const multer = require('multer');
const path = require('path');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'db/'); // Store files in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    // Rename the file to ensure uniqueness, using current timestamp + original file extension
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Modify route to handle file upload using multer
router.post("/", upload.single('employeeImage'), (req, res) => {
  const { name, email, department, salary, username, password } = req.body;
  const employeeImage = req.file; // Access the uploaded image file

  if (!employeeImage) {
    return res.status(400).send('No image file uploaded');
  }

  // Construct the image path to store in the database
  const imagePath = `/db/${employeeImage.filename}`;

  // Modified query to include image path
  let qry = "insert into employee_db.employee_details(fullname, email, department, salary, username, password, image_path) values (?,?,?,?,?,?,?)";

  // Store employee details along with image path
  db.query(qry, [name, email, department, salary, username, password, imagePath], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Database error');
    }

    if (result.affectedRows > 0) {
      res.render("user", { msg: true });
    } else {
      res.render("user", { msg: false });
    }
  });
});

module.exports = router;
