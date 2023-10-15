var socket = io();

const scrollToBottom = () => {
  let messages = document.querySelector("#messages").lastElementChild;
  messages.scrollIntoView();
};

socket.on("connect", () => {
  // console.log("connected to server");

  let searchQuery = window.location.search.substring(1);
  let params = JSON.parse(
    '{"' +
      decodeURI(searchQuery)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"') +
      '"}'
  );
  console.log(params);
  socket.emit("join", params, (err) => {
    if (err) {
      alert(err);
      window.location.href = "/";
    } else {
      // window.location.href = "/chat.html";
      console.log("No Error");
    }
  });

  // socket.emit("createMessage",{
  //     from:"Rosh",
  //     text:"Whats going on?"
  // })
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});

socket.on("updateUsersList", (users) => {
  let ol = document.createElement("ol");
  users.forEach((user) => {
    let li = document.createElement("li");
    li.innerHTML = user;
    ol.appendChild(li);
  });
  let userList = document.querySelector("#users");
  userList.innerHTML = "";
  userList.append(ol);
});

socket.on("newMessage", (message) => {
  const formattedTime = moment(message.createdAt).format("LTS");
  const template = document.querySelector("#message-template").innerHTML;
  const html = Mustache.render(template, {
    from: message.from,
    text: message.text,
    createdAt: formattedTime,
  });

  const div = document.createElement("div");
  div.innerHTML = html;
  document.querySelector("#messages").append(div);
  scrollToBottom();
  // const formattedTime = moment(message.createdAt).format("LTS");
  //   console.log("newMessage ", message);
  //   let li = document.createElement("li");
  //   li.innerHTML = `${message.from} ${formattedTime} : ${message.text}`;
  //   li.style.listStyleType = "none";
  //   document.querySelector("body").appendChild(li);
});

socket.on("newLocationMessage", (message) => {
  const formattedTime = moment(message.createdAt).format("LTS");
  console.log("newLocationMessage ", message);
  const template = document.querySelector(
    "#location-message-template"
  ).innerHTML;
  const html = Mustache.render(template, {
    from: message.from,
    url: message.url,
    createdAt: formattedTime,
  });
  const div = document.createElement("div");
  div.innerHTML = html;
  document.querySelector("#messages").append(div);
  scrollToBottom();

  //   let li = document.createElement("li");
  //   li.innerHTML = `${message.from} ${formattedTime} : `;
  //   let a = document.createElement("a");
  //   a.setAttribute("target", "_blank");
  //   a.setAttribute("href", message.url);
  //   a.innerHTML = "My current location";
  //   li.style.listStyleType = "none";
  //   li.appendChild(a);
  //   document.querySelector("body").appendChild(li);
});

// socket.emit("createMessage",{
//     from:"Rosh",
//     text:"hey"
// }, function(message){
//     console.log("Got it.",message)
// })

document.querySelector("#submit-btn").addEventListener("click", (e) => {
  e.preventDefault();
  socket.emit(
    "createMessage",
    {
      from: "User",
      text: document.querySelector("input[name='message']").value,
    },
    () => {
      document.querySelector("input[name='message']").value = "";
    }
  );
});

document.querySelector("#send-location").addEventListener("click", (e) => {
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by your browser :-(");
  }
  navigator.geolocation.getCurrentPosition(
    (position) => {
      // console.log(position)
      socket.emit("createLocationMessage", {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    },
    () => {
      alert("Unable to fetch your location :-(");
    }
  );
});
