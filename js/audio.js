// 歌曲列表 - 使用本地MP3文件
const songArr = [
    {
        name: "洛春赋",
        singer: "云汐",
        src: "./mp3/music0.mp3"
    },
    {
        name: "Yesterday",
        singer: "The Beatles",
        src: "./mp3/music1.mp3"
    },
    {
        name: "江南烟雨色",
        singer: "叶炫清",
        src: "./mp3/music2.mp3"
    },
    {
        name: "Vision pt.II",
        singer: "Elektronomia",
        src: "./mp3/music3.mp3"
    }
];

// 获取页面元素
const audio = document.getElementById('audioTag');
const playPauseBtn = document.getElementById('playPause');
const skipForwardBtn = document.getElementById('skipForward');
const skipBackwardBtn = document.getElementById('skipBackward');
const progressTotal = document.getElementById('progress-total');
const progressBar = document.getElementById('progress');
const playedTime = document.getElementById('playedTime');
const audioTime = document.getElementById('audioTime');
const musicTitle = document.getElementById('music-title');
const authorName = document.getElementById('author-name');
const recordImg = document.getElementById('record-img');
const playModeBtn = document.getElementById('playMode');
const volumeBtn = document.getElementById('volume');
const volumeSlider = document.getElementById('volumn-togger');
const listBtn = document.getElementById('list');
const closeListBtn = document.getElementById('close-list');
const musicList = document.getElementById('music-list');
const speedBtn = document.getElementById('speed');

// 当前播放状态
let curIndex = 0;
let isPlay = false;
let playMode = 0; // 0: 列表循环, 1: 单曲循环, 2: 随机播放
let currentSpeed = 1.0;

// 时间格式化
function formatTime(s) {
    let m = Math.floor(s / 60);
    let sec = Math.floor(s % 60);
    return `${m < 10 ? '0' + m : m}:${sec < 10 ? '0' + sec : sec}`;
}

// 播放当前歌曲
function playSong() {
    const curSong = songArr[curIndex];
    audio.src = curSong.src;
    musicTitle.innerText = curSong.name;
    authorName.innerText = curSong.singer;
    // 切换唱片图片
    recordImg.style.backgroundImage = `url('../imges/img/record${curIndex}.jpg')`;
    audio.play();
    isPlay = true;
    playPauseBtn.classList.add('icon-pause');
    playPauseBtn.classList.remove('icon-play');
    // 启用唱片旋转动画
    recordImg.style.animationPlayState = 'running';
    updateSongListActive();
}

// 暂停播放
function pauseSong() {
    audio.pause();
    isPlay = false;
    playPauseBtn.classList.add('icon-play');
    playPauseBtn.classList.remove('icon-pause');
    // 暂停唱片旋转动画
    recordImg.style.animationPlayState = 'paused';
}

// 更新列表选中状态
function updateSongListActive() {
    const items = document.querySelectorAll('.all-list div');
    items.forEach((item, index) => {
        item.style.backgroundColor = index === curIndex ? '#1DB954' : '';
        item.style.color = index === curIndex ? '#fff' : '';
    });
}

// 播放/暂停按钮
playPauseBtn.addEventListener('click', () => {
    if (isPlay) {
        pauseSong();
    } else {
        playSong();
    }
});

// 上一首
skipForwardBtn.addEventListener('click', () => {
    if (playMode === 2) {
        curIndex = Math.floor(Math.random() * songArr.length);
    } else {
        curIndex = curIndex === 0 ? songArr.length - 1 : curIndex - 1;
    }
    playSong();
});

// 下一首
skipBackwardBtn.addEventListener('click', () => {
    if (playMode === 2) {
        curIndex = Math.floor(Math.random() * songArr.length);
    } else {
        curIndex = curIndex === songArr.length - 1 ? 0 : curIndex + 1;
    }
    playSong();
});

// 同步进度条
audio.ontimeupdate = () => {
    if (audio.duration) {
        let per = audio.currentTime / audio.duration * 100;
        progressBar.style.width = per + '%';
        playedTime.innerText = formatTime(audio.currentTime);
    }
};

// 加载总时长
audio.onloadedmetadata = () => {
    audioTime.innerText = formatTime(audio.duration);
};

// 点击进度条跳转
progressTotal.addEventListener('click', (e) => {
    let w = progressTotal.offsetWidth;
    let pos = e.offsetX;
    audio.currentTime = pos / w * audio.duration;
});

// 播放结束处理
audio.onended = () => {
    if (playMode === 1) {
        audio.currentTime = 0;
        audio.play();
    } else {
        skipBackwardBtn.click();
    }
};

// 播放模式切换
playModeBtn.addEventListener('click', () => {
    playMode = (playMode + 1) % 3;
    playModeBtn.style.backgroundImage = `url('../imges/img/mode${playMode + 1}.png')`;
});

// 音量控制
volumeSlider.addEventListener('input', () => {
    audio.volume = volumeSlider.value / 100;
    // 切换音量/静音图标
    if (audio.volume === 0) {
        volumeBtn.classList.add('mute');
        volumeBtn.classList.remove('volume');
    } else {
        volumeBtn.classList.add('volume');
        volumeBtn.classList.remove('mute');
    }
});

// 切换列表显示
listBtn.addEventListener('click', () => {
    musicList.style.display = 'block';
    closeListBtn.style.display = 'block';
});

closeListBtn.addEventListener('click', () => {
    musicList.style.display = 'none';
    closeListBtn.style.display = 'none';
});

// 歌曲列表点击
document.querySelectorAll('.all-list div').forEach((item, index) => {
    item.addEventListener('click', () => {
        curIndex = index;
        playSong();
        musicList.style.display = 'none';
        closeListBtn.style.display = 'none';
    });
});

// 倍速切换
speedBtn.addEventListener('click', () => {
    const speeds = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
    const currentIndex = speeds.indexOf(currentSpeed);
    currentSpeed = speeds[(currentIndex + 1) % speeds.length];
    audio.playbackRate = currentSpeed;
    speedBtn.innerText = currentSpeed + 'X';
});

// 初始化
audio.volume = volumeSlider.value / 100;
updateSongListActive();