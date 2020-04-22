const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./mysqlConnention');

const { getHomePage } = require('./routes/index');

require('dotenv').config();

const TWO_HOURS = 1000 * 60 * 60 * 2;

const {
    PORT = process.env.PORT,
    NODE_ENV = 'development',

    SESS_NAME = 'sid',
    SESS_SECRET = 'fosslab',
    SESS_LIFETIME = TWO_HOURS
} = process.env;

const IN_PROD = NODE_ENV === 'production';

const app = express();

app.use(session({
    name : SESS_NAME,
    resave : false,
    saveUninitialized : false,
    secret : SESS_SECRET,
    cookie : {
        maxAge : SESS_LIFETIME,
        sameSite : true,
        secure : IN_PROD
    }
}))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', getHomePage);

app.listen(PORT, (err) => {
    if(!err) {
        console.log('Server is running...');
        console.log('Listening to port ' + PORT);
    } else {
        console.log(err);
    }
})


