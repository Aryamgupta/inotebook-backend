const connectToMongo = require('./db');
connectToMongo();


const express = require('express')
var cors = require('cors')
var app = express()

app.use(cors())
const port = process.env.REACT_APP_WEB_PORT || 5000

// this is the role mode it gets the function work which is written in the callback when that localhost is triggerd 
// to use the fucntions from other files the " app.use(link,function) "  is used



app.use(express.json()); // to use the body of the request the this line is used

app.get('/', (req, res) => {
  res.send('heloo workf dasda')
})

app.use('/api/notes', require('./routes/notes'));
app.use('/api/auth', require('./routes/auth'));

app.listen(port, () => {
  console.log(`iNotebook app listening on port ${port}`)
})