const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

const access_token = "YOUR-TOKEN-HERE";

async function getByUsername(username) {
  const result = await fetch(`https://api.github.com/users/${username}`);
  return { user: await result.json(), found: res.status === 200 };
}

async function getProperty(url) {
  return (await fetch(url)).json()
}

/* GET github user listing asyncly. */
router.get('/users/:username', async (req, res, next) => {
  try {
    const { username } = req.params;
    const apiResult = await getByUsername(username);

    if (!apiResult.found) {
      res.status(404).end();
      return;
    }

    const { user } = apiResult;
    const { repos_url, followers_url } = user;
    const [repos, followers] = await Promise.all([getProperty(repos_url), getProperty(followers_url)]);

    user.repos = repos;
    user.followers = followers;

    res.send(user);
  } catch (e) {
    res.status(500).send(e.message).end();
  }
});

module.exports = router;
