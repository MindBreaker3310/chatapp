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

//傳送訊息
jQuery('#message-form').on('submit',(e)=>{
  e.preventDefault();//避免使用預設 改寫submit方法
  socket.emit('createMessage',{
    from:'user',
    text:jQuery('[name=message-input]').val()
  },(callback)=>{
    console.log('callback done');
  });
});

//取得location
const locationButton = jQuery('#btn-location');
locationButton.on('click', () => {
  if (!navigator.geolocation) {
    return alert('Geo location not supported by your browser');
  }
  navigator.geolocation.getCurrentPosition((position) => {
    console.log(position);
    socket.emit('createLocationMessage',{
      from:'user',
      text:{lat:position.coords.latitude,lon:position.coords.longitude}
    });
    }, (err) => {
      alert('Unable to fetch location');
    });
});

//接收location
socket.on('newLocationMessage',(message)=>{
  console.log('newLocationMessage',message);
  //放到list裡
  var li=jQuery('<li></li>');
  var a=jQuery('<a target="_blank">my location</a>')

  li.text(`${message.from}:`);
  a.attr('href',message.url);
  li.append(a);
  jQuery('#messages').append(li);
});
