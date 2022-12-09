//node modules
const express = require("express");
const app = express();
const PORT = 8080;
const bcrypt = require("bcryptjs");
const cookieSession = require('cookie-session');

app.use(cookieSession({
  name: 'session',
  keys: ["key1", "key2"],

    // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));

//uses cookieParser
// const cookieParser = require('cookie-parser')
// app.use(cookieParser())


//***helper functions

//generates random 5 characters of letters and numbers
let ranNum = function generateRandomString() {
  return Math.random().toString(36).slice(2,8);
};


const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
};

const users = {
  'userRandomID': {
    id: "userRandomID",
    email: 'user@example.com',
    password: bcrypt.hashSync("password", 10)
  },
  'user2RandomID': {
    id: 'user2RandomID',
    email: 'user2@example.com',
    password: bcrypt.hashSync("password1", 10)
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

const urlsForUser = function (urlDatabase, userID) {
  const result = {}
  for (const url in urlDatabase) {
    if (urlDatabase[url].userID === userID) {
      result[url] = urlDatabase[url]
    }//le.log(urlDatabase[url].userID)
  }
  return result;
}

const hashedPassword = bcrypt.hashSync("password", 10);



//userURL(urlDatabase)
//renders the urls_registration page
app.get('/registration', (req, res) => {
  const templateVars = {user: req.session.user_id};
  res.render("urls_registration", templateVars);  
});

//adds new user to object, generates random userID and sets cookie to userID
app.post('/registration', (req, res) => {
  const userID = ranNum();
  //checks if email and password are empty
  if(req.body.email === "" || req.body.password === "") {
    return res.status(400).send("email or password is empty");
    
  } else if (getUserByEmail(req.body.email)) { //checks if registration exists
    return res.status(400).send("user already exists");
    //res.redirect('/urls');
  } else {
    users[userID] = {
      userID,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10)
    }
    req.session.user_id = userID;
    //console.log(user)
    //console.log(users[userID].password)
    return res.redirect('/urls');
  }
})

//renders login page
app.get('/login', (req, res) => {
  const user = users[req.session.user_id]
  if (req.session.user_id) {
    res.redirect('/urls')
  } else {
    const templateVars = {user: user};
    res.render("urls_login", templateVars);
  }
})

//can enter username and deposits cookie to track username
app.post('/login', (req, res) => {
  if(req.body.email === "" || req.body.password === "") {
    return res.status(400).send("email or password is empty")
  }
  const enteredPassword = req.body.password
  const enteredEmail = req.body.email
  const user = getUserByEmail(enteredEmail);
  console.log('user', user)
  const userID = user.userID;
  console.log(userID);
  const passwordCheck = bcrypt.compareSync(enteredPassword, user.password);
  console.log(passwordCheck)
  //in case of login check if email and password not empty, then check if user object is NOT undefined if !user show error, 
  // then check if password matches password stored.
  if (user.email === enteredEmail && passwordCheck) {
    req.session.user_id = userID
    res.redirect('/urls')
  } else {
    return res.status(403).send("User not found in post/login")
  }
})

//allows logout and removes cookie
app.post('/logout', (req, res) => {
  //clear the user cookie in this route
  req.session = null
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
  console.log(req.session.user_id)
  if (!req.session.user_id) {
    return res.status(403).send("no userID in get/urls")
  }
  const user = users[req.session.user_id]
  console.log(user + "here")
  if (!user) {
    return res.status(403).send("no user in get/urls")
  }

  const urls = urlsForUser(urlDatabase, user.id)
  console.log("++++++", urls)
  const templateVars = {urls, user};
  return res.render("urls_index", templateVars);

  // for (let url in urlDatabase) {
  //   if (urlDatabase[url].userID == req.cookies["user_id"]) {
  //     const templateVars = {urls: urlDatabase[url], user};
  //     return res.render("urls_index", templateVars);
  //   } else {
  //     templateVars = {user, urls: ""}
  //     return res.render("urls_index", templateVars);
  //   }
  // }
})

//route definition to add new long url and convert to short, displays username via cookie in templateVars
app.get("/urls/new", (req, res) => {
  const user = users[req.session.user_id];
  const templateVars = {user}
  if (!user) {
    res.redirect('/login');
  } else {
    res.render("urls_new", templateVars);
  } 
})

//route takes in the user defined url and sends response of 6 random alphanumeric characters
app.post("/urls", (req, res) => { 
  if (!req.session.user_id) {
    return res.status(403).send("no such userID in post/urls")
  }
  const user = users[req.session.user_id]
  if (!user) {
    return res.status(403).send("User is not logged in post/urls")
  }
  let newLong = req.body.longURL;
  let id = ranNum();

  urlDatabase[id] = { longURL: newLong, user };
  console.log(urlDatabase)
  return res.redirect(`/urls`);
});

//reassigns id to imputed url
app.post("/urls/:myid", (req, res) => {
  //get id, treat myid as variable and add it below
  let id = req.params.myid;
  //reassign id to new inputed url
  let newURL = req.body;
  if (!req.session.user_id) {
    return res.status(403).send("ID does not exist in myid")
  }
  const user = users[req.session.user_id]
  if (!user) {
    return res.status(403).send("User not logged in myid")
  }
  console.log(urlDatabase[id])
  urlDatabase[id].longURL = newURL["longURL"]
  res.redirect('/urls');
});

//Allows user to delete urls by inluding entire short and long url object
app.post("/urls/:id/delete", (req, res) => {
  let id = req.params.id;
  if (!req.session.user_id) {
    return res.status(403).send("ID does not exist in id/delete")
  }
  const user = users[req.session.user_id]
  if (!user) {
    return res.status(403).send("User not logged in id/delete")
  }
  delete urlDatabase[id];
  res.redirect('/urls');
});

//Find longURL assign variable to req.params and then use urlDatabase to get key userInput
app.get("/urls/:id", (req, res) => {
  if (!req.session.user_id) {
    return res.status(403).send("ID does not exist in urls/:id")
  }
  const user = users[req.session.user_id]
  if (!user) {
    return res.status(403).send("User not logged in urls/:id")
  }
  let userInput = req.params.id;
  const templateVars = { id:userInput, longURL:urlDatabase[userInput], user};
  res.render("urls_show", templateVars);
});

//can now click on short url to take you to long url.
app.get("/u/:id", (req, res) => {
  let userInput = req.params.id;
  const longURL = urlDatabase[userInput]
  if (!longURL) {
    res.status(403).send("no long url in u/:id")
  } else {
    res.redirect(longURL); 
  }  
});

//server is able to connect to client
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
