// Eléments du DOM sur lesquels on va interagir
const player = document.getElementById('player');
const playBtn = document.getElementById('play');
const stopBtn = document.getElementById('stop');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const volUpBtn = document.getElementById('vol-up');
const volDownBtn = document.getElementById('vol-down');
const loopBtn = document.getElementById('loop');
const audio = document.getElementById('audio');
const title = document.getElementById('title');
const cover = document.getElementById('cover');
const progressContainer = document.getElementById('progress-container');
const progress = document.getElementById('progress');
const volContainer = document.getElementById('vol-container');
const volProgress = document.getElementById('vol-progress');

//Tous les titres présents dans le dossier
const songs = ['Coldplay - Viva La Vida', 'Daft Punk - Harder Better Faster Stronger', 'Foster the People - Pumped Up Kicks', 'Gorillaz - On Melancholy Hill', 'The Weeknd - Save Your Tears', 'Vitalic - Poison Lips', 'Vitalic - Waiting For The Stars'];

//Variables
let songIndex = 0;
let isStopped = true;
let isLooping = true;

//Volume
volProgress.style.width = `${audio.volume * 100}%`;
loopBtn.querySelector('i.fas').style.color = "#00FF00";

const currentSong = songs[songIndex];

//Chargement des détails des chansons
loadSong(currentSong);

//fonction loadSong (permet de récupérer les détails du son à jouer)
function loadSong(song) {
    title.innerText = song;
    audio.src = `music/${song}.mp3`;
    cover.src = `cover/${song}.jpeg`;
}

//Liste des évènements du DOM
audio.addEventListener('error', audioError);
audio.addEventListener('timeupdate', updateProgressBar);
audio.addEventListener('ended', playLoop);
playBtn.addEventListener('click', playPause);
stopBtn.addEventListener('click', stopSong);
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
volDownBtn.addEventListener('click', reduceSongVol);
volUpBtn.addEventListener('click', increaseSongVol);
progressContainer.addEventListener('click', setProgress);
volContainer.addEventListener('click', updateVol);
loopBtn.addEventListener('click', changeLoopState);

function changeClasses(e, c1, c2) {
    e.classList.remove(c1);
    e.classList.add(c2);
}

//fonction playSong (permet de jouer un son)
function playSong(song) {
    if(isStopped) {
        loadSong(song);
        cover.alt = song;
    }
    changeClasses(playBtn.querySelector('i.fas'), 'fa-play', 'fa-pause')
    playBtn.querySelector('i.fas').style.color = '#00ff00';
    document.getElementById('music-container').classList.remove('disabled-animation');
    changeClasses(player, 'stop', 'play');
    audio.play();
}

//Permet de mettre le son en pause
function pauseSong() {
    player.classList.remove('play');
    changeClasses(playBtn.querySelector('i.fas'), 'fa-pause', 'fa-play');
    playBtn.querySelector('i.fas').style.color = '#fff';
    document.getElementById('music-container').classList.add('disabled-animation');
    audio.pause();
}

//fonction stopSong (permet d'arrêter le son en cours de lecture)
function stopSong() {
    document.getElementById('music-container').classList.add('disabled-animation');
    changeClasses(playBtn.querySelector('i.fas'), 'fa-pause', 'fa-play');
    playBtn.querySelector('i.fas').style.color = '#fff';
    changeClasses(player, 'play', 'stop');
    title.innerText = "Titre";
    audio.pause();
    audio.currentTime = 0;
    cover.alt = '';
    isStopped = true;
}

//fonction playBtn (permet de jouer ou d'arrêter le son en fonction de l'état dans lequel il se trouve)
function playPause() {
    const isPlaying = player.classList.contains('play');
    isPlaying ? pauseSong() : playSong(currentSong);
}

//fonction PrevSong (permet d'aller au son précedent)
function prevSong() {
    stopSong();
    songIndex--;
    songIndex < 0 ? songIndex = songs.length -1 : songIndex;
    loadSong(songs[songIndex]);
    playSong(songs[songIndex]);
}

//fonction NextSong (permet d'aller au son suivant)
function nextSong() {
    stopSong();
    songIndex++;
    songIndex > songs.length - 1 ? songIndex = 0 : songIndex;
    loadSong(songs[songIndex]);
    playSong(songs[songIndex]);
}

//fonction updateProgressBar (met à jour la barre de progression du son)
function updateProgressBar(e) {
    const {duration, currentTime} = e.target;
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;
}

//fonction setProgress (met à jour la barre de progression en fonction du click de l'utilisateur)
function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;

    if(!player.classList.contains['stop']) {
        audio.currentTime = (clickX / width) * audio.duration;
    }
}

//fonction reduceSongVol (permet de baisser le volume)
function reduceSongVol() {
    if(audio.volume > .1) {
        audio.volume -= .1;
        volProgress.style.width = `${audio.volume * 100}%`;
    }

    if(audio.volume <= .1) {
        audio.volume = 0;
        audio.muted = true;
        volProgress.style.width = `0`;
        changeClasses(volDownBtn.querySelector('i.fas'), 'fa-volume-down', 'fa-volume-mute');
    } 

    if(audio.volume <= .5) {
        changeClasses(volUpBtn.querySelector('i.fas'), 'fa-volume-up', 'fa-volume-down');
    }
}

//fonction increaseSongVol (permet d'augmenter le volume)
function increaseSongVol () {
    if(audio.volume < .9) {
        audio.muted = false;
        audio.volume += .1;
        volProgress.style.width = `${audio.volume * 100}%`;
        changeClasses(volDownBtn.querySelector('i.fas'), 'fa-volume-mute', 'fa-volume-down');
    }

    if(audio.volume > .5) {
        changeClasses(volUpBtn.querySelector('i.fas'), 'fa-volume-down', 'fa-volume-up');
    }

    if(audio.volume > .9) {
        audio.volume = 1.0;
        volProgress.style.width = `100%`;
    }
}

//fonction updateVol (met à jour le volume par click de l'utilisateur)
function updateVol(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;

    audio.volume = (clickX / width);
    volProgress.style.width = `${audio.volume * 100}%`;
}

//fonction changeLoopState (interrupteur pour déclncher ou désactiver la lecture en boucle)
function changeLoopState() {
    isLooping === true ? isLooping = false : isLooping = true;

    if(isLooping) {
        loopBtn.querySelector('i.fas').style.color = "#00FF00";
    } else {
        loopBtn.querySelector('i.fas').style.color = "#fff";
    }
}

//fonction playLoop (définit la lecture en boucle ou non)
function playLoop () {
    if(songIndex >= songs.length -1 && isLooping) {
        nextSong();
    } else {
        stopSong;
    }
}

//Fonction audioError (permet de renvoyer un erreur si le son n'a pas été trouvé)
function audioError() {
    title.innerText = "Erreur lors du chargement";
}