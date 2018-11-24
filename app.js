var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var flash = require("connect-flash");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seeds");

var commentRoute = require("./routes/comments");
var campgroundRoute = require("./routes/campgrounds");
var indexRoute = require("./routes/index");

//seedDB(); //seed the database

//mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });
mongoose.connect("mongodb://yelpcamp:yelpcamp1@ds115664.mlab.com:15664/nodeyelpcamp", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "My name is Saurabh Singh",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoute);
app.use("/campgrounds", campgroundRoute);
app.use("/campgrounds/:id/comments", commentRoute);

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Yelp camp has started!!");
});
