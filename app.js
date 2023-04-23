require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const auth = require('./middleware/auth');
const mongoose = require('./config/database');
const User = require('./models/userModel');
const Job = require('./models/jobModel');

const app = express();
app.use(express.json());

// routes
app.get('/health', (req, res)=>{
    res.send('yeah, its working');
})

app.get('/', (req, res)=>{
    res.send('hello');
});

app.post('/jobterminator/register', async(req, res, next)=>{
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

        res.status(201).json(user.name);
    } catch (err) {
        next(err);
        // res.status(400).json({message: err.message});
    }
})

app.post('/jobterminator/login', async(req, res, next)=>{
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

            return res.status(200).json(user.name);
        }
        res.status(400).json("Invalid Credential")
    } catch (err) {
        next(err);
    }
})

app.post('/jobterminator/protected', auth, async(req, res, next)=>{
    try {
        const {companyName, logoUrl, jobPosition, monthSalary, jobType, workAt, location, jobDescription, aboutCompany, skills} = req.body;
        if (!(companyName && logoUrl && jobPosition && monthSalary && jobType && workAt && location && jobDescription && aboutCompany && skills)) {
            return res.status(400).json("All Input Is Required")
        }

        const job = await Job.create({
            companyName: companyName,
            logoUrl: logoUrl,
            jobPosition: jobPosition,
            monthSalary: monthSalary,
            jobType: jobType,
            workAt: workAt,
            location: location,
            jobDescription: jobDescription,
            aboutCompany: aboutCompany,
            skills: skills
        })
        res.status(201).json({message: 'successfuly added', job});

    } catch (err) {
        err.status = 400;
        next(err);
    }
})

// get filterd and detailed jobs
app.post('/jobterminator/list',auth, async(req, res, next)=>{

    try {
        let filter = req.query;
        if (req.query.skills) {
            let skills = {$in: req.query.skills};
            filter.skills = skills;
        }
        
        console.log(filter)
        const jobList = await Job.find(filter).catch((err)=>next(err));

        res.send(jobList);
    } catch (err) {
        next(err);
    }
    
})

app.put('/jobterminator/:id', async(req, res, next)=>{
    try {
        const {id} = req.params;
        console.log(id)
        const job = await Job.findByIdAndUpdate(id, req.body);
        if (!job) {
            return res.status(404).json("Cannot find any product1")
        }

        const updateJob = await Job.findById(id);
        res.status(200).send(updateJob);
    } catch (err) {
        err.status = 500;
        next(err)
    }
})


module.exports = app;