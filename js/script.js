let charLock = 0;
let prev = [];
let pos = 0;
let exception;
let bfI = 0;
let bfJ = 0;
let __KONAMI_CODE_SEQUENCE = 0;
let __KONAMICODE_COMPLETE = false;
let cursor = {
    pos: 0,
    isLock: function () {
        if (this.pos < 0) this.pos = 0;
        if (charLock == this.pos) return {
            bool: true,
            num: this.pos
        };
        return {
            bool: false,
            num: NaN
        };
    }
};

function setup() {
    text = document.getElementById('promptIn');
    text.style.color = 'yellow';
    text.style.backgroundColor = document.body.style.backgroundColor = 'black';

    function lis(e) {
        e.preventDefault();
    };
    document.addEventListener('keydown', lis);
    setTimeout(() => {
        text.value = '[Prompt_21] v0.1\n\n';
        setTimeout(() => {
            text.value += 'Made by Giancarl021\n\n';
            setTimeout(() => {
                text.value += ' > ';
                document.removeEventListener('keydown', lis);
            }, 150);
        }, 300);
    }, 500);
}

function cmdAply(e) {
    konamiCode(e.keyCode);
    if (validadeKey(e.keyCode)) charLock++;
    if (e.ctrlKey && e.keyCode == 65) e.preventDefault();
    switch (e.keyCode) {
        case 8:
        case 46:
            if (!charLock) e.preventDefault();
            else charLock--;
            break;
        case 13:
            e.preventDefault();
            if (!charLock) return;
            prev[prev.length] = text.value.substr(text.value.length - charLock);
            pos = prev.length;
            let res = executeCMD(prev[pos - 1]);
            if (res != -1) text.value += '\n > ';
            charLock = 0;
            text.scrollTop = text.scrollHeight;
            break;
        case 38:
            e.preventDefault();
            if (pos == 0) return;
            text.value = charLock == 0 ? text.value + prev[pos == 0 ? pos : --pos].trim() : text.value.substr(0, text.value.length - charLock) + prev[pos == 0 ? pos : --pos];
            charLock = prev[pos].trim().length;
            cursor.pos = 0;
            break;
        case 40:
            e.preventDefault();
            if (pos >= prev.length - 1) {
                text.value = text.value.substr(0, text.value.length - charLock);
                charLock = 0;
                pos = prev.length;
                cursor.pos = 0;
            } else {
                text.value = charLock == 0 ? text.value + prev[pos == prev.length - 1 ? pos : ++pos] : text.value.substr(0, text.value.length - charLock) + prev[pos == prev.length - 1 ? pos : ++pos];
                charLock = prev[pos].trim().length;
            }
            break;
        case 37:
        case 39:
            if (!charLock || cursor.isLock().bool) {
                if (cursor.isLock().num == charLock && e.keyCode == 37) e.preventDefault();
                else if (e.keyCode == 39) cursor.pos == 0 ? 0 : cursor.pos--;
            } else e.keyCode == 37 ? cursor.pos++ : (cursor.pos == 0 ? 0 : cursor.pos--);
            break;
        default:

    }
}

function executeCMD(line) {
    let dbfillSubString = null;
    if (line.includes('{') && line.includes('}') && line.split(' ')[0] == 'dbfill') {
        dbfillSubString = line.substring(line.indexOf('{') + 1, line.indexOf('}'));
    }
    line = line.toLowerCase();
    line = line.trim();
    line = line.replace(/ +(?= )/g, '');
    line += ' ';
    if (eastereggs(line.trim()) == 0) return 0;
    let cmd = line.charAt(0) == '=' ? '=' : line.split(' ')[0];
    let sub = line.split(' ');
    if ((cmd == '=' && line.split(' ')[0] == '=') || cmd != '=') sub.shift();
    sub.pop();
    sub.join(' ');
    sub = sub.toString();
    if (line.split(' ')[0] != '=' && cmd == '=') sub = sub.substr(1);
    sub = sub.replaceChar(',', ' ');

    switch (cmd) {
        case 'clear':
            text.value = '';
            break;
        case 'help':
            text.value += '\nhelp - mostra os comandos possíveis de se executar\n' +
                'clear - limpa o prompt\n' +
                'reboot / reset - reinicia o prompt\n' +
                'dbfill <BETA> - gera uma lista de inserções com dados para uma tabela de SQL\n' +
                'music - toca uma música padrão ou importa uma de seu computador para tocar\n' +
                'time - retorna a data e hora atuais\n' +
                'time* - retorna e atualiza a data e hora atuais (suboperadores - apenas "-w" <PADRÃO> e "-t")\n' +
                'color - muda a cor da fonte\n' +
                'bgcolor - muda a cor do fundo\n' +
                'web <BETA> - abre uma url em uma janela\n' +
                'suboperadores - "-c" (padrão, imprime o resultado no console), "-t" <APENAS CHROME> (imprime o resultado em uma aba pop-up), "-d" (baixa um arquivo com o resultado) "-w" <BETA> (insere os dados em uma janela flutuante)\n';
            break;
        case 'reboot':
        case 'reset':
            if (__KONAMICODE_COMPLETE) eastereggs('  konami code  ');
            text.value = '';
            prev = [];
            charLock = pos = 0;
            color('yellow');
            bgcolor('black');
            music('stop', 1);
            let w = document.getElementsByClassName('window-frame');
            let x = w.length;
            if (x > 0) {
                for (let i = 0; i < x; i++) {
                    closeWindow(document.getElementsByClassName('window-frame')[0].childNodes[1]);
                }
            }
            setup();
            return -1;
        case '  download': //inutilizado !!!
            text.value += '\nIniciando download...\n';
            setTimeout(() => {
                window.open('download/this.zip', '_blank');
            }, 500);
            break;
        case '=':
            try {
                text.value += '\n' + eval(sub) + '\n';
            } catch (exception) {
                text.value += '\nExpressão inválida\n';
            }
            break;
        case 'dbfill':
            dbfill(sub, dbfillSubString);
            break;
        case 'music':
            music(sub, null);
            break;
        case 'convert':
            convert(sub);
            break;
        case 'time':
            time(sub);
            break;
        case 'time*':
            dynamicTime(sub);
            break;
        case 'color':
            color(sub);
            break;
        case 'bgcolor':
            bgcolor(sub);
            break;
        case 'web':
            web(sub);
            break;
        default:
            text.value += '\nComando Inválido! Digite "help" para a lista de comandos\n';
    }
    return 0;
}

function dbfill(cmd, sub) {
    let op;
    try {
        op = cmd.split('-')[1].substr(0, 1);
    } catch (exception) {
        op = -1;
    }
    if (cmd.includes(':')) res = queryExecute(op == -1 ? cmd : cmd.replace('-' + op, ''), sub);
    else if (cmd == 'help') {
        text.value += '\n<COMANDO EM FASE BETA>\n' +
            'sintaxe - dbfill <nome da tabela> : <número de inserções> (<variáveis>) {<valores>}\n' +
            'lista de funções de inserção - dbfill $help\n' +
            'suboperadores aceitos - "-c" <PADRÃO>, "-d", "-t", "-w"\n';
        return;
    } else if (cmd == '$help') {
        text.value += '\n' +
            '$nome - insere um nome completo\n' +
            '$nome< - insere apenas o primeiro nome\n' +
            '$data - insere a data atual\n' +
            '$data< - insere uma data anterior a atual\n' +
            '$data> - insere uma data posterior a atual\n' +
            '$data* - insere uma data aleatória\n' +
            '$hora - insere a hora atual\n' +
            '$hora* - insere uma hora aleatória\n' +
            '$int(<min>..<máx>) - insere um inteiro dentro do intervalo colocado\n' +
            '$bool - insere um booleano\n';
        // funções de inserção
        return;
    } else {
        text.value += '\nExpressão inválida, digite "dbfill help" para a lista de subcomandos\n';
        return;
    }
    if (res == -1) {
        text.value += '\nExpressão inválida, digite "dbfill help" para a lista de subcomandos\n';
        return;
    } else if (res == 1) return;
    subOP(op, res, 'insertQuery.sql', 'DBFILL');

    function queryExecute(cmd, sub) {
        let table, num, val, fx;
        cmd.trim();
        table = cmd.substring(0, cmd.indexOf(':'));
        table = table.trim();
        if (table == '' || table.includes(' ')) return -1;
        if (cmd.includes('(') && cmd.includes(')')) {
            num = cmd.substring(cmd.indexOf(':') + 1, cmd.indexOf('('));
            num.trim();
            num = Number.parseInt(num);
            if (!num || num < 0) return -1;
            val = cmd.substring(cmd.indexOf('(') + 1, cmd.indexOf(')'));
            if (val.includes(',')) val = val.split(',');
            else {
                val = val.replace(/ +(?= )/g, '');
                val = val.split(' ');
            }
            if (val.toString() == '') return -1;
            val = val.trimAll();
            bfJ = val;
            if (sub != null) {
                if (sub.includes('\'')) {
                    //AQUI SPLIT MANUAL
                    sub = sub.split(',');
                } else if (sub.includes(',')) sub = sub.split(',');
                else {
                    sub = sub.replace(/ +(?= )/g, '');
                    sub = sub.split(' ');
                }
                if (sub.toString() == '') return -1;
                sub = sub.trimAll();

            } else {
                return -1;
            }
            return compile(table, num, val, sub);
        } else {
            return -1;
        }

        function compile(table, num, val, fx) {
            if (fx.length < val.length) return -1;
            let bf = '';
            for (let i = 0; i < num; i++) {
                bf += 'insert into ' + table + '(' + val + ') values (';
                let j;
                for (j = 0; j < val.length; j++) {
                    if (fx[j].charAt(0) == '$') {
                        fx[j] = fx[j].toLowerCase();
                        let d = new Date(),
                            day, month, year, random;
                        switch (fx[j]) {
                            case '$nome':
                                bf += '\'' + __DBFILL_DATA_NAME[Math.floor(Math.random() * 100)].first + ' ' + __DBFILL_DATA_NAME[Math.floor(Math.random() * 100)].last + '\',';
                                break;
                            case '$nome<':
                                bf += '\'' + __DBFILL_DATA_NAME[Math.floor(Math.random() * 100)].first + '\',';
                                break;
                            case '$data':
                                bf += '\'' + (d.getDate() < 10 ? '0' + d.getDate() : d.getDate()) + '/' + (d.getMonth() < 10 ? '0' + d.getMonth() : d.getMonth()) + '/' + d.getFullYear() + '\',';
                                break;
                            case '$data>':
                                random = Math.floor(Math.random() * 150);
                                day = d.getDate() + random > 31 ? 31 : d.getDate() + random;
                                random = Math.floor(Math.random() * 4);
                                month = d.getMonth() + random > 12 ? 12 : d.getMonth() + random;
                                year = d.getFullYear() + Math.floor(Math.random() * 15);
                                bf += '\'' + (day < 10 ? '0' + day : day) + '/' + (month < 10 ? '0' + month : month) + '/' + year + '\',';
                                break;
                            case '$data<':
                                random = Math.floor(Math.random() * 15);
                                day = (d.getDate() - random) < 1 ? 1 : d.getDate() - random;
                                random = Math.floor(Math.random() * 4);
                                month = (d.getMonth() - random) < 1 ? 1 : d.getMonth() - random;
                                year = d.getFullYear() - Math.floor(Math.random() * 15);
                                bf += '\'' + (day < 10 ? '0' + day : day) + '/' + (month < 10 ? '0' + month : month) + '/' + year + '\',';
                                break;
                            case '$data*':
                                day = Math.ceil(Math.random() * 31);
                                month = Math.ceil(Math.random() * 12);
                                year = 1500 + Math.ceil(Math.random() * 1000);
                                bf += '\'' + (day < 10 ? '0' + day : day) + '/' + (month < 10 ? '0' + month : month) + '/' + year + '\',';
                                break;
                            case '$hora':
                                bf += '\'' + (d.getHours() < 10 ? '0' + d.getHours() : d.getHours()) + ':' + (d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()) + ':' + (d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds()) + '\',';
                                break;
                            case '$hora*':
                                day = Math.floor(Math.random() * 24);
                                month = Math.ceil(Math.random() * 60);
                                year = Math.ceil(Math.random() * 60);
                                bf += '\'' + (day < 10 ? '0' + day : day) + ':' + (month < 10 ? '0' + month : month) + ':' + (year < 10 ? '0' + year : year) + '\',';
                                break;
                            case '$bool':
                                bf += (Math.floor(Math.random() * 2) % 2 == 0 ? 'true' : 'false') + ',';
                                break;
                            default:
                                if (fx[j].includes('$int')) {
                                    if (!fx[j].includes('(') && !fx[j].includes(')')) {
                                        return -1;
                                    }
                                    let sub = fx[j].substring(fx[j].indexOf('(') + 1, fx[j].indexOf(')'));
                                    sub = sub.split('..');
                                    buffer = Number.parseInt(sub[0]) + Math.floor(Math.random() * sub[1]);
                                    if (!buffer && buffer != 0) return -1;
                                    bf += buffer + ',';
                                } else bf += 'null,';
                        }
                    } else bf += fx[j].replaceChar('¬', ',') + ',';
                }
                bf = bf.substr(0, bf.length - 1);
                bf += ');';
                if (i < num - 1) bf += '\n';
            }
            return bf;
        }
    }
}

function music(cmd, e) {
    let op;
    try {
        op = cmd.split('-')[1].substr(0, 1);
        cmd = cmd.replace('-' + op, '');
        if (cmd != '  changedInput  ') cmd = cmd.replaceChar(' ', '');
    } catch (exception) {
        op = -1;
    }
    let i, j = [];
    switch (cmd) {
        case 'help':
            text.value += '\nplay/start - inicia uma música padrão\n' +
                'pause/stop - para de tocar a música em reprodução\n' +
                'import - carrega uma música do seu computador para tocar\n' +
                'suboperadores aceitos - <ESCONDIDO POR PADRÃO>, "-w"\n';
            break;
        case 'play':
        case 'start':
        op = 'w';
            let src = ['https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/124014750&color=%23ff5500&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true',
                'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/240837085&color=%23ff5500&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true',
                'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/389721078&color=%23ff5500&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true',
                'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/257550093&color=%23ff5500&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true',
                'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/444215115&color=%23ff5500&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true',
                'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/184180126&color=%23ff5500&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true',
                'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/328723827&color=%23ff5500&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true'
            ];
            i = document.getElementById('soundcloud');
            if (i != null) {
                text.value += '\nJá há uma reprodução em andamento\n';
                return;
            }
            i = document.createElement('iframe');
            i.style.display = 'none';
            i.id = 'soundcloud';
            i.setAttribute('allow', 'autoplay');
            i.onended = function () {
                music('stop', 1);
            }
            i.src = src[Math.floor(Math.random() * src.length)];
            if (op == 'w') {
                i.style.display = 'inherit';
                i.style.width = '502px';
                i.style.height = '322px';
                i.style.marginLeft = '-2px';
                i.style.marginTop = '-2px';
                subOP(op, i, 'noResize', 'MUSIC PLAYER');
            } else {
                document.body.appendChild(i);
                text.value += '\nReprodução iniciada\n';
            }
            break;
        case 'pause':
        case 'stop':
            i = document.getElementById('soundcloud');
            if (i == null) {
                if (e != 1) text.value += '\nNenhuma música está tocando\n';
            } else {
                if (i.parentNode != document.body) {
                    closeWindow(i.parentNode);
                } else document.body.removeChild(i);
                if (e != 1) text.value += '\nReprodução parada\n';
            }
            break;
        case 'import':
            i = document.getElementById('soundcloud');
            if (i != null) {
                if (i.parentNode != document.body) {
                    text.value += '\nJá há uma reprodução em andamento\n';
                    return;
                } else {
                    music('stop', 1);
                    text.value += '\nReprodução atual parada';
                }
            }
            i = document.createElement('input');
            i.setAttribute('type', 'file');
            i.name = 'files';
            i.onchange = function (event) {
                if (op == 'w') music('  changedInput  -w', event);
                else music('  changedInput  ', event);
            }
            i.id = 'importMP3';
            i.accept = 'audio/*';
            if (op != 'w') i.style.display = 'none';
            document.body.appendChild(i);
            i.click();
        case '  changedInput  ':
            i = document.createElement('audio');
            let fp;
            try {
                fp = e.target.files[0];
            } catch (exception) {
                text.value += '\nCarregando arquivo...\n';
                return;
            }
            if (!(fp.name.includes('.mp3') || fp.name.includes('.wav') || fp.name.includes('.ogg'))) {
                text.value = text.value.substring(0, text.value.length - 5) + '\nArquivo não carregado\n\n > ';
                return;
            }
            i.src = URL.createObjectURL(fp);
            i.id = 'soundcloud';
            if (op != 'w') i.onended = function () {
                music('stop', 1);
            };
            document.body.removeChild(document.getElementById('importMP3'));
            if (op == 'w') {
                j[0] = document.createElement('div');
                j[0].setAttribute('class', 'window-musicplayer');
                j[0].appendChild(i);
                j[1] = document.createElement('div');
                j[1].setAttribute('class', 'window-musicplayer-playbutton');
                j[1].setAttribute('onclick', '__MUSIC_IMPORT_PAUSE(this)');
                j[1].style.backgroundImage = 'url(\'img/pause.png\')';
                j[2] = document.createElement('div');
                j[2].setAttribute('class', 'window-musicplayer-timebar');
                j[0].appendChild(j[2]);
                j[0].appendChild(j[1]);
                __MUSIC_TIME_INTERVAL_SETUP(j[2]);
                i.onended = function () {
                    __MUSIC_IMPORT_PAUSE(j[1]);
                }
                startWindow('MUSIC PLAYER', j[0], true);
            } else document.body.appendChild(i);
            i.play();
            text.value = text.value.substring(0, text.value.length - 5) + '\nReprodução iniciada\n\n > ';
            break;
        default:
            text.value += '\nExpressão inválida\n';
            break;
    }
}

function time(cmd) {
    let op;
    try {
        op = cmd.split('-')[1].substr(0, 1);
    } catch (exception) {
        op = -1;
    }
    let x = new Date();
    let year = x.getFullYear();
    let month = x.getMonth() < 10 ? '0' + x.getMonth() : x.getMonth();
    let day = x.getDate() < 10 ? '0' + x.getDate() : x.getDate();
    let hour = x.getHours() < 10 ? '0' + x.getHours() : x.getHours();
    let min = x.getMinutes() < 10 ? '0' + x.getMinutes() : x.getMinutes();
    let sec = x.getSeconds() < 10 ? '0' + x.getSeconds() : x.getSeconds();
    let res = day + '/' + month + '/' + year + ' - ' + hour + ':' + min + ':' + sec;
    subOP(op, res, 'time.txt', 'TIME');
}

function dynamicTime(cmd) {
    let op;
    try {
        op = cmd.split('-')[1].substr(0, 1);
    } catch (exception) {
        op = 'w';
    }
    if (op == 'c' || op == 'd') op = 'w';
    let res = document.createElement('div');
    let el = document.createElement('h1');
    el.setAttribute('class', '__DYNAMICTIME_H1_TIME_UPDATE');
    el.style.fontSize = '2vh';
    el.style.margin = el.style.padding = 0;
    el.style.userSelect = 'none';
    el.style.fontFamily = '\'Consolas\', monospace';

    if (op == 'w') {
        res.style.position = el.style.position = 'absolute';
        res.style.left = el.style.left = '50%';
        res.style.top = el.style.top = '50%';
        res.style.transform = el.style.transform = 'translate(-50%, -50%)';
        res.style.width = '100vw';
    }
    res.appendChild(el);
    el = document.createElement('script');
    el.innerHTML = 'update();__DYNAMICTIME_W_SETINTERVAL=setInterval(update,1000);function update(){let x=new Date();let year=x.getFullYear();let month=x.getMonth()<10?\'0\'+x.getMonth():x.getMonth();let day=x.getDate()<10?\'0\'+x.getDate():x.getDate();let hour=x.getHours()<10?\'0\'+x.getHours():x.getHours();let min=x.getMinutes()<10?\'0\'+x.getMinutes():x.getMinutes();let sec=x.getSeconds()<10?\'0\'+x.getSeconds():x.getSeconds();for(let i=0;i<document.getElementsByClassName(\'__DYNAMICTIME_H1_TIME_UPDATE\').length;i++)document.getElementsByClassName(\'__DYNAMICTIME_H1_TIME_UPDATE\')[i].innerHTML=day+\'/\'+month+\'/\'+year+\'-\'+hour+\':\'+min+\':\'+sec;}';
    res.appendChild(el);
    subOP(op, res, 'null', 'DYNAMIC TIME');
}

function color(cmd) {
    switch (cmd) {
        case 'help':
            text.value += '\n' +
                'color <nome da cor em inglês>\n' +
                'color rgb(<vermelho(0-255)>,<verde(0-255),<azul(0-255)>)\n' +
                'color #<código hexadecimal>\n' +
                'color <qualquer outra função de cor do CSS>\n' +
                'color switch - inverte as cores de fundo e texto\n' +
                'color reset - coloca o texto na cor padrão\n' +
                'color return - imprime a cor do texto atual\n';
            return;
        case 'switch':
            let bf = text.style.color;
            text.style.color = text.style.backgroundColor;
            text.style.backgroundColor = document.body.style.backgroundColor = bf;
            break;
        case 'reset':
            text.style.color = 'yellow';
            break;
        case 'return':
            text.value += '\n' + text.style.color;
            break;
    }

    text.style.color = cmd;
    text.value += '\n';
}

function bgcolor(cmd) {
    switch (cmd) {
        case 'help':
            text.value += '\n' +
                'bgcolor <nome da cor em inglês>\n' +
                'bgcolor rgb(<vermelho(0-255)>,<verde(0-255),<azul(0-255)>)\n' +
                'bgcolor #<código hexadecimal>\n' +
                'bgcolor <qualquer outra função de cor do CSS>\n' +
                'bgcolor switch - inverte as cores de fundo e texto\n' +
                'bgcolor reset - coloca o fundo na cor padrão\n' +
                'bgcolor return - imprime a cor do fundo atual\n';
            return;
        case 'switch':
            let bf = text.style.color;
            text.style.color = text.style.backgroundColor;
            text.style.backgroundColor = document.body.style.backgroundColor = bf;
            break;
        case 'reset':
            text.style.backgroundColor = document.body.style.backgroundColor = 'black';
            break;
        case 'return':
            text.value += '\n' + text.style.backgroundColor;
            break;
    }
    document.body.style.backgroundColor = text.style.backgroundColor = cmd;
    text.value += '\n';
}

function web(cmd) {
    if (cmd == '') {
        text.value += '\nURL Inválida\n';
        return;
    }
    let op;
    try {
        op = cmd.split('-')[1].substr(0, 1);
        cmd = cmd.replace('-' + op, '');
    } catch (exception) {
        op = 'w';
    }
    let el = document.createElement('iframe');
    Object.assign(el.style, {
        width: '100%',
        height: '100%',
        position: 'absolute'
    });
    if (!(cmd.includes('http') || cmd.includes('https'))) cmd = 'http://' + cmd;
    el.src = cmd;
    startWindow('WEB PAGE', el, true);
    text.value += '\n';
}

function convert(cmd) { // INCOMPLETO
    let op;
    try {
        op = cmd.split('-')[1].substr(0, 1);
    } catch (exception) {
        op = -1;
    }
    cmd += ' ';
    let orig, dest;
    try {
        orig = cmd.split('..')[0];
        dest = cmd.split('..')[1];
        dest = dest.split(' ')[0];
    } catch (exception) {
        text.value += '\nExpressão Inválida\n';
        return;
    }

    console.log(orig + ' ' + dest);
    text.value += '\n';
}

function subOP(op, res, filename, windowName) {
    switch (op) {
        case 't':
            try {
                let w = window.open('about:blank', '_blank');
                try {
                    w.document.body.appendChild(res);
                } catch (exception) {
                    res = res.replaceChar('\n', '<br/>');
                    w.document.body.innerHTML = res;
                }
                text.value += '\n';
            } catch (exception) {
                text.value += '\nErro ao abrir pop-up\n';
            }
            break;
        case 'd':
            let bf = document.createElement('a');
            bf.style.display = 'none';
            bf.setAttribute('href', 'data:text/plain;charset=utf-8,' + res);
            bf.setAttribute('download', filename);
            document.body.appendChild(bf);
            bf.click();
            document.body.removeChild(bf);
            text.value += '\n';
            break;
        case 'w':
            text.value += '\nJanela Iniciada\n';
            if (filename == 'noResize') startWindow(windowName, res, false);
            else startWindow(windowName, res, true);
            break;
        case 'c':
        default:
            text.value += '\n' + res + '\n';
            break;
    }
}

function konamiCode(key) {
    if ((__KONAMI_CODE_SEQUENCE == 0 || __KONAMI_CODE_SEQUENCE == 1) && key == 38) {
        __KONAMI_CODE_SEQUENCE++;
    } else if ((__KONAMI_CODE_SEQUENCE == 2 || __KONAMI_CODE_SEQUENCE == 3) && key == 40) {
        __KONAMI_CODE_SEQUENCE++;
    } else if ((__KONAMI_CODE_SEQUENCE == 4 || __KONAMI_CODE_SEQUENCE == 6) && key == 37) {
        __KONAMI_CODE_SEQUENCE++;
    } else if ((__KONAMI_CODE_SEQUENCE == 5 || __KONAMI_CODE_SEQUENCE == 7) && key == 39) {
        __KONAMI_CODE_SEQUENCE++;
    } else if (__KONAMI_CODE_SEQUENCE == 8 && key == 66) {
        __KONAMI_CODE_SEQUENCE++
    } else if (__KONAMI_CODE_SEQUENCE == 9 && key == 65) {
        __KONAMI_CODE_SEQUENCE++;
    } else {
        __KONAMI_CODE_SEQUENCE = 0;
    }
    if (__KONAMI_CODE_SEQUENCE == 10) {
        eastereggs('  konami code  ');
    }
}

function eastereggs(cmd) {
    let el;
    switch (cmd) {
        case 'omae wa mou shindeiru':
            el = document.createElement('audio');
            el.src = 'audio/nani.mp3';
            el.style.display = 'none';
            document.body.appendChild(el);
            el.play();
            setTimeout(() => {
                document.body.removeChild(el);
            }, 800);
            text.value += '\nNANI?\n';
            break;
        case 'nani':
        case 'nani?':
            el = [document.createElement('div'), document.createElement('audio')];
            el[0].setAttribute('class', 'glitch');
            el[1].src = 'audio/noise.mp3';
            el[1].style.display = 'none';
            document.body.appendChild(el[0]);
            document.body.appendChild(el[1]);
            el[1].play();
            setTimeout(() => {
                document.body.removeChild(el[0]);
                document.body.removeChild(el[1]);
            }, 1600);
            text.value += '\n#$%¨&*()_(*¨&    %$#@%¨%&$%*¨(*     &%¨$#!     #@@!%¨&*(\n\n)_)(*&  GREVFS    $  R@#%¨&*()OK\n                  n \nIMJHNHGT@#%¨#$%*$U¨            JBR@W#%@!#TGBRWEU¨   &*OKMNJHR#@!@REDWQF!@#$@!$%¨&*(%$\n';
            break;
        case '  konami code  ':
            setTimeout(() => {
                if (!__KONAMICODE_COMPLETE) text.style.animation = 'hueRotate 1s linear infinite';
                else text.style.animation = '';
                __KONAMICODE_COMPLETE = !__KONAMICODE_COMPLETE;
                cmdAply({
                    keyCode: 40,
                    preventDefault: function () {}
                });
            }, 5);
            break;
        default:
            return -1;
    }
    return 0;
}

function validadeKey(keycode) {
    if ((keycode > 47 && keycode < 58) || // number keys
        (keycode == 32) || // spacebar & return key(s) (if you want to allow carriage returns)
        (keycode > 64 && keycode < 91) || // letter keys
        (keycode > 95 && keycode < 112) || // numpad keys
        (keycode > 185 && keycode <= 193) || // ;=,-./` (in order)
        (keycode > 218 && keycode < 223) || //firefox 1
        (keycode == 61) || (keycode == 173) || //firefox 2
        (keycode == 59)) // firefox 3
        return true;
    return false;
}

String.prototype.replaceChar = function (font, dest) {
    let buffer = '';
    for (let i = 0; i < this.length; i++) {
        if (this.charAt(i) == font) buffer += dest;
        else buffer += this.charAt(i);
    }
    return buffer;
}

Array.prototype.trimAll = function () {
    let buffer = [];
    for (let i = 0; i < this.length; i++) {
        buffer[i] = this[i].toString().trim();
    }
    return buffer;
}
