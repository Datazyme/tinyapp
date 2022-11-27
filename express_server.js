const express = require("express");
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));

//generates random 5 characters of letters and numbers
let ranNum = function generateRandomString() {
  return Math.random().toString(36).slice(2,8);
};

const urlDatabase = {
  "b2xVn2": "http://wwww.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//root page says hello
app.get("/", (req, res) => {
  res.send("Hello");
});

//urls.json returns json string representing urlDatabase object
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//index is in views and provides format to return the urlDatabase object
app.get("/urls", (req, res) => {
  const templateVars = {urls: urlDatabase};
  res.render("urls_index", templateVars)
})

//route definition to add new long url and convert to short
app.get("/urls/new", (req, res) => {
  res.render("urls_new")
})

//route takes in the user defined url and sends response of 6 random alphanumeric characters
app.post("/urls", (req, res) => {
  console.log(req.body)
  res.send(ranNum());
});

//Found this in lecture to find longURL assign variable to re.params and then use urlDatabase to get key userInput 
app.get("/urls/:id", (req, res) => {
  let userInput = req.params.id
  const templateVars = { id:userInput, longURL:urlDatabase[userInput]};
  res.render("urls_show", templateVars)
})

//adding /hello at the end shows Hello world with World in bold
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n")
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});