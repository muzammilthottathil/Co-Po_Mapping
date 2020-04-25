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
        // let getCourseDetailsQuery = `SELECT * FROM course, department WHERE course_code = "${courseCode}" AND course.dept_id = department.dept_id`;
        let getCourseDetailsQuery = `SELECT course.course_code, course.course_name, department.dept_name, course.semester
            FROM course, department 
            WHERE course.course_code = "${courseCode}" AND course.dept_id = department.dept_id `;
        let getFacultyQuery = `SELECT faculty_name, course_year
            FROM course_faculty, faculty
            WHERE course_faculty.c_code = "${courseCode}" AND faculty.faculty_id = course_faculty.course_faculty_id
            ORDER BY course_year DESC , faculty_name ASC`

        let course;
        let faculties;

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

            course = rows[0];
            
        })

        db.query(getFacultyQuery, (err, rows, fields) => {
            if(err) {
                res.status(303).send(err);
                return;
            }

            faculties = rows;
            res.render('courseDetails.ejs', {
                title : course.course_name,
                course : course,
                faculties : faculties
            }); 

        })
    }
}