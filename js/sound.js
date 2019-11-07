var context;
var bufferLoader;
var gainNode;
var filter;

var sources = [];

var filterSample = {
    FREQ_MUL: 7000,
    QUAL_MUL: 30
}

window.addEventListener('load', init, false);

function init() {
    try {
        context = new (window.AudioContext || window.webkitAudioContext)();

        gainNode = context.createGain();
        filter = context.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 5000;

        bufferLoader = new BufferLoader(context, ['outfoxing.mp3'], finishedLoading);
    } catch (e) {
        alert('Web Audio API is not supported in this browser')
    }
}

document.querySelector('button[data-playing]').addEventListener('click', function() {
    if (this.dataset.playing === 'false') {
        bufferLoader.load();
        this.dataset.playing = 'true';
    } else {
        this.dataset.playing = 'false';
        for (var i = 0; i < sources.length; i++) {
            sources[i].stop();
        }
    }
}, false);

document.querySelector('[data-filter-type]').addEventListener('change', function(e) {
    filter.type = e.target.value;
}, false);

document.querySelector('[data-volume]').addEventListener('input', function(e) {
    var volume = +e.target.value;
    var fraction = volume / +e.target.max;
    gainNode.gain.value = fraction * fraction;
}, false);

document.querySelector('[data-filter-frequency]').addEventListener('input', function(e) {
    var minValue = 40;
    var maxValue = context.sampleRate / 2;
    // Logarithm (base 2) to compute how many octaves fall in the range.
    var numberOfOctaves = Math.log(maxValue / minValue) / Math.LN2;
    // Compute a multiplier from 0 to 1 based on an exponential scale.
    var multiplier = Math.pow(2, numberOfOctaves * (+e.target.value - 1.0));
    filter.frequency.value = maxValue * multiplier;
}, false);

document.querySelector('[data-filter-quality]').addEventListener('input', function(e) {
    filter.Q.value = +e.target.value * filterSample.QUAL_MUL;
}, false);

function finishedLoading(bufferList) {
    var source = context.createBufferSource();
    sources.push(source);

    source.buffer = bufferList[0];

    source.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(context.destination);

    source.start(0);
}

function BufferLoader(context, urlList, callback) {
    this.context = context;
    this.urlList = urlList;
    this.onload = callback;
    this.bufferList = [];
    this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

    var loader = this;

    request.onload = function() {
        loader.context.decodeAudioData(request.response, function(buffer) {
            if (!buffer) {
                alert('error decoding file data: ' + url);
                return;
            }

            loader.bufferList[index] = buffer;
            if (++loader.loadCount === loader.urlList.length) {
                loader.onload(loader.bufferList);
            }
        }, function(error) {
            console.error('decodeAudioData error', error);
        });
    };

    request.onerror = function() {
        alert('BufferLoader: XHR error');
    };

    request.send();
};

BufferLoader.prototype.load = function() {
    for (var i = 0; i < this.urlList.length; i++) {
        this.loadBuffer(this.urlList[i], i);
    }
};
