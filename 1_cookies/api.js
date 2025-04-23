const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
dotenv.config({path: path.resolve(__dirname, '../.env')});// path has to be specified because we are trying to access .env file from a file which is present in anthoer folder
const app = express();
const {PORT} = process.env;
app.use(express.json());// express.json() is a middleware that is used to get parsed body from request object
app.use(cookieParser());// cookieParser() is an Express middleware that parses HTTP cookies from incoming requests, making them accessible in your application

//home
//products
//clearCookies 

// creating cookies
// when home gets the request we'll add a cookie -> share the cookie with response
app.get("/home", function(request, response) {
   response.cookie("prevPage", "home", {maxAge: 100000, httpOnly: true});// when we use document.cookie we'll get all the cookies but someone can impersonate as we if that cookies are visible to to everyone. So, inorder to reslove it we wrote tgis httpOnly : true property
   response.status(200).json({
    message: "Thank you for the visit"
})
})


// we will check whether the user is visiting our webpage for the first time or already visited
app.get("/products", function(request, response){
    console.log(request.cookies);
    let msgStr = "";
    if(request.cookies.prevPage){
        msgStr = `You have already visited the ${request.cookies.prevPage}`
    }
    response.status(200).json({
        message: `Thank you for accessing the product route ${msgStr}`
    })
})

// clear cookies 
app.get("/clearCookies", function(request, response){
    response.clearCookie("prevPage", {path: "/"});
    response.status(200).json({
        message: "I have cleared your cookie"
    })
})

app.listen(PORT, function() {
    console.log(`Server is running at port ${PORT}`);
})