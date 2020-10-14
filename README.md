# OpenSongServer

## Usage

```
$ git clone https://github.com/jeffmikels/OpenSongServer.git
$ cd OpenSongServer
$ npm i
$ cp config.js.example config.js
$ node watcher.js
```

Make sure to change the values in the config file to match your system.

## Configuration

-   `openSongDir`: should be the full path to your OpenSong Documents folder (The one with `Sets` and `Songs` in it.)
-   `serverBasePath`: only needs to be set if you are hosting behind a proxy server in a subdirectory.
