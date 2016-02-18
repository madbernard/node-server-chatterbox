# node-server-chatterbox

This is a project I completed as a student at Hack Reactor, while pairing with . Built with Node.js and relying on async file read/write, this server replaces Parse for the previously-built [chatterbox chat client found here](https://github.com/madbernard/ajax-parse-chat-chatterbox-client).

## Structure

The repository consist of

- Server app
- Client app
- test Specs files

### Chatterbox server 

The server features at a glance:

- GET/POST/OPTIONS requests. 
- Support CORS to handle cross domain issues. 
- Serve Static Assets (css/html/js/img)
- Persistent storage using files.

Its architecture allows for easy extension of the request handler router, and adding as many endpoints as needed.

## Install

The project relies on bower and npm for managing external libraries and dependencies, so be sure to first:

`bower install`

`npm install`

to run it, simply run `node basic-server.js` and open the client/index.html file with your browser.
In particular:

- `./server/basic-server.js`
- `./client/index.html`

Make sure to have a valid config.js inside the env folder.

### SpecRunner - mocha

The specrunner contains tests for the server and integration tests.

### Testing

Tests are made with the [Mocha](https://github.com/mochajs/mocha) testing framework.
Tests are located in the ./spec directory.

```
npm test
```
