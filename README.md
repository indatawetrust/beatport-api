# beatport-api

[![Travis Build Status](https://img.shields.io/travis/indatawetrust/beatport-api.svg)](https://travis-ci.org/indatawetrust/beatport-api)

### install
```
npm i beatport-api --save
```

### usage
```js
const beatapi = require('beatport-api');

// for genres
beatapi
.genres()
.then(genres => {
  console.log(genres)
})

// for top 100
beatapi.top100()

// for genre top 100 
beatapi.top100(5)
```
