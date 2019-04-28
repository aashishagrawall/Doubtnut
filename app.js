// app.js

var express = require('express');
var bodyParser = require('body-parser');
var contact = require('./routes/contact'); // Imports routes for the products
var app = express();





//	Set up mongoose connection
var mongoose = require('mongoose');
var dev_db_url = 'mongodb://localhost:27017/cricket';
var mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB,{ useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(__dirname + '/public'));
contact(app);
var server=require('http').Server(app);
var io = require('socket.io')(server);


 


var port = process.env.PORT || 4000;
var socketInstance;
io.on('connection', function(socket){
  socketInstance = socket;
    socket.emit('hello', 'welcome to amazing world of cricket');
});
  

server.listen(port, () => {
    console.log('Server is up and running on port numner ' + port);
});

exports.getSocketInstance = function(){
  return socketInstance
};
