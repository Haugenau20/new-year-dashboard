// Special songs that will be highlighted in the queue
// You can identify songs by either Spotify URI or by track name + artist combination

export interface SpecialSong {
  // Option 1: Use Spotify URI (most accurate)
  // Find this by right-clicking a song in Spotify > Share > Copy Spotify URI
  uri?: string;

  // Option 2: Use track name and artist (less accurate, but easier)
  trackName?: string;
  artistName?: string;

  // Optional: Add a label/reason
  label?: string;
}

export const SPECIAL_SONGS: SpecialSong[] = [
  // Example using Spotify URI (recommended):
  // {
  //   uri: 'spotify:track:3n3Ppam7vgaVa1iaRUc9Lp',
  //   label: 'Party Anthem'
  // },

  // Example using track + artist names:
  // {
  //   trackName: 'Mr. Brightside',
  //   artistName: 'The Killers',
  //   label: 'Must-Play'
  // },

  // Add your special songs here:

  {
    trackName: 'Palace',
    artistName: 'Julias Moon',
    uri: 'spotify:track:1eeJma41NW6cYmDvc70Y3J',
    label: 'Alexander'
  },
  {
    trackName: 'Be My Lover',
    artistName: 'La Bouche',
    uri: 'spotify:track:3vSn1frPgFcRXrjWOfhMLl',
    label: 'Alexander'
  },
  {
    trackName: 'Sail',
    artistName: 'AWOLNATION',
    uri: 'spotify:track:7ueP5u2qkdZbIPN2YA6LR0',
    label: 'Alexander'
  },
  {
    trackName: 'Speechless (feat. Erika Sirola)',
    artistName: 'Robin Schulz',
    uri: 'spotify:track:1rCcsYnmqbMYdkG7kS9GC5',
    label: 'Alexander'
  },
  {
    trackName: 'Roses - Imanbek Remix',
    artistName: 'SAINt JHN',
    uri: 'spotify:track:24Yi9hE78yPEbZ4kxyoXAI',
    label: 'Alexander'
  },
  {
    trackName: 'Vild Idag syg Imorgen',
    artistName: 'Vild Smith',
    uri: 'spotify:track:3iyXCRyq3b8UXO6HI3zXgM',
    label: 'Freya'
  },
  {
    trackName: 'Talk Dirty',
    artistName: 'Jason Derulo',
    uri: 'spotify:track:31JwK4iHCf75rnQWoMPU5t',
    label: 'Freya'
  },
  {
    trackName: 'Pænt Nej Tak',
    artistName: 'Nik & Jay',
    uri: 'spotify:track:4LO5gXiwKwpiDQkfPxujd7',
    label: 'Freya'
  },
  {
    trackName: 'Man Kan Ikke Stole På En Pige Med En Lille Røv',
    artistName: 'TopGunn',
    uri: 'spotify:track:56nFKMsuu6Q12d4PpHlkSB',
    label: 'Freya'
  },
  {
    trackName: 'Classic',
    artistName: 'MKTO',
    uri: 'spotify:track:6FE2iI43OZnszFLuLtvvmg',
    label: 'Freya'
  },
  {
    trackName: 'Gimme! Gimme! Gimme! (A Man After Midnight)',
    artistName: 'ABBA',
    uri: 'spotify:track:3vkQ5DAB1qQMYO4Mr9zJN6',
    label: 'Nanna'
  },
  {
    trackName: 'Tag Mig Som Jeg Er',
    artistName: 'KALASET',
    uri: 'spotify:track:7aSvvFYDuR8fCurPx6hqwl',
    label: 'Nanna'
  },
  {
    trackName: 'Moth To A Flame (with The Weeknd)',
    artistName: 'Swedish House Mafia',
    uri: 'spotify:track:7kfOEMJBJwdCYqyJeEnNhr',
    label: 'Nanna'
  },
  {
    trackName: 'Escapism.',
    artistName: 'RAYE',
    uri: 'spotify:track:2VOZniNxFIDl8ydLltrMNb',
    label: 'Nanna'
  },
  {
    trackName: 'Guess featuring billie eilish',
    artistName: 'Charli XCX',
    uri: 'spotify:track:0IsIY8pfu1yaGkPUD7pkDx',
    label: 'Nanna'
  },
  {
    trackName: 'Alive',
    artistName: 'Pearl Jam',
    uri: 'spotify:track:1L94M3KIu7QluZe63g64rv',
    label: 'Peter'
  },
  {
    trackName: 'Better Man',
    artistName: 'Pearl Jam',
    uri: 'spotify:track:2B98ljvzqpCVgt5reTHq28',
    label: 'Peter'
  },
  {
    trackName: 'Be Yourself',
    artistName: 'Audioslave',
    uri: 'spotify:track:3zwmW1gM4E8FlHXV5nE16u',
    label: 'Peter'
  },
  {
    trackName: 'Wish you were here',
    artistName: 'Pink Floyd',
    uri: 'spotify:track:6mFkJmJqdDVQ1REhVfGgd1',
    label: 'Peter'
  },
  {
    trackName: 'Higher',
    artistName: 'Creed',
    uri: 'spotify:track:1ZozJfi8u9cO2Ob8KwiwNT',
    label: 'Peter'
  },
  {
    trackName: 'Happy New Year ',
    artistName: 'ABBA',
    uri: 'spotify:track:4AsvGVDWs16fqIiIdDzyvX',
    label: 'Katharina'
  },
  {
    trackName: 'Stupid Man',
    artistName: 'Thomas Helmig',
    uri: 'spotify:track:5HjIGzesTt8dwTgy8z7KRf',
    label: 'Katharina'
  },
  {
    trackName: 'Cant Feel My Face',
    artistName: 'The Weeknd',
    uri: 'spotify:track:22VdIZQfgXJea34mQxlt81',
    label: 'Katharina'
  },
  {
    trackName: 'The Nights',
    artistName: 'Avicii',
    uri: 'spotify:track:0ct6r3EGTcMLPtrXHDvVjc',
    label: 'Katharina'
  },
  {
    trackName: 'Im good (Blue)',
    artistName: 'David Guetta & Bebe Rexha',
    uri: 'spotify:track:4uUG5RXrOk84mYEfFvj3cK',
    label: 'Katharina'
  },
  {
    trackName: 'Yo-Yo',
    artistName: 'Joey Moe',
    uri: 'spotify:track:2cCddpwGpx5H8xIrrNANCd',
    label: 'Søren'
  },
  {
    trackName: 'SexyBack',
    artistName: 'Justin Timberlake',
    uri: 'spotify:track:0O45fw2L5vsWpdsOdXwNAR',
    label: 'Søren'
  },
  {
    trackName: 'We No Speak Americano',
    artistName: 'Yolanda Be Cool & DCUP',
    uri: 'spotify:track:0CJ1quCQhVX9Ax2jYwwovA',
    label: 'Søren'
  },
  {
    trackName: 'Fireflies',
    artistName: 'Owl City',
    uri: 'spotify:track:3DamFFqW32WihKkTVlwTYQ',
    label: 'Søren'
  },
  {
    trackName: 'Basket Case',
    artistName: 'Green Day',
    uri: 'spotify:track:6L89mwZXSOwYl76YXfX13s',
    label: 'Søren'
  },
  {
    trackName: 'Hey Shorty (Yeah Yeah Pt. 2)',
    artistName: 'Kato',
    uri: 'spotify:track:4KM16itm41Ip3Dqyjq2VXW',
    label: 'Diana'
  },
  {
    trackName: 'Endnu en',
    artistName: 'Nik & Jay',
    uri: 'spotify:track:23eu66HbWUGHvchZa7JkE2',
    label: 'Diana'
  },
  {
    trackName: 'Nede Mette',
    artistName: 'Blak',
    uri: 'spotify:track:2gFaHRqjAE5ZNNnGr9eYG4',
    label: 'Diana'
  },
  {
    trackName: 'Lækker, PT. 2',
    artistName: 'Nik & Jay, L.O.C., Nexus',
    uri: 'spotify:track:7zpoh96ckCzpULd44nWXv9',
    label: 'Diana'
  },
  {
    trackName: 'Baby',
    artistName: 'Justin Bieber',
    uri: 'spotify:track:6epn3r7S14KUqlReYr77hA',
    label: 'Diana'
  },
  // {
  //   trackName: '',
  //   artistName: '',
  //   uri: '',
  //   label: ''
  // },
  {
    uri: 'spotify:track:4Li2WHPkuyCdtmokzW2007',
    label: 'Haug, Søren'
  },
  {
    uri: 'spotify:track:2geMSoH29SfXAZVgPR8avw',
    label: 'Søren Haug'
  },
  {
    uri: 'spotify:track:2om86fvyOE6GGtubpMkZpC',
    label: 'Søren Haug'
  },
  {
    uri: 'spotify:track:0O45fw2L5vsWpdsOdXwNAR',
    label: 'Søren Haug'
  },
  {
    uri: 'spotify:track:6e8Ou0wiqAzIpWb2eSxll8',
    label: 'Søren Haug'
  },
  {
    uri: 'spotify:track:3Osd3Yf8K73aj4ySn6LrvK',
    label: 'Søren Haug'
  },
  {
    uri: 'spotify:track:7xYnUQigPoIDAMPVK79NEq',
    label: 'Søren Haug'
  },
  {
    uri: 'spotify:track:72SpPFrMYCXLB3Fbw9tEgf',
    label: 'Søren Haug'
  },
  {
    uri: 'spotify:track:1NpcoGf4Hhk95X02DbIECE',
    label: 'Søren Haug'
  }

];
