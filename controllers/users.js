const User = require("../models/user");

module.exports.renderSignup = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    const newUser = new User({ username, email });
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Successfully signed up");
      res.redirect("/listings");
    });
  } catch (err) {
    console.error("Signup error:", err);
    const message =
      err.name === "UserExistsError"
        ? "A user with the given username is already registered"
        : err.code === 11000
        ? "A user with that email or username already exists"
        : err.message || "Unable to register user";
    req.flash("error", message);
    return res.redirect("/signup");
  }
};

module.exports.renderLogin = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.login = (req, res) => {
  req.flash("success", "Welcome to WanderLove");
  const redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are logged out");
    res.redirect("/listings");
  });
};
