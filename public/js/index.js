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
var input_box=jQuery('[name=message-input]');

jQuery('#message-form').on('submit',(e)=>{
  e.preventDefault();//避免使用預設 改寫submit方法
  socket.emit('createMessage',{
    from:'user',
    text:input_box.val()
  },(callback)=>{
    input_box.val('');//成功後清空輸入框
  });
});

//取得location
const locationButton = jQuery('#btn-location');
locationButton.on('click', () => {
  if (!navigator.geolocation) {
    return alert('Geo location not supported by your browser');
  }

  locationButton.attr('disabled','disabled').text('Sending...');

  navigator.geolocation.getCurrentPosition((position) => {
    locationButton.removeAttr('disabled').text('location');
    console.log(position);
    socket.emit('createLocationMessage',{
      from:'user',
      text:{lat:position.coords.latitude,lon:position.coords.longitude}
    });
    }, () => {
      locationButton.removeAttr('disabled').text('location');
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
