import bindEvent from './event';
import Game from './game';
import myMusic from './music';

const Local = function() {
  // dom
  const doms = {
    gameDiv: document.getElementById('game'),
    nextDiv: document.getElementById('next'),
    timeDiv: document.getElementById('status-time'),
    scoreDiv: document.getElementById('score'),
    startLineDiv: document.getElementById('line'),
    levelDiv: document.getElementById('level'),
    dragonDiv: document.getElementById('dragon'),
    left: document.getElementById('left'),
    right: document.getElementById('right'),
    rotate: document.getElementById('rotate'),
    down: document.getElementById('down'),
    drop: document.getElementById('drop'),
    pause: document.getElementById('pause'),
    sound: document.getElementById('sound'),
    again: document.getElementById('again'),
    statusPause: document.getElementById('status-pause'),
    statusSound: document.getElementById('status-sound'),
    scoreName: document.getElementById('score-name')
  };

  // 游戏对象
  const game = new Game();

  // 声音
  const music = myMusic();

  // 历史分数
  const scores = [];

  // 当前分数
  let curScore = 0;

  // 定时器
  let timer = null;

  // 下落速度
  game.INTERVAL = 0;

  // 不同级别对应的速度
  const LEVEL_SPEED = [500, 450, 400, 350, 300, 250];

  /*
  *  分数--级别对应关系
  *  级别1 0-1000, 2 1000-2000, 3 2000-3000, 4 3000-4000, 5 4000-5000 6 >=5000
  */
  const LEVEL1_SCORE = 1000;
  const LEVEL2_SCORE = 2000;
  const LEVEL3_SCORE = 3000;
  const LEVEL4_SCORE = 4000;
  const LEVEL5_SCORE = 5000;

  // 获取时间间隔
  const TIME_INTERVAL = 30000;

  // 暂停标志位
  game.isPaused = false;

  // 最高分、上轮得分动画id
  let animID = null;

  // 方块类型
  const generateType = () => Math.floor(Math.random() * 7);

  // 方块方向
  const generateDir = () => Math.floor(Math.random() * 4);

  // 移动
  const move = () => {  

    if (!game.down()) { // 不能下降时
      game.fixed();
      const lines = game.checkClear();

      if (game.checkGameOver()) {
        end();
      } else {
        if (lines.length > 0) { // 消行
          music.clear && music.clear();
          curScore = game.addScore(lines.length);
          game.clearLineAnimation(lines, performNext);
        } else {
          performNext();
        }
      }
    }   
  };

  // 下一块
  const performNext = () => {
    game.performNext(generateType(), generateDir());
    // 升级
    levelUpByScore(curScore);
  };

  // 级别标志位
  let level2 = false, level3 = false, level4 = false, level5 = false, level6 = false;

  // 根据分数改变级别
  const levelUpByScore = curScore => {
    
    // 游戏起始级别对应的起始分数
    switch (game.beforeStartLevel) {
      case 1: 
        if (curScore < LEVEL1_SCORE) {       
          return;
        } else {
          break;
        }
      case 2: 
        if (curScore < LEVEL2_SCORE) {       
          return;
        } else {
          break;
        }
      case 3: 
        if (curScore < LEVEL3_SCORE) {      
          return;
        } else {
          break;
        }
      case 4: 
        if (curScore < LEVEL4_SCORE) {        
          return;
        } else {
          break;
        }
      case 5: 
        if (curScore < LEVEL5_SCORE) {        
          return;
        } else {
          break;
        }
      case 6: 
        return;
    }
    
    switch (true) {
      case curScore < LEVEL2_SCORE:
        if (!level2) {                  
          changeDownSpeedByLevel(2);
          level2 = true;
        }
        break;
      case curScore < LEVEL3_SCORE:
        if (!level3) {
          changeDownSpeedByLevel(3);
          level3 = true;
        }
        break;
      case curScore < LEVEL4_SCORE:
        if (!level4) {
          changeDownSpeedByLevel(4);
          level4 = true;
        }
        break;
      case curScore < LEVEL5_SCORE:
        if (!level5) {
          changeDownSpeedByLevel(5);
          level5 = true;
        }
        break;
      case curScore >= LEVEL5_SCORE:
        if (!level6) {
          changeDownSpeedByLevel(6);
          level6 = true;
        }
        break;
      default: 
        break;
    }
  };

  // 根据级别改变下落速度
  const changeDownSpeedByLevel = level => {
    game.level = level;
    game.INTERVAL = game.setLevel(game, null, LEVEL_SPEED);
    clearInterval(timer);
    timer = null;
    timer = setInterval(move, game.INTERVAL); 
  };

  // 初始化
  const init = () => {
    game.init(doms, generateType(), generateDir());
    // 起始行数
    game.setStartLine(game);
    // 时间
    game.setTime();
    setInterval(game.setTime, TIME_INTERVAL);
    // 级别
    game.INTERVAL = game.setLevel(game, null, LEVEL_SPEED);

    // 绑定事件
    game.start = start;
    game.pause = pause;
    game.end = end;
    game.LEVEL_SPEED = LEVEL_SPEED;
    bindEvent(doms, game, music);

    // 恐龙动画
    doms.dragonDiv.style.display = 'block';
    game.showDragon(game, music);

    if (scores.length != 0) {
      showHighestScore();
    }
  };

  // 开始
  const start = () => {

    if (game.isPaused) { // 暂停
      doms.statusPause.className = 'status-pause';
    } else { // 第一次开始游戏
      game.newGameDataByLine(game);
      doms.dragonDiv.style.display = 'none';
      doms.dragonDiv.className = 'dragon';
      cancelAnimationFrame(animID);
      animID = null;
      doms.scoreName.innerText = '得分';
      game.setScore(0);
    }
    move();
    timer = setInterval(move, game.INTERVAL);
    game.gameStart = false;
    game.isPaused = false;
  };

  // 结束
  const end = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;    
    }
    
    // 结束动画
    if (game.isPaused) {
      doms.statusPause.className = 'status-pause';
      game.isPaused = false;
    }
    game.gameOver(game, music);

    // 添加当前分数到历史分数组
    scores.push(curScore);
    showHighestScore();
    
  };

  // 暂停
  const pause = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
      game.gameStart = true;
      game.isPaused = true;
      doms.statusPause.className = 'status-pause pause-flash';
    }
  };

  // 显示最高分和上轮得分
  const showHighestScore = () => {
    const highestScore = Math.max.apply(null, scores);
    const prevScore = scores[scores.length - 1];
    
    let count = 0;
    let flag1 = false;
    let flag2 = false;

    function fn() {      
      if (count / 200 < 1) {
        if (!flag1) {
          doms.scoreName.innerText = '最高得分';
          game.setScore(highestScore);
          flag1 = true;
          flag2 = false;       
        }
      } else {
        if (count > 400) count = 0;
        if (!flag2) {
          doms.scoreName.innerText = '上轮得分';
          game.setScore(prevScore);
          flag2 = true;
          flag1 = false;
        }
      }
      count++;
      animID = requestAnimationFrame(fn);
    }
    animID = requestAnimationFrame(fn);
  };

  // 导出
  this.init = init;
};

export default Local;
