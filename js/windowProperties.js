let wPos = [0, 0];
let __DYNAMICTIME_W_SETINTERVAL;
let __MUSICPLAYER_IS_PAUSED = false;
let __MUSICPLAYER_TIME_SETINTERVAL = null;

function startWindow(title, content, resize) {
    let w = document.createElement('div');
    w.style.resize = resize ? 'both' : 'none';
    w.setAttribute('class', 'window-frame');
    w.innerHTML = '<div class="window-bar">' +
        '<div class="window-title">' + title + '</div>' +
        '</div>' +
        '<div class="window-close" onclick="closeWindow(this);"></div>' +
        '<div class="window-content"></div>';
    let cont = w.childNodes[2];
    try {
        cont.appendChild(content);
    } catch (exception) {
        let wText = document.createElement('textarea');
        wText.setAttribute('class', 'window-text');
        wText.innerHTML = content.toString();
        cont.appendChild(wText);
    }
    let sw = w.childNodes[0];
    sw.onmousedown = function (e) {
        e.preventDefault();
        document.body.onmousemove = function (e) {
            sw.parentNode.style.transform = 'translate(-50%, -15px)';
            wPos[0] = e.clientX;
            wPos[1] = e.clientY;
            sw.parentNode.style.left = wPos[0] + 'px';
            sw.parentNode.style.top = wPos[1] + 'px'
        }
    }
    document.onmouseup = function () {
        document.body.onmousemove = null;
    }
    document.body.appendChild(w);
}

function closeWindow(el) {
    if (__MUSICPLAYER_TIME_SETINTERVAL != null) __MUSIC_TIME_INTERVAL_SETUP();
    if (el.parentNode.getElementsByClassName('window-title')[0].innerHTML == 'DYNAMIC TIME') {
        clearInterval(__DYNAMICTIME_W_SETINTERVAL);
    };
    document.body.removeChild(el.parentNode);
    document.getElementById('promptIn').focus();
}

function __MUSIC_IMPORT_PAUSE(el) {
    if (!__MUSICPLAYER_IS_PAUSED) {
        el.parentNode.getElementsByTagName('audio')[0].pause();
        el.style.backgroundImage = 'url(\'img/play.png\')';
    } else {
        el.parentNode.getElementsByTagName('audio')[0].play();
        el.style.backgroundImage = 'url(\'img/pause.png\')';
    }
    __MUSICPLAYER_IS_PAUSED = !__MUSICPLAYER_IS_PAUSED;
}

function __MUSIC_TIME_INTERVAL_SETUP(el) {
    if (__MUSICPLAYER_TIME_SETINTERVAL == null) {
        __MUSICPLAYER_TIME_SETINTERVAL = setInterval(() => update(el), 0);
    } else {
        clearInterval(__MUSICPLAYER_TIME_SETINTERVAL);
        __MUSICPLAYER_TIME_SETINTERVAL = null;
    }

    function update(el) {
        let dur = el.parentNode.getElementsByTagName('audio')[0].duration;
        let cur = el.parentNode.getElementsByTagName('audio')[0].currentTime;
        el.style.width = ((100 * cur) / dur) + '%';
    }
}