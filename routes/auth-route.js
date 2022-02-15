// http://www.passportjs.org/tutorials/google/prompt/

const router = require("express").Router();
const passport = require("passport");
const bcrypt = require("bcrypt");
const User = require("../models/user-model");

router.get("/login", (req, res) => {
  res.render("login", { user: req.user });
});

router.get("/signup", (req, res) => {
  res.render("signup", { user: req.user });
});

router.get("/logout", (req, res) => {
  // The logout function from passport.js (logOut)
  req.logOut();
  res.redirect("/");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/auth/login",
    failureFlash: "Wrong email or password.",
  }),
  (req, res) => {
    // req.session.returnTo  and  req.originalUrl can store the previous url and login redirect to previous path
    if (req.session.returnTo) {
      let newPath = req.session.returnTo;
      req.session.returnTo = "";
      res.redirect(newPath);
    } else {
      res.redirect("/profile");
    }
  }
);

router.post("/signup", async (req, res) => {
  console.log(req.body);
  let { name, email, password } = req.body;
  //   Check if the email is already in DB
  const emailExist = await User.findOne({ email });
  // Not to use connect-flash
  // if (emailExist) return res.status(400).send("Email already exist");

  // Use connect-flash
  if (emailExist) {
    req.flash("error_msg", "Email has already been registered");
    res.redirect("/auth/signup");
  }

  const hash = await bcrypt.hash(password, 10);
  password = hash;
  let newUser = new User({ name, email, password });
  try {
    // // Not to use connect-flash
    // const savedUser = await newUser.save();
    // res.status(200).send({
    //   msg: "User saved.",
    //   savedObj: savedUser,
    // });

    // Use Connect-flash
    await newUser.save();
    req.flash("success_msg", "Registration succeeds. You can login now.");
    res.redirect("/auth/login");
  } catch (err) {
    // console.log(err);
    // res.status(400).send(err);

    req.flash("error_msg", err.errors.name.properties.message);
    res.redirect("/auth/signup");
  }
});

//  Wrong setting
// router.get("/google", (req, res) => {
//   passport.authenticate("google", {
//     scope: ["profile","email"],
//   });
// });
// ----Original------------------------------
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// router.get(
//   "/google",
//   passport.authenticate("google", {
//     scope: [
//       "https://www.googleapis.com/auth/userinfo.profile",
//       "https://www.googleapis.com/auth/userinfo.email",
//     ],
//   })
// );

// // If you allow users choose their account when login, use this setting
// router.get(
//   "/google",
//   passport.authenticate("google", {
//     scope: ["profile", "email"],
//     prompt: "select_account",
//   })
// );

// router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
//   res.redirect("/profile");
// });
// ------Original-----------------
router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  // req.session.returnTo  and  req.originalUrl can store the previous url and login redirect to previous path
  if (req.session.returnTo) {
    let newPath = req.session.returnTo;
    req.session.returnTo = "";
    res.redirect(newPath);
  } else {
    res.redirect("/profile");
  }
});

// router.get(
//   "/google/redirect",
//   passport.authenticate("google", {
//     successRedirect: "/profile",
//     scope: [
//       "https://www.googleapis.com/auth/userinfo.profile",
//       "https://www.googleapis.com/auth/userinfo.email",
//     ],
//   })
// );

// the function of module.exports is to export module to be used by other files/modules/js  (can be require(""))
module.exports = router;
