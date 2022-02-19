# DSS UI Test

Web application test written in vanilla JS, HTML, and CSS that at a minimum, displays sets of media that responds to UP/DOWN/LEFT/RIGHT arrow keys.

<img src="assets/dss-demo.gif" width="800">


## Developer Documentation

### Building
1. Install `live-server` either globally or as a development tool by using `yarn add -D live-server` or `yarn global-add live-server` with yarn, or `npm install -g live-server` with npm.
2. Run `yarn live-server` which should open a window with the application.

## Application Use

1. When within the application, use UP/DOWN/LEFT/RIGHT arrow keys to navigate across different sections and thumbnails of media.
  - Note: When user reaches last section shown on screen, more ref sections should be dynamically loaded. (That is, until there are no more ref sections available).
  - Special sets like "Trending" and "New to Disney+" are formatted differently than others.
2. Use ENTER keys to open a modal of the selected thumbnail, and ESC key to close the selected thumbnail.

