import { Vibrant } from 'node-vibrant/node';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
const envPath = join(__dirname, '..', '.env');
const envContent = readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const trimmedLine = line.trim();
  if (trimmedLine && !trimmedLine.startsWith('#')) {
    const match = trimmedLine.match(/^([^=]+)=(.*)$/);
    if (match) {
      env[match[1].trim()] = match[2].trim();
    }
  }
});

const SPOTIFY_CLIENT_ID = env.VITE_SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = env.VITE_SPOTIFY_CLIENT_SECRET;

if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
  console.error('Error: Spotify credentials not found in .env file');
  console.error('Found env keys:', Object.keys(env));
  process.exit(1);
}

// Spotify API client credentials flow
async function getSpotifyToken() {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')
    },
    body: 'grant_type=client_credentials'
  });

  if (!response.ok) {
    throw new Error('Failed to get Spotify access token');
  }

  const data = await response.json();
  return data.access_token;
}

// Get track info from Spotify
async function getTrackInfo(trackId, token) {
  const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch track ${trackId}: ${response.statusText}`);
  }

  return response.json();
}

// Extract colors from image URL
async function extractColors(imageUrl) {
  try {
    const palette = await Vibrant.from(imageUrl).getPalette();

    return {
      vibrant: palette.Vibrant?.hex || null,
      darkVibrant: palette.DarkVibrant?.hex || null,
      lightVibrant: palette.LightVibrant?.hex || null,
      muted: palette.Muted?.hex || null,
      darkMuted: palette.DarkMuted?.hex || null,
      lightMuted: palette.LightMuted?.hex || null,
    };
  } catch (error) {
    console.error(`Error extracting colors from ${imageUrl}:`, error.message);
    return null;
  }
}

// Parse specialSongs.ts to extract URIs
function parseSpecialSongs() {
  const specialSongsPath = join(__dirname, '..', 'src', 'config', 'specialSongs.ts');
  const content = readFileSync(specialSongsPath, 'utf-8');

  const uriMatches = content.matchAll(/uri:\s*['"]spotify:track:([a-zA-Z0-9]+)['"]/g);
  const trackIds = Array.from(uriMatches).map(match => match[1]);

  return trackIds;
}

// Main function
async function main() {
  console.log('🎨 Starting color extraction for special songs...\n');

  // Check if output file exists and load it
  const outputPath = join(__dirname, '..', 'src', 'config', 'specialSongColors.json');
  let existingColors = {};
  try {
    const existing = readFileSync(outputPath, 'utf-8');
    existingColors = JSON.parse(existing);
    console.log(`📂 Loaded ${Object.keys(existingColors).length} existing color entries\n`);
  } catch (error) {
    console.log('📂 No existing color data found, starting fresh\n');
  }

  // Parse special songs
  const trackIds = parseSpecialSongs();
  console.log(`🎵 Found ${trackIds.length} special songs\n`);

  if (trackIds.length === 0) {
    console.log('No tracks found to process. Exiting.');
    return;
  }

  // Get Spotify token
  console.log('🔑 Getting Spotify access token...');
  const token = await getSpotifyToken();
  console.log('✅ Token acquired\n');

  // Process each track
  const results = { ...existingColors };
  let processed = 0;
  let skipped = 0;
  let failed = 0;

  for (const trackId of trackIds) {
    const uri = `spotify:track:${trackId}`;

    // Skip if already processed
    if (existingColors[uri]) {
      console.log(`⏭️  Skipping ${uri} (already processed)`);
      skipped++;
      continue;
    }

    try {
      console.log(`🎵 Processing ${uri}...`);

      // Get track info
      const track = await getTrackInfo(trackId, token);
      const albumName = track.album.name;
      const artistName = track.artists[0].name;
      const trackName = track.name;

      console.log(`   "${trackName}" by ${artistName}`);
      console.log(`   Album: ${albumName}`);

      // Get largest album image
      const images = track.album.images;
      if (images.length === 0) {
        console.log(`   ⚠️  No album artwork found`);
        failed++;
        continue;
      }

      // Use the first image (highest quality)
      const imageUrl = images[0].url;
      console.log(`   🖼️  Extracting colors from album art...`);

      // Extract colors
      const colors = await extractColors(imageUrl);

      if (colors) {
        results[uri] = {
          trackName,
          artistName,
          albumName,
          colors,
          imageUrl
        };
        console.log(`   ✅ Colors extracted successfully`);
        processed++;
      } else {
        console.log(`   ❌ Failed to extract colors`);
        failed++;
      }

      // Rate limiting - be nice to Spotify API
      await new Promise(resolve => setTimeout(resolve, 100));

    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
      failed++;
    }

    console.log('');
  }

  // Save results
  console.log('💾 Saving results...');
  writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`✅ Saved to ${outputPath}\n`);

  // Summary
  console.log('📊 Summary:');
  console.log(`   Total tracks: ${trackIds.length}`);
  console.log(`   Newly processed: ${processed}`);
  console.log(`   Skipped (existing): ${skipped}`);
  console.log(`   Failed: ${failed}`);
  console.log(`   Total in database: ${Object.keys(results).length}`);
  console.log('\n✨ Done!');
}

main().catch(console.error);
