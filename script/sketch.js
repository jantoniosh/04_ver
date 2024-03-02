let div, n;
let up;
let time;
let ancho_linea;
let osc;
let playing;

let delay = new Tone.FeedbackDelay(0.5).connect(Tone.Master);
let reverb = new Tone.JCReverb(0.01).connect(Tone.Master);
let crusher = new Tone.BitCrusher(6).toMaster();
let tremolo = new Tone.Tremolo(9, 0.75).toMaster();
let pitch = new Tone.PitchShift(-6).toMaster();
let vol = new Tone.Volume(-100).toMaster();
let mic, fft;

function setup() {
    // 864
    createCanvas(864, 864);
    ancho_linea = 2;
    n = 3;
    div = width / (n * 2);
    mic = new p5.AudioIn();
    mic.start();
    fft = new p5.FFT(0, 32);
    fft.setInput(mic);
    playing = 0;
}

// osc = new Tone.Oscillator(200, "sine").connect(delay).toMaster().start();
// osc.toMaster();

let synthA = new Tone.Synth({
    oscillator: {
        type: 'triangle7',
        modulationType: 'sine',
        modulationIndex: 3,
        harmonicity: 3.4
    },
    envelope: {
        attack: 0.001,
        decay: 0.1,
        sustain: 0.1,
        release: 0.1
    }

}).connect(delay).toMaster();

let synthApattern = new Tone.Pattern(function (time, note) {
    synthA.triggerAttackRelease(note, time);
}, ["C2", "D2", "E3", "G3", "A4"], "alternateDown");
synthApattern.humanize = true;

let synthB = new Tone.Synth({
    oscillator: {
        type: 'triangle8'
    },
    envelope: {
        attack: 2,
        decay: 1,
        sustain: 0.4,
        release: 4
    }


}).connect(delay).toMaster();


let synthBpattern = new Tone.Pattern(function (time, note) {
    synthB.triggerAttackRelease(note, time);
}, ["C2", "D2", "E3", "G3", "A4"], "alternateUp");
synthBpattern.humanize = true;

let synthC = new Tone.PolySynth(4, Tone.Synth).connect(crusher).toMaster();
synthC.set({
    "filter": {
        "type": "lowpass"
    },
    "envelope": {
        "attack": 0.25
    }
});

//Mary Kate's progression
//Em C G D
let e_chord = ["E3", "G3", "C2"];
let C_chord = ["C3", "E3", "G3"];
let G_chord = ["G3", "E3", "D3"];
let D_chord = ["D3", "G3", "E3"];

let pianoPart = new Tone.Pattern(function (time, note) {
    synthC.triggerAttackRelease(note, "8n", time);
}, [
    ["0:0", e_chord],
    ["0:05", C_chord],
    ["0:1", G_chord],
    ["0:2", D_chord]
])

function draw() {
    let spectrum = fft.analyze();
    // }
    let r = map(spectrum[0], 0, 255, 200, 255);
    background(255, 105, 97);
    noFill();
    strokeWeight(3);
    let n_c = 8;
    let sp = width / n_c;
    for (let i = 0; i < n_c; i++) {
        let s = map(spectrum[i], 0, 255, sp * i, sp * (i + 1));
        ellipse(width / 2, height / 2, s, s);
    }
}

function mouseClicked() {
    if (playing == 1) {
        Tone.Transport.start();
        synthApattern.start();
    }
    else {
        Tone.Transport.stop();
        synthBpattern.stop();
    }
    console.log(playing);
    playing = playing + 1;
    if (playing >= 2) {
        playing = 0;
    }
}
