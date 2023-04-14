const app = require('./app');
const port = process.env.PORT || 80;

//WRONG ROUTE ERROR HANDLER
app.use((req, res, next)=>{
    const err = new Error('Not Found');
    err.status = 404;
    next(err)
})

//ERROR HANDLER
app.use((err, req, res, next)=>{
    res.status(err.status || 500);
    res.send({
        error:{
            status: err.status || 500,
            message: err.message
        }
    })
})

app.listen(port, ()=>{
    console.log(`server in running on port ${port}`);
});