const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const http = require('http');
const socketIo = require('socket.io');
const container = require("./container");

container.resolve(function(users, _){

    const app = showExpress();

    mongoose.Promise = global.Promise;
    mongoose.connect("mongodb+srv://golden_jaguar:zoniakk1@cluster0.p5qup.mongodb.net/Cluster0?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true})

    function showExpress(){
        const app = express();
        const server = http.createServer(app);
        const io = socketIo(server);

        configureExpress(app);

        server.listen(process.env.PORT || 8080, function(){
            console.log("Connected To HideOut");
        });

        const router = require('express-promise-router')();
        users.SetRouting(router);

        app.use(router);

        app.use(function(req, res){
            res.send("404 page not found");
        })

    }

    function configureExpress(app){

        app.use(express.static('public'));
        app.use(cookieParser());
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true}));
        app.set('view engine', 'ejs');
        app.locals._ = _;
    }
})