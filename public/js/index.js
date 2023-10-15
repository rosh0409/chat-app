let user = {
  uName: "",
  uRoom: "",
};

const handleChange = (e) => {
  console.log(e.name, e.value);
  if (e.name === "name") {
    user.uName = e.value;
  }
  if (e.name === "room") {
    user.uRoom = e.value;
  }
};

const handleClick = () => {
  //   alert(user.uName, user.uRoom);
  if (user.uName !== "" && user.uRoom !== "") {
    // alert(user.uName);
    // alert(user.uRoom);
    // Mustache.render("./chat.html");
    window.location.href = "/chat.html";
    //   console.log(user);
  } else {
    alert("please fill your details :-(");
  }
};
