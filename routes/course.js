const db = require('../mysqlConnention');

module.exports = {

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

    getAllCourses : (req, res) => {
        let getAllCoursesQuery = `SELECT * FROM course`;
        db.query(getAllCoursesQuery, (err, rows, fields) => {
            if(err) {
                res.status(303).send(err);
                return;
            }
            res.render('coursesList.ejs', {
                title : 'Courses',
                courses : rows
            })
        })
    },

    getCourseDetails : (req, res) => {
        let courseCode = req.params.coursecode;
        let getCourseDetailsQuery = `SELECT * FROM course WHERE course_code = "${courseCode}"`;
        db.query(getCourseDetailsQuery, (err, rows, fields) => {
            if(err) {
                res.status(303).send(err);
                return;
            }

            if(rows.length === 0) {
                res.json({
                    message : 'Invalid course id'
                })
                return;
            }

            let course = rows[0];

            let getDepartmentQuery = `SELECT dept_name FROM department WHERE dept_id = "${course.dept_id}"`;
            db.query(getDepartmentQuery, (err, rows, fields) => {
                if(err) {
                    res.status(303).send(err);
                    return;
                }

                if(rows.length === 0) {
                    res.json({
                        message : 'Invalid Department Id'
                    })
                    return;
                }

                res.render('courseDetails.ejs', {
                    title : course.course_name,
                    course : course,
                    deptName : rows[0].dept_name
                });
            }) 
        })
    }
}