import SquareFactory from './squareFactory';

// 游戏运行逻辑
const Game = function() {
  // 游戏矩阵dom，下一块矩阵dom，计时dom，计分dom，起始行dom，级别dom, 恐龙图片dom，分数
  let gameDiv, nextDiv, timeDiv, scoreDiv, startLineDiv, levelDiv, dragonDiv, score = 0;

  // 游戏矩阵
  const gameData = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ];

  // 下一块中所有小方块dom
  const nextDivs = [];

  // 游戏矩阵中所有小方块dom
  const gameDivs = [];

  // 分数dom、起始行dom、级别dom、时间dom中所有的数字dom
  const scoreDivs = [];
  const startLineDivs = [];
  const levelDivs = [];
  const timeDivs = [];

  // 当前方块，下一个方块
  let cur, next;

  // 游戏结束动画速度，大于0的整数
  const ANIMATION_SPEED = 3;

  // 恐龙眨眼时间
  const DRAGON_EYE_SPEED = 1500;

  // 恐龙走路时间
  const DRAGON_WALK_SPEED = 1500;

  // 游戏是否可以开始
  this.gameStart = true;

  // 起始行数
  this.startLine = 0;

  // 级别数
  this.level = 1;

  // 游戏开始前的级别
  this.beforeStartLevel = 1;

  // 游戏结束的动画是否结束
  this.gameOverAnimationDone = true;

  // 初始化div
  const initDiv = function(container, data, divs) {
    for(let i = 0; i < data.length; i++) {
      const div = [];
      for(let j = 0; j < data[0].length; j++) {
        var newNode = document.createElement('div');
        newNode.className = 'none';
        container.appendChild(newNode);
        div.push(newNode);
      }
      divs.push(div);
    }
  };

  // 刷新div
  const refreshDiv = function(data, divs) {
    for(let i = 0; i < data.length; i++) {
      for(let j = 0; j < data[0].length; j++) {
        if (data[i][j] == 0) {
          divs[i][j].className = 'none';
        } else if (data[i][j] == 1) {
          divs[i][j].className = 'done';
        } else if (data[i][j] == 2) {
          divs[i][j].className = 'current';
        } else if (data[i][j] == 3) {
          divs[i][j].className = 'clear';
        }
      }
    }
  };

  // 检测点是否合法
  const check = (pos, x, y) => {
    if (pos.x + x < 0) {
      return false;
    } else if (pos.x + x >= gameData.length) {
      return false;
    } else if (pos.y + y < 0) {
      return false;
    } else if (pos.y + y >= gameData[0].length) {
      return false;
    } else if (gameData[pos.x + x][pos.y + y] == 1) {
      return false;
    } else {
      return true;
    }
  };

  // 检测数据是否合法
  const isValid = (pos, data) => {
    for(let i = 0; i < data.length; i++) {
      for(let j = 0; j < data[0].length; j++) {
        if (data[i][j] != 0) {
          if (!check(pos, i, j)) {
            return false;
          }
        }
      }
    }
    return true;
  };
  
  // 清除数据
  const clearData = () => {
    for(let i = 0; i < cur.data.length; i++) {
      for(let j = 0; j < cur.data[0].length; j++) {
        if (check(cur.origin, i, j)) {         
          gameData[cur.origin.x + i][cur.origin.y + j] = 0;
        }
      }
    }   
  };

  // 设置数据
  const setData = () => {
    for(let i = 0; i < cur.data.length; i++) {
      for(let j = 0; j < cur.data[0].length; j++) {
        if (check(cur.origin, i, j)) {
          gameData[cur.origin.x + i][cur.origin.y + j] = cur.data[i][j];
        }
      }
    }
  };

  // 下移
  const down = () => {    
    if (cur.canDown(isValid)) {
      clearData();
      cur.down();
      setData();
      refreshDiv(gameData, gameDivs);
      return true;
    } else {
      return false;
    }
  };

  // 左移
  const left = () => {
    if (cur.canLeft(isValid)) {
      clearData();
      cur.left();
      setData();
      refreshDiv(gameData, gameDivs);
    }
  };

  // 右移
  const right = () => {
    if (cur.canRight(isValid)) {
      clearData();
      cur.right();
      setData();
      refreshDiv(gameData, gameDivs);
    }
  };

  // 旋转
  const rotate = () => {
    if (cur.canRotate(isValid)) {
      clearData();
      cur.rotate();
      setData();
      refreshDiv(gameData, gameDivs);
    }
  };

  // 下落
  const drop = () => {
    while (down());
  };

  // 不能再下降时固定
  const fixed = () => {
    for (let i = 0; i < cur.data.length; i++) {
      for (let j = 0; j < cur.data[0].length; j++) {
        if (cur.data[i][j] == 2) {
          gameData[cur.origin.x + i][cur.origin.y + j] = 1;
        }
      }
    }
  };

  // 执行下一块
  const performNext = (index, dir) => {
    cur = next;
    setData();
    next = SquareFactory.prototype.make(index, dir);
    refreshDiv(gameData, gameDivs);
    refreshDiv(next.data, nextDivs);
  };

  // 判断消行
  const checkClear = () => {
    // 消除的行的下标
    let lines = [];
    for (let i = gameData.length -1; i > 0; i--) {
      let clear = true;

      for (let j = 0; j < gameData[0].length; j++) {
        if (gameData[i][j] != 1) {
          clear = false;
          break;
        }
      }

      if (clear) lines.push(i);
    }

    return lines;
  };

  // 消行动画
  const clearLineAnimation = (lines, callback) => {
    let count = 0;
    let animID = null;

    function fn() {
      if (count % 4 > 1) {
        for (let i = 0; i < lines.length; i++) {
          for (let j = 0; j < gameDivs[0].length; j++) {
            gameDivs[lines[i]][j].className = 'done';       
          }
        }
      } else {
        for (let i = 0; i < lines.length; i++) {
          for (let j = 0; j < gameDivs[0].length; j++) {
            gameDivs[lines[i]][j].className = 'done clear';       
          }
        }
      }

      count++;
      if (count < 12) {
        animID = requestAnimationFrame(fn);
      } else {
        cancelAnimationFrame(animID);
        animID = null;
        clearLines(lines);
        callback();
      }
    }
    fn();
  };

  // 消行
  const clearLines = lines => {
    for (let i = lines.length - 1; i >= 0; i--) {
      gameData.splice(lines[i], 1);
      gameData.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    }
  };

  // 加分
  const addScore = line => {
    let _score = 0;

    switch (line) {
      case 1: 
        _score = 10;
        break;
      case 2: 
      _score = 30;
        break;
      case 3: 
        _score = 60;
        break;
      case 4: 
        _score = 100;
        break;
      default: 
        break;
    }

    score += _score;
    setScore(score);

    return score;
  };

  // 设置分数
  const setScore = score => {
    let len2 = scoreDivs.length - 1;

    if (score == 0) {
      for (let i = 0; i <= len2; i++) {
        scoreDivs[i].style.backgroundPosition = '-215px -25px';
        if (i == len2) {
          scoreDivs[i].style.backgroundPosition = '-75px -25px';
        }
      }
      return;
    }

    score = (score + '').split('');

    let len1 = score.length - 1;
    
    for (let i = len2; i >= 0; i--) {
      if (len1 >= 0) {
        scoreDivs[i].style.backgroundPosition = (-75 - Number(score[len1]) * 14) + 'px -25px';
        len1--;
      } else {
        scoreDivs[i].style.backgroundPosition = '-215px -25px';
      }
    }
  };

  // 设置起始行 game--对象实例，dir--正负一
  const setStartLine = (game, dir) => {
    const len = startLineDivs.length;
    
    if (dir) {
      game.startLine += dir;
    }

    if (game.startLine > 10) game.startLine = 0;
    if (game.startLine < 0) game.startLine = 10;

    if (game.startLine < 10) {
      startLineDivs[len - 1].style.backgroundPosition = (-75 - game.startLine * 14) + 'px -25px';
      startLineDivs[len - 2].style.backgroundPosition = '-215px -25px';
    } else {
      startLineDivs[len - 1].style.backgroundPosition = '-75px -25px';
      startLineDivs[len - 2].style.backgroundPosition = '-88px -25px';
    }
  };

  // 设置起始行数后对应的游戏矩阵
  const newGameDataByLine = game => {
    const line = game.startLine;
    const arr = [0, 1];

    for (let i = 0; i < gameData.length; i++) {
      for (let j = 0; j < gameData[0].length; j++) {
        if (i < gameData.length - line) {
          gameData[i][j] = 0;
        } else {
          gameData[i][j] = arr[Math.floor(Math.random() * 2)];
        }
      }
    }

    refreshDiv(gameData, gameDivs);
  };

  // 设置级别 game--对象实例，dir--正负一。级别取值--1-6
  const setLevel = (game, dir, LEVEL_SPEED) => {   
    if (dir) {
      game.level += dir;
      game.beforeStartLevel += dir;

      if (game.level > 6) game.level = 1;
      if (game.level < 1) game.level = 6;

      if (game.beforeStartLevel > 6) game.beforeStartLevel = 1;
      if (game.beforeStartLevel < 1) game.beforeStartLevel = 6;
    }

    levelDivs[0].style.backgroundPosition = (-75 - game.level * 14) + 'px -25px';

    return LEVEL_SPEED[game.level - 1];
  };

  // 初始化数字格子
  const initNumberDiv = (container, divs, len) => {
    const fragment = document.createDocumentFragment();   
    for (let i = 0; i < len; i++) {
      const newNode = document.createElement('span');
      newNode.className = 'number-default-style';
      fragment.appendChild(newNode);
      divs.push(newNode);
    }
    container.appendChild(fragment);
  };

  // 判断游戏是否结束
  const checkGameOver = () => {
    var gameOver = false;
    for (let i = 0; i < gameData[0].length; i++) {
      if (gameData[0][i] == 1) {
        gameOver = true;
      }
    }

    return gameOver;
  };

  // 游戏结束 参数：game对象实例
  const gameOver = (game, music) => {
    let len = gameData.length - 1;
    let animID1 = null, animID2 = null, count = 0;

    // 结束声音
    music.gameOver && music.gameOver();

    // 游戏结束动画
    game.gameOverAnimationDone = false;
    
    function fn1() {
      count++;

      if (count % ANIMATION_SPEED == 0) {
        for (let i = 0; i < gameData[0].length; i++) {
          gameData[len][i] = 2;
        }
        refreshDiv(gameData, gameDivs);
        len--;
      }

      if (len >= 0) {
        animID1 = requestAnimationFrame(fn1);
      } else {
        cancelAnimationFrame(animID1);
        animID2 = requestAnimationFrame(fn2);
        animID1 = null;
      }
    }

    function fn2() {
      count++;
      if (count % ANIMATION_SPEED == 0) {
        len++;
        for (let i = 0; i < gameData[0].length; i++) {
          gameData[len][i] = 0;
        }

        refreshDiv(gameData, gameDivs);
      }

      if (len < gameData.length - 1) {
        animID2 = requestAnimationFrame(fn2);
      } else {
        cancelAnimationFrame(animID2);
        animID2 = null;

        // 清空分数
        score = 0;

        // 设置游戏为可以开始状态
        game.gameStart = true;
        game.gameOverAnimationDone = true;

        // 显示恐龙动画
        showDragon(game, music);
      }
    }
  
    animID1 = requestAnimationFrame(fn1);
  };

  // 显示恐龙动画
  const showDragon = (game, music) => {
    // 重置声音
    music.reset && music.reset();

    dragonDiv.style.display = 'block';
    dragonDiv.classList.add('dragon-opacity');

    setTimeout(() => {
      dragonDiv.classList.add('dragon-eye-active');
      setTimeout(() => {
        dragonDiv.classList.remove('dragon-eye-active');
        dragonDiv.classList.add('dragon-walk-active');
  
        setTimeout(() => {
          dragonDiv.classList.remove('dragon-walk-active');
          dragonDiv.classList.add('dragon-walk-rotate-active');
          // 游戏在动画未做完前开始，清除动画
          game.gameStart || dragonDiv.classList.remove('dragon-walk-rotate-active');
        }, DRAGON_WALK_SPEED);
      }, DRAGON_WALK_SPEED);
    }, DRAGON_EYE_SPEED);
  };

  // 设置游戏时间
  const setTime = () => {    
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const _hours = hours > 9 ? hours.toString() : '0' + hours;
    const _minutes = minutes > 9 ? minutes.toString() : '0' + minutes;
    const time = _hours.split('').concat(_minutes.split(''));
    let j = 0;
    
    for (let i = 0; i < timeDivs.length; i++) {
      if (i == 2) {
        timeDivs[i].className = 'number-default-style time-flash';
      } else {
        timeDivs[i].style.backgroundPosition = -75 - time[j] * 14 + 'px -25px';
        j++;
      }
    }
  };

  // 初始化，index--方块类型，dir方块方向
  const init = (doms, index, dir) => {
    
    gameDiv = doms.gameDiv;
    nextDiv = doms.nextDiv;
    timeDiv = doms.timeDiv;
    scoreDiv = doms.scoreDiv;
    startLineDiv = doms.startLineDiv;
    levelDiv = doms.levelDiv;
    dragonDiv = doms.dragonDiv;

    // 下一个方块
    cur = SquareFactory.prototype.make(index, dir);
    next = SquareFactory.prototype.make(Math.floor(Math.random() * 7), Math.floor(Math.random() * 4));
    
    initDiv(gameDiv, gameData, gameDivs);
    initDiv(nextDiv, next.data, nextDivs);    
    refreshDiv(next.data, nextDivs);

    initNumberDiv(scoreDiv, scoreDivs, 6);
    initNumberDiv(startLineDiv, startLineDivs, 6);
    initNumberDiv(levelDiv, levelDivs, 1);
    initNumberDiv(timeDiv, timeDivs, 5);
  };

  this.init = init;
  this.down = down;
  this.left = left;
  this.right = right;
  this.rotate = rotate;
  this.drop = drop;
  this.fixed = fixed;
  this.performNext = performNext;  
  this.checkClear = checkClear;
  this.checkGameOver = checkGameOver;
  this.addScore = addScore;
  this.gameOver = gameOver;
  this.showDragon = showDragon;
  this.pause = pause;
  this.setStartLine = setStartLine;
  this.setLevel = setLevel;
  this.setTime = setTime;
  this.newGameDataByLine = newGameDataByLine;
  this.setScore = setScore;
  this.clearLineAnimation = clearLineAnimation;
};

export default Game;
