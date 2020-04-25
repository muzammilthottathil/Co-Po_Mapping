const db = require('../mysqlConnention');

module.exports = {

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