const app = require("./index");
const debug = require("debug")("node-angular");
const http = require("http");
const express = require('express');
const router = express.Router();
const mongodb = require('mongodb');
const socket = require('socket.io');
const Users = require('../src/models/user_model');
const Monedero = require('../src/models/monedero_model');

const normalizePort = val => {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

const onError = error => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
  debug("Listening on " + bind);
  console.log("Listening on " + bind);
};

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

const server = http.createServer(app);
server.on("error", onError);
server.on("listening", onListening);
server.listen(port);

const io = socket.listen(server);

io.sockets.on('connection', (socket) => {
  let user;
  console.log('Client connected ' + socket['id']);

  socket.on('Subscribing', (data) => {
    user = data;
    socket.join(user['id']);
    console.log('id: ' + user['id']);
  });
  // if (user) {
  socket.on('onCompra', (data) => {
    Monedero.findOne({ _id: data['id'] }).then(wallet => {
      try {
        wallet['Historial'][0]['compra'].push([
          data['cant'],
          new Date()
        ]);

        Monedero.findOneAndUpdate({ _id: data['id'] }, { Historial: wallet['Historial'] }).then(asd => {
          io.emit('onCompra',{cant:data['cant'],date:new Date()});
        });
      }
      catch (error) {
        console.log('Strange error');
        console.log(error);
      }
    }).catch(error => {
      console.log(error);
      console.log('Error from server');
    });
  });

  socket.on('onVenta', (data) => {
    Monedero.findOne({ _id: data['id'] }).then(wallet => {
      try {
        wallet['Historial'][0]['venta'].push([
          data['cant'],
          new Date()
        ]);

        Monedero.findOneAndUpdate({ _id: data['id'] }, { Historial: wallet['Historial'] }).then(asd => {
          io.emit('onVenta',{cant:data['cant'],date:new Date()});
        });
      }
      catch (error) {
        console.log('Strange error');
        console.log(error);
      }
    }).catch(error => {
      console.log(error);
      console.log('Error from server');
    });
  });
  // }
  socket.on("disconnect", () => {
    if (user) {
      Users.findOneAndUpdate({ _id: user['id'] }, { lastSession: new Date() }).then(updateUser => {
        if (!updateUser) {
          console.log('Error al actualizar compruebe su sesión');
        }
      })
        .catch(error => {
          console.log('Credenciales invalidas')
        });
      console.log('Client disconnected ' + user['name']);
    } else {
      console.log("Client disconnected " + socket['id']);
    }
  });
});
