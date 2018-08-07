const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

const access_token = "YOUR-TOKEN-HERE";

function getByUsername(username) {
  return fetch(`https://api.github.com/users/${username}`, {}).then(res => {
    return res.json().then(user => {
      return { user, found: res.status === 200 }
    })
  })
}

function getProperty(url) {
  return fetch(url).then(res => res.json());
}

/* GET users listing. */
  // 1. get user from github api
  // 2. fetch the users' repositories
  // 3. fetch the users' followers
router.get('/users/:username', function(req, res, next) {
  const { username } = req.params;

  getByUsername(username)
    .then(apiResult => {
      console.log(apiResult);
      // Return early if no result
      if (!apiResult.found) {
        res.status(404).end(apiResult.message);
        return;
      }
      
      const { user } = apiResult;
      const { repos_url, followers_url } = user;
      
      return Promise.all([getProperty(repos_url), getProperty(followers_url)])
        .then(results => {
          const [repos, followers] = results;
          user.repos = repos;
          user.followers = followers;
          res.send(user);
        });
    })
    .catch(err => { console.log (err) });
});

module.exports = router;
