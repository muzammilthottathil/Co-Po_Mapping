const db = require('../mysqlConnention');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();

module.exports = {
    getLoginPage : (req, res) => {
        res.render('login.ejs', {
            title : 'Login'
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
                res.status(200).json({
                    message : "Email not found !!!"
                });
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

                        // res.json({
                        //     facultyId : user.faculty_id, 
                        //     deptId : user.dept_id, 
                        //     email : user.faculty_email
                        // })
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
        let getUserQuery = `SELECT * FROM faculty WHERE faculty_id = ?`;

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

            let user = rows[0];
            let deptId = user.dept_id;
            
            
            let getDepartmentQuery = 'SELECT dept_name FROM department WHERE dept_id = ?';
            db.query(getDepartmentQuery, [deptId], (err, rows, fields) => {
                if(err) {
                    res.status(300).send(err);
                    return;
                }
                if(rows.length === 0) {
                    res.send('No such department exists');
                    return;
                }
                
                let department = rows[0].dept_name;
                // console.log(department);

                res.render('facultyProfile.ejs', {
                    title : 'Profile',
                    faculty : user,
                    department : department
                })
            })
        })
    },

    logoutFaculty : (req, res) => {
        // console.log(req.cookies.token);
        // req.cookies.token = null;
        res.cookie('token', null, {
            expires: new Date(Date.now() + 1),
            secure: false, // set to true if your using https
            httpOnly: true,
        })
        res.redirect('/login');
    }
}