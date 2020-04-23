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
    }
}