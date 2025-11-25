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
