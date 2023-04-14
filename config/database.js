const mongoose = require('mongoose');

// connect to database
const uri = process.env.DATABASE_URL;
mongoose.connect(uri)
.then(()=>console.log('Database connected to server'))
.catch((err)=>console.log(err));

module.exports = mongoose;