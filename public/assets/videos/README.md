# Background Video Files

This directory contains video loops for the dashboard backgrounds.

## Required Video Files

Create the following video files (6 total expected):

1. **darkveil-loop.mp4** - Record the DarkVeil WebGL effect
2. **colorbends-loop.mp4** - Record the ColorBends WebGL effect
3. **iridescence-loop.mp4** - Record the Iridescence WebGL effect
4. **variant-1.mp4** - Additional variation (your choice)
5. **variant-2.mp4** - Additional variation (your choice)
6. **variant-3.mp4** - Additional variation (your choice)

## Recording Instructions

### Setup
1. Start the dev server: `npm run dev`
2. Navigate to **http://localhost:3001/dev** in your browser
3. Press **F11** for fullscreen (1920×1080 recommended)
4. Use OBS Studio or similar screen recording software

### Using the /dev Page

The `/dev` page shows backgrounds with minimal UI for recording:

**Controls:**
- **← →** (Arrow keys) - Switch between backgrounds
- **1-6** (Number keys) - Jump directly to background 1-6
- **Space** - Pause/Resume animation (useful to set up recording)
- **H** - Toggle help overlay (press H to hide ALL UI before recording)

**Recording Workflow:**
1. Navigate to background you want to record (use arrow keys or number keys)
2. Press **H** to hide ALL UI elements (gives you a completely clean view)
3. Wait a few seconds for the animation to stabilize
4. Start OBS recording
5. Record for 60-75 seconds (gives buffer for creating loop)
6. Stop recording
7. Press **H** again to show UI, then press **→** to move to next background
8. Repeat for all 6 backgrounds

## Software You'll Need

1. **OBS Studio** (free) - For recording
   - Download: https://obsproject.com/
   - Used to record your screen

2. **HandBrake** (free) - For encoding videos to correct format
   - Download: https://handbrake.fr/
   - Used AFTER recording to convert videos to proper size/format

## Step-by-Step Recording Process

### Step 1: Record with OBS Studio

**OBS Settings:**
1. Open OBS Studio
2. Add a "Window Capture" or "Display Capture" source
3. In Settings → Video:
   - Base Resolution: 1920×1080
   - Output Resolution: 1920×1080
4. In Settings → Output:
   - Output Mode: Simple
   - Recording Quality: High Quality
   - Recording Format: MP4
5. Start recording, capture 60-75 seconds, stop recording

**Result:** You'll have a large video file (maybe 100-500MB)

### Step 2: Encode with HandBrake

**Why?** OBS creates large files. HandBrake compresses them to ~2-3MB while keeping quality.

**HandBrake Settings:**
1. Open HandBrake
2. Load your recorded video
3. Set these options:
   - **Format:** MP4
   - **Video Codec:** H.264 (x264)
   - Go to "Video" tab:
     - **Framerate:** 24 (Constant Framerate)
     - **Quality:** RF 22 (lower = better quality but larger file)
   - Go to "Audio" tab:
     - **Remove all audio tracks** (click the X)
   - Go to "Dimensions" tab:
     - **Width:** 1920, **Height:** 1080
4. Click "Start Encode"

**Result:** A 2-3MB video file ready to use!

### Step 3: Save the Files

Save your encoded videos with these exact names in `public/assets/videos/`:

1. `darkveil-loop.mp4`
2. `colorbends-loop.mp4`
3. `iridescence-loop.mp4`
4. `variant-1.mp4` (DarkVeil Variant)
5. `variant-2.mp4` (ColorBends Variant)
6. `variant-3.mp4` (Iridescence Variant)

**File Size Check:** Each video should be 2-3MB. If larger, increase RF value in HandBrake (try RF 24 or 26).

### Creating Seamless Loops (Optional)

The backgrounds are slow-moving, so loops don't need to be perfect. But if you want seamless loops:
- Test the video in VLC media player set to loop
- If there's a visible "jump" at the loop point, trim a few frames from the end in HandBrake
- The CSS crossfade transition system will help hide any imperfections

### Quick Troubleshooting

**Video too large?** In HandBrake, increase RF value (22 → 24 → 26)
**Video looks blurry?** Decrease RF value (22 → 20 → 18)
**Target:** 2-3MB per 60-second video at good quality

## Testing Your Videos

1. **Place videos** in `public/assets/videos/` with the exact filenames above
2. **Start dev server:** `npm run dev`
3. **Go to main page:** http://localhost:3001 (not /dev)
4. **Watch backgrounds rotate** every 10 seconds (configurable in code)
5. **Play a special song** on Spotify to see CSS color filters in action

**Final test:** Load on your actual Chromecast and verify smooth 24fps playback!

## Summary

**The 2-Tool Workflow:**
1. **OBS Studio** → Record screen (creates large file)
2. **HandBrake** → Compress to 2-3MB MP4 at 24fps

That's it! No need to understand FFmpeg or complex commands - HandBrake has a simple GUI for everything you need.
