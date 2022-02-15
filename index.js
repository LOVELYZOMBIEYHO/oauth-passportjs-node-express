const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const authRoute = require("./routes/auth-route");
const profileRoute = require("./routes/profile-route");
require("./config/passport");
const passport = require("passport");
// If use flash(connect-flash) to replace cookie-session, no need to use cookie-session
// const cookieSession = require("cookie-session");

// Use flash should install (express-session) and (connect-flash)
const session = require("express-session");
const flash = require("connect-flash");

// Port and Hostname
// const hostname = "0.0.0.0";

// For Heroku
const port = process.env.PORT || 8080;

// Connect to MongoDB Atlas (MongoDB cloud), the KEY is stored in .env, last is gitignore the .env file to prevent password show outsider
mongoose
  .connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connect to the MongoDB Atlas");
  })
  .catch((err) => {
    console.log("Fail to connect");
    console.log(err);
  });

//   Middleware
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// When use cookie-session, use this
// app.use(
//   cookieSession({
//     keys: [process.env.SECRET],
//   })
// );

// Flash session setting
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Connect-flash
app.use(flash());
// set middleware and pop up messeage when signup without googleID, and input error or username already exist or username too short etc.
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

//  Middleware, when redirect /auth/login or /auth/logout or etc... will use this as middeware
app.use("/auth", authRoute);
app.use("/profile", profileRoute);

// Render "views" folder's index.ejs
app.get("/", (req, res) => {
  res.render("index", { user: req.user });
});

// app.listen(port, hostname, () => {
//   console.log(`Server running at http://${hostname}:${port}/`);
// });

// For Heroku
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
