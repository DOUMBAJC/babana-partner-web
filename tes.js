 const musicLibrary = [
  { 'title': 'Bohemian Rhapsody',
    'artist': 'Queen',
    'rating': 5,
    'playCount': 1000000,
    'durationSec': 354 },
  { 'title': 'Stairway to Heaven',
    'artist': 'Led Zeppelin',
    'rating': 4,
    'playCount': 750000,
    'durationSec': 482 },
  { 'title': 'Hotel California',
    'artist': 'Eagles',
    'rating': 4,
    'playCount': 600000,
    'durationSec': 390 },
  { 'title': 'Achy Breaky Heart',
    'artist': 'Billy Ray Cyrus',
    'rating': 2,
    'playCount': 300000,
    'durationSec': 205 },
  { 'title': 'Sweet Child O\' Mine',
    'artist': 'Guns N\' Roses',
    'rating': 4,
    'playCount': 500000,
    'durationSec': 356 },
  { 'title': 'Friday',
    'artist': 'Rebecca Black',
    'rating': 1,
    'playCount': 200000,
    'durationSec': 199 },
  { 'title': 'Smells Like Teen Spirit',
    'artist': 'Nirvana',
    'rating': 5,
    'playCount': 800000,
    'durationSec': 301 },
  { 'title': 'Don\'t Stop Believin\'',
    'artist': 'Journey',
    'rating': 3,
    'playCount': 450000,
    'durationSec': 251 },
  { 'title': 'Wonderwall',
    'artist': 'Oasis',
    'rating': 3,
    'playCount': 400000,
    'durationSec': 258 },
  { 'title': 'Another One Bites the Dust',
    'artist': 'Queen',
    'rating': 4,
    'playCount': 550000,
    'durationSec': 214 },
  { 'title': 'Ice Ice Baby',
    'artist': 'Vanilla Ice',
    'rating': 2,
    'playCount': 350000,
    'durationSec': 240 }
]

// 👇 fill out this function
 function noBadSongs (songs) {
  return songs.map(song => {
        if(song.rating < 2){
          return {...song}
        }
        return song
  })
}

// 👇 fill out this function
 function songsSortedByPopularity (songs) {
  // return the songs sorted by `playCount` (highest to lowest)
  return songs.sort((a, b) => {
    return b.playCount - a.playCount
  })
}

// 👇 fill out this function
 function averageRating (songs) {
  // return the average of all the ratings (with 2 digits after the decimal point) and as a real Number data type
    const totalRating = songs.reduce((acc, song) => { 
        return acc + song.rating
    }, 0)
    const average = totalRating / songs.length
    return parseFloat(average.toFixed(2))
}

// 👇 fill out this function
 function topSongs (songs, count) {
  // return an array with only the top ${count} songs (based on playCount)
    const sortedSongs = songs.sort((a, b) => {
        return b.playCount - a.playCount
    })
    return sortedSongs.slice(0, count)
}

export function rollDice (sides) {
  // returns a random number between 1 and the sides argument (can 1 exactly or `sides` exactly or anything in between)
    return Math.floor(Math.random() * sides) + 1
}

// 👇 fill out this function
export function roll6SidedDice () {
  // returns a number that's always a max of 6
    return rollDice(6)
}

// 👇 fill out this function
export function rollForOneOrMorePlayers (players) {
  // rolls a 6 sided dice for each player and return an object of the results

  const results = {}
  players.forEach(player => {
    results[player] = roll6SidedDice()
  })

  return results    
}

console.log(rollDice(6));
