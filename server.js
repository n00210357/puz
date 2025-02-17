//links to the severs need modules
const express = require('express');
const jwt = require('jsonwebtoken')
const app = express();
const cors = require('cors');

// chooses the port
const port = 5000;

//connects to the severs required files
require('dotenv').config();
require('./conifg/db.js')();
require('./conifg/image_upload.js');

app.use(cors());

//sets up the apps type
app.use(express.json());
app.set('view engine', 'html');

//sets up image view
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views/'));

app.use((req, res, next) => 
{
    //grabs authorization
    let authHeader = req.headers.authorization?.split(' ');
    console.log(authHeader);

    //confirms authorization
    if (req.headers?.authorization && authHeader[0] == 'Bearer')
    {
        //verifies authorization
        jwt.verify(authHeader[1], process.env.JWT_SECRET, (err, decoded) => 
        {
            if (err)req.user = undefined;
            req.user = decoded;
            next();
        });
    }
    else
    {
        req.user = undefined;
        next();
    }
});

//connects the routes
app.use('/api/users', require('./routes/users.js'));
app.use('/api/puzzles', require('./routes/puzzles.js'));
app.use('/api/comments', require('./routes/comments.js'));
app.use('/api/messages', require('./routes/messages.js'));
//app.use('/api/mines', require('./routes/mines.js'));
//app.use('/api/mineral_mines', require('./routes/mineral_mines.js'));

//logs the port
app.listen(port, () =>
{
    console.log(`Example port = ${port}`);
});