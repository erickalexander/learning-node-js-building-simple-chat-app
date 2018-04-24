var express = require('express') //tells application it will be using express
var bodyParser = require('body-parser')
var app = express()
var http = require('http').Server(app)

var io = require('socket.io')(http)


app.use(express.static(__dirname)) //serves the static html file
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false})) //catch the values from the front end which come in urlencoded

var messages = [
  {name: 'jerry', message:'Hi'},
  {name: 'steve', message:'Hi'}

]
app.get('/messages',(req,res) => {

  res.send(messages)
})

app.post('/messages',(req,res) => {
  messages.push(req.body)
  io.emit('message',req.body) //created an event called message
  res.sendStatus(200)
})

io.on('connection', (socket) =>{
  console.log("A user connected");
})

var server = http.listen(3000, () =>{

  console.log("server is listening on port", server.address().port);
}) //gets express server started and listening for requests
