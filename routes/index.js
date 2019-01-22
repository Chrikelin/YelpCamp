var express     = require("express"),
    router      = express.Router(),
    passport    = require("passport"),
    User        = require("../models/user");

//ROOT ROUTE
router.get("/", function(req, res) {
    res.render("landing");
});



//SHOW REGISTER FORM
router.get("/register", function(req ,res) {
    res.render("register");
});

//SIGN UP LOGIC
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user) {
        if(err) {
            console.log(err);
            req.flash("error", err.message);
            return res.redirect("register");
        }
        passport.authenticate("local")(req, res, function() {
            req.flash("success", "Welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

//LOGIN FORM
router.get("/login", function(req, res) {
    res.render("login");
});

//LOGIN LOGIC
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds", 
        failureRedirect: "/login"
    }), function(req, res) {
});

//LOGOUT
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
});

module.exports = router;