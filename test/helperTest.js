const { assert } = require('chai');

const {
  getUserByEmail,
  ranNum,
  urlsForUser,
} = require("../helpers");


const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

const testUrlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers)
    const expectedUserID = "userRandomID";
    assert.strictEqual(user, expectedUserID);
  });


  it('should return null with a non-existent email', function () {
    const actual = getUserByEmail("invalid@example.com", testUsers);
    const expectedOutput = null;
    assert.strictEqual(actual, expectedOutput);
  });
});

describe('generateRandomString', function () {
  it('should return a string', function () {
    const actual = typeof ranNum();
    const expected = "string";
    assert.strictEqual(actual, expected);
  });

  it('should return false between two random strings', function () {
    const actual = ranNum() === ranNum();
    const expected = false;
    assert.strictEqual(actual, expected);
  });
});

describe('urlsForUser', function () {
  it('should return an empty object if user has no shortURL', function () {
    const actual = urlsForUser("user", testUrlDatabase);
    const expected = {};
    assert.deepEqual(actual, expected);
  });
});