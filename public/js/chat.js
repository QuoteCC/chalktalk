var socket = io();

socket.on('connect', function () {

  var room_id = localStorage.getItem('room_id');
  var room_name = localStorage.getItem('room_name');
  var user_name = localStorage.getItem('user_name');
  var user_id = localStorage.getItem('user_id');
  var user_token = localStorage.getItem('user_token');


  if( !room_id || !room_name || !user_name || !user_id || !user_token) {
    alert('You MUST sign in to start chatting');
    return window.location.href = '/';
  }

  //Set room name
  $('#room-name').html(room_name);

  var params = {
    room_id,
    user_token
  }

  socket.emit('join', params, function(err) {
    if(err){
      console.log('Error: '+ err);
      alert(err);
      window.location.href = '/';
    }

  });
});

socket.on('disconnect',function () {
  console.log('Disconnected from the server');
    socket.emit('leaveRoom', {
      user_name: localStorage.getItem('user_name'),
      user_id: localStorage.getItem('user_id'),
      room_id: localStorage.getItem('room_id')
    });
});

socket.on('updateUserList', function (users) {
  var ol = $('<ol></ol>');

  users.forEach( function (user) {
    ol.append($('<li></li>').text(user.name));
  });

  $('#users').html(ol);
});

socket.on('updateMessageList', function (messages) {

  var request = messages.forEach( function (message, index) {
    var formattedTime = moment(message.createdAt).format('MMM Do, h:mm a');

    var li = $('<li></li>');
    li.text(`${message.from}: ${formattedTime} ${message.text}`);

    $('#messages').append(li);

  });
});

socket.on('newMessage', function (message) {
  var formattedTime = moment(message.createdAt).format('MMM Do, h:mm a');

  var li = $('<li></li>');
  li.text(`${message.from}: ${formattedTime} ${message.text}`);

  $('#messages').append(li);


});


var message_form = $('#message-form');
var _window = $(window);

message_form.on('submit', function(e) {
  e.preventDefault();
  var text = $('[name=message]').val();
  socket.emit('createMessage', {
    room_id: localStorage.getItem('room_id'),
    user_name: localStorage.getItem('user_name'),
    text: text
  }, function () {
    $('[name=message]').val('');
  });
});

















// console.log('Just for scrolling');
