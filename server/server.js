const path = require('path');
const express = require('express');
const socketIO=require('socket.io');
const http=require('http')

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();
var server=http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection',(socket)=>{
  console.log('new user connected');
//用戶歡迎訊息
  socket.emit('newMessage',{
    from:'Admin',
    text:'welcome to the chat app',
    createdAt:new Date().getTime()
  });
//廣播新用戶加入
  socket.broadcast.emit('newMessage',{
    from:'Admin',
    text:'new user joined',
    createdAt:new Date().getTime()
  });
//接收客戶端創建的訊息
  socket.on('createMessage',(message,callback)=>{
    console.log(message);
    //發送訊息至所有用戶端
    io.emit('newMessage',{
      from: message.from,
      text: message.text,
      createdAt:new Date().getTime()
    });
    callback('serverMessage callback');
  });
//用戶離開
  socket.on('disconnect',()=>{
    console.log('user was disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
