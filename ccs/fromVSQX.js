const { TrackData } = require("./models/trackData");
const { BeatData } = require("./models/beatData");
const { BpmData } = require("./models/bpmData");
const { NoteData } = require("./models/noteData");
const { TrackManager } = require("./utils/trackManager");
const { romajiToHiragana } = require('hiragana-romaji-katakana');

const { v3 } = require('./tagDictionary/v3');
const { v4 } = require('./tagDictionary/v4');
const {BaseTick} = require("./models/baseTick");


exports.fromVSQX = (vsqxJson, isHiragana) => {
    console.log("start from vsqx");

    // get BaseTick for prelude measure
    // if it is not default, change here
    let baseTick = new BaseTick();

    // Base Data Containers
    let tracks = new TrackManager();
    let beats = [];
    let bpms = [];

    // get tag dictionary
    let tagDictionary = null;
    if (vsqxJson.hasOwnProperty('vsq4')){
        tagDictionary = v4;
    } else if (vsqxJson.hasOwnProperty('vsq3')) {
        tagDictionary = v3;
    } else {
        // 지원하지 않는 파일 예외 출력하기
        return null;
    }

    // get root
    let root = vsqxJson[tagDictionary["root"]];


    // create track data
    let vsUnit = root[tagDictionary["mixer"]][tagDictionary["vs_unit"]];
    let createTrackData = (obj) => {
        let trackData = new TrackData();
        trackData.trackNumber = parseInt(obj[tagDictionary["vs_track_no"]]);
        trackData.mute = parseInt(obj[tagDictionary["mute"]]);
        trackData.solo = parseInt(obj[tagDictionary["solo"]]);
        tracks.add(trackData);
    };

    if (Array.isArray(vsUnit)){
        for (let i in vsUnit){
            let data = vsUnit[i];
            createTrackData(data);
        }
    } else {
        createTrackData(vsUnit);
    }

    // create beat data and tempo data
    let masterTrack = root[tagDictionary["master_track"]];
    baseTick.preludeMeasure = masterTrack[tagDictionary["prelude_measure"]];
    let timeSignal = masterTrack[tagDictionary["time_signal"]];
    let createBeatData = (obj) => {
        let beatData = new BeatData();
        beatData.rhythmChangePoint = obj[tagDictionary["pos_mes"]];
        beatData.denominator = obj[tagDictionary["denominator"]];
        beatData.numerator = obj[tagDictionary["numerator"]];
        beats.push(beatData);
    };

    if (Array.isArray(timeSignal)) {
        for (let i in timeSignal) {
            let data = timeSignal[i];
            createBeatData(data)
        }
    } else {
        createBeatData(timeSignal)
    }

    let tempo = masterTrack[tagDictionary["tempo"]];
    let createBpmData = (obj) => {
        let bpmData = new BpmData();
        bpmData.clock = obj[tagDictionary["position_tick"]];

        bpmString = `${obj[tagDictionary["bpm"]]}`;
        bpmData.tempo = bpmString;

        if (bpmString.length > 4) {
            bpmData.integerPoint = bpmString.substring(0, 3);
            bpmData.decimalPoint = bpmString.substring(3);
        } else {
            bpmData.integerPoint = bpmString.substring(0, 2);
            bpmData.decimalPoint = bpmString.substring(2);
        }
        bpms.push(bpmData);
    };

    if (Array.isArray(tempo)){
        for (let i in tempo) {
            let data = tempo[i];
            createBpmData(data);
        }
    } else {
        createBpmData(tempo);
    }

    // update track data and create note data
    let vsTrack = root[tagDictionary["vs_track"]];
    let processTrackAndNote = (obj, trackNumber) => {
        let processPartData = (obj) => {
            // empty track exception
            if (obj === undefined) {
                return;
            }

            let playTime = obj[tagDictionary["play_time"]];
            let partPosTick = obj[tagDictionary["position_tick"]] - baseTick.preludeTick;
            let note = obj[tagDictionary["note"]];

            let createNote = (obj) => {
                let noteData = new NoteData();
                noteData.playTime = playTime;
                noteData.setBeginTick(obj[tagDictionary["position_tick"]] + partPosTick);
                noteData.setDuration(obj[tagDictionary["duration_tick"]]);
                noteData.noteNumber = obj[tagDictionary["note_number"]];
                // 히라가나 변경 루틴 필요
                let lyric = obj[tagDictionary["lyric"]]["__cdata"];
                noteData.lyric = isHiragana ? romajiToHiragana(lyric) : lyric;
                noteArray.push(noteData);
            };

            if (Array.isArray(note)) {
                for (let i in note){
                    let data = note[i];
                    createNote(data);
                }
            } else {
                createNote(note);
            }


        };

        let noteArray = [];
        let vsPart = obj[tagDictionary["musical_part"]];
        if (Array.isArray(vsPart)){
            for (let i in vsPart) {
                let data = vsPart[i];
                processPartData(data);
            }
        } else {
            processPartData(vsPart);
        }

        let trackData = tracks.findTrack(trackNumber);
        trackData.trackName = obj[tagDictionary["track_name"]]["__cdata"];
        if (trackData.note.length > 0) {
            trackData.note.concat([...noteArray]);
        } else {
            trackData.note = [...noteArray];
        }
    };

    if (Array.isArray(vsTrack)) {
        for (let i in vsTrack) {
            let data = vsTrack[i];
            processTrackAndNote(data, i);
        }
    } else {
        processTrackAndNote(vsTrack, 0);
    }


    console.log("end of fromVSQX");

    return {
        tracks: tracks,
        beats: beats,
        bpms: bpms
    };

}
