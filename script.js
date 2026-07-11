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

// --- STAGE 4: THE FINAL BOSS (MODAL OPEN/CLOSE) ---
document.addEventListener('DOMContentLoaded', () => {
    const goodbyeBtn = document.getElementById('goodbye-btn');
    const videoModal = document.getElementById('video-modal');
    const videoCard = document.getElementById('video-card');
    const finalVideo = document.getElementById('final-video');
    const closeVideoBtn = document.getElementById('close-video-btn');

    if (goodbyeBtn && videoModal) {
        // OPEN MODAL ACTION
        goodbyeBtn.addEventListener('click', () => {
            // Remove hidden structure class
            videoModal.classList.remove('hidden');
            
            // Allow browser paint cycle before triggering CSS animations
            setTimeout(() => {
                videoModal.classList.remove('opacity-0', 'pointer-events-none');
                videoModal.classList.add('opacity-100');
                
                if (videoCard) {
                    videoCard.classList.remove('scale-95');
                    videoCard.classList.add('scale-100');
                }
                
                // Attempt automatic playback (Will catch if browser requires manual tap interaction)
                finalVideo.play().catch(err => {
                    console.log("Autoplay paused by browser policy. Awaiting Queen Iris's input.");
                });
            }, 20);
        });
    }

    if (closeVideoBtn && videoModal) {
        // CLOSE MODAL ACTION
        closeVideoBtn.addEventListener('click', () => {
            // Pause the video immediately so the audio doesn't keep playing in the background
            finalVideo.pause();
            
            // Trigger exit fade and shrink animations
            videoModal.classList.remove('opacity-100');
            videoModal.classList.add('opacity-0', 'pointer-events-none');
            
            if (videoCard) {
                videoCard.classList.remove('scale-100');
                videoCard.classList.add('scale-95');
            }

            // Hide structure completely after transition completes
            setTimeout(() => {
                videoModal.classList.add('hidden');
            }, 300);
        });
    }
});

// --- LIGHTBOX CLICK-TO-ZOOM IN LOGIC ---
document.addEventListener('DOMContentLoaded', () => {
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');

    // Select all image elements inside your reward grid cards
    const gridCards = document.querySelectorAll('#reward-stage .grid > div');

    gridCards.forEach(card => {
        const img = card.querySelector('img');
        const caption = card.querySelector('p');

        if (img) {
            // Make individual cards indicate they are interactable
            card.classList.add('cursor-zoom-in');

            card.addEventListener('click', () => {
                // Set modal image src and text context
                lightboxImg.src = img.src;
                lightboxCaption.innerText = caption ? caption.innerText : "";

                // Show modal structure 
                lightboxModal.classList.remove('hidden');
                
                // Allow browser drawing cycle to trigger CSS layout state before transition
                setTimeout(() => {
                    lightboxModal.classList.remove('pointer-events-none', 'opacity-0');
                    lightboxModal.classList.add('opacity-100');
                    lightboxImg.classList.remove('scale-95');
                    lightboxImg.classList.add('scale-100');
                }, 20);
            });
        }
    });

    // Close function layout
    function closeLightbox() {
        lightboxModal.classList.remove('opacity-100');
        lightboxModal.classList.add('opacity-0', 'pointer-events-none');
        lightboxImg.classList.remove('scale-100');
        lightboxImg.classList.add('scale-95');

        // Hide entirely from view after transition completes
        setTimeout(() => {
            lightboxModal.classList.add('hidden');
            lightboxImg.src = "";
        }, 300);
    }

    // Dismiss light box upon hitting close trigger or background click bounds
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxModal.addEventListener('click', (e) => {
        // Only close if user clicks the backdrop or image wrapper element boundaries
        if (e.target === lightboxModal || e.target.parentElement === lightboxModal) {
            closeLightbox();
        }
    });

    // Accessibility fallback escape key trigger
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !lightboxModal.classList.contains('hidden')) {
            closeLightbox();
        }
    });
});