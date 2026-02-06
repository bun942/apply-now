document.addEventListener('DOMContentLoaded', () => {
    // --- State & Elements ---
    let currentPage = 1;
    let musicPlaying = false;
    let noClickCount = 0;

    const elements = {
        heartsContainer: document.getElementById('hearts-container'),
        musicBtn: document.getElementById('music-toggle'),
        bgMusic: document.getElementById('bg-music'),
        page1: document.getElementById('page-1'),
        page2: document.getElementById('page-2'),
        page3: document.getElementById('page-3'),
        apologyText: document.getElementById('apology-text'),
        continueBtn: document.getElementById('continue-btn'),
        questionText: document.getElementById('question-text'),
        yesBtn: document.getElementById('yes-btn'),
        noBtn: document.getElementById('no-btn'),
        acceptanceText: document.getElementById('acceptance-text'),
        spamContainer: document.getElementById('spam-container'),
        finalBanner: document.getElementById('final-banner')
    };

    // --- Content ---
    const apologyLines = [
        "Hey... ",
        "Before anything else — I owe you an apology.",
        "I’m really sorry for acting rude earlier.",
        "I was exhausted from work, drained from travelling, and honestly… I behaved like a complete idiot 😅",
        "That’s on me.",
        "Truth is, I do want to see you in that dress for the engagement ceremony.",
        "(And yes — you’re going to look unreal.)",
        "If you forgive me, send me the address.",
        "If my dentist appointment finishes by 11, I’ll come pick you up.",
        "Otherwise, I’ll meet you directly at the gym.",
        "Deal? 💙"
    ];

    const questionLines = ["Will you be my long-distance Valentine? 💌"];
    const rejectionLines = ["Try again, garru 😌"]; // "Garru" or similar term of endearment meant? Kept as requested.

    // --- Global Animations (Hearts) ---
    function spawnHeart() {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.innerText = Math.random() > 0.5 ? '💙' : '🤍'; // Blue and White hearts
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDuration = (Math.random() * 3 + 5) + 's'; // 5-8s duration
        heart.style.fontSize = (Math.random() * 20 + 10) + 'px';

        elements.heartsContainer.appendChild(heart);

        // Cleanup
        setTimeout(() => {
            heart.remove();
        }, 8000);
    }

    // Spawn hearts periodically
    setInterval(spawnHeart, 500);

    // --- Audio ---
    elements.musicBtn.addEventListener('click', () => {
        if (!musicPlaying) {
            elements.bgMusic.volume = 0; // Start at 0
            elements.bgMusic.play().then(() => {
                musicPlaying = true;
                elements.musicBtn.innerText = "Sound On 🎵";
                elements.musicBtn.style.opacity = '0.5';

                // Fade in
                let vol = 0;
                const interval = setInterval(() => {
                    if (vol < 1) {
                        vol += 0.05;
                        elements.bgMusic.volume = Math.min(vol, 1);
                    } else {
                        clearInterval(interval);
                    }
                }, 100);

            }).catch(e => console.log("Audio play failed:", e));
        } else {
            // Fade out then pause
            let vol = elements.bgMusic.volume;
            const interval = setInterval(() => {
                if (vol > 0) {
                    vol -= 0.05;
                    elements.bgMusic.volume = Math.max(vol, 0);
                } else {
                    clearInterval(interval);
                    elements.bgMusic.pause();
                    musicPlaying = false;
                    elements.musicBtn.innerText = "Enable Sound 🎵";
                    elements.musicBtn.style.opacity = '1';
                }
            }, 100);
        }
    });

    // --- Typing Engine ---
    async function typeParagraphs(container, lines, speed = 30) {
        container.innerHTML = ''; // Clear previous

        for (let line of lines) {
            const p = document.createElement('p');
            p.classList.add('typing-cursor');
            container.appendChild(p);

            // Re-trigger layout for animation
            p.classList.add('visible');

            for (let char of line) {
                p.textContent += char;
                await new Promise(r => setTimeout(r, speed));
            }

            p.classList.remove('typing-cursor');
            await new Promise(r => setTimeout(r, 300)); // Pause between lines
        }
    }

    async function typeText(element, text, speed = 50) {
        element.textContent = '';
        element.classList.add('typing-cursor');

        for (let char of text) {
            element.textContent += char;
            await new Promise(r => setTimeout(r, speed));
        }
        element.classList.remove('typing-cursor');
    }

    // --- Page 1 Logic ---
    async function startPage1() {
        await typeParagraphs(elements.apologyText, apologyLines);
        elements.continueBtn.classList.remove('hidden');

        // Pop in effect for button
        elements.continueBtn.style.animation = "popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards";
    }

    elements.continueBtn.addEventListener('click', () => {
        // Transition to Page 2
        elements.page1.classList.remove('active');
        elements.page1.classList.add('hidden');

        setTimeout(() => {
            elements.page2.classList.remove('hidden');
            elements.page2.classList.add('active');
            startPage2();
        }, 600);
    });

    // --- Page 2 Logic ---
    async function startPage2() {
        await typeParagraphs(elements.questionText, questionLines, 50);
    }

    elements.noBtn.addEventListener('click', async () => {
        noClickCount++;

        // 1. Shrink NO, Grow YES
        const currentNoScale = 1 - (noClickCount * 0.1);
        const currentYesScale = 1 + (noClickCount * 0.2);

        if (currentNoScale > 0) {
            elements.noBtn.style.transform = `scale(${currentNoScale})`;
            elements.yesBtn.style.transform = `scale(${currentYesScale})`;
        } else {
            // Cap it: Make NO tiny and unclickable essentially, or just move it away
            elements.noBtn.style.opacity = '0';
            elements.noBtn.style.pointerEvents = 'none';
        }

        // 2. Shake NO
        elements.noBtn.classList.add('shake');
        setTimeout(() => elements.noBtn.classList.remove('shake'), 500);

        // 3. Retype text
        // Clear current text
        elements.questionText.innerHTML = '';
        const p = document.createElement('p');
        p.classList.add('visible');
        elements.questionText.appendChild(p);

        // Type Sassy/Sad response
        await typeText(p, rejectionLines[0]);
        await new Promise(r => setTimeout(r, 1000));

        // Retype question
        await typeText(p, questionLines[0]);
    });

    elements.yesBtn.addEventListener('click', () => {
        // Transition to Page 3
        elements.page2.classList.remove('active');
        elements.page2.classList.add('hidden');

        // Heart Burst
        for (let i = 0; i < 30; i++) {
            setTimeout(spawnHeart, i * 50);
        }

        setTimeout(() => {
            document.body.classList.add('dark-mode'); // Switch bg to black
            elements.page3.classList.remove('hidden');
            elements.page3.classList.add('active');
            startPage3();
        }, 600);
    });

    // --- Page 3 Logic ---
    async function startPage3() {
        const p = document.createElement('p');
        p.classList.add('visible');
        elements.acceptanceText.appendChild(p);

        await typeText(p, "Thank you 💚", 100);

        // Wait a bit then spam buttons
        setTimeout(spamThankYouButtons, 500);
    }

    function spamThankYouButtons() {
        const count = 15; // Number of buttons to spam
        let spawned = 0;

        const interval = setInterval(() => {
            if (spawned >= count) {
                clearInterval(interval);
                showFinalBanner();
                return;
            }

            const btn = document.createElement('button');
            btn.className = 'spam-btn';
            btn.innerText = 'Thank You 💚';

            // Random position around center
            const offsetX = (Math.random() - 0.5) * window.innerWidth * 0.5;
            const offsetY = (Math.random() - 0.5) * window.innerHeight * 0.5;

            btn.style.transform = `translate(${offsetX}px, ${offsetY}px)`;

            // Center it relative to container
            btn.style.left = '50%';
            btn.style.top = '40%';

            elements.spamContainer.appendChild(btn);
            spawned++;
        }, 200);
    }

    function showFinalBanner() {
        setTimeout(() => {
            elements.finalBanner.classList.remove('hidden');
            elements.finalBanner.classList.add('visible');

            // Try closing close logic after a few seconds
            setTimeout(attemptClose, 4000);
        }, 500);
    }

    function attemptClose() {
        try {
            window.close();
        } catch (e) {
            console.log("Cannot close window via script");
        }

        // Since we can't reliably close windows not opened by script, 
        // we change the banner text to suggest closing.
        const bannerText = elements.finalBanner.querySelector('p');
        bannerText.innerHTML += "<br><br><span style='font-size: 1rem; opacity: 0.8'>(You can close this tab now 💚)</span>";
    }

    // Init Page 1
    startPage1();
});
