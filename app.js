const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const { getLoginPage, loginFaculty, getFacultyProfile } = require('./routes/faculty');
const { addAdmin } = require('./routes/admin');

require('dotenv').config();

const { getHomePage } = require('./routes/index');

require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', getHomePage);

app.get('/login', getLoginPage);
app.post('/login', loginFaculty);

app.get('/faculty/:id', getFacultyProfile);

app.post('/admin/add', addAdmin);

app.listen(process.env.PORT, (err) => {
    if(!err) {
        console.log('Server is running...');
        console.log('Listening to port ' + process.env.PORT);
    } else {
        console.log(err);
    }
})


