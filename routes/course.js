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

        // console.log(sem);
        // console.log(courseCode, courseName, numberOfCos, deptId, sem);
        // res.json({
        //     courseCode,
        //     courseName,
        //     numberOfCos,
        //     deptId,
        //     sem,
        // })

        let addCourseQuery = `INSERT INTO course(course_code, course_name, co_no, dept_id, semester) VALUES (?, ?, ?, ?, ?)`;
        let values = [courseCode, courseName, numberOfCos, deptId, sem];

        db.query(addCourseQuery, values, (err, rows, fields) => {
            if(err) {
                res.status(300).send(err);
                return;
            }
            // console.log(req.body.adminId);

            // res.redirect('/login');
            res.send(`
                <div>
                    <h1>Course added succesfully</h1>
                    <p>Go back to <a href="/faculty/${req.body.adminId}">profile page</a></p>
                </div>
            `)
        })
    }
}