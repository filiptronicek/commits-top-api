# Commits.top API
An API to get rankings of the most active GitHub contributors by country. Use it to show your rank to other people, or just showoff, how active people from your country / any other are!

Based on data from [lauripiispanen/most-active-github-users-counter](https://github.com/lauripiispanen/most-active-github-users-counter)

For the list of all the locations, see https://github.com/lauripiispanen/github-top/tree/master/_data/locations

To list the locations in the API, use the [`/locations`](https://commiters.now.sh/locations) endpoint.

## HTTP Endpoint
`GET`: [`https://commiters.now.sh/rank/country`](https://commiters.now.sh/rank/country)

## JavaScript implementation
Display how active you are on your website! (replace `czech_republic` with your country and `me.username` with your username!)
```js
function getRank() {
  const url = "https://commiters.now.sh/rank/czech_republic";

  fetch(url)
    .then((response) => response.json())
    .then((res) => {
      for (const user of res.users.users) {
        if (user.login === me.username) {
          console.log(`${user.rank}${
            user.rank === 1 ? "st" : user.rank === 2 ? "nd" : "th"
          }`);
        }
      }
    });
}
```
