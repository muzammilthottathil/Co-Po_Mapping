const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const { getLoginPage, loginFaculty, getFacultyProfile, logoutFaculty } = require('./routes/faculty');
const { addAdmin, addFaculty, getFacultyAddPage, assignFaculty, getAddCoursePage, addCourse, getAssignFacultyPage } = require('./routes/admin');
const {  getAllCourses, getCourseDetails, getCoursePage } = require('./routes/course');
const { verifyFaculty, ifLoggedIn, verifyAdmin } = require('./routes/middleware');

const { getCoPoMatrixPage, addCoPoMatrix } = require('./routes/course');

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

app.get('/admin/addfaculty', verifyAdmin, getFacultyAddPage);
app.post('/admin/addfaculty', verifyAdmin, addFaculty);

app.get('/admin/addcourse', verifyAdmin, getAddCoursePage);
app.post('/admin/addcourse', verifyAdmin, addCourse);

app.get('/admin/courses', verifyAdmin, getAllCourses);
app.get('/admin/courses/:coursecode', verifyAdmin, getCourseDetails);

app.get('/admin/courses/:coursecode/assignfaculty', verifyAdmin, getAssignFacultyPage);
app.post('/admin/courses/:coursecode/assignfaculty', verifyAdmin, assignFaculty);

app.get('/admin/courses/:coursecode/entercopomatrix', getCoPoMatrixPage);
app.post('/admin/courses/:coursecode/entercopomatrix', addCoPoMatrix);

app.get('/faculty/:id/courses/:coursecode/:year', verifyFaculty, getCoursePage);


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


