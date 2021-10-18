const { BaseTick } = require("./baseTick");


class BpmData {
    constructor() {
        this.tempo = '';
        this._clock = 0;
        this.integerPoint = '';
        this.decimalPoint = '';
        this.deff = new BaseTick();
    }

    get clock() {
        let intClock = parseInt(parseFloat(this._clock));
        return `${intClock}`;
    }

    set clock(value) {
        if (value !== 0){
            value -= this.deff.preludeTick;
        }

        let cevioTick = (parseInt(value) / this.deff.vocaloidTimeResolution) * this.deff.cevioTimeResolution;
        this._clock = cevioTick > 0 ? cevioTick + this.deff.cevioStartTick : cevioTick;
    }
}

exports.BpmData = BpmData;