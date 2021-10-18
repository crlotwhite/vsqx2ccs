class TrackManager {
    constructor() {
        this.tracks = new Array();
        this.length = 0;
    }

    findTrack(trackNumber) {
        for (let idx in this.tracks) {
            if (this.tracks[idx].trackNumber == `${trackNumber}`) {
                return this.tracks[idx];
            }
        }
        return null;
    }

    add(item) {
        this.tracks.push(item);
        this.length += 1;
    }
}

exports.TrackManager = TrackManager;