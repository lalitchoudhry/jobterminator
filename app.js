require('dotenv').config()
const express = require('express')
const port = process.env.PORT || 80;

const app = express()

app.get('/', (req, res)=>{
    res.send('hello');
})

app.listen(port, ()=>{
    console.log(`server is lisening on port ${port}`)
})