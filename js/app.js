const AudioContext = window.AudioContext || window.webkitAudioContext;

let audioContext;
let audioElement;
let track;

const onload = () => {
    audioContext = new AudioContext();

    audioElement = document.querySelector('audio');
    track = audioContext.createMediaElementSource(audioElement);
    
    track.connect(audioContext.destination);

    const playButton = document.querySelector('button');

    playButton.addEventListener('click', function() {
        debugger
        audioContext.resume().then(() => {
            if (this.dataset.playing === 'false') {
                audioElement.currentTime = 0;
                audioElement.play();
                this.dataset.playing = 'true';
            }
        
            if (this.dataset.playing === 'true') {
                audioElement.pause();
                audioElement.currentTime = 0;
                this.dataset.playing = 'false';
            }
        });
    }, false);

    audioElement.addEventListener('ended', () => {
        playButton.dataset.playing = 'false';
    }, false);
};

window.addEventListener("load", onload, false);
