const jwt = require('jsonwebtoken');

require('dotenv').config();

module.exports = {
    verifyFaculty : (req, res, next) => {
        let token = req.cookies.token;
        // console.log(token);
        if(!token) {
            res.redirect('/login');
            return;
        }

        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
            if(err) {
                res.status(200).send(err);
                return;
            }

            // console.log(decoded);
            // console.log(req.params);
            if(decoded.facultyId == req.params.id) {
                req.body.facultyId = decoded.facultyId;
                next();
                return;
            } else {
                res.status(403).json({
                    message : 'Permission denied'
                });
            }
    
        });

    },

    ifLoggedIn : (req, res, next) => {
        let token = req.cookies.token;
        // console.log(token);
        if(token == null) {
            next();
            return;
        }

        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
            if(err) {
                res.status(403).send(err);
                return;
            }

            res.redirect('/faculty/' + decoded.facultyId);
        });
    },

    verifyAdmin : (req, res, next) => {
        let token = req.cookies.token;

        if(token == null) {
            res.redirect('/login');
            return;
        }

        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
            if(err) {
                res.status(403).send(err);
                return;
            }

            // console.log(user.admin);
            if(user.admin) {
                req.body.adminId = user.facultyId;
                // console.log(req.body.adminId);
                next();
                return;
            } else {
                res.status(403).json({
                    message : 'Permission denied',
                    reason : 'Only admins have the permission for this'
                })
            }            
        });
    }
}