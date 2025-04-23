const express = require("express");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const promisify = require("util").promisify;
const app = express();
app.use(cookieParser());

const promisifiedJWTSign = promisify(jwt.sign);
const promisifiedJWTVerify = promisify(jwt.verify);
const payload = "1234";
const secretKey = "i am secret"; // secretKey should not be in server code it should be in .env file
// send the token
app.get("/sign", async function (request, response) {
  try {
    const authToken = await promisifiedJWTSign({ data: payload }, secretKey, {
      expiresIn: "1hr",
      algorithm: "HS256",
    });
    response.cookie("jwt", authToken, { maxAge: 1000000, httpOnly: true });
    response.status(200).json({
      message: "Signed the jwt and sending it in cookie",
      authToken,
    });
  } catch (err) {
    response.status(400).json({
      message: err.message,
      status: "Failure",
    });
  }
});

//verifying the token
app.get("/verify", async function (request, response) {
  try {
    const token = request.cookies.jwt;
    const decodedToken = await promisifiedJWTVerify(token, secretKey);

    response.status(200).json({
      message: "Token is decoded",
      decodedToken,
    });
  } catch (err) {
    response.status(400).json({
      message: err.message,
      status: "Failure",
    });
  }
});

app.listen(3000, function () {
  console.log("Server listening at port 3000");
});
