var socket= io();

socket.on('connect',()=>{
  console.log('connect to server');


  socket.emit('createMessage',{
    from:'max',
    text:'connected',
    createdAt:'2018'
  });

});

socket.on('newMessage',(message)=>{
  console.log(message);
});

socket.on('disconnect',()=>{
  console.log('disconnect');
});

socket.on('new email',(mail)=>{
  console.log('new email',mail);
});
