# Quick Start

## Features

- Editing Subtitle files (.srt)
- Manually editing math subtitles (LaTeX equations) and saved as Html file.
- Useful shortcuts
- An OBS studio script can be used to record open caption videos with Html files (https://github.com/Yukinooo7/recording_video_obs.git)

## Install

Check [Latest Releases](https://github.com/Yukinooo7/Mathematics-subtitling-app/releases) page for recent version of packaged app for MacOS and Windows

Alternatively, you can use following steps to build app by yourself. You can find the generated apps in the `dist` directory.

- MacOS
  - build
    ```
    git clone https://github.com/Yukinooo7/Mathematics-subtitling-app.git
    cd Mathematics-subtitling-app
    npm install
    npm run make:macos
    ```

- Windows
  - build
    ```
    git clone https://github.com/Yukinooo7/Mathematics-subtitling-app.git
    cd Mathematics-subtitling-app
    npm install
    npm run make:win
    ```
- All Systems
  - build
    ```
    git clone https://github.com/Yukinooo7/Mathematics-subtitling-app.git
    cd Mathematics-subtitling-app
    npm install
    npm run dist
    ```

## Environment Requirement

* This app will use Python (version >= 3.6) to process texts and generate Html files and a Python library called `Jinja` is required. Without this library, the app cannot generate Html file but other functions are fine.
* Windows
  * Please make sure the default Python has `Jinja` library
  * `pip install Jinja2` to install `Jinja` library
  * Or you can select the Python version through the app: go to `Setting` to set Python Path
* Mac OS
  * Please select the Python version in the app. Go to `Setting` to set Python Path.
  * MacOS apps use another Python which is not same as the default using one so please make sure you select the Python that contains `Jinja` library.