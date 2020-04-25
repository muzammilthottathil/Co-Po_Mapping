const bcrypt = require('bcrypt');
const db = require('../mysqlConnention');

module.exports = {

    addAdmin : (req, res) => {

        let name = req.body.name;
        let deptId = req.body.deptId;
        let email = req.body.email;
        let password = req.body.password;

        bcrypt.hash(password, 10, (err, hash) => {
            if(err) {
                console.log(err);
                return;
            }
            password = hash;

            let registerUserQuery = `INSERT INTO faculty (faculty_name, dept_id, faculty_email, faculty_password, admin) VALUES(?, ?, ?, ?, ?)`
            let values = [name, deptId, email, password, true];
            db.query(registerUserQuery, values, (err, rows, fields) => {
                if(err) {
                    res.status(500).send(err);
                    return;
                }
                res.redirect('/login');
            })
        })
    },

    getFacultyAddPage : (req, res) => {
        res.render('addFaculty.ejs', {
            title : 'Add Faculty'
        })
    },

    addFaculty : (req, res) => {
        let facultyName = req.body.name;
        let deptId = req.body.department;
        let email = req.body.email;
        let password = req.body.password;

        bcrypt.hash(password, 10, (err, hash) => {
            if(err) {
                console.log(err);
                return;
            }
            password = hash;

            let registerUserQuery = `INSERT INTO faculty (faculty_name, dept_id, faculty_email, faculty_password, admin) VALUES(?, ?, ?, ?, ?)`
            let values = [facultyName, deptId, email, password, false];
            db.query(registerUserQuery, values, (err, rows, fields) => {
                if(err) {
                    res.status(500).send(err);
                    return;
                }
                res.redirect('/login')
            })
        })
    },

    getAddCoursePage : (req, res) => {
        res.render('addcourse.ejs', {
            title : 'Add course'
        })
    },

    addCourse : (req, res) => {

        let courseCode = req.body.courseCode;
        let courseName = req.body.courseName;
        let numberOfCos = req.body.numberOfCos;
        let deptId = req.body.dept;
        let sem = req.body.semester;

        let addCourseQuery = `INSERT INTO course(course_code, course_name, co_no, dept_id, semester) VALUES (?, ?, ?, ?, ?)`;
        let values = [courseCode, courseName, numberOfCos, deptId, sem];

        db.query(addCourseQuery, values, (err, rows, fields) => {
            if(err) {
                res.status(300).send(err);
                return;
            }

            res.send(`
                <div>
                    <h1>Course added succesfully</h1>
                    <p>Go back to <a href="/faculty/${req.body.adminId}">profile page</a></p>
                </div>
            `);
        })
    },

    getAssignFacultyPage : (req, res) => {

        let courseCode = req.params.coursecode;
        let getCourseDetailsQuery = `SELECT * FROM course, department WHERE course_code = "${courseCode}" AND course.dept_id = department.dept_id`;
        let getFacultiesQuery = `SELECT faculty_id, faculty_name FROM faculty`;

        let faculties = [];

        db.query(getFacultiesQuery, (err, rows, fields) => {
            if(err) {
                res.status(300).send(err);
                return;
            }

            faculties = rows;
        })

        db.query(getCourseDetailsQuery, (err, rows, fields) => {
            if(err) {
                res.status(303).send(err);
                return;
            }

            if(rows.length === 0) {
                res.json({
                    message : "Invalid course code"
                })
                return;
            }

            let course = rows[0];
            res.render('assignFaculty.ejs', {
                title : 'Assign Faculty',
                course : course,
                faculties : faculties
            })
        })

        
    },

    assignFaculty : (req, res) => {

        let courseCode = req.params.coursecode;
        let year = req.body.year;
        let facultyId = req.body.faculty;

        let addCourseYearQuery = `INSERT IGNORE INTO co_attainment(course_code, year) VALUES (?, ?)`;
        
        db.query(addCourseYearQuery, [ courseCode, year ], (err, rows, fields) => {
            if(err) {
                res.status(303).send(err);
                return;
            }

            let addFacultyQuery = `INSERT IGNORE INTO course_faculty VALUES(?, ?, ?)`;
            let addFacultyValues = [ courseCode, year, facultyId ];

            db.query(addFacultyQuery, addFacultyValues, (err, rows, fields) => {
                if(err) {
                    res.status(303).send(err);
                    return;
                }

                res.redirect('/admin/courses/' + courseCode);
            })

        })
    }
}