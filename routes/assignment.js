const db = require('../mysqlConnention');

module.exports = {

    getAssignmentDetails : (req, res) => {
        res.json({
            message : "Assignment details will shown here"
        })
    }
}