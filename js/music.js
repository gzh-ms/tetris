const myMusic = function() {
  // 音频上下文
  const AudioContext = (
    window.AudioContext ||
    window.webkitAudioContext ||
    window.mozAudioContext ||
    window.oAudioContext ||
    window.msAudioContext
  );
  
  const hasWebAudioAPI = {
    data: !!AudioContext && location.protocol.indexOf('http') !== -1
  };

  const music = {
    toggle: 'on',
    soundToggle: function(doms) {
      if (music.toggle == 'on') {
        music.toggle = 'off';
        doms.statusSound.style.backgroundPosition = '-150px -75px';
      } else {
        music.toggle = 'on';
        doms.statusSound.style.backgroundPosition = '-175px -75px';
      }   
    }
  };

  (() => {
    if (!hasWebAudioAPI.data) return;

    const audioCtx = new AudioContext();
    const xhr = new XMLHttpRequest();
    const url = './music/music.mp3';
    xhr.open('GET', url, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = () => {
      // 创建音频源 地址：https://developer.mozilla.org/zh-CN/docs/Web/API/AudioContext/decodeAudioData
      audioCtx.decodeAudioData(xhr.response, buffer => {
        const getSource = () => {
          const source = audioCtx.createBufferSource();
          source.buffer = buffer;
          source.connect(audioCtx.destination);       
          return source;
        };

        // reset音乐
        music.reset = () => {
          if (music.toggle == 'off') return;
          getSource().start(0, 3.7202, 3.6224);
        };

        // 消除方块
        music.clear = () => {
          if (music.toggle == 'off') return;
          getSource().start(0, 0, 0.7675);
        };

        // 立即掉落
        music.drop = () => {
          if (music.toggle == 'off') return;
          getSource().start(0, 1.2558, 0.3546);
        };

        // 游戏结束
        music.gameOver = () => {
          if (music.toggle == 'off') return;
          getSource().start(0, 8.1276, 1.1437);
        };

        // 旋转
        music.rotate = () => {
          if (music.toggle == 'off') return;
          getSource().start(0, 2.2471, 0.0807);
        };

        // 移动
        music.move = () => {
          if (music.toggle == 'off') return;
          getSource().start(0, 2.9088, 0.1437);
        };
      },
      error => {
        if (window.console && window.console.error) {
          window.console.error('音频:' + url + '读取错误', error);
          hasWebAudioAPI.data = false;
        }
      });
    };

    xhr.send();
  })();

  return music;
};

export default myMusic;
