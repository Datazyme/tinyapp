//node modules
const express = require("express");
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));

//uses cookieParser
const cookieParser = require('cookie-parser')
app.use(cookieParser())


//***helper functions

//generates random 5 characters of letters and numbers
let ranNum = function generateRandomString() {
  return Math.random().toString(36).slice(2,8);
};


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  'userRandomID': {
    id: "userRandomID",
    email: 'user@example.com',
    password: 'purple-monkey-dinosaur'
  },
  'user2RandomID': {
    id: 'user2RandomID',
    email: 'user2@example.com',
    password: 'dishwasher-funk'
  }
};

//returns users object based on submitted email
const getUserByEmail = function (email) {
  for (let user in users) {
    if (users[user].email === email) {
      return users[user];
    }
  }
}

//renders the urls_registration page
app.get('/registration', (req, res) => {
  if (req.cookies["user_id"]) {
    res.redirect('/urls');
  } else {
    const templateVars = {user: req.cookies["user"]};
    res.render("urls_registration", templateVars);
  }
});

//adds new user to object, generates random userID and sets cookie to userID
app.post('/registration', (req, res) => {
  const userID = ranNum();
  //checks if email and password are empty
  if(req.body.email === "" || req.body.password === "") {
    res.status(400).send("email or password is empty");
    
  } else if (getUserByEmail(req.body.email)) { //checks if registration exists
    res.status(400).send("user already exists");
    res.redirect('/urls');
  } else {
    users[userID] = {
      userID,
      email: req.body.email,
      password: req.body.password
    }
    const user = users[userID].userID;
    res.cookie('user_id', user);
    res.redirect('/urls');
  }
})

//renders login page
app.get('/login', (req, res) => {
  const userID = req.cookies["user_id"];
  const user = users[userID];
  if (req.cookies["user_id"]) {
    res.redirect('/urls')
  } else {
    const templateVars = {user: user};
    res.render("urls_login", templateVars);
  }
})

//can enter username and deposits cookie to track username
app.post('/login', (req, res) => {
  const user = getUserByEmail(req.body.email);
  const userID = user.userID;
  console.log(userID);
  //in case of login check if email and password not empty, then check if user object is NOT undefined if !user show error, 
  // then check if password matches password stored.
  if(req.body.email === "" || req.body.password === "") {
    res.status(400).send("email or password is empty")
  } else if (user.email === req.body.email && user.password === req.body.password) {
    res.cookie('user_id', userID)
    res.redirect('/urls')
  } else {
    res.status(403).send("User not found")
  }
})

//allows logout and removes cookie
app.post('/logout', (req, res) => {
  //clear the user cookie in this route
  res.clearCookie('user_id')
  res.redirect('/login')
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
  const user = users[req.cookies["user_id"]]
  const templateVars = {urls: urlDatabase, user};
  res.render("urls_index", templateVars);
})

//route definition to add new long url and convert to short, displays username via cookie in templateVars
app.get("/urls/new", (req, res) => {
  const user = users[req.cookies["user_id"]]
  const templateVars = {user}
  if (!user) {
    res.redirect('/login');
  } else {
    res.render("urls_new", templateVars);
  } 
})

//route takes in the user defined url and sends response of 6 random alphanumeric characters
app.post("/urls", (req, res) => {
  const user = users[req.cookies["user_id"]]
  let newLong = req.body;
  let id = ranNum();
  if (!user) {
    res.status(403).send("not logged in")
  } else {
    urlDatabase[id] = newLong["longURL"];
    res.redirect(`/urls/${id}`);
  }
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
  const user = users[req.cookies["user_id"]]
  let userInput = req.params.id;
  const templateVars = { id:userInput, longURL:urlDatabase[userInput], user};
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
