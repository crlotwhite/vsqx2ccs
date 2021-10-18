const {BaseTick} = require("./models/baseTick");
const {json2xml} = require("xml-js");


exports.toCCS = (resultData) => {
    let tracks = resultData.tracks;
    let beats = resultData.beats;
    let bpms = resultData.bpms;

    // create ccs file
    let deff = new BaseTick();
    let ccs = {
        _declaration: {
            _attributes: {
                version: "1.0",
                encoding: "utf-8"
            }
        },
        Scenario: {
            _attributes: {
                Code: deff.ccsCode
            },
            Sequence: {
                _attributes: {
                    Id: ""
                },
                Scene: {
                    _attributes: {
                        Id: ""
                    },
                    Units: {
                        Unit: []
                    },
                    Groups: {
                        Group: []
                    },
                    SoundSetting: {
                        _attributes: {
                            Rhythm: "4/4",
                            Tempo: "78",
                            MasterVolume: "0"
                        }
                    }
                }
            }
        }
    }

    // create unit(track)
    for (let i = 0; i < tracks.length; i++) {
        let currentTrack = tracks.findTrack(i);
        let unit = {
            _attributes: {
                Version: "1.0",
                Id: "1.0",
                Category: "SingerSong",
                Group: currentTrack.trackGuid,
                StartTime: "00:00:00",
                Duration: "10:00:00"
            },
            Song: {
                _attributes: {
                    Version: "1.07"
                },
                Tempo: {
                    Sound: [
                        // {
                        //     _attributes: {
                        //         Clock: "0",
                        //         Tempo: "120"
                        //     }
                        // }
                    ]
                },
                Beat: {
                    Time: []
                },
                Score: {
                    Key: {
                        _attributes: {
                            Clock: "0",
                            Fifths: "0",
                            Mode: "0"
                        }
                    },
                    Note: []
                }
            }
        }

        // add tempo data
        for (let i in bpms) {
            let currentBpm = bpms[i];
            let soundObj = {
                _attributes: {
                    Clock: currentBpm.clock,
                    Tempo: currentBpm.integerPoint
                }
            };

            unit.Song.Tempo.Sound.push(soundObj);
        }

        // add beat data
        for (let i in beats) {
            let currentBeat = beats[i];
            let timeObj = {
                _attributes: {
                    Clock: currentBeat.rhythmChangePoint,
                    Beats: currentBeat.numerator,
                    BeatType: currentBeat.denominator
                }
            };

            unit.Song.Beat.Time.push(timeObj);
        }

        for (let i in currentTrack.note) {
            let currentNote = currentTrack.note[i];
            let noteObj = {
                _attributes: {
                    Clock: currentNote.clock,
                    PitchStep: currentNote.pitchStep,
                    PitchOctave: currentNote.pitchOctave,
                    Duration: currentNote.duration,
                    Lyric: currentNote.lyric,
                }
            };

            unit.Song.Score.Note.push(noteObj);
        }

        ccs.Scenario.Sequence.Scene.Units.Unit.push(unit);

        // add group
        let groupObj = {
            _attributes: {
                Version: "1.0",
                Id: currentTrack.trackGuid,
                Category: "SingerSong",
                Name: currentTrack.name,
                Color: "#FFFF0000",
                Volume: "0",
                Pan: "0",
                IsSolo: `${currentTrack.solo}`,
                IsMuted: `${currentTrack.mute}`
            }
        };
        ccs.Scenario.Sequence.Scene.Groups.Group.push(groupObj);
    }




    // test data
    let jsonCCS = JSON.stringify(ccs);
    console.log(jsonCCS);

    console.log("\n");

    let xml = json2xml(jsonCCS, {compact: true, ignoreComment: true, spaces: 4});

    return xml;
};
