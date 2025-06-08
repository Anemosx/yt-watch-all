# YouTube Channel Play All

![Apache License 2.0](https://img.shields.io/badge/license-Apache--2.0-blue)
![JavaScript](https://img.shields.io/badge/javascript-vanilla-yellow)
[![Chrome](https://img.shields.io/badge/chrome-extension-brightgreen.svg)](https://developer.chrome.com/extensions)
[![Firefox](https://img.shields.io/badge/firefox-addon-orange.svg)](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons)


A simple browser extension that adds a 'Play All' button to YouTube channel pages, making it easy to watch all of a channel's uploaded videos in a single playlist.

## Features

- **"Play All" Button**: Automatically adds a convenient "Play All" button to the "Videos" or "Uploads" section on a YouTube channel's homepage.
- **Automatic Playlist Generation**: Clicking the button takes you to a playlist of all the channel's public video uploads. The playlist ID is derived from the channel ID.
- **Seamless Integration**: Designed to work with YouTube's dynamic, single-page application structure. The button appears and disappears reliably as you navigate the site.
- **Lightweight & Simple**: No external libraries or frameworks. Just plain, efficient JavaScript.

## Installation

### Prerequisites

- A modern web browser like Google Chrome or Mozilla Firefox.

### Extension Setup

#### For Chrome:

1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable "Developer mode" in the top-right corner.
3. Click "Load unpacked".
4. Select the `channel-watch-app` directory from this repository.

#### For Firefox:

1. Open Firefox and navigate to `about:debugging`.
2. Click "This Firefox" in the left sidebar.
3. Click "Load Temporary Add-on...".
4. Select the `manifest.json` file inside the `channel-watch-app` directory.

## Usage

1. Navigate to any YouTube channel's main page (e.g., `https://www.youtube.com/@SomeChannel`).
2. The "Play All" button will appear next to the "Videos" or "Uploads" shelf title.
3. Click the button to be taken to a playlist containing all videos from that channel.

## Development

The extension is built using vanilla JavaScript.

### Extension Development

To make changes to the extension:

1. Edit the files within the `channel-watch-app/` directory, primarily `content.js`.
2. After saving your changes, go to your browser's extension page and reload the extension. Your changes will be applied immediately.

## Author

**Arnold Unterauer**

## Acknowledgments

- This extension interacts with YouTube's front-end.
