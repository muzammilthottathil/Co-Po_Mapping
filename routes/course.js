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

        let getCourseDetailsQuery = `SELECT course.course_code, course.course_name, department.dept_name, course.semester, course.co_no
            FROM course, department 
            WHERE course.course_code = "${courseCode}" AND course.dept_id = department.dept_id `;

        let getFacultyQuery = `SELECT faculty_name, course_year
            FROM course_faculty, faculty
            WHERE course_faculty.c_code = "${courseCode}" AND faculty.faculty_id = course_faculty.course_faculty_id
            ORDER BY course_year DESC , faculty_name ASC`;

        let getCoPoMappingQuery = `SELECT co, po, relation
            FROM co_po_mapping
            WHERE code = "${courseCode}"
            ORDER BY po`;

        let course;
        let faculties;
        let copoRecords = new Array();
        let copoMatrix = [ [], [], [], [], [], [] ];

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

        db.query(getCoPoMappingQuery, (err, rows, fields) => {
            if(err) {
                res.status(303).send(err);
                return;
            }

            copoRecords = rows;
            copoRecords.forEach(copo => {
                copoMatrix[copo.co - 1].push(copo.relation);
            })
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
                faculties : faculties,
                copoMatrix : copoMatrix
            }); 

        })
    },

    getCoPoMatrixPage : (req, res) => {
        let courseCode = req.params.coursecode;
        let getCourseDetailsQuery = `SELECT course.course_code, course.course_name, course.co_no
            FROM course 
            WHERE course.course_code = "${courseCode}"`;

        db.query(getCourseDetailsQuery, (err, rows, fields) => {
            if(err) {
                res.status(303).send(err);
                return;
            }

            if(rows.length === 0) {
                res.json({
                    message : "Invalid Course"
                })
                return;
            }

            res.render('copoMatrix.ejs', {
                title : 'CO - PO Matrix',
                course : rows[0]
            })
        })

    },

    addCoPoMatrix : (req, res) => {

        let courseCode = req.params.coursecode;
        let values = [
            req.body.co1,
            req.body.co2,
            req.body.co3,
            req.body.co4,
            req.body.co5,
        ];

        let getCourseCoNo = `SELECT co_no
            FROM course
            WHERE course_code = "${courseCode}"`;

        db.query(getCourseCoNo, (err, rows, fields) => {
            if(err) {
                res.status(303).send(err);
                return;
            }

            let coNo = rows[0].co_no;
            if(coNo === 6) {
                values.push(req.body.co6);
            }

            // console.log(coNo);
            let records = [];

            for(let i = 0; i < coNo; i++) {
                for(let j = 0; j < 12; j++) {
                    if(values[i] !== null) {
                        let row = [ courseCode, i+1, j+1, values[i][j] ];
                        records.push(row);
                    }
                }
            }

            // console.log(records);

            let insertMappingQuery = `INSERT IGNORE INTO co_po_mapping VALUES ?`;

            db.query(insertMappingQuery, [records], (err, rows, fields) => {
                if(err) {
                    console.log("Error occured here");
                    res.status(303).send(err);
                    return;
                }

                console.log('Co-Po mapping added successfully');
                res.redirect('/admin/courses/' + courseCode);

            })
        })
    },

    getCoursePage : (req, res) => {

        let courseCode = req.params.coursecode;
        let courseYear = req.params.year;

        let getAssignmentsQuery = `SELECT *
            FROM  assignment
            WHERE assign_course_code = "${courseCode}" AND assign_course_year = ${courseYear}`

        let assignments = [];
        let intsernalExams = [];
        let endSemExam = [];

        db.query(getAssignmentsQuery, (err, rows, fields) => {
            if(err) {
                res.status(303).send(err);
                return;
            }

            assignments = rows;

            let noOfAssignments = rows.length;
            res.render('coursePage.ejs', {
                title : courseCode,
                year : courseYear,
                noOfAssignments : noOfAssignments,
                assignments : assignments
            })
        })

        
    },

    getAddAssignmentPage : (req, res) => {

        let courseCode = req.params.coursecode;
        let courseYear = req.params.year;
        let assignmentNo = req.params.assignmentno;

        let getCourseDetailsQuery = `SELECT * FROM course WHERE course_code = "${courseCode}"`;

        db.query(getCourseDetailsQuery, (err, rows, fields) => {
            if(err) {
                res.status(303).send(err);
                return;
            }

            if(rows.length === 0) {
                res.json({
                    message : 'Invalid course code'
                })
                return;
            }

            course = rows[0];

            res.render('addAssignmentPage.ejs', {
                title : 'Add Assignment',
                courseYear : courseYear,
                course : course,
                assignmentNo : assignmentNo
            });
        }); 
    },

    addAssignment : (req, res) => {

        let courseCode = req.params.coursecode;
        let courseYear = req.params.year;
        let assignmentNo = req.params.assignmentno;
        let facultyId = req.params.id;

        let coTotals = req.body.cototals;

        let addNewAssignmentQuery = `INSERT INTO assignment (assign_course_code, assign_course_year, assign_no, co1_total, co2_total, co3_total, co4_total, co5_total, co6_total)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        let values = [ courseCode, courseYear, assignmentNo, coTotals[0], coTotals[1], coTotals[2], coTotals[3], coTotals[4], coTotals[5] ]
        db.query(addNewAssignmentQuery, values, (err, rows, fields) => {
            if(err) {
                res.status(303).send(err);
                return;
            }

            res.redirect(`/faculty/${facultyId}/courses/${courseCode}/${courseYear}`);
        })
    }
}