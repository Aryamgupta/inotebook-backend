const express = require('express');

const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_STR = 'aryamsign';
const getuser = require('../middleware/getuser')

const checkForError = (req,res) =>{
    const result = validationResult(req);
    return !result.isEmpty();
}
// now we will take the input or the crate new user from the req body and store it to the data base

// Route 1 : for sign up / using : http://localhost:5000/api/auth/createuser / it will work for creating a account for the user no login is required
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email','Enter a Email name').isEmail(),
    body('password','Enter a Password name').isLength({ min: 3 }),
], async (req, res) => {
    let success = false;
    // if errors are there then send bad request and do nothing
    if(checkForError(req)){
        return res.status(400).json({success ,error : "please enter the correct entries"});
    }

    try{
        
    // check if user exists or not 
    let user = await User.findOne({email : req.body.email});
    // console.log(user);
    if(user){
        return res.status(400).json({success ,error : "User Already Exists"});
    }

   

    const salt = await bcrypt.genSalt(10);
    const secPassword = await bcrypt.hash(req.body.password,salt);
    user = await User.create({
        name : req.body.name,
        email : req.body.email,
        username: req.body.username,
        password : secPassword,
    })
    // console.log(user.id);

    const data = {
        user: {
            id: user.id
        }
      }
      const authtoken = jwt.sign(data, JWT_STR);
      success = true;
      res.json({ success, authtoken })
      
    }
    catch(error){
        console.error(error.message);
        res.status(500).send({success ,message : "Some error occured"});
    }
   
});


// Route 1 : for login  / using : http://localhost:5000/api/auth/login  /login of the user log in is required

router.post('/login', [
    body('email','Enter a Email name').isEmail(),
    body('password','Enter a Password name').exists(),
], async (req, res) => {
    let success = false;
    // if errors are there then send bad request and do nothing
    if(checkForError(req)){
        return res.status(400).json({success ,error : "please enter the correct entries"});
    }

    const {email , password} = req.body;
    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({success ,error : "Please Enter the correct Credentials"});
        }
        const storedPass = await bcrypt.compare(password,user.password);
        if(!storedPass){
            return res.status(400).json({success ,error : "Please Enter the correct Credentials"});
        }
        const data = {
            user: {
              id: user.id,
            }
          }
          const authtoken = jwt.sign(data, JWT_STR);
          success = true;
          res.json({ success, authtoken })
    }
    catch(error){
        console.error(error.message);
        success  = false;
        res.status(500).send({success,message : "Some error occured"});
    }
})

// Route 3 : get logged in user details  / using : http://localhost:5000/api/auth/getuser
router.post('/getuserdetail', getuser , async (req, res) => {
    let success = false;
    try {
        let userId = req.usemr.id;
        const user = await User.find({_id : userId}).select("-password");
        res.send(user);
        
        // console.log("data retrived successfully");

      } catch (error) {
        console.error(error.message);
        res.status(500).send({success ,message : "Internal Server Error"});
      }
})

module.exports = router;