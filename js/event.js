// 绑定事件
const bindEvent = (doms, game, music) => {
  /*
  *  game.gameStart 标志位，表示游戏是否可以开始，已经在玩时为否。
  *  game.isPaused 标志位，表示游戏是否是暂停状态。
  *  移动端使用touchstart/touchend代替mousedown/mouseup
  */
 
 function events(startEvent, endEvent) {
    // left
    const leftClassNames = doms.left.className;
    doms.left[startEvent] = function(e) {      
      this.className = leftClassNames + ' active';

      if (game.gameOverAnimationDone) {
        // 声音
        music.move && music.move();
        // 游戏开始后执行
        game.gameStart || game.left();
        // 游戏开始前执行
        game.gameStart && !game.isPaused && game.setStartLine(game, -1);
      }
    };

    doms.left[endEvent] = function() {
      this.className = leftClassNames;
    };

    // right
    const rightClassNames = doms.right.className;
    doms.right[startEvent] = function() {
      this.className = rightClassNames + ' active';

      if (game.gameOverAnimationDone) {
        // 声音
        music.move && music.move(); 
        // 游戏开始后执行
        game.gameStart || game.right();
        // 游戏开始前执行
        game.gameStart && !game.isPaused && game.setStartLine(game, 1);
      }
    };

    doms.right[endEvent] = function() {
      this.className = rightClassNames;
    };

    // down
    const downClassNames = doms.down.className;
    doms.down[startEvent] = function() {
      this.className = downClassNames + ' active';

      if (game.gameOverAnimationDone) {
        // 声音
        music.move && music.move();
        // 游戏开始后执行
        game.gameStart || game.down();
        // 游戏开始前执行
        game.gameStart && !game.isPaused && (game.INTERVAL = game.setLevel(game, -1, game.LEVEL_SPEED));
      }
    };

    doms.down[endEvent] = function() {
      this.className = downClassNames;
    };

    // rotate
    const rotateClassNames = doms.rotate.className;
    doms.rotate[startEvent] = function() {
      this.className = rotateClassNames + ' active';

      if (game.gameOverAnimationDone) {
        if (game.gameStart) { // 游戏开始前
          music.move && music.move();
        } else { // 游戏开始后
          music.rotate && music.rotate();
          game.rotate();
        }
        // 游戏开始前执行
        game.gameStart && !game.isPaused && (game.INTERVAL = game.setLevel(game, 1, game.LEVEL_SPEED));
      }
    };

    doms.rotate[endEvent] = function() {
      this.className = rotateClassNames;
    };

    // 空格
    const dropClassNames = doms.drop.className;
    doms.drop[startEvent] = function() {
      this.className = dropClassNames + ' active';
      
      if (game.gameOverAnimationDone) {
        if (game.gameStart) { // 开始游戏
          game.start();
        } else { // 立即掉落
          music.drop && music.drop();
          game.drop();
        }
      }
    };

    doms.drop[endEvent] = function() {
      this.className = dropClassNames;
    };

    // 重玩
    const againClassNames = doms.again.className;
    doms.again[startEvent] = function() {
      this.className = againClassNames + ' active';
      (!game.gameStart || game.isPaused) && game.end();
    };

    doms.again[endEvent] = function() {
      this.className = againClassNames;
    };

    // 暂停
    const pauseClassNames = doms.pause.className;
    doms.pause[startEvent] = function() {
      this.className = pauseClassNames + ' active';
      game.pause();
    };

    doms.pause[endEvent] = function() {
      this.className = pauseClassNames;
    };

    // 声音
    const soundClassNames = doms.sound.className;
    doms.sound[startEvent] = function() {
      this.className = soundClassNames + ' active';
      music.soundToggle(doms);
    };

    doms.sound[endEvent] = function() {
      this.className = soundClassNames;
    };
  }

  const u = navigator.userAgent;
  
  if (/iphone|ipad|andriod/i.test(u)) {
    events('ontouchstart', 'ontouchend');
  } else {
    events('onmousedown', 'onmouseup');
    // 按下
    document.onkeydown = e => {
      switch (e.keyCode) {
        case 40: // 下移
          doms.down.onmousedown();
          break;
        case 39: // 右移
          doms.right.onmousedown();
          break;
        case 37: // 左移
          doms.left.onmousedown();
          break;
        case 38: // 旋转
          doms.rotate.onmousedown();
          break;
        case 32: // 掉落
          doms.drop.onmousedown();
          break;
        case 82: // 重玩
          doms.again.onmousedown();
          break;
        case 83: // 声音
          doms.sound.onmousedown();
          break;
        case 80: // 暂停
          doms.pause.onmousedown();
          break;
        default:
          break;
      }
    };
  
    // 抬起
    document.onkeyup = e => {
      switch (e.keyCode) {
        case 40: // 下移
          doms.down.onmouseup();
          break;
        case 39: // 右移
          doms.right.onmouseup();
          break;
        case 37: // 左移
          doms.left.onmouseup();
          break;
        case 38: // 旋转
          doms.rotate.onmouseup();
          break;
        case 32: // 掉落
          doms.drop.onmouseup();
          break;
        case 82: // 重玩
          doms.again.onmouseup();
          break;
        case 83: // 声音
          doms.sound.onmouseup();
          break;
        case 80: // 暂停
          doms.pause.onmouseup();
          break;
        default:
          break;
      }
    };
  }
};

export default bindEvent;
