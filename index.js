class Api {
  constructor() {
    this.request = require('request');
    this.cheerio = require('cheerio');

    const LRU = require('lru-cache'),
      options = {
        max: 0,
        maxAge: 1000 * 60 * 60,
      };
    this.cache = new LRU(options);

    this.baseUrl = 'https://www.beatport.com/';
  }

  get(prefix) {
    return new Promise((resolve, reject) => {
      this.request(
        {
          method: 'GET',
          uri: this.baseUrl + prefix,
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36',
          },
        },
        (err, res, body) => {
          if (!err) {
            const $ = this.cheerio.load(body);

            resolve($);
          } else {
            reject(err);
          }
        },
      );
    });
  }

  cacheGet(key) {
    return this.cache.get(key);
  }

  cacheSet(key, value) {
    this.cache.set(key, value);
  }

  async genres() {
    if (this.cacheGet('genres')) {
      return this.cacheGet('genres');
    }

    const $ = await this.get('');

    this._genres = $(
      'body > div.header-container > div > div > div.mobile-menu-body > ul > li.nav-links.genre-parent.head-parent > div > div:nth-child(2) .genre-drop-list__genre',
    )
      .toArray()
      .map((item, index) => ({
        code: index,
        name: $(item).text(),
        url: $(item).attr('href'),
      }));

    this.cacheSet('genres', this._genres);

    return this._genres;
  }

  async top100(genre) {
    if (!this._genres) {
      await this.genres();
    }

    genre = this._genres.filter(item => item.code == genre);

    if (genre.length) {
      genre = genre[0];
    } else {
      genre = {
        url: '',
        code: '',
      };
    }

    if (this.cacheGet(`top100${genre.code}`)) {
      return this.cacheGet(`top100${genre.code}`);
    }

    const $ = await this.get(genre.url + '/top-100');

    const window = {};

    eval($('#data-objects').html());

    const value = window.Playables.tracks.map(item => ({
      id: item.id,
      tag: `${item.slug}/${item.id}`,
      slug: item.slug,
      artist: item.artists,
      genres: item.genres,
      title: item.title,
      duration: item.duration,
      images: item.images,
      preview: item.preview,
    }));

    this.cacheSet(`top100${genre.code}`, value);

    return value;
  }
}

module.exports = new Api();
