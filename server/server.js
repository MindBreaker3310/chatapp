const path = require('path');
const express = require('express');
const socketIO=require('socket.io');
const http=require('http');

const {msg,locationMsg}=require('./message');
const {isRealString}=require('./validation');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

const {Users_obj}=require('./users');
var users=new Users_obj();

var app = express();
var server=http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));



io.on('connection',(socket)=>{
  console.log('new user connected');
//用戶歡迎訊息
  socket.emit('newMessage',msg('Admin','welcome to the chat app'));
//廣播新用戶加入
  //socket.broadcast.emit('newMessage',msg('Admin','new user joined'));
//接收客戶端創建的訊息
  socket.on('createMessage',(message,callback)=>{
    console.log(message);
    var user=getUser(socket.id);
    //發送訊息至所有用戶端
    io.to(user.room).emit('newMessage',msg(user.name,message.text));
    callback('serverMessage callback');
  });
//接收位置訊息
  socket.on('createLocationMessage',(loc)=>{
    console.log(loc);
    var user=getUser(socket.id);
    //發送訊息至所有用戶端
    io.to(user.room).emit('newLocationMessage',locationMsg(user.name,loc.text));
  });

  socket.on('join',(params,callback)=>{
    if(!isRealString(params.name)||!isRealString(params.room)){
      callback('name and room name are required.');
    }
    socket.join(params.room);//加入房間
    users.removeUser(params.id);
    users.addUser(socket.id,params.name,params.room);
    io.to(params.room).emit('updateUsers',users.getUserList(params.room));
    socket.broadcast.to(params.room).emit('newMessage',msg('admin',`${params.name} has joined.`));
    callback();
  });

//用戶離開
  socket.on('disconnect',()=>{
    console.log('user was disconnected');
    var user=users.removeUser(socket.id);
    
    io.to(user.room).emit('updateUsers',users.getUserList(user.room));
    io.to(user.room).emit('newMessage',msg('admin',`${user.name} has leaved.`));      
    
  });
});

server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
