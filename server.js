require('dotenv').load();

var express = require('express') //tells application it will be using express
var bodyParser = require('body-parser')
var app = express()
var http = require('http').Server(app)


var io = require('socket.io')(http)
var mongoose = require('mongoose')

var dburl = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@ds259119.mlab.com:59119/chat-database`

app.use(express.static(__dirname)) //serves the static html file
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false})) //catch the values from the front end which come in urlencoded

var Message = mongoose.model('Message',{
  name: String,
  message: String

})


app.get('/messages',(req,res) => {
  Message.find({}, (err,messages) => {
  res.send(messages)
  })
})

app.post('/messages',(req,res) => {
  var message = new Message(req.body)

  message.save((err) => {
    if (err)
      sendStatus(500)

    //console.log(req.body)
    io.emit('message',req.body)
    res.sendStatus(200)
  })
})

io.on('connection', (socket) =>{
  console.log("A user connected");
})

mongoose.connect(dburl, (err) => {
  console.log("mongo db connection",err) //make the database connection
})

var server = http.listen(3000, () =>{
  console.log("server is listening on port", server.address().port);
}) //gets express server started and listening for requests
