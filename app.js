require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const port = process.env.PORT || 80;

const app = express();
app.use(express.json());

// connect to database
const url = process.env.DATABASE_URL;
mongoose.connect(url)
.then(()=>console.log('Database connected to server'))
.catch((err)=>console.log(err));

// routes
app.get('/', (req, res)=>{
    res.send('hello');
});

app.listen(port, ()=>{
    console.log(`server is lisening on port ${port}`);
});