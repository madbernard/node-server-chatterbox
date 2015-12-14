// YOUR CODE HERE:

// ajax call out
// parse return

var myDataStore = {
  roomname: null,
  friendsList: []
};

function getMessages() {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    // 'where={"playerName":"Sean Plott","cheatMode":false}'
    url: 'https://api.parse.com/1/classes/chatterbox',
    method: 'GET',
    data: {'order':'-createdAt', 'limit':'1000'},
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message received. Data: ', data);
      // store fetched messages on myDataStore object in array of messages
      if (myDataStore.roomname !== null) {
        myDataStore.messages = parseByValue(data.results, 'roomname', myDataStore.roomname);
      }
      else {
        myDataStore.messages = data.results;
        getRooms();
        appendRooms(myDataStore.rooms);
      }
      addClassByValue($('.username'), myDataStore.friendsList, 'friend');
      // index is the newest message, ie, last in returned array
      myDataStore.index = 0;
      $('.holdsMessages').html('');
      appendMessages(myDataStore.index);
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to receive messages. Error: ', data);
    }
  });
}

// we will use this to get only the messages of a room, or of a friend, or etc
// returns an array of messages that have the value
function parseByValue(collection, property, value){
  return _.reduce(collection, function(parse, message){
    if (message[property] === value) {
      parse.push(message);
    }
    return parse;
  }, []);
}

// collection here is a jQuery array of things on the page
function addClassByValue(collection, value, newClass){
  _.each(collection, function(item){
    for(var i = 0; i < value.length; i++){
      if($(item).text() === value[i]){
        console.log('in add class');
        $(item).addClass(newClass);
        $(item).parent().children('.text').addClass(newClass);
      }
    }
  });
}

//extracts and escapes room values from list of messages, into an array stored at myDataStore.rooms
function getRooms() {
  myDataStore.rooms = _.reduce(myDataStore.messages, function(allRooms, message){
    var roomname = _.escape(message.roomname);
    if (!_.contains(allRooms, roomname)) {
      allRooms.push(roomname);
    }
    return allRooms;
  }, []);
}

//appends room names to drop down list from passed in array
function appendRooms(roomsArray){
  var newRoom;
  for (var i = 0; i < roomsArray.length; i++) {
    newRoom = '<option class="roomName" value="' + roomsArray[i] + '">' + roomsArray[i] + '</option>';
    $('#roomList').append(newRoom);
  }
}

function appendMessages(index) {
  var counter;
  var message;
  var remaining = myDataStore.messages.length - index;

  if (remaining < 25) {
    counter = remaining;
  }
  else {
    counter = 25;
  }

  while(counter) {
    message = buildMessage(index);
    $('.holdsMessages').append(message);
    counter--;
    index++;
  }
  myDataStore.index = index;
}

// this puts together a message in HTML to display on page
function buildMessage(index) {
  var picture, username, time, text, message;
  picture = '<div class="userpic"></div>';
  username = '<div class="username">' + _.escape(myDataStore.messages[index].username) + '</div>';
  time = '<div class="createdAt">' + myDataStore.messages[index].createdAt + '</div>';
  text = '<div class="text">' + _.escape(myDataStore.messages[index].text) + '</div>';
  message ='<div class="message">' + picture + username + time + text + '</div>';
  return message;
}

// function that fetches chunks of 25ish messages based on index of current newest message

// sends a json object to Parse server
function postMessage(newMessage) {
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    method: 'POST',
    data: newMessage,
    contentType: 'application/json',
    success: function(){
      console.log('Message was sent! Message = ' + newMessage);
      $('.messageText').val('');
      $('.holdsMessages').html('');
      getMessages();
    },
    error: function(error){
      console.log('Failed to send message! Error: ' + error);
    }
  });
}

// createdAt: "2015-09-01T01:00:42.028Z"
// objectId: "hwhupXO0iX"
// roomname: "4chan"
// text: "trololo"
// updatedAt: "2015-09-01T01:00:42.028Z"
// username: "shawndrost"

// builds a json object from form submissions
function buildMessageObject(user, time, text) {
  // take data about message: text, user, date, room
  // build object to be passed to server
  var messageObject = {
    roomname: myDataStore.roomname,
    text: text,
    username: user
  };
  // return object to be sent
  return messageObject;
}

$(document).ready(function() {
  // this gets URL of page
  var URL = window.location.search;
  //calling reg expression, it returns an array, the second is what we want
  myDataStore.username = /username=(.*)/.exec(URL)[1];
  // initial getMessages and apply them to the page
  getMessages();

  $('.getOld').on('click', function(){
    appendMessages(myDataStore.index);
  });

  $('.refresh').on('click', function(){
    // these are two ways to do the same "clear when new things appear" behavior
    // $('.message').remove();
    getMessages();
  });

  $('.messageSubmit').on('click', function(){
    var message, createdAt, room, messageObject;
    message = $('.messageText').val();
    createdAt = new Date().toISOString();
    messageObject = buildMessageObject(myDataStore.username, createdAt, message);
    messageObject = JSON.stringify(messageObject);
    postMessage(messageObject);
  });

  $('.submitRoom').on('click', function(){
    var newRoom = [$('.newRoomName').val()];
    appendRooms(newRoom);
    myDataStore.roomname = newRoom[0];
    //$("._statusDDL").val('2');
    $('.newRoomName').val('');
    $('#roomList').val(newRoom[0]);
    getMessages();
  });

  // roomName is the class given to each option in the dropdown menu
  $('select').change(function(){
    // sets the general roomname value to the choice
    var thisRoom = $('select option:selected').val();
    if (thisRoom !== 'allRooms') {
      myDataStore.roomname = thisRoom;
    }
    else {
      myDataStore.roomname = null;
    }
    getMessages();
  });

  // this relies on holdmessages since that is the nearest built-in thing on the page
  $('.holdsMessages').on('click', '.username', function(){
    var savedName = $(this).text();
    console.log('In user click', savedName);
    myDataStore.friendsList.push(savedName);
    addClassByValue($('.username'), [savedName], 'friend');
  });

});

// https://api.jquery.com/change/

// http://stackoverflow.com/questions/499405/change-the-selected-value-of-a-drop-down-list-with-jquery
// $(document).on('change', 'input', function() {
//   // Does some stuff and logs the event to the console
// });


