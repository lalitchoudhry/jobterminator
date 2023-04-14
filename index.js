const app = require('./app');
const port = process.env.PORT || 80;

app.listen(port, ()=>{
    console.log(`server in running on port ${port}`);
});