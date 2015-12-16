/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.
https://nodejs.org/api/http.html#http_agent_requests
**************************************************************/
var dataStorage = {results: []};
// ultimately to accept new room creation we would add to the accepted URL array
//when we got '/classes/*' "*" would be added as a fine URL
//and later returned as room name?
var acceptedURLs = ['/classes/room','/classes/room1','/classes/messages'];

var requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log("Serving request type " + request.method + " for url " + request.url);
  // https://nodejs.org/api/http.html#http_response_getheader_name
  // The outgoing status.
  // we'll need to make this a function that returns appropriate http status for the request.method and result ...?
  var statusCode = 200;

  // See the note below about CORS headers.
  var headers = defaultCorsHeaders;

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  headers['Content-Type'] = "application/json";

  //var returnHeaders = JSON.stringify(headers);

//  var returnedObject = {results: []};
  var returnedObject = dataStorage;

  var json = JSON.stringify(returnedObject);

  var URL = request.url;
  //calling reg expression, it could get room name later
  var checkThis = /\/classes\/(.*)/.exec(URL);
  //console.log(checkThis, 'the regex array');
  //console.log(checkThis === null, 'the regex array has stuff?');

  // this will handle 404 code
  if (checkThis === null) {
      // change code to 404
      statusCode = 404;

      response.writeHead(statusCode, 'Not Found', headers);
      // return (end)
      response.end(json);
  }
 // http://stackoverflow.com/questions/23340968/debugging-node-js-with-node-inspector
 // http://stackoverflow.com/questions/17251553/nodejs-request-object-documentation
 //https://nodejs.org/api/http.html#http_class_http_clientrequest
 // node-inspector --no-preload request-handler.js
 //   node-debug basic-server.js
 //   http://127.0.0.1:8080/


  // checks for the correct url and method
     // if POST

  // we would take the data iaf we could find it
  // and add it to an object
  // and send back the object/data to the client

  if (request.method === 'POST') {
    statusCode = 201;
      //var data = response.getHeader('Date');
    // what magic word to listen for?  end gets us into this fn
    //but connect or response doesn't
    var collectedMessage = '';
    request.on('data', function(chunk){
      collectedMessage += chunk;
        //var dataWeWant = chunk.toString();
        //console.log(dataStorage, 'dataStorage object');
        //console.log(chunk.toString(), 'chunk?');
        //{ username: 'Jono', message: 'Do my bidding!' }
    });

    request.on('end', function () {
      console.log(collectedMessage, 'in end condition');
      // add stuff to message
      var addedDateMessage = JSON.parse(collectedMessage);
      addedDateMessage.createdAt = new Date();
      // add to results array
      dataStorage.results.push(addedDateMessage);
      // change code to 201
      response.writeHead(statusCode, '201 sent', headers);
      // return (end)
      response.end(json);
    });
      console.log(response);
  }


  if (request.method === 'OPTIONS') {

    response.writeHead(statusCode, 'this is options', headers);
    response.end(json);
  }


// http://stackoverflow.com/questions/5892569/responding-with-a-json-object-in-nodejs-converting-object-array-to-json-string
// function random(response) {
//   console.log("Request handler random was called.");
//   response.writeHead(200, {"Content-Type": "application/json"});
//   var otherArray = ["item1", "item2"];
//   var otherObject = { item1: "item1val", item2: "item2val" };
//   var json = JSON.stringify({
//     anObject: otherObject,
//     anArray: otherArray,
//     another: "item"
//   });
//   response.end(json);
// }


    // results:  a key in the returned object that holds an array of message objects

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  response.writeHead(statusCode, "OK", headers);

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
  // https://nodejs.org/api/http.html#http_response_end_data_encoding_callback
  response.end(json);
};

// createdAt: "2015-09-01T01:00:42.028Z"
// objectId: "hwhupXO0iX"
// updatedAt: "2015-09-01T01:00:42.028Z"
//
// // roomname: "4chan"
// // text: "trololo"
// // username: "shawndrost"

//http://jsbin.com/tepapajoro/edit?js,console

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  //"Access-Control-Allow-Origin": "*",
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

module.exports = {
    requestHandler: requestHandler
};


