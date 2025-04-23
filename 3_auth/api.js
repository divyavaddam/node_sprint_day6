const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
app.use(cookieParser());

/*
1. Signup
2. Login 
3. /allowIfLoggedIn -> allows as to access user data if user is authenticated
*/

const signUpController = async function (request, response) {
  try {
    const userObject = request.body;
    let newUser = await UserModel.create(userObject);
    response.send(201).json({
      message: "User Created Successfully",
      user: newUser,
      status: "Success",
    });
  } catch (err) {
    response.status(500).json({
      message: err.message,
      status: "Failure",
    });
  }
};
const loginController = async function (request, response) {
  try {
    let { email, password } = request.body;
    let user = await UserModel.findOne({ email });
    if (user) {
      let areEqual = password == user.password;
      if (areEqual) {
        // user is authenticated
        // we are sending the token -> people remenber them
        // payload: id of that user
        let token = await promisifiedJWTSign({ id: user["id"], JWT_SECRET });
        console.log("sending token");
        response.cookie("JWT", token, {
          maxAge: 900000,
          httpOnly: true,
          path: "/",
        });
        response.status(200).json({
          status: "Success",
          message: "User logged In",
        });
      } else {
        response.status(404).json({
          status: "Failure",
          message: "Email or password is incorrect",
        });
      }
    }
  } catch (err) {}
};
const protectRouteMiddleware = async function (request, response) {
  try {
    let decryptedToken = await promisifiedJWTVerify(
      request.cookies.JWT,
      JWT_SECRET
    );
    if (decryptedToken) {
      let userId = decryptedToken.id;
      request.userId = userId;
      next();
    }
  } catch (err) {
    response.status(500).json({
      status: "Failure",
      message: err.message,
    });
  }
};
const getUserData = async function (request, response) {
  try {
    const id = request.userId;
    const user = await UserModel.findById(id);
    response.status(200).json({
      status: "Success",
      message: "User data retrived successfully",
    });
  } catch (err) {
    response.status(500).json({
      message: err.message,
    });
  }
};
// routes
app.post("/signUp", signUpController);
app.post("/login", loginController);
app.get("/allowIfLoggedInUser", protectRouteMiddleware, getUserData);

// 404 route not found
app.use(function (request, response) {
  response.status(404).json({
    status: "Failure",
    message: "404 page not found",
  });
});

app.listen(3000, function () {
  console.log("Server is running at port 3000");
});
