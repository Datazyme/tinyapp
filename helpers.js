//returns users object based on submitted email
const getUserByEmail = function (email, users) {
  for (let user in users) {
    
    if (users[user].email === email) {
      return user;
    }
  }
  return null
}


const urlsForUser = function (urlDatabase, userID) {
  const result = {}
  for (const url in urlDatabase) {
    if (urlDatabase[url].userID === userID) {
      result[url] = urlDatabase[url]
    }
  }
  return result;
}

let ranNum = function generateRandomString() {
  return Math.random().toString(36).slice(2,8);
};

module.exports = { getUserByEmail, urlsForUser, ranNum }; 