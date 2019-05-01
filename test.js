import test from 'ava';
import bpapi from '.';

test('genres', async t => {
    
  const genres = await bpapi.genres()

  t.is(genres.length, 31)

})

test('top 100', async t => {

  const tracks = await bpapi.top100()

  t.is(tracks.length, 100)

})

test('top 100 - 10', async t => {

  const tracks = await bpapi.top100(10)

  t.is(tracks.length, 100)

})
