const express = require('express');
require('dotenv').config();
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;

//serve static files
app.use(express.static(path.join(__dirname, 'build')));

//route
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


app.listen(PORT, () => {console.log(`Listening to you on ${PORT}`)});

