const db = require('../mysqlConnention');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();

module.exports = {
    getLoginPage : (req, res) => {
        res.render('login.ejs', {
            title : 'Login',
            //Change begins here
            message : null
            //Change ends here
        })
    },

    loginFaculty : (req, res) => {
        let email = req.body.email;
        let password = req.body.password;

        let getFacultyQuery = `SELECT * FROM faculty WHERE faculty_email = ? `;
        db.query(getFacultyQuery, [email], (err, rows, fields) => {
            if(err) {
                res.status(500).send(err);
                return;
            }

            if(rows.length === 0) {
                res.render('login.ejs',{
                    title : 'Login',
                    //Change begins here 
                    message : 'Incorrect Email ID or Password !!!'
                    //Change ends here
                })
                return;
            } 
            
            let user = rows[0];
            bcrypt.compare(password, user.faculty_password, (err, match) => {
                if(err) {
                    res.status(200).send(err);
                    return;
                }
                
                if(match) {
                    jwt.sign({ facultyId : user.faculty_id, deptId : user.dept_id, admin : user.admin }, process.env.JWT_SECRET_KEY, { expiresIn : "3600s" }, (err, token) => {
                        if(err) {
                            res.status(300).send(err);
                            return;
                        }

                        res.cookie('token', token, {
                            expiresIn: "3600s",
                            secure: false, // set to true if your using https
                            httpOnly: true,
                        })
                        
                        console.log('login succesful');
                        res.redirect('/faculty/' + user.faculty_id);
                    })
                } else {
                    res.redirect('/login');
                }
            })
        })
    },

    getFacultyProfile : (req, res) => {

        let userId = req.params.id;
        let getUserQuery = `SELECT faculty_name, faculty_email, dept_name, faculty_id
            FROM faculty, department
            WHERE faculty_id = ? AND faculty.dept_id = department.dept_id`;

        let getAssignedCoursesQuery = `SELECT course_code, course_year, course_name, co_no, dept_id, semester
            FROM course_faculty, course
            WHERE course_faculty.course_faculty_id = ? AND course.course_code = course_faculty.c_code
            ORDER BY course_faculty.course_year DESC, course.course_code`
        
        let user;
        let courses;
        db.query(getUserQuery, [userId], (err, rows, fields) => {
            if(err) {
                res.status(300).send(err);
                return;
            }
            if(rows.length === 0) {
                res.json({
                    message : 'No such user fount'
                });
                return;
            }

            user = rows[0];

            
        });

        db.query(getAssignedCoursesQuery, [userId], (err, rows, fields) => {
            if(err) {
                res.status(303).send(err);
                return;
            }

            courses = rows;

            if(user.admin) {
                res.render('adminProfile.ejs', {
                    title : 'Profile',
                    faculty : user,
                    department : user.dept_name,
                    courses : courses
                });
            } else {
                res.render('facultyProfile.ejs', {
                    title : 'Profile',
                    faculty : user,
                    department : user.dept_name,
                    courses : courses
                });
            }



        })


    },

    logoutFaculty : (req, res) => {

        res.cookie('token', null, {
            expires: new Date(Date.now() + 1),
            secure: false, // set to true if your using https
            httpOnly: true,
        })
        res.redirect('/login');
    }
}