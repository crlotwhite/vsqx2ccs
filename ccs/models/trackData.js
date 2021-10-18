const { v4: uuidv4 } = require('uuid');


class TrackData {
    constructor() {
        this.trackName = '';
        this.note = new Array();
        this._trackNumber = 0;

        // track status
        this.mute = 0;
        this.solo = 0;
        this.volume = 0;

        // GUID for track and mixer identification
        this.guidValue = uuidv4();
    }

    get trackGuid() {
        return `${this.guidValue}`;
    }

    get trackNumber() {
        return this._trackNumber;
    }

    set trackNumber(value) {
        this._trackNumber = parseInt(value);
    }
}

exports.TrackData = TrackData;