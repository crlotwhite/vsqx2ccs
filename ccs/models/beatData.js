const { BaseTick } = require("./baseTick");


class BeatData {
    constructor() {
        this.denominator = '';
        this.numerator = '';
        this._rhythmChangePoint = 0;
        this.deff = new BaseTick();
    }

    get rhythmChangePoint() {
        return `${this._rhythmChangePoint}`;
    }

    set rhythmChangePoint(value) {
        if (value >= this.deff.preludeMeasure){
            value -= this.deff.preludeMeasure
        }
        // Reflects that the measure is four quarter notes.
        let cevioTick = parseInt(value) * 4 * this.deff.cevioTimeResolution;

        // Exception handling for tempo corresponding to vocaloid 0 tick
        if (cevioTick === 0){
            this._rhythmChangePoint = cevioTick;
        } else {
            this._rhythmChangePoint = cevioTick + this.deff.cevioStartTick;
        }

    }
}

exports.BeatData = BeatData;