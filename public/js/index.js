var socket= io();
//連線
socket.on('connect',()=>{
  console.log('connect to server');
});

//伺服器關閉
socket.on('disconnect',()=>{
  console.log('disconnect');
});


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

function scrollToBottom(){
  var messages_list=jQuery('#messages-list');
  var lastMessage=messages_list.children('li:last-child');

  var clientHeight = messages_list.prop('clientHeight');
  var scrollTop = messages_list.prop('scrollTop');
  var scrollHeight = messages_list.prop('scrollHeight');//整個list高度
  var lastMessageHeight=lastMessage.innerHeight();//最後一個的高度
  var secondLastMessageHeight=lastMessage.prev().innerHeight();//倒數第二個的高度

  if(clientHeight+scrollTop+lastMessageHeight+secondLastMessageHeight>=scrollHeight){
    messages_list.scrollTop(scrollHeight);//滑到最下面
  }

}

//接收伺服器訊息
socket.on('newMessage',(message)=>{
  var template=jQuery('#message-template').html();
  var html=Mustache.render(template,{
    from:message.from,
    text:message.text,
    createdAt:message.createdAt
  });
  jQuery('#messages-list').append(html);
  scrollToBottom()
});


//接收location
socket.on('newLocationMessage',(message)=>{
  var template=jQuery('#location-template').html();
  var html=Mustache.render(template,{
    from:message.from,
    createdAt:message.createdAt,
    url:message.url
  });

  jQuery('#messages-list').append(html);
  // console.log('newLocationMessage',message);
  // //放到list裡
  // var li=jQuery('<li></li>');
  // var a=jQuery('<a target="_blank">my location</a>')

  // li.text(`${message.createdAt} -> ${message.from}:`);
  // a.attr('href',message.url);
  // li.append(a);
  // jQuery('#messages').append(li);
  scrollToBottom()
});
