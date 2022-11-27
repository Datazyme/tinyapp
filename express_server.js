const express = require("express");
const app = express();
const PORT = 8080;

app.set("view engine", "ejs")

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

// //returns a = 1;
// app.get("/set", (req, res) => {
//   const a = 1;
//   res.send(`a = ${a}`);
// });

// //returns error because assigned in a differnt scope
// app.get("/fetch", (req, res) => {
//   res.send(`a = ${a}`)
// })

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});