const express = require("express");
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));

//uses cookieParser
const cookieParser = require('cookie-parser')
app.use(cookieParser())

//generates random 5 characters of letters and numbers
let ranNum = function generateRandomString() {
  return Math.random().toString(36).slice(2,8);
};

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

//renders the urls_registration page
app.get('/register', (req, res) => {
  const templateVars = {user: req.cookies["user"]}
  res.render("urls_register", templateVars);
});

app.post('/register', (req, res) => {
  const userID = ranNum();
  users[userID] = {
    userID,
    email: req.body.email,
    password: req.body.password
  }
  console.log(users[userID].userID)
  console.log(users[userID])
  cookie_id = res.cookie('users', users[userID].userID)
  res.redirect('/urls')
})

//can enter username and deposits cookie to track username
app.post('/login', (req, res) => {
  const user = req.body.username;
  res.cookie('user', user)
  res.redirect('/urls')
})

app.post('/logout', (req, res) => {
  //clear the user cookie in this route
  res.clearCookie('user')
  res.redirect('/urls')
})

//root page says hello
app.get("/", (req, res) => {
  res.redirect('/urls');
});

//adding /hello at the end shows Hello world with World in bold
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

//urls.json returns json string representing urlDatabase object
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//urls_index is rendered, displays the urlDatabase object, displays the username if entered via cookie
app.get("/urls", (req, res) => {
  const user = req.cookies["user"]
  const templateVars = {urls: urlDatabase, user};
  res.render("urls_index", templateVars);
})

//route definition to add new long url and convert to short, displays username via cookie in templateVars
app.get("/urls/new", (req, res) => {
  const templateVars = {user: req.cookies["user"]}
  res.render("urls_new", templateVars);
})

//route takes in the user defined url and sends response of 6 random alphanumeric characters
app.post("/urls", (req, res) => {
  let newLong = req.body;
  let id = ranNum();
  urlDatabase[id] = newLong["longURL"];
  res.redirect(`/urls/${id}`);
});

//reassigns id to imputed url
app.post("/urls/:myid", (req, res) => {
  //get id, treat myid as variable and add it below
  let id = req.params.myid;
  //reassign id to new inputed url
  let newURL = req.body;
  urlDatabase[id] = newURL["longURL"]
  res.redirect('/urls');
});

//Allows user to delete urls by inluding entire short and long url object
app.post("/urls/:id/delete", (req, res) => {
  let id = req.params.id;
  delete urlDatabase[id];
  res.redirect('/urls');
});

//Find longURL assign variable to req.params and then use urlDatabase to get key userInput
app.get("/urls/:id", (req, res) => {
  let userInput = req.params.id;
  const templateVars = { id:userInput, longURL:urlDatabase[userInput], user: req.cookies["user"]};
  res.render("urls_show", templateVars);
});

//can now click on short url to take you to long url.
app.get("/u/:id", (req, res) => {
  let userInput = req.params.id;
  const longURL = urlDatabase[userInput]
  res.redirect(longURL);
});

//server is able to connect to client
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});