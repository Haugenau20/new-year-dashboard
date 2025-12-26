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
  tag?: string;
}

export const SPECIAL_SONGS: SpecialSong[] = [
  {
    trackName: 'Palace',
    artistName: 'Julias Moon',
    uri: 'spotify:track:1eeJma41NW6cYmDvc70Y3J',
    label: 'Alexander',
    tag: '04-AF-E2-AE-7A-26-81'
  },
  {
    trackName: 'Be My Lover',
    artistName: 'La Bouche',
    uri: 'spotify:track:3vSn1frPgFcRXrjWOfhMLl',
    label: 'Alexander',
    tag: '04-2F-3F-AF-7A-26-81'
  },
  {
    trackName: 'Sail',
    artistName: 'AWOLNATION',
    uri: 'spotify:track:7ueP5u2qkdZbIPN2YA6LR0',
    label: 'Alexander',
    tag: '04-BF-3B-AF-7A-26-81'
  },
  {
    trackName: 'Speechless (feat. Erika Sirola)',
    artistName: 'Robin Schulz',
    uri: 'spotify:track:1rCcsYnmqbMYdkG7kS9GC5',
    label: 'Alexander',
    tag: '04-56-4B-AF-7A-26-81'
  },
  {
    trackName: 'Roses - Imanbek Remix',
    artistName: 'SAINt JHN',
    uri: 'spotify:track:24Yi9hE78yPEbZ4kxyoXAI',
    label: 'Alexander',
    tag: '04-5C-4B-AF-7A-26-81'
  },
  {
    trackName: 'Vild Idag syg Imorgen',
    artistName: 'Vild Smith',
    uri: 'spotify:track:3iyXCRyq3b8UXO6HI3zXgM',
    label: 'Freya',
    tag: '04-19-EE-AE-7A-26-81'
  },
  {
    trackName: 'Talk Dirty',
    artistName: 'Jason Derulo',
    uri: 'spotify:track:31JwK4iHCf75rnQWoMPU5t',
    label: 'Freya',
    tag: '04-7C-4D-AF-7A-26-81'
  },
  {
    trackName: 'Pænt Nej Tak',
    artistName: 'Nik & Jay',
    uri: 'spotify:track:4LO5gXiwKwpiDQkfPxujd7',
    label: 'Freya',
    tag: '04-DA-27-AF-7A-26-81'
  },
  {
    trackName: 'Man Kan Ikke Stole På En Pige Med En Lille Røv',
    artistName: 'TopGunn',
    uri: 'spotify:track:56nFKMsuu6Q12d4PpHlkSB',
    label: 'Freya',
    tag: '04-D5-F5-AE-7A-26-81'
  },
  {
    trackName: 'Classic',
    artistName: 'MKTO',
    uri: 'spotify:track:6FE2iI43OZnszFLuLtvvmg',
    label: 'Freya',
    tag: '04-8C-2C-AF-7A-26-81'
  },
  {
    trackName: 'Gimme! Gimme! Gimme! (A Man After Midnight)',
    artistName: 'ABBA',
    uri: 'spotify:track:3vkQ5DAB1qQMYO4Mr9zJN6',
    label: 'Nanna',
    tag: '04-1F-33-AF-7A-26-81'
  },
  {
    trackName: 'Tag Mig Som Jeg Er',
    artistName: 'KALASET',
    uri: 'spotify:track:7aSvvFYDuR8fCurPx6hqwl',
    label: 'Nanna',
    tag: '04-76-1A-AF-7A-26-81'
  },
  {
    trackName: 'Moth To A Flame (with The Weeknd)',
    artistName: 'Swedish House Mafia',
    uri: 'spotify:track:7kfOEMJBJwdCYqyJeEnNhr',
    label: 'Nanna',
    tag: '04-26-44-AF-7A-26-81'
  },
  {
    trackName: 'Escapism.',
    artistName: 'RAYE',
    uri: 'spotify:track:2VOZniNxFIDl8ydLltrMNb',
    label: 'Nanna',
    tag: '04-84-37-AF-7A-26-81'
  },
  {
    trackName: 'Guess featuring billie eilish',
    artistName: 'Charli XCX',
    uri: 'spotify:track:0IsIY8pfu1yaGkPUD7pkDx',
    label: 'Nanna',
    tag: '04-D3-3F-AF-7A-26-81'
  },
  {
    trackName: 'Alive',
    artistName: 'Pearl Jam',
    uri: 'spotify:track:1L94M3KIu7QluZe63g64rv',
    label: 'Peter',
    tag: '04-56-51-AF-7A-26-81'
  },
  {
    trackName: 'Better Man',
    artistName: 'Pearl Jam',
    uri: 'spotify:track:2B98ljvzqpCVgt5reTHq28',
    label: 'Peter',
    tag: '04-B6-E2-AE-7A-26-81'
  },
  {
    trackName: 'Be Yourself',
    artistName: 'Audioslave',
    uri: 'spotify:track:3zwmW1gM4E8FlHXV5nE16u',
    label: 'Peter',
    tag: '04-AD-36-AF-7A-26-81'
  },
  {
    trackName: 'Wish you were here',
    artistName: 'Pink Floyd',
    uri: 'spotify:track:6mFkJmJqdDVQ1REhVfGgd1',
    label: 'Peter',
    tag: '04-56-CB-AE-7A-26-81'
  },
  {
    trackName: 'Higher',
    artistName: 'Creed',
    uri: 'spotify:track:1ZozJfi8u9cO2Ob8KwiwNT',
    label: 'Peter',
    tag: '04-5D-48-AF-7A-26-81'
  },
  {
    trackName: 'Happy New Year ',
    artistName: 'ABBA',
    uri: 'spotify:track:4AsvGVDWs16fqIiIdDzyvX',
    label: 'Katharina',
    tag: '04-87-2D-AF-7A-26-81'
  },
  {
    trackName: 'Stupid Man',
    artistName: 'Thomas Helmig',
    uri: 'spotify:track:5HjIGzesTt8dwTgy8z7KRf',
    label: 'Katharina',
    tag: '04-74-D7-AE-7A-26-81'
  },
  {
    trackName: 'Cant Feel My Face',
    artistName: 'The Weeknd',
    uri: 'spotify:track:22VdIZQfgXJea34mQxlt81',
    label: 'Katharina',
    tag: '04-D8-47-AF-7A-26-81'
  },
  {
    trackName: 'The Nights',
    artistName: 'Avicii',
    uri: 'spotify:track:0ct6r3EGTcMLPtrXHDvVjc',
    label: 'Katharina',
    tag: '04-25-D6-AE-7A-26-81'
  },
  {
    trackName: 'Im good (Blue)',
    artistName: 'David Guetta & Bebe Rexha',
    uri: 'spotify:track:4uUG5RXrOk84mYEfFvj3cK',
    label: 'Katharina',
    tag: '04-D8-28-AF-7A-26-81'
  },
  {
    trackName: 'Yo-Yo',
    artistName: 'Joey Moe',
    uri: 'spotify:track:2cCddpwGpx5H8xIrrNANCd',
    label: 'Søren',
    tag: '04-31-23-AF-7A-26-81'
  },
  {
    trackName: 'SexyBack',
    artistName: 'Justin Timberlake',
    uri: 'spotify:track:0O45fw2L5vsWpdsOdXwNAR',
    label: 'Søren',
    tag: '04-5B-FF-AE-7A-26-81'
  },
  {
    trackName: 'We No Speak Americano',
    artistName: 'Yolanda Be Cool & DCUP',
    uri: 'spotify:track:0CJ1quCQhVX9Ax2jYwwovA',
    label: 'Søren',
    tag: '04-67-EF-AE-7A-26-81'
  },
  {
    trackName: 'Fireflies',
    artistName: 'Owl City',
    uri: 'spotify:track:3DamFFqW32WihKkTVlwTYQ',
    label: 'Søren',
    tag: '04-CE-DB-AE-7A-26-81'
  },
  {
    trackName: 'Basket Case',
    artistName: 'Green Day',
    uri: 'spotify:track:6L89mwZXSOwYl76YXfX13s',
    label: 'Søren',
    tag: '04-B5-16-AF-7A-26-81'
  },
  {
    trackName: 'Hey Shorty (Yeah Yeah Pt. 2)',
    artistName: 'Kato',
    uri: 'spotify:track:4KM16itm41Ip3Dqyjq2VXW',
    label: 'Diana',
    tag: '04-FB-F9-AE-7A-26-81'
  },
  {
    trackName: 'Endnu en',
    artistName: 'Nik & Jay',
    uri: 'spotify:track:23eu66HbWUGHvchZa7JkE2',
    label: 'Diana',
    tag: '04-CD-E9-AE-7A-26-81'
  },
  {
    trackName: 'Nede Mette',
    artistName: 'Blak',
    uri: 'spotify:track:2gFaHRqjAE5ZNNnGr9eYG4',
    label: 'Diana',
    tag: '04-71-E8-AE-7A-26-81'
  },
  {
    trackName: 'Lækker, PT. 2',
    artistName: 'Nik & Jay, L.O.C., Nexus',
    uri: 'spotify:track:7zpoh96ckCzpULd44nWXv9',
    label: 'Diana',
    tag: '04-53-EF-AE-7A-26-81'
  },
  {
    trackName: 'Baby',
    artistName: 'Justin Bieber',
    uri: 'spotify:track:6epn3r7S14KUqlReYr77hA',
    label: 'Diana',
    tag: '04-97-E2-AE-7A-26-81'
  },
  {
    trackName: 'Counter-Strike & Damer',
    artistName: 'Umage Image',
    uri: 'spotify:track:765htqtuQYAFdgSK5fTQ0v',
    label: 'Jonas',
    tag: '04-CD-2B-AE-7A-26-81'
  },
  {
    trackName: 'Flydende Grænser',
    artistName: 'Umage Image',
    uri: 'spotify:track:4pXj7eRftm8Z74jeNxAwJ0',
    label: 'Jonas',
    tag: '04-73-6E-AE-7A-26-81'
  },
  {
    trackName: 'Young Blood',
    artistName: 'The Naked And Famous',
    uri: 'spotify:track:25nzKGDiua1lE9Qo5V19GL',
    label: 'Jonas',
    tag: '04-37-A5-AE-7A-26-81'
  },
  {
    trackName: 'Everyday Normal Guy',
    artistName: 'Jon Lajoie',
    uri: 'spotify:track:2KldK81uQyPpbJLwEekaLQ',
    label: 'Jonas',
    tag: '04-63-CB-AE-7A-26-81'
  },
  {
    trackName: 'Like a Prayer',
    artistName: 'Ill Take You There Choir',
    uri: 'spotify:track:492ceDtqmafb6QD1Xfhpmo',
    label: 'Jonas',
    tag: '04-81-C5-AE-7A-26-81'
  },
  {
    trackName: 'Mr Blue Sky',
    artistName: 'Electric Light Ochestra',
    uri: 'spotify:track:2RlgNHKcydI9sayD2Df2xp',
    label: 'Brygmann',
    tag: '04-7A-E8-AE-7A-26-81'
  },
  {
    trackName: 'The Rubberband Man',
    artistName: 'The Spinners',
    uri: 'spotify:track:13Mzsb8VzRSZ5w3pM48cn6',
    label: 'Brygmann',
    tag: '04-49-EF-AE-7A-26-81'
  },
  {
    trackName: 'She Bangs - English Version',
    artistName: 'Ricky Martin',
    uri: 'spotify:track:1uPrIHgYztXSkkcts9jet8',
    label: 'Brygmann',
    tag: '04-C5-F5-AE-7A-26-81'
  },
  {
    trackName: 'Just cant get enough',
    artistName: 'Depeche Mode',
    uri: 'spotify:track:0qi4b1l0eT3jpzeNHeFXDT',
    label: 'Brygmann',
    tag: '04-B7-15-AF-7A-26-81'
  },
  {
    trackName: 'I dont wanna be',
    artistName: 'Gavin DeGraw',
    uri: 'spotify:track:4vl2zwXsTmAxgu9iY0g6UK',
    label: 'Brygmann',
    tag: '04-8A-FF-AE-7A-26-81'
  },
  {
    trackName: 'Broken Arrows',
    artistName: 'Avicii',
    uri: 'spotify:track:260jSxvzkFt71ksvkcy2ke',
    label: 'Mikkel',
    tag: '04-85-FF-AE-7A-26-81'
  },
  {
    trackName: 'Rigtige Mænd',
    artistName: 'Stig Rossen',
    uri: 'spotify:track:1KAdOiRwDdDC6ZLMaO8OkO',
    label: 'Mikkel',
    tag: '04-53-64-AF-7A-26-81'
  },
  {
    trackName: 'Cotton Eye Joe',
    artistName: 'Rednex',
    uri: 'spotify:track:06hsdMbBxWGqBO0TV0Zrkf',
    label: 'Mikkel',
    tag: '04-BC-E2-AE-7A-26-81'
  },
  {
    trackName: 'Dont stop believing',
    artistName: 'Journey',
    uri: 'spotify:track:77NNZQSqzLNqh2A9JhLRkg',
    label: 'Mikkel',
    tag: '04-B6-15-AF-7A-26-81'
  },
  {
    trackName: 'Fireball',
    artistName: 'Pitbull ft. John Ryan',
    uri: 'spotify:track:4Y7XAxTANhu3lmnLAzhWJW',
    label: 'Mikkel',
    tag: '04-6C-D7-AE-7A-26-81'
  },
  {
    trackName: 'Hey Ya!',
    artistName: 'OutKast',
    uri: 'spotify:track:2PpruBYCo4H7WOBJ7Q2EwM',
    label: 'Davina',
    tag: '04-78-D7-AE-7A-26-81'
  },
  {
    trackName: 'Wannabe',
    artistName: 'Spice Girls',
    uri: 'spotify:track:1Je1IMUlBXcx1Fz0WE7oPT',
    label: 'Davina',
    tag: '04-76-D7-AE-7A-26-81'
  },
  {
    trackName: 'Love Foolosophy',
    artistName: 'Jamiroquai',
    uri: 'spotify:track:0upgxxew2mVAEctrz08jnf',
    label: 'Davina',
    tag: '04-48-CF-AE-7A-26-81'
  },
  {
    trackName: 'Elskovspony',
    artistName: 'Johnny Deluxe',
    uri: 'spotify:track:0gloEpnKRspgRbp5jI7Bbd',
    label: 'Davina',
    tag: '04-48-EF-AE-7A-26-81'
  },
  {
    trackName: 'Black Betty',
    artistName: 'Ram Jam',
    uri: 'spotify:track:6kooDsorCpWVMGc994XjWN',
    label: 'Davina',
    tag: '04-BD-E2-AE-7A-26-81'
  },
  {
    trackName: 'Cantina Band',
    artistName: 'John Williams',
    uri: 'spotify:track:5ZSAdkQb23NPIcUGt6exdm',
    label: 'Haug',
    tag: '04-93-D1-AE-7A-26-81'
  },
  {
    trackName: 'Stayin Alive - Teddybears Remix',
    artistName: 'Bee Gees',
    uri: 'spotify:track:5iyuBXYblt5wpD7DC16WnP',
    label: 'Haug',
    tag: '04-6E-E8-AE-7A-26-81'
  },
  {
    trackName: 'Galvanize - Chris Lake Remix',
    artistName: 'The Chemical Brothers',
    uri: 'spotify:track:7Ki6lQlcAW565EsHfP8U7S',
    label: 'Haug',
    tag: '04-3D-CF-AE-7A-26-81'
  },
  {
    trackName: 'Tokyo Drift',
    artistName: 'Teriyaki Boyz',
    uri: 'spotify:track:0upFohXrGxIIAjyaJmCkMU',
    label: 'Haug',
    tag: '04-C6-F5-AE-7A-26-81'
  },
  {
    trackName: 'Gi Mig Danmark Tilbage',
    artistName: 'Natasja',
    uri: 'spotify:track:2om86fvyOE6GGtubpMkZpC',
    label: 'Haug',
    tag: '04-72-D7-AE-7A-26-81'
  },
  // {
  //   trackName: '',
  //   artistName: '',
  //   uri: '',
  //   label: '',
  //   tag: ''
  // },
];
