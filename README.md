# Commits.top API
## commits.top REST API

Display how active you are on your website! (replace `czech_republic` with your country and `me.username` with your username!)
```js
function getRank() {
  const url = "https://commiters.now.sh/rank/czech_republic";

  fetch(url)
    .then((response) => response.json())
    .then((res) => {
      for (const user of res.users) {
        if (user.user.username === me.username) {
          console.log(`${user.rank}${
            user.rank === 1 ? "st" : user.rank === 2 ? "nd" : "th"
          }`);
        }
      }
    });
}
```
