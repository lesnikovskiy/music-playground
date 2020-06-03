
let volumeControl = document.querySelector('input[name="volume"]');
let frequencyControl = document.querySelector('input[name="frequency"]');
let filterTypeControl = document.querySelector('select[name="filterType"]');

let audioContext = new (window.AudioContext || window.webkitAudioContext)();
let gainNode = audioContext.createGain();
let biquadFilter = audioContext.createBiquadFilter();

biquadFilter.connect(gainNode);
gainNode.connect(audioContext.destination);
gainNode.gain.value = volumeControl.value;

setup();

function setup() {
    volumeControl.addEventListener("change", function (e) {
        gainNode.gain.value = +e.target.value;
    }, false);
}

function createOscillator() {
    const osc = audioContext.createOscillator();
    osc.type = getWave();

    if (document.getElementById("biquad-filter-checkbox").checked) {
        biquadFilter.frequency.value = getFrequency(frequencyControl.value);
        biquadFilter.type = filterTypeControl.options[filterTypeControl.selectedIndex].value;
        osc.connect(biquadFilter);
    } else {
        osc.connect(gainNode);
    }

    return osc;
}

function getWave() {
    const wavesElement = document.getElementById("waves");
    const checkedWaveElement = wavesElement.querySelector("input[name=wave]:checked");

    return checkedWaveElement ? checkedWaveElement.value : "square";
}

function getFrequency(value) {
    const minValue = 40;
    const maxValue = audioContext.sampleRate / 2;
    // Logarithm (base 2) to compute how many octaves fall in the range.
    const numberOfOctaves = Math.log(maxValue / minValue) / Math.LN2;
    // Compute a multiplier from 0 to 1 based on an exponential scale.
    const multiplier = Math.pow(2, numberOfOctaves * (+value - 1.0));

    return maxValue * multiplier;
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
    oscillator = null;
}, false);