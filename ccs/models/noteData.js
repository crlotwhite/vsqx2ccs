const { BaseTick } = require("./baseTick");


class NoteData {
    constructor() {
        // note range
        this.__noteCountMax = 127;
        this.__noteCountMin = 0;
        this.__dodecaphonism = 12;

        this.deff = new BaseTick();

        // note lyric
        this._noteNumber = this.deff.centerNoteNumber;
        this.lyric = 'a';

        // note start position and duration
        this.position1 = 0;
        this.position2 = 1;
        this.beginPosition = '0';
        this.duration = `${this.deff.cevioTimeResolution}`;
        this._playTime = 0;

        // cevio note count
        this._pitchStep = 5;
        this._pitchOctave = 0;
    }

    setTick(_noteNumber) {
        // Set the scale in CeVIO from the note number
        let noteNumber = parseInt(_noteNumber);
        if (noteNumber > this.__noteCountMax) {
            this.noteNumber = this.__noteCountMax;
        }

        if (noteNumber < this.__noteCountMin) {
            this.noteNumber = this.__noteCountMin;
        }

        // Scale adjustment
        this._pitchOctave = noteNumber / this.__dodecaphonism + this.deff.shiftOctave
        this._pitchStep = noteNumber % this.__dodecaphonism
    }

    get playTime() {
        let h = parseInt(this._playTime / 3600);
        let m = parseInt((this._playTime % 3600) / 60);
        let s = parseInt((this._playTime % 3600) % 60);
        return `${h}:${m}:${s}`;
    }

    get clock() {
        return `${parseInt(parseFloat(this.beginPosition))}`;
    }

    get pitchOctave() {
        return `${parseInt(this._pitchOctave)}`;
    }

    get pitchStep() {
        return `${this._pitchStep}`;
    }

    get noteNumber() {
        return this._noteNumber;
    }

    set noteNumber(value) {
        this._noteNumber = value;
        this.setTick(value);
    }

    set playTime(value) {
        this._playTime = value;
    }

    setBeginTick(vsqxBegin) {
        // Doubled for processing by CeVIO + start value
        this.position1 = (parseInt(vsqxBegin) / this.deff.vocaloidTimeResolution) * this.deff.cevioTimeResolution + this.deff.cevioStartTick;
        this.beginPosition = `${this.position1}`;
    }

    setDuration(vsqxDuration) {
        // Corrected for processing with CeVIO
        this.position2 = parseInt(vsqxDuration) * this.deff.difference;
        this.duration = `${parseInt(this.position2)}`;
    }
}

exports.NoteData = NoteData;