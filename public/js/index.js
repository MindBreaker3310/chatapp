var socket= io();
//連線
socket.on('connect',()=>{
  console.log('connect to server');
});
//接收伺服器訊息
socket.on('newMessage',(message)=>{
  console.log('newMessage',message);
  //放到list裡
  var li=jQuery('<li></li>');
  li.text(`${message.from}:${message.text}`);
  jQuery('#messages').append(li);
});
//伺服器關閉
socket.on('disconnect',()=>{
  console.log('disconnect');
});
//傳送訊息至伺服器
// socket.emit('createMessage',{
//   from:'client',
//   text:'say hi',
// },(serverMessage)=>{
//   console.log('callback got it',serverMessage);
// });
//
jQuery('#message-form').on('submit',(e)=>{
  e.preventDefault();

  socket.emit('createMessage',{
    from:'user1',
    text:jQuery('[name=message-input]').val()
  },(callback)=>{
    console.log('callback done');
  });
});
