require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const mongoose = require('./config/database');
const User = require('./models/userModel')

const app = express();
app.use(express.json());

// routes
app.get('/', (req, res)=>{
    res.send('hello');
});

app.post('/register', async(req, res)=>{
    try {
        const {name, email, mobile, password} = req.body;

        if (!(name && email && mobile && password)) {
            return res.status(400).send("All input is required");
        }

        const oldUser = await User.findOne({ email });
        if (oldUser) {
            return res.status(409).send("User Already Exist. Please Login");
        }

        const encryptedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name: name,
            email: email.toLowerCase(),
            mobile: mobile,
            password: encryptedPassword
        });

        const token = jwt.sign(
            {user_id: user._id, email},
            process.env.TOKEN_KEY
        );

        user.token = token;

        res.status(201).json(user);
    } catch (err) {
        console.log(err)
        res.status(400).json({message: err.message});
    }
})

app.post('/login', async(req, res)=>{
    try {
        const {email, password} = req.body;
        if (!(email && password)) {
            return res.status(400).json('All input is required')
        }

        const user = await User.findOne({email});

        if (user && (await bcrypt.compare(password, user.password))) {
            //create token
            const token = jwt.sign(
                { user_id: user._id, email },
                process.env.TOKEN_KEY
            );
            user.token = token;

            return res.status(200).json(token);
        }
        res.status(400).json("Invalid Credential")
    } catch (err) {
        res.status(501).json({message: err.message});
    }
})

module.exports = app;