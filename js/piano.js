
let volumeControl = document.querySelector('input[name="volume"]');
let frequencyControl = document.querySelector('input[name="frequency"]');

let audioContext = new (window.AudioContext || window.webkitAudioContext)();
let gainNode = audioContext.createGain();
gainNode.connect(audioContext.destination);

setup();

function setup() {
    gainNode.gain.value = 0.05;

    volumeControl.addEventListener("change", function (e) {
        gainNode.gain.value = +e.target.value;
    }, false);

    frequencyControl.addEventListener("change", function (e) {
        const minValue = 40;
        const maxValue = audioContext.sampleRate / 2;
        // Logarithm (base 2) to compute how many octaves fall in the range.
        const numberOfOctaves = Math.log(maxValue / minValue) / Math.LN2;
        // Compute a multiplier from 0 to 1 based on an exponential scale.
        const multiplier = Math.pow(2, numberOfOctaves * (+e.target.value - 1.0));
        filter.frequency.value = maxValue * multiplier;
    }, false);
}

function createOscillator() {
    const osc = audioContext.createOscillator();
    osc.type = getWave();
    osc.connect(gainNode);

    return osc;
}

function getWave() {
    const wavesElement = document.getElementById("waves");
    const checkedWaveElement = wavesElement.querySelector("input[name=wave]:checked");

    return checkedWaveElement ? checkedWaveElement.value : "square";
}

let oscillator = null;

const keyboardSet = document.getElementById("keyboard-set");
keyboardSet.addEventListener("mousedown", function (e) {
    e.stopPropagation();

    const freq = +e.target.dataset.frequency;

    oscillator = createOscillator();
    oscillator.frequency.value = freq;
    oscillator.start();
}, false);

keyboardSet.addEventListener("mouseup", function (e) {
    e.stopPropagation();

    oscillator.stop();
}, false);