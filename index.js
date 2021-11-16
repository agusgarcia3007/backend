const express = require('express')
const app = express()
const PORT = process.env.PORT || 4000
const connectDB = require('./config/db');
const cors = require('cors');


connectDB();


//enable cors 

app.use(cors());

//enable express.json
app.use(express.json({extended : true }))

app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/tasks', require('./routes/tasks'));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})