module.exports = {
    getHomePage : (req, res) => {
        res.render('index.ejs', {
            title : 'College of Engineering Trivandrum'
        });
    }
}