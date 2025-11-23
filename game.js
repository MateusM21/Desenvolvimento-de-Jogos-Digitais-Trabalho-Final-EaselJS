var stage, loader, flappy, jumpListener, pipeCreator, score, scoreText, scoreTextOutline;
var started = false;
var pipeContainer; 
var uiContainer; 
var gameSpeed = 1; 

// --- VARIÁVEIS DE ÁUDIO ---
var somPulo, somHit, somPonto, musicaFundo; // Adicionada musicaFundo
var volumeSFX = 1.0;    // Volume dos Efeitos
var volumeMusica = 1.0; // Volume da Música
var estaMudo = false;

// Variáveis de Pontuação
var lastScore = 0;
var coinsCollected = 0; 

// Elementos da Interface
var coinUiText, coinUiTextOutline, coinUiIcon;

// Variável da Animação da Moeda
var coinSpriteSheet;

function init() {
  stage = new createjs.StageGL("gameCanvas");

  createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
  createjs.Ticker.framerate = 60;
  createjs.Ticker.addEventListener("tick", stage);

  var background = new createjs.Shape();
  background.graphics.beginLinearGradientFill(["#2573BB", "#6CB8DA", "#567A32"], [0, 0.85, 1], 0, 0, 0, 480)
  .drawRect(0, 0, 320, 480);
  background.name = "background";
  background.cache(0, 0, 320, 480);

  stage.addChild(background);

  // --- CARREGAMENTO DE SONS ---
  // Efeitos
  somPulo = new Audio("img/sfx_wing.wav"); somPulo.preload = 'auto';
  somHit = new Audio("img/sfx_hit.wav"); somHit.preload = 'auto';
  somPonto = new Audio("img/sfx_point.wav"); somPonto.preload = 'auto';
  
  // Música de Fundo (BGM)
  musicaFundo = new Audio("img/bgm.mp3"); 
  musicaFundo.preload = 'auto';
  musicaFundo.loop = true; // Faz a música repetir para sempre

  // --- CARREGAMENTO DE IMAGENS ---
  var manifest = [
    { "src": "cloud.png", "id": "cloud" },
    { "src": "flappy.png", "id": "flappy" },
    { "src": "pipe.png", "id": "pipe" },
    { "src": "MonedaD.png", "id": "coinsImg" } 
  ];

  loader = new createjs.LoadQueue(true);
  loader.addEventListener("complete", handleComplete);
  loader.addEventListener("error", (e) => console.error("ERRO IMG:", e.item.src));
  loader.loadManifest(manifest, true, "./img/");
}

function handleComplete() {
  var imgCoins = loader.getResult("coinsImg");
  if(imgCoins) {
      var coinData = {
          images: [imgCoins],
          frames: { width: 16, height: 16, regX: 8, regY: 8 },
          animations: { spin: { frames: [0, 1, 2, 3, 4], speed: 0.15 } }
      };
      coinSpriteSheet = new createjs.SpriteSheet(coinData);
  }

  started = false;
  
  pipeContainer = new createjs.Container();
  stage.addChild(pipeContainer);

  createClouds();
  createFlappy();
  
  uiContainer = new createjs.Container();
  stage.addChild(uiContainer);
  
  createInterface(); 
}

// ==========================================
//      CONTROLE DE ÁUDIO AVANÇADO
// ==========================================

// Chamado pelo Slider de Efeitos
function ajustarVolumeSFX(valor) {
    volumeSFX = parseFloat(valor);
    document.getElementById("sfx-display").innerText = "EFEITOS: " + Math.round(volumeSFX * 100) + "%";
    checkMudoAutomatico();
    aplicarVolumes();
}

// Chamado pelo Slider de Música
function ajustarVolumeMusica(valor) {
    volumeMusica = parseFloat(valor);
    document.getElementById("bgm-display").innerText = "MÚSICA: " + Math.round(volumeMusica * 100) + "%";
    checkMudoAutomatico();
    aplicarVolumes();
}

// Se mexer no slider, desmarca o "Mudo" se estava marcado
function checkMudoAutomatico() {
    if (estaMudo && (volumeSFX > 0 || volumeMusica > 0)) {
        estaMudo = false;
        document.getElementById("mute-check").checked = false;
    }
}

function alternarMudo() {
    estaMudo = document.getElementById("mute-check").checked;
    aplicarVolumes();
}

// Aplica os volumes atuais a todos os sons
function aplicarVolumes() {
    // Se estiver mudo, volume é 0. Se não, usa o volume do slider.
    var volS = estaMudo ? 0 : volumeSFX;
    var volM = estaMudo ? 0 : volumeMusica;
    
    if(somPulo) somPulo.volume = volS;
    if(somHit) somHit.volume = volS;
    if(somPonto) somPonto.volume = volS;
    
    if(musicaFundo) musicaFundo.volume = volM;
}

// ==========================================
//      LÓGICA DO MENU
// ==========================================

function iniciarJogoPeloMenu() {
  document.getElementById("menu-overlay").classList.add("hidden");
  
  // Desbloqueia Efeitos (Toca mudo rapidinho)
  [somPulo, somHit, somPonto].forEach(audio => {
      if(audio) {
          audio.volume = 0; // Começa baixo para desbloquear
          audio.play().then(() => {
              audio.pause();
              audio.currentTime = 0;
          }).catch(e => {});
      }
  });

  // Inicia a Música de Fundo
  if (musicaFundo) {
      // Aplica volume configurado antes de tocar
      musicaFundo.volume = estaMudo ? 0 : volumeMusica;
      musicaFundo.play().catch(e => console.log("Erro BGM:", e));
  }

  // Garante que os volumes corretos sejam aplicados após o desbloqueio
  setTimeout(aplicarVolumes, 100);

  iniciarLogicaJogo();
}

function iniciarLogicaJogo() {
    jumpListener = stage.on("stagemousedown", jumpFlappy);
    createjs.Ticker.addEventListener("tick", checkCollision);
    createjs.Ticker.addEventListener("tick", checkCoinCollision); 
    startGame();
}

function abrirOpcoes() {
  document.getElementById("main-menu").classList.add("hidden");
  document.getElementById("options-menu").classList.remove("hidden");
}

function voltarMenu() {
  document.getElementById("options-menu").classList.add("hidden");
  document.getElementById("main-menu").classList.remove("hidden");
}

function abrirPontuacao() {
    var bestScore = localStorage.getItem("flappyBestScore") || 0;
    document.getElementById("menu-last-score").innerText = lastScore;
    document.getElementById("menu-best-score").innerText = bestScore;
    document.getElementById("main-menu").classList.add("hidden");
    document.getElementById("score-menu").classList.remove("hidden");
}

function fecharPontuacao() {
    document.getElementById("score-menu").classList.add("hidden");
    document.getElementById("main-menu").classList.remove("hidden");
}

function mudarVelocidade(velocidade) {
  gameSpeed = velocidade;
  document.getElementById("sp-1").classList.remove("selected");
  document.getElementById("sp-1-5").classList.remove("selected");
  if(velocidade === 1) document.getElementById("sp-1").classList.add("selected");
  if(velocidade === 1.6) document.getElementById("sp-1-5").classList.add("selected");
}

function restartGameImmediate() {
    limparStage();
    document.getElementById("menu-overlay").classList.add("hidden");
    document.getElementById("game-over-menu").classList.add("hidden");
    handleComplete();
    // Se a música parou por algum motivo, garante que ela volta
    if(musicaFundo && musicaFundo.paused && !estaMudo && volumeMusica > 0) {
        musicaFundo.play().catch(e=>{});
    }
    iniciarLogicaJogo();
}

// ==========================================
//              LÓGICA DO JOGO
// ==========================================

function startGame() {
  started = true;
  createPipes();
  var intervalo = 2200 / gameSpeed;
  pipeCreator = setInterval(createPipes, intervalo);
  jumpFlappy();
}

function createClouds() {
  var clouds = [];
  for (var i = 0; i < 3; i++) {
    var img = loader.getResult("cloud");
    if(img) clouds.push(new createjs.Bitmap(img));
  }
  if(clouds.length > 0) {
      clouds[0].x = 40; clouds[0].y = 20;
      clouds[1].x = 140; clouds[1].y = 70;
      clouds[2].x = 100; clouds[2].y = 130;
      for (var i = 0; i < 3; i++) {
        var dir = i % 2 == 0 ? -1 : 1;
        var dur = 5000 / gameSpeed;
        createjs.Tween.get(clouds[i], { loop: true})
        .to({ x: clouds[i].x - (200 * dir)}, dur, createjs.Ease.getPowInOut(2))
        .to({ x: clouds[i].x }, dur, createjs.Ease.getPowInOut(2));
        stage.addChild(clouds[i]);
      }
  }
}

function createFlappy() {
  var img = loader.getResult("flappy");
  if(!img) return;
  flappy = new createjs.Bitmap(img);
  flappy.regX = flappy.image.width / 2;
  flappy.regY = flappy.image.height / 2;
  flappy.x = stage.canvas.width / 2;
  flappy.y = stage.canvas.height / 2;
  flappy.radius = 12; 
  stage.addChild(flappy);
}

function jumpFlappy() {
  if (somPulo) { 
      somPulo.currentTime = 0; 
      // Volume já é controlado pela função aplicarVolumes(), mas reforçamos:
      somPulo.volume = estaMudo ? 0 : volumeSFX; 
      somPulo.play().catch(e => {}); 
  }
  
  var tSubida = 350 / gameSpeed;
  var tDescida = 900 / gameSpeed;
  createjs.Tween.get(flappy, { override: true })
  .to({ y: flappy.y - 60, rotation: -10 }, tSubida, createjs.Ease.getPowOut(2))
  .to({ y: stage.canvas.height + (flappy.image.width / 2), rotation: 30 }, tDescida, createjs.Ease.getPowIn(2))
  .call(gameOver);
}

function createPipes() {
  var imgPipe = loader.getResult("pipe");
  if(!imgPipe) return;

  var topPipe = new createjs.Bitmap(imgPipe);
  var bottomPipe = new createjs.Bitmap(imgPipe);
  var position = Math.floor(Math.random() * 280 + 100);

  topPipe.y = position - 75;
  topPipe.x = stage.canvas.width + (topPipe.image.width / 2);
  topPipe.scaleY = -1; 
  topPipe.name = "pipe";

  bottomPipe.y = position + 75;
  bottomPipe.x = stage.canvas.width + (bottomPipe.image.width / 2);
  bottomPipe.name = "pipe";
  topPipe.regX = bottomPipe.regX = topPipe.image.width / 2;

  var dur = 4000 / gameSpeed;
  
  createjs.Tween.get(topPipe).to({ x: 0 - topPipe.image.width }, dur).call(function() { removeObject(topPipe); })
  .addEventListener("change", updatePipe);
  createjs.Tween.get(bottomPipe).to( { x: 0 - bottomPipe.image.width }, dur).call(function() { removeObject(bottomPipe); });

  if(coinSpriteSheet && Math.random() < 0.35) {
      var coin = new createjs.Sprite(coinSpriteSheet, "spin");
      coin.regX = 8; coin.regY = 8;
      coin.x = topPipe.x;
      coin.y = position; 
      coin.name = "coin";
      coin.radius = 10;
      createjs.Tween.get(coin).to({ x: -50 }, dur).call(function() { removeObject(coin); });
      pipeContainer.addChild(bottomPipe, topPipe, coin);
  } else {
      pipeContainer.addChild(bottomPipe, topPipe);
  }
}

function removeObject(obj) {
  if(pipeContainer.contains(obj)) pipeContainer.removeChild(obj);
}
function removePipe(pipe) { removeObject(pipe); }

function updatePipe(event) {
  var p = event.target.target;
  if ((p.x - p.regX + p.image.width) < (flappy.x - flappy.regX)) {
    event.target.removeEventListener("change", updatePipe);
    incrementScore(); 
  }
}

function checkCoinCollision() {
    if (!started) return;
    var coins = pipeContainer.children.filter(child => child.name === "coin");
    for (var i = 0; i < coins.length; i++) {
        var c = coins[i];
        var dx = flappy.x - c.x;
        var dy = flappy.y - c.y;
        var dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < flappy.radius + c.radius) { collectCoin(c); }
    }
}

function collectCoin(coin) {
    removeObject(coin);
    incrementCoins();
}

function checkCollision() {
  var lx = flappy.x - flappy.regX + 5;
  var ly = flappy.y - flappy.regY + 5;
  var points = [
    new createjs.Point(lx, ly),
    new createjs.Point(lx + flappy.image.width - 10, ly),
    new createjs.Point(lx, ly + flappy.image.height - 10),
    new createjs.Point(lx + flappy.image.width - 10, ly + flappy.image.height - 10)
  ];

  for (var i = 0; i < points.length; i++) {
    var objs = stage.getObjectsUnderPoint(points[i].x, points[i].y);
    if (objs.filter((o) => o.name == "pipe").length > 0) {
      if(somHit) { 
          somHit.currentTime = 0; 
          somHit.volume = estaMudo ? 0 : volumeSFX;
          somHit.play().catch(e => {}); 
      }
      gameOver();
      return;
    }
  }
}

function createInterface() {
  score = 0;
  scoreText = new createjs.Text(score, "24px 'Press Start 2P'", "#FFFFFF");
  scoreText.x = 20; scoreText.y = 30;
  scoreText.textAlign = "left";
  scoreText.cache(-5, -5, 150, 50);

  scoreTextOutline = scoreText.clone();
  scoreTextOutline.color = "#000000";
  scoreTextOutline.outline = 4;
  scoreTextOutline.cache(-5, -5, 150, 50);

  uiContainer.addChild(scoreTextOutline, scoreText);

  coinsCollected = 0;
  
  if(coinSpriteSheet) {
      coinUiIcon = new createjs.Sprite(coinSpriteSheet, "spin");
      coinUiIcon.x = 290; 
      coinUiIcon.y = 30;  
      coinUiIcon.scaleX = coinUiIcon.scaleY = 1.5;
      coinUiIcon.regX = 8; coinUiIcon.regY = 8;
      uiContainer.addChild(coinUiIcon);
  }

  coinUiText = new createjs.Text(coinsCollected, "18px 'Press Start 2P'", "#FFD700");
  coinUiText.x = 270; coinUiText.y = 30; 
  coinUiText.textAlign = "right";
  coinUiText.textBaseline = "middle"; 
  coinUiText.cache(-150, -20, 160, 50);

  coinUiTextOutline = coinUiText.clone();
  coinUiTextOutline.color = "#000000";
  coinUiTextOutline.outline = 4; 
  coinUiTextOutline.cache(-150, -20, 160, 50);

  uiContainer.addChild(coinUiTextOutline, coinUiText);
}

function incrementScore() {
  score++;
  if (somPonto) { 
      somPonto.currentTime = 0; 
      somPonto.volume = estaMudo ? 0 : volumeSFX;
      somPonto.play().catch(e => {}); 
  }
  scoreText.text = scoreTextOutline.text = score;
  scoreText.updateCache();
  scoreTextOutline.updateCache();
}

function incrementCoins() {
  coinsCollected++;
  coinUiText.text = coinUiTextOutline.text = coinsCollected;
  coinUiText.updateCache();
  coinUiTextOutline.updateCache();
}

function gameOver() {
  createjs.Tween.removeAllTweens();
  stage.off("stagemousedown", jumpListener);
  clearInterval(pipeCreator);
  createjs.Ticker.removeEventListener("tick", checkCollision);
  createjs.Ticker.removeEventListener("tick", checkCoinCollision);

  lastScore = score;
  var bestScore = localStorage.getItem("flappyBestScore") || 0;
  if (score > bestScore) {
      bestScore = score;
      localStorage.setItem("flappyBestScore", bestScore);
  }
  
  var elScore = document.getElementById("final-score");
  var elBest = document.getElementById("best-score");
  if(elScore) elScore.innerText = score;
  if(elBest) elBest.innerText = bestScore;

  document.getElementById("menu-overlay").classList.remove("hidden");
  document.getElementById("main-menu").classList.add("hidden");
  document.getElementById("options-menu").classList.add("hidden");
  document.getElementById("score-menu").classList.add("hidden");
  document.getElementById("game-over-menu").classList.remove("hidden");
}

function limparStage() {
    stage.removeAllChildren();
    var background = new createjs.Shape();
    background.graphics.beginLinearGradientFill(["#2573BB", "#6CB8DA", "#567A32"], [0, 0.85, 1], 0, 0, 0, 480)
    .drawRect(0, 0, 320, 480);
    background.name = "background";
    background.cache(0, 0, 320, 480);
    stage.addChild(background);
}

function resetGame() {
  limparStage();
  document.getElementById("menu-overlay").classList.remove("hidden");
  document.getElementById("main-menu").classList.remove("hidden");
  document.getElementById("game-over-menu").classList.add("hidden");
  document.getElementById("score-menu").classList.add("hidden");
  handleComplete();
}