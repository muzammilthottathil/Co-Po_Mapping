const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const { getLoginPage, loginFaculty, getFacultyProfile, logoutFaculty } = require('./routes/faculty');
const { addAdmin, addFaculty, getFacultyAddPage } = require('./routes/admin');
const { verifyFaculty, ifLoggedIn, verifyAdmin } = require('./routes/middleware');

require('dotenv').config();

const { getHomePage } = require('./routes/index');

require('dotenv').config();

const app = express();

app.use(cookieParser());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', getHomePage);

app.get('/login', ifLoggedIn, getLoginPage);
app.post('/login', ifLoggedIn, loginFaculty);

app.get('/faculty/:id', verifyFaculty, getFacultyProfile);

app.get('/addfaculty', verifyAdmin, getFacultyAddPage);
app.post('/addfaculty', addFaculty);

app.post('/admin/add', addAdmin);

app.get('/logout', logoutFaculty);

app.listen(process.env.PORT, (err) => {
    if(!err) {
        console.log('Server is running...');
        console.log('Listening to port ' + process.env.PORT);
    } else {
        console.log(err);
    }
})


