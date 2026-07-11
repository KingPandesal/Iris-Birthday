// --- Configuration & DOM elements ---
const introStage = document.getElementById('intro-stage');
const gameStage = document.getElementById('game-stage');
const rewardStage = document.getElementById('reward-stage');
const typedTextEl = document.getElementById('typed-text');
const progressBar = document.getElementById('intro-progress');

// Intro Messages
const messages = [
    "First off... thank you for being the absolute best friend anyone could ask for. 🥺✨",
    "Salamat sa mga kulitan natin, sa mga moments na sumasakit na mga tiyan natin kakatawa.",
    "Always ko ich-cherish moments natin together kahit nakalimutan mo na, HAHAHA!",
    "Yung halos wala na tayong ligo kakabantay sa New Sibonga.",
    "Sa mga late-night libangan natin sa Bongbong dati na halos pagalitan na tayo ng parents natin. 😅",
    "Yung mga times na halos ayaw na natin umuwi sa mga bahay natin kasi masaya tayo sa isa't isa.",
    "Yung foodtrip natin sa gilid ng kalsada. Kahit walang lamesa at wala masyadong pera, goods na.",
    "We may not always be together na ngayon physically, but I want you to know that you are always in my heart. 💖",
    "AYMISHU AND ILABYUUUUUU! 🥰",
    "WHY AM I CRYING HABANG GINAGAWA TO?!! 😭",
    "You deserve the absolute world today (and every single day)!",
    "BUT! Before you get your birthday rewards...",
    "You have to prove your worth in a quick game. Ready? 🎬"
];

let currentMsgIndex = 0;

// --- STAGE 1: CUTESY INTRO ANIMATION TIMELINE ---
function runIntro() {
    if (currentMsgIndex < messages.length) {
    // Fade out text gently
    typedTextEl.style.opacity = 0;
    
    setTimeout(() => {
        // Change text and fade back in
        typedTextEl.innerText = messages[currentMsgIndex];
        typedTextEl.style.opacity = 1;
        
        // Advance progress bar
        currentMsgIndex++;
        const progressPercentage = (currentMsgIndex / messages.length) * 100;
        progressBar.style.width = `${progressPercentage}%`;
        
        // Wait 4 seconds before moving to the next message
        setTimeout(runIntro, 4000);
    }, 500);
    } else {
    // Transition to Game Stage
    introStage.classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
        introStage.classList.add('hidden');
        gameStage.classList.remove('hidden');
        startGame();
    }, 700);
    }
}

// Start intro sequence short shortly after load
setTimeout(runIntro, 1000);


// --- STAGE 2: THE GAME ENGINE ---
const gameArea = document.getElementById('game-area');
const player = document.getElementById('player');
const scoreEl = document.getElementById('score');

let score = 0;
let gameInterval;
const fallingItems = ['💖', '🌟', '🧁', '🎈', '✨'];

// Move player basket via mouse movement or tap inside game area
gameArea.addEventListener('mousemove', (e) => {
    const rect = gameArea.getBoundingClientRect();
    let relX = e.clientX - rect.left;
    // Clamp values within game box boundaries
    if(relX < 20) relX = 20;
    if(relX > rect.width - 20) relX = rect.width - 20;
    player.style.left = `${relX}px`;
});

gameArea.addEventListener('touchmove', (e) => {
    const rect = gameArea.getBoundingClientRect();
    let relX = e.touches[0].clientX - rect.left;
    if(relX < 20) relX = 20;
    if(relX > rect.width - 20) relX = rect.width - 20;
    player.style.left = `${relX}px`;
});

function startGame() {
    // Spawn a new falling object every 900ms
    gameInterval = setInterval(spawnItem, 900);
}

function spawnItem() {
    if (score >= 10) {
    clearInterval(gameInterval);
    endGame();
    return;
    }

    const item = document.createElement('div');
    item.className = 'absolute text-2xl select-none pointer-events-none transition-all duration-75';
    item.innerText = fallingItems[Math.floor(Math.random() * fallingItems.length)];
    
    // Random horizontal starting position
    const areaWidth = gameArea.clientWidth;
    const startX = Math.random() * (areaWidth - 30);
    item.style.left = `${startX}px`;
    item.style.top = `-30px`;
    
    gameArea.appendChild(item);

    let currentTop = -30;
    const fallSpeed = 3 + Math.random() * 3; // randomized speeds

    function fall() {
    if (score >= 10) {
        item.remove();
        return;
    }

    currentTop += fallSpeed;
    item.style.top = `${currentTop}px`;

    // Check if item reaches player height boundary
    if (currentTop > gameArea.clientHeight - 55 && currentTop < gameArea.clientHeight - 15) {
        const playerX = player.offsetLeft;
        const itemX = item.offsetLeft;

        // Catch collision registration width check
        if (Math.abs(itemX - playerX) < 35) {
        score++;
        scoreEl.innerText = score;
        item.remove();
        
        // Pop effect on player when catching items
        player.classList.add('scale-125');
        setTimeout(() => player.classList.remove('scale-125'), 100);
        return;
        }
    }

    // Remove item if it misses and hits the floor
    if (currentTop < gameArea.clientHeight) {
        requestAnimationFrame(fall);
    } else {
        item.remove();
    }
    }

    requestAnimationFrame(fall);
}

// --- STAGE 3: SHOW REWARDS ---
function endGame() {
    gameStage.classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
    gameStage.classList.add('hidden');
    rewardStage.classList.remove('hidden');
    // Simple confetti trigger effect via document styling fallback
    document.body.style.backgroundColor = '#C4F2F7';
    }, 500);
}