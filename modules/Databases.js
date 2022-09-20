const fs = require('node:fs');
const json = require('format-json');

class Databases {

	constructor(client) {
		this.client = client;
		this.built = false;
		this.tracklist = {};
		this.playlists = {};
	}

	build() {
		if (this.built) return this;

		this.tracklist = this.loadDbOnStart('tracklist', './databases/tracklist.json');
		this.playlists = this.loadDbOnStart('playlists', './databases/playlists.json');

		this.built = true;
		return this;
	}

	loadDbOnStart(type, filePath) {
		let Database = {};
		try {
			Database = JSON.parse(fs.readFileSync(filePath, 'utf8'));
		}
		catch (error) {
			Database = {};
			this.client.logger.error('[Databases]loadDbOnStart', `Nie udało się wczytać bazy ${type}!\n${error}`);
		}
		this.client.logger.log('[Databases]loadDbOnStart', `Wczytano bazę ${type}!`);
		return Database;
	}

	SaveDb(Database, type) {
		let filePath = '';
		if (!Database) {
			this.client.logger.error('[Databases]SaveDb', `Problem z zapisem bazy ${type}, baza jest pusta!`);
			return false;
		}
		switch (type) {
		case 'tracklist':
			this.tracklist = Database;
			filePath = './databases/tracklist.json';
			break;
		case 'playlists':
			this.playlist = Database;
			filePath = './databases/playlists.json';
			break;
		default:
			return;
		}

		try {
			fs.writeFile(filePath, json.plain(Database));
		}
		catch (error) {
			this.client.logger.error('[Databases]SaveDb', `Problem z zapisem bazy ${type}!\n${error}`);
			return false;
		}
		return true;
	}

	addTracktoTracklist(tracks) {
		let howMany = 0;
		for (const track of tracks) {
			if (this.tracklist.tracks.indexOf(track.info.uri) === -1 && track.info.length > 120000 && track.info.length < 480000) {
				this.tracklist.tracks.push(track.info.uri);
				howMany++;
			}
		}
		if (howMany === 0) return;
		this.client.logger.info('[Databases]addTracktoTracklist', `Added ${howMany} tracks to tracklist!`);
		this.SaveDb(this.tracklist, 'tracklist');
	}

	removeTrackfromTracklist(track) {
		this.tracklist.tracks = remove_item(this.tracklist.tracks, track.info.uri);
		this.client.logger.info('[Databases]removeTrackfromTracklist', `Removed "${track.info.title}" from tracklist!`);
		this.SaveDb(this.tracklist, 'tracklist');
	}
}
module.exports = Databases;