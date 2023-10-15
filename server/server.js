const path = require("path");
const express = require("express");
const socketIO = require("socket.io");
const http = require("http");

const { generateMessage, generateLocationMessage } = require("./utils/message");
const { isRealString } = require("./utils/isRealString");
const { Users } = require("./utils/users");
const publicPath = path.join(__dirname, "/../public");

let app = express();
let server = http.createServer(app);
// const http = require("http").Server(app);
const io = socketIO(server);
let users = new Users();

app.use(express.static(publicPath));

io.on("connection", (socket) => {
  console.log("connected");

  //   socket.emit(
  //     "newMessage",
  //     generateMessage("Admin", "Welcome to the chat app :-)")
  //   );

  //   socket.broadcast.emit(
  //     "newMessage",
  //     generateMessage("Admin", "New User Joined :-)")
  //   );

  socket.on("join", (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback("Name and Room are required :-(");
    }
    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);
    io.to(params.room).emit("updateUsersList", users.getUserList(params.room));
    socket.emit(
      "newMessage",
      generateMessage("Admin", `Welcome to ${params.room} :-)`)
    );

    user = users.getUser(socket.id);
    if (user) {
      socket.broadcast
        .to(params.room)
        .emit(
          "newMessage",
          generateMessage(
            "Admin",
            `${user.name} has joined the ${user.room} chat room :-)`
          )
        );
      callback();
    }
  });

  socket.on("createMessage", (message, callback) => {
    // console.log("createMessage ", message);
    let user = users.getUser(socket.id);
    if (user && isRealString(message.text)) {
      io.to(user.room).emit(
        "newMessage",
        generateMessage(user.name, message.text)
      );
    }

    //braodcast msg to everyone
    // io.sockets.emit("newMessage", generateMessage(message.from, message.text));
    callback("This is the server");

    //broadcast msg to everyone except self
    // socket.broadcast.emit("newMessage",{
    //         from:message.from,
    //         text:message.text,
    //         createdAt:new Date().getTime()
    //     })
  });

  socket.on("createLocationMessage", (coords) => {
    let user = users.getUser(socket.id);
    if (user) {
      io.to(user.room).emit(
        "newLocationMessage",
        generateLocationMessage(user.name, coords.lat, coords.lng)
      );
    }
  });

  socket.on("disconnect", () => {
    let user = users.removeUser(socket.id);
    if (user) {
      io.to(user.room).emit("updateUsersList", users.getUserList(user.room));
      io.to(user.room).emit(
        "newMessage",
        generateMessage(
          "Admin",
          `${user.name} has left the ${user.room} chat room :-(`
        )
      );
    }
  });
});
const PORT = process.env.PORT || 1234;
server.listen(1234, () => {
  console.log("server is running");
});
