// this storages all of the messages from the client
var dataStorage = {results: []};

// headers filled in on every response.writehead()
var headers = {
    "access-control-allow-origin" : "*",
    "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
    "access-control-allow-headers": "content-type, accept",
    "access-control-max-age"      : 10, // Seconds.
    "Content-Type"                : "application/json"
};

// does the magic
var requestHandler = function(request, response) {
  // this console.log is for seeing the method type (GET, POST, etc) and the url
  // console.log("Serving request type " + request.method + " for url " + request.url);

  // the status code is by default 200
  var statusCode = 200;
  // final data object that is returned to the client and is a string
  var json = JSON.stringify(dataStorage);

  var URL = request.url;
  //calling reg expression
  var checkThis = /\/classes\/(.*)/.exec(URL);
  //console.log(checkThis, 'the regex array');

  // this will handle 404 code
  // if checkThis is null then the url didn't start with /classes/
  if (checkThis === null) {
      statusCode = 404;

      response.writeHead(statusCode, 'Not Found', headers);
      // return (end)
      response.end(json);
  }

  // if method is POST
  // this handles the case where the client has something for us to store
  if (request.method === 'POST') {
    statusCode = 201;
    // created variable to handle the request data
    var collectedMessage = '';

    // listening as long as there is still data coming from the client
    request.on('data', function(chunk){
      // chunk will be stored in collectedMessages for the moment
      collectedMessage += chunk;
      //console.log(chunk.toString(), 'chunk?');
      //{ username: 'Jono', message: 'Do my bidding!' }
    });

    // the client sends the end sign when all the data has been sent
    // it is then manipulated in the callback
    request.on('end', function () {
      // this callback will add a date to the incoming message object
      var addedDateMessage = JSON.parse(collectedMessage);
      // add date to message
      addedDateMessage.createdAt = new Date();
      // add to results array
      dataStorage.results.push(addedDateMessage);
      // change code to 201
      response.writeHead(statusCode, '201 sent', headers);
      // return (end)
      response.end(json);
    });
  }

  // technically we don't need this because the default statusCode is 200
  if (request.method === 'OPTIONS') {
    response.writeHead(statusCode, 'this is options', headers);
    response.end(json);
  }

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  response.writeHead(statusCode, "OK", headers);

  response.end(json);
};

// this exports the requestHandler function so other files can use it
module.exports = {
    requestHandler: requestHandler
};
