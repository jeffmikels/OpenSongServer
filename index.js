// THIS APP RESPONDS TO AND BROADCASTS KIDOPOLIS CHECKINS
// SET UP THE BASIC NODE APP WITH SOCKET SUPPORT
const fs = require("fs"),
	util = require("util"),
	url = require("url");

// , qs = require('querystring')
const config = require('./config.js');
const stat = util.promisify(fs.stat);
const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);

const WebSocket = require("ws");

// remember the trailing slash here
const openSongDir = config.openSongDir;
const serverBasePath = config.serverBasePath;

// SET UP LOGGING TO CONSOLE AND ALSO TO FILE
const log_file = fs.createWriteStream(__dirname + "/debug.log", { flags: "a" });
const log_stdout = process.stdout;


// OVERLOAD THE Log FUNCTION WITH OUR CUSTOM ONE
Log = function (d) {
	var now = new Date();
	var s = now.toISOString() + ": " + util.format(d) + "\n";
	log_file.write(s);
	log_stdout.write(s);
};

// GLOBAL SETTINGS & CONFIGURATION DATA
var LISTEN_PORT = 8083;

// SETTING UP GLOBAL VARIABLES AND APP PROPERTIES
var app = require("http").createServer(handler);

/* START THE NATIVE WEBSOCKET SERVER */
var ws_connections = [];
var ws_channels = {};
const wss = new WebSocket.Server({
	server: app,
	clientTracking: true,
});

// send keepalive pings
const interval = setInterval(function ws_ping() {
	wss.clients.forEach(function each(ws) {
		if (ws.isAlive === false) return ws.terminate();
		ws.isAlive = false;
		ws.ping(noop);
	});
}, 30000);

// setup real wss listeners
wss.on("connection", function connection(ws) {
	ws.isAlive = true;
	ws.isWS = true;
	ws.subscription = "";
	ws.on("pong", heartbeat);

	ws_connections.push(ws);
	ws.on("message", function incoming(raw_message) {
		// to simulate socket.io
		// each "data" will be a JSON encoded dictionary
		// like this:
		// {'message': [string message], 'data': [submitted data]}
		Log("received: message");
		Log(raw_message);

		var json = JSON.parse(raw_message);
		var message = json.message;
		var data = json.data;

		if (message == "text") {
			broadcast("text", data);
		}
	});
});

/* INITIALIZE AND START THE SOCKET.IO LISTENER */
Log("---------- SERVER STARTING --------------");
Log(":: " + Date());
Log(`:: localhost:${LISTEN_PORT}`);
Log("-----------------------------------------");

// START THE LISTENER
app.listen(LISTEN_PORT);

/* FUNCTION DECLARATIONS */
// serve static files from this directory
function handler(req, res) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Credentials", "true");

	let urldata = url.parse(req.url, true);
	// Log('QUERY: ' + JSON.stringify(query));


	// remove leading slash
	let path = urldata.pathname;
	path = path.replace(/^\//, '');

	// remove trailing slash
	path = decodeURI(path.replace(/\/$/, ""));
	Log(path);

	// default html
	if (path == '') path = 'index.html';

	// allow only specific html files
	if (path.match(/(index|viewer|editor)\.html$/)) {
		Log(`sending ${path}`);
		fs.readFile(__dirname + "/" + path, { encoding: "utf-8" }, function (err, data) {
			if (err) {
				res.writeHead(404);
				return res.end(JSON.stringify(err));
			}

			res.writeHead(200);
			return res.end(data);
		});
		return;
	}

	// ignore all directories but Sets and Songs and "static"
	if (!path.match(/Sets|Songs|static/)) {
		res.writeHead(403);
		return res.end("SETS AND SONGS ARE THE ONLY ALLOWED DIRECTORIES");
	}

	if (path.match(/static\/.*\.js/)) {
		console.log("attempting to serve a static js file");
		console.log(path);
		let fstream = fs.createReadStream(path);
		res.statusCode = "200";
		res.setHeader("Content-Type", "text/javascript");
		fstream.pipe(res);
		return;
	}

	// is this click.wav
	if (path.match(/static\/click\.wav/)) {
		let fstream = fs.createReadStream("static/click.wav");
		res.statusCode = "200";
		res.setHeader("Content-Type", "audio/wav");
		fstream.pipe(res);
		return;
	}

	// is this an opensong directory?
	let localpath = openSongDir + path;
	fs.stat(localpath, (err, st) => {
		if (err) {
			res.writeHead(404);
			return res.end();
		}

		if (st.isDirectory()) {
			Log("found directory");
			try {
				data = walkDir(path);
				res.writeHead(200);
				return res.end(JSON.stringify(data));
			} catch (e) {
				res.writeHead(500);
				// return res.end(JSON.stringify(e));
				return res.end();
			}

			// readdir(localpath).then((items)=>{
			// 	Log('reading directory');
			// 	let retval = {path, dirs:[],files:[]};
			//
			// 	// filter files
			// 	for (item of items) {
			// 		Log(item);
			// 		if (item.match(/\.+/)) continue;
			// 		Log(item);
			// 		let i = fs.statSync(localpath + '/' + item);
			// 		if (i.isDirectory()) retval.dirs.push(item);
			// 		if (i.isFile()) retval.files.push(item);
			// 	}
			//
			// 	Log(retval);
			// 	res.writeHead(200);
			// 	return res.end(JSON.stringify(retval));
			// }).catch((err)=>{
			// 	res.writeHead(404);
			// 	return res.end(JSON.stringify(err));
			// });
		} else if (st.isFile()) {
			retval = {};
			if (path.match(/Sets/)) data = loadSet(path);
			else if (path.match(/Songs/)) data = loadSong(path);
			else {
				res.writeHead(403);
				return res.end('{"err":"not allowed"}');
			}
			res.writeHead(200);
			return res.end(JSON.stringify(data));
		} else {
			Log("nothing");
			res.writeHead(404);
			// return res.end(JSON.stringify(err));
			return res.end();
		}
	});
}

function walkDir(root) {
	let retval = { root, dirs: [], files: [] };
	let localroot = openSongDir + root;
	Log(localroot);
	let st = fs.statSync(localroot);
	let items = fs.readdirSync(localroot);
	for (let item of items) {
		if (item.match(/^\./)) continue;

		let p = root + "/" + item;
		Log(p);
		let itemstat = fs.statSync(openSongDir + "/" + p);
		if (itemstat.isDirectory()) {
			let data = walkDir(p);
			retval.dirs.push(data);
		} else if (itemstat.isFile()) {
			retval.files.push({
				name: item,
				time: itemstat.mtime.getTime(),
			});
		}
	}
	return retval;
}

function getTagContent(xml, tag) {
	let re = new RegExp("<" + tag + ">(.*?)</" + tag + ">", "s"); //dotAll
	let res = xml.match(re);
	if (res) return res[1];
	return "";
}

// return possible keys for each chord
function keySemitonesFromChord(chord_semi, color) {
	if (color == "minor") {
		// minor chords might be the third, second, or sixth of the scale
		return [(chord_semi + 3) % 12, (chord_semi + 12 - 2) % 12, (chord_semi + 12 - 4) % 12];
	} else if (color == "maj7") {
		// major7 chords are usually the 6m with a 4 added
		// so they usually function as the fourth of the scale
		// but they are also in the scale of the 6m
		// since we don't report minor keys, for now, we just guess the 4
		return [(chord_semi + 12 - 5) % 12];
	} else {
		// major chords are usually the 1, 4, 5 of the scale
		return [chord_semi % 12, (chord_semi + 12 - 5) % 12, (chord_semi + 12 - 7) % 12];
	}
}

function loadSong(path) {
	let fullPath = openSongDir + path;
	let chordletters = "A A# B C C# D D# E F F# G G# A Bb B C Db D Eb E F Gb G Ab".split(" ");
	let real_key_map = [12, 13, 14, 15, 16, 17, 18, 19, 20, 9, 22, 23];
	// make sure looping around works
	chordletters.concat(chordletters);
	let song = {};
	try {
		let xmldata = fs.readFileSync(fullPath, { encoding: "utf-8" });
		xmldata = xmldata.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
		song.path = path;
		song.title = getTagContent(xmldata, "title");
		song.author = getTagContent(xmldata, "author");
		song.ccli = getTagContent(xmldata, "ccli");
		song.copyright = getTagContent(xmldata, "copyright");
		song.key = getTagContent(xmldata, "key");
		song.presentation = getTagContent(xmldata, "presentation");
		song.tempo = getTagContent(xmldata, "tempo");
		song.lyrics = getTagContent(xmldata, "lyrics");

		// sometimes, we use multiple lines for the printed
		// version of the lyrics, but we don't need them for display
		song.lyrics = song.lyrics.replace(/\n(\s*\n)+/g, "\n\n");

		song.transpose = getTagContent(xmldata, "capo");
		song.abc = "";

		// set up ABC notation regex
		// abc is assumed to take up the entire end of the document
		let abc = /%abc(.*)/gis;
		let abcmatch = abc.exec(song.lyrics);
		if (abcmatch) {
			// clean up initial characters that might be added by opensong
			song.abc = abcmatch[1].replace(/(\n|^)[;\s.]/g, "$1");
			song.lyrics = song.lyrics.replace(abcmatch[0], "");
		}

		// if song has no bpm specified in the file, compute it now
		if (!song.bpm) {
			Log(`Computing BPM for ${song.title}`);
			// Log(song.lyrics)
			let re = new RegExp(/;\s*(\d+)\s*BPM|;\s*BPM:?\s*(\d+)/gim);
			let match = re.exec(song.lyrics);
			if (match) {
				// Log(match);
				if (match[1]) song.bpm = parseInt(match[1]);
				else if (match[2]) song.bpm = parseInt(match[2]);
				Log(`BPM: ${song.bpm}`);
			} else {
				Log("No bpm information found");
			}
		}

		// if song has no key specified in the file, compute it now
		if (!song.key) {
			Log(`Computing Key for ${song.title}`);
			let possible = [];
			let seen = [];
			// to compute the key:
			// for the first chord, compute the possible keys
			// for each subsequent chord, remove impossible keys until one remains

			keySearch: for (let line of song.lyrics.split("\n")) {
				if (line.substring(0, 1) == ".") {
					// Log(line);
					// let cs = /[^\/\.](([ABCDEFG][b#]?)(m(?!a))?[^\s\/]*)/g;
					// ignore bass chords (immediately following a slash)
					let cs = /[^\/](([ABCDEFG][b#]?)(maj7|Maj7|M7|m)?[^\s\/]*)/g;
					let m;
					while (1) {
						m = cs.exec(line);
						if (m) {
							let cname = m[1];
							if (seen.indexOf(cname) >= 0) continue;
							seen.push(cname);
							let cletter = m[2];
							let color = m[3];
							color = color ? color : "major";
							if (color == "Maj7" || color == "M7") color = "maj7";
							if (color == "m") color = "minor";

							Log(`Found Chord: ${cname} => ${cletter} (${color})`);
							let cindex = chordletters.indexOf(cletter);
							if (cindex >= 0) {
								// is this the first chord we have seen?
								if (possible.length == 0) {
									possible = keySemitonesFromChord(cindex, color);
									let pos_string = possible.map((e) => chordletters[e]);
									Log(`${cname} => ${pos_string}`);
									continue;
								} else {
									new_possible = keySemitonesFromChord(cindex, color);
									possible = possible.filter((e) => new_possible.indexOf(e) != -1);
									let pos_string = possible.map((e) => chordletters[e]);
									Log(`${cname} => ${pos_string}`);
									if (possible.length == 1) {
										break keySearch;
									}
								}
							}
						} else {
							break;
						}
					}
				}
			}

			if (possible.length > 0) {
				// only use flat key signatures except for F#
				let real_key_index = possible[0] + 12;
				if (real_key_index == 9 + 12) real_key_index = 9; // CHANGE Gb to F#
				song.key = chordletters[real_key_index];
				if (possible.length == 1) Log(`Determined Key Is: ${song.key}`);
				else Log(`Guessed Key Is: ${song.key}`);
			} else {
				Log("Key could not be determined.");
			}
		}
		return song;
	} catch (e) {
		// Log(e);
		Log(`error opening file: ${fullPath}`);
		return null;
	}
}

function loadSet(path) {
	let localroot = openSongDir + path;
	try {
		let xmldata = fs.readFileSync(localroot, { encoding: "utf-8" });
		Log(xmldata);
		let setData = { songs: [] };
		setData.path = path;

		// get set name
		let t = xmldata.match(/<set name="(.*?)".*?>/);
		setData.name = t ? t[1] : path;

		// get set songs
		let matches = xmldata.match(/<slide_group .*?\/>/g);
		for (let slide_group of matches) {
			let name = "";
			let presentation = "";
			let type = "";
			let path = "";
			let t = slide_group.match(/name="(.*?)"/);
			if (t) name = t[1];

			t = slide_group.match(/presentation="(.*?)"/);
			if (t) presentation = t[1];

			t = slide_group.match(/type="(.*?)"/);
			if (t) type = t[1];
			if (type != "song") continue;

			t = slide_group.match(/path="(.*?)"/);
			if (t) {
				path = "Songs/" + t[1] + "/" + name;
				path = path.replace(/\/\//, "/"); // replace double slashes
				let newsong = loadSong(path);
				if (newsong == null) {
					newsong = {
						path: path,
						title: name,
						lyrics: `;FILE NOT FOUND ON SERVER:\n;"${path}"`,
					};
				}
				if (presentation != "") newsong.presentation = presentation;
				setData.songs.push(newsong);
			}
		}
		return setData;
	} catch (e) {
		Log(e);
		Log("error");
	}
}

function ping() {
	// backend has been updated and we have received a ping
	Log('sending "myping" message');
	io.sockets.emit("myping", Date.now());
	socket_send("myping", Date.now());
	maybe_refresh();
}

// native websocket functions
function ws_send(conn, msg, data) {
	try {
		var message = { message: msg, data: data };
		message = JSON.stringify(message);
		if (conn.readyState === WebSocket.OPEN && conn.isAlive) conn.send(message);
	} catch (e) {
		Log("sending socket failed: message attempted was as follows");
		Log(msg);
	}
}

function broadcast(message, data) {
	wss.clients.forEach(function (client) {
		ws_send(client, message, data);
	});
}

function noop() {}

function heartbeat() {
	this.isAlive = true;
}
