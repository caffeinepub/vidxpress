# VidXpress

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Video feed page listing uploaded videos with title, play button, and metadata
- Video upload functionality (floating action button / upload button)
- Video playback (inline player)
- User authorization so users can upload their own videos
- Blob storage for video files and thumbnails

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Select blob-storage and authorization components
2. Generate Motoko backend: video metadata storage (title, uploader, blob reference, timestamp), list videos, upload video record
3. Build frontend: dark-themed video feed with cards (title, uploader, play button), upload modal with file picker, inline video player
