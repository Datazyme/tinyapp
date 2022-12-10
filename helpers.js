//returns users object based on submitted email
const getUserByEmail = function (email, users) {
  for (let user in users) {
    console.log(user)
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

let ranNum = function generateRandomString() {
  return Math.random().toString(36).slice(2,8);
};

module.exports = { getUserByEmail, urlsForUser, ranNum }; 