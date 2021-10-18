class BaseTick {
    constructor() {
        this.vocaloidTimeResolution = 480;
        this.cevioTimeResolution = 960;
        this.cevioStartTick = 3840;
        this.shiftOctave = -1;
        this.centerNoteNumber = 64;
        this.ccsCode = '7251BC4B6168E7B2992FA620BD3E1E77';
        this.preludeMeasure = 4;
    }

    get difference() {
        // 4분 음표 길이 비율
        return this.cevioTimeResolution / this.vocaloidTimeResolution;
    }

    get preludeTick() {
        return 4 * this.vocaloidTimeResolution * this.preludeMeasure;
    }
}

exports.BaseTick = BaseTick;