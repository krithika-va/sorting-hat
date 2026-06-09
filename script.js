// Wait for DOM to load before initializing
document.addEventListener('DOMContentLoaded', () => {
    
// ============ THREE.JS 3D SORTING HAT ============
function init3DHat() {
    const container = document.getElementById('threeCanvas');
    if (!container) {
        console.log('Three.js container not found');
        return;
    }
    
    try {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true });
        
        renderer.setSize(200, 200);
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);
        
        // Create a stylized hat
        const hatGroup = new THREE.Group();
        
        // Cone (main hat body)
        const coneGeometry = new THREE.ConeGeometry(0.8, 1.5, 32);
        const coneMaterial = new THREE.MeshStandardMaterial({ color: 0x2a1a0a, roughness: 0.4, metalness: 0.7 });
        const cone = new THREE.Mesh(coneGeometry, coneMaterial);
        cone.position.y = 0;
        hatGroup.add(cone);
        
        // Brim
        const brimGeometry = new THREE.TorusGeometry(0.9, 0.08, 32, 64);
        const brimMaterial = new THREE.MeshStandardMaterial({ color: 0x4a2a1a, roughness: 0.5 });
        const brim = new THREE.Mesh(brimGeometry, brimMaterial);
        brim.rotation.x = Math.PI / 2;
        brim.position.y = -0.6;
        hatGroup.add(brim);
        
        // Tip of hat
        const tipGeometry = new THREE.SphereGeometry(0.15, 16, 16);
        const tipMaterial = new THREE.MeshStandardMaterial({ color: 0xd4af37, emissive: 0xd4af37, emissiveIntensity: 0.3 });
        const tip = new THREE.Mesh(tipGeometry, tipMaterial);
        tip.position.y = 0.85;
        hatGroup.add(tip);
        
        // Gold band
        const bandGeometry = new THREE.TorusGeometry(0.7, 0.05, 32, 64);
        const bandMaterial = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9 });
        const band = new THREE.Mesh(bandGeometry, bandMaterial);
        band.rotation.x = Math.PI / 2;
        band.position.y = -0.2;
        hatGroup.add(band);
        
        // Floating particles around hat
        const particleCount = 50;
        const particleGeometry = new THREE.BufferGeometry();
        const particlePositions = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount; i++) {
            particlePositions[i * 3] = (Math.random() - 0.5) * 2;
            particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 1.5;
            particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 1.5 - 0.5;
        }
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        const particleMaterial = new THREE.PointsMaterial({ color: 0xd4af37, size: 0.02 });
        const particles = new THREE.Points(particleGeometry, particleMaterial);
        hatGroup.add(particles);
        
        scene.add(hatGroup);
        
        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(1, 2, 1);
        scene.add(directionalLight);
        const backLight = new THREE.PointLight(0xd4af37, 0.5);
        backLight.position.set(0, 1, -1);
        scene.add(backLight);
        
        camera.position.set(0, 0.5, 2.5);
        camera.lookAt(0, 0, 0);
        
        // Animation loop
        function animate() {
            requestAnimationFrame(animate);
            hatGroup.rotation.y += 0.005;
            hatGroup.rotation.x = Math.sin(Date.now() * 0.001) * 0.05;
            particles.rotation.y += 0.01;
            renderer.render(scene, camera);
        }
        animate();
        
        console.log('3D Hat initialized');
    } catch (error) {
        console.error('Three.js error:', error);
    }
}

// ============ PARTICLE SYSTEM ============
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particleCanvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.init();
    }
    
    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.animate();
        setInterval(() => this.addParticle(), 300);
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    addParticle() {
        this.particles.push({
            x: Math.random() * this.canvas.width,
            y: this.canvas.height + 10,
            radius: Math.random() * 3 + 1,
            alpha: Math.random() * 0.5 + 0.2,
            speedY: Math.random() * 2 + 1,
            color: `hsl(${Math.random() * 60 + 30}, 100%, 60%)`
        });
    }
    
    animate() {
        if (!this.ctx) return;
        requestAnimationFrame(() => this.animate());
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            p.y -= p.speedY;
            
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = '#d4af37';
            this.ctx.fill();
            
            if (p.y < -10) {
                this.particles.splice(i, 1);
                i--;
            }
        }
    }
}

// ============ WEB AUDIO ============
class MagicAudio {
    constructor() {
        this.audioContext = null;
        this.isEnabled = false;
    }
    
    init() {
        if (!this.audioContext) {
            try {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                this.isEnabled = true;
            } catch(e) { console.log('Audio not supported'); }
        }
    }
    
    playMagicSound() {
        if (!this.isEnabled || !this.audioContext) return;
        try {
            const oscillator = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            oscillator.connect(gain);
            gain.connect(this.audioContext.destination);
            oscillator.frequency.value = 880;
            gain.gain.value = 0.1;
            oscillator.start();
            gain.gain.exponentialRampToValueAtTime(0.00001, this.audioContext.currentTime + 1);
            oscillator.stop(this.audioContext.currentTime + 1);
        } catch(e) { console.log('Audio play failed'); }
    }
    
    playRevealSound() {
        if (!this.isEnabled || !this.audioContext) return;
        try {
            const oscillator = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            oscillator.connect(gain);
            gain.connect(this.audioContext.destination);
            oscillator.frequency.value = 440;
            gain.gain.value = 0.15;
            oscillator.start();
            setTimeout(() => {
                oscillator.frequency.value = 880;
                setTimeout(() => {
                    oscillator.frequency.value = 1760;
                    setTimeout(() => {
                        gain.gain.exponentialRampToValueAtTime(0.00001, this.audioContext.currentTime + 1);
                        oscillator.stop(this.audioContext.currentTime + 1);
                    }, 200);
                }, 200);
            }, 200);
        } catch(e) { console.log('Audio play failed'); }
    }
}

// ============ SPEECH SYNTHESIS ============
class SortingHatSpeech {
    speak(text, house = null) {
        if (!window.speechSynthesis) return;
        
        try {
            const utterance = new SpeechSynthesisUtterance();
            utterance.text = text;
            utterance.rate = 0.9;
            utterance.pitch = 0.8;
            
            if (house === 'gryffindor') utterance.pitch = 0.7;
            else if (house === 'hufflepuff') utterance.pitch = 0.9;
            else if (house === 'ravenclaw') utterance.pitch = 0.85;
            else if (house === 'slytherin') utterance.pitch = 0.75;
            
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(utterance);
        } catch(e) { console.log('Speech failed'); }
    }
}

// ============ CONFETTI SYSTEM ============
function burstConfetti(house) {
    const colors = {
        gryffindor: ['#ae0001', '#ffd700'],
        hufflepuff: ['#ecb939', '#000000'],
        ravenclaw: ['#222f5b', '#cd7f32'],
        slytherin: ['#2a623d', '#c0c0c0']
    };
    
    const houseColors = colors[house] || ['#d4af37', '#ffffff'];
    
    for (let i = 0; i < 150; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: ${Math.random() * 8 + 4}px;
            height: ${Math.random() * 8 + 4}px;
            background: ${houseColors[Math.floor(Math.random() * houseColors.length)]};
            left: ${Math.random() * window.innerWidth}px;
            top: -10px;
            border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
            z-index: 1000;
            pointer-events: none;
            animation: fall ${Math.random() * 3 + 2}s linear forwards;
        `;
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 4000);
    }
}

// Add confetti CSS
const confettiStyle = document.createElement('style');
confettiStyle.textContent = `
    @keyframes fall {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(${window.innerHeight + 50}px) rotate(360deg); opacity: 0; }
    }
`;
document.head.appendChild(confettiStyle);

// ============ MAIN SORTING HAT CLASS ============
class GrandSortingHat {
    constructor() {
        this.currentQuestion = 0;
        this.answers = [];
        this.housePoints = { gryffindor: 0, hufflepuff: 0, ravenclaw: 0, slytherin: 0 };
        this.ilmPoints = { thunderbird: 0, wampus: 0, horned: 0, pukwudgie: 0 };
        this.savedResults = this.loadSavedResults();
        this.audio = new MagicAudio();
        this.speech = new SortingHatSpeech();
        
        this.questions = this.generateQuestions();
        this.init();
        
        // Start 3D hat and particles after a short delay
        setTimeout(() => {
            init3DHat();
            new ParticleSystem();
        }, 100);
        
        // Audio requires user interaction first
        document.body.addEventListener('click', () => this.audio.init(), { once: true });
    }
    
    generateQuestions() {
        return [
            { text: "Which quality do you value most in a companion?", options: [
                { text: "Courage to stand against darkness", hogwarts: { gryffindor: 5 }, ilvermorny: { thunderbird: 3 } },
                { text: "Loyalty unwavering as the stars", hogwarts: { hufflepuff: 5 }, ilvermorny: { pukwudgie: 4 } },
                { text: "Wisdom that pierces all veils", hogwarts: { ravenclaw: 5 }, ilvermorny: { horned: 4 } },
                { text: "Ambition to reshape destiny", hogwarts: { slytherin: 5 }, ilvermorny: { wampus: 3 } }
            ]},
            { text: "The Sorting Hat speaks: 'What lies deepest in your heart?'", options: [
                { text: "The courage to protect the innocent", hogwarts: { gryffindor: 8 }, ilvermorny: { thunderbird: 4 } },
                { text: "The patience to nurture and heal", hogwarts: { hufflepuff: 8 }, ilvermorny: { pukwudgie: 5 } },
                { text: "The wisdom to see truth", hogwarts: { ravenclaw: 8 }, ilvermorny: { horned: 5 } },
                { text: "The ambition to rise above all", hogwarts: { slytherin: 8 }, ilvermorny: { wampus: 5 } }
            ]},
            { text: "What whispers to your soul in the quiet hours?", options: [
                { text: "The call of glory and valor", hogwarts: { gryffindor: 5 }, ilvermorny: { thunderbird: 5 } },
                { text: "The warmth of hearth and kin", hogwarts: { hufflepuff: 5 }, ilvermorny: { pukwudgie: 5 } },
                { text: "The thirst for forbidden knowledge", hogwarts: { ravenclaw: 5 }, ilvermorny: { horned: 5 } },
                { text: "The hunger for legacy and power", hogwarts: { slytherin: 5 }, ilvermorny: { wampus: 5 } }
            ]},
            { text: "When shadows lengthen and danger approaches, you...", options: [
                { text: "Charge forward without hesitation", hogwarts: { gryffindor: 5 }, ilvermorny: { thunderbird: 4 } },
                { text: "Stand with those you love", hogwarts: { hufflepuff: 5 }, ilvermorny: { pukwudgie: 4 } },
                { text: "Outthink the approaching threat", hogwarts: { ravenclaw: 5 }, ilvermorny: { horned: 5 } },
                { text: "Turn the darkness to your advantage", hogwarts: { slytherin: 5 }, ilvermorny: { wampus: 5 } }
            ]},
            { text: "Which element resonates with your spirit?", options: [
                { text: "Fire - passion and courage", hogwarts: { gryffindor: 4 }, ilvermorny: { thunderbird: 5 } },
                { text: "Earth - loyalty and strength", hogwarts: { hufflepuff: 4 }, ilvermorny: { pukwudgie: 4 } },
                { text: "Air - intellect and curiosity", hogwarts: { ravenclaw: 4 }, ilvermorny: { horned: 5 } },
                { text: "Water - adaptability and depth", hogwarts: { slytherin: 4 }, ilvermorny: { wampus: 4 } }
            ]},
            { text: "What legacy do you wish to leave behind?", options: [
                { text: "A tale of bravery sung for ages", hogwarts: { gryffindor: 5 }, ilvermorny: { thunderbird: 4 } },
                { text: "A family bound in love", hogwarts: { hufflepuff: 5 }, ilvermorny: { pukwudgie: 5 } },
                { text: "Discoveries that change the world", hogwarts: { ravenclaw: 5 }, ilvermorny: { horned: 5 } },
                { text: "A dynasty that shapes history", hogwarts: { slytherin: 5 }, ilvermorny: { wampus: 5 } }
            ]},
            { text: "What does the Mirror of Erised show you?", options: [
                { text: "Yourself celebrated as a hero", hogwarts: { gryffindor: 5 }, ilvermorny: { thunderbird: 4 } },
                { text: "Your loved ones safe and happy", hogwarts: { hufflepuff: 5 }, ilvermorny: { pukwudgie: 5 } },
                { text: "Yourself unlocking great secrets", hogwarts: { ravenclaw: 5 }, ilvermorny: { horned: 5 } },
                { text: "Yourself ruling with wisdom", hogwarts: { slytherin: 5 }, ilvermorny: { wampus: 5 } }
            ]},
            { text: "Which magical creature calls to your spirit?", options: [
                { text: "The noble Phoenix", hogwarts: { gryffindor: 5 }, ilvermorny: { thunderbird: 5 } },
                { text: "The gentle Unicorn", hogwarts: { hufflepuff: 5 }, ilvermorny: { pukwudgie: 4 } },
                { text: "The wise Owl", hogwarts: { ravenclaw: 5 }, ilvermorny: { horned: 5 } },
                { text: "The serpentine Basilisk", hogwarts: { slytherin: 5 }, ilvermorny: { wampus: 4 } }
            ]},
            { text: "Your patronus takes form as...", options: [
                { text: "A noble lion or stallion", hogwarts: { gryffindor: 5 }, ilvermorny: { thunderbird: 3 } },
                { text: "A loyal badger or dog", hogwarts: { hufflepuff: 5 }, ilvermorny: { pukwudgie: 4 } },
                { text: "A wise raven or owl", hogwarts: { ravenclaw: 5 }, ilvermorny: { horned: 4 } },
                { text: "A cunning serpent or fox", hogwarts: { slytherin: 5 }, ilvermorny: { wampus: 3 } }
            ]},
            { text: "What drives you most in life?", options: [
                { text: "The desire to help others", hogwarts: { gryffindor: 4, hufflepuff: 4 }, ilvermorny: { pukwudgie: 5 } },
                { text: "The pursuit of knowledge", hogwarts: { ravenclaw: 5 }, ilvermorny: { horned: 5 } },
                { text: "The need to prove myself", hogwarts: { slytherin: 4 }, ilvermorny: { wampus: 4 } },
                { text: "The call of adventure", hogwarts: { gryffindor: 5 }, ilvermorny: { thunderbird: 5 } }
            ]},
            { text: "How do you handle conflict?", options: [
                { text: "Confront it directly", hogwarts: { gryffindor: 5 }, ilvermorny: { thunderbird: 4 } },
                { text: "Seek a peaceful resolution", hogwarts: { hufflepuff: 5 }, ilvermorny: { pukwudgie: 5 } },
                { text: "Outsmart the opposition", hogwarts: { ravenclaw: 4 }, ilvermorny: { horned: 4 } },
                { text: "Use it to my advantage", hogwarts: { slytherin: 5 }, ilvermorny: { wampus: 5 } }
            ]},
            { text: "What's your approach to rules?", options: [
                { text: "Rules should be followed... mostly", hogwarts: { hufflepuff: 4, ravenclaw: 3 }, ilvermorny: { horned: 3 } },
                { text: "Rules are meant to be broken for the greater good", hogwarts: { gryffindor: 5 }, ilvermorny: { thunderbird: 5 } },
                { text: "Rules are for others, not for me", hogwarts: { slytherin: 4 }, ilvermorny: { wampus: 4 } },
                { text: "Rules exist for a logical reason", hogwarts: { ravenclaw: 5 }, ilvermorny: { pukwudgie: 3 } }
            ]},
            { text: "What's your learning style?", options: [
                { text: "Hands-on and practical", hogwarts: { gryffindor: 4 }, ilvermorny: { thunderbird: 4 } },
                { text: "Collaborative and group-based", hogwarts: { hufflepuff: 5 }, ilvermorny: { pukwudgie: 4 } },
                { text: "Independent and research-heavy", hogwarts: { ravenclaw: 5 }, ilvermorny: { horned: 5 } },
                { text: "Strategic and goal-oriented", hogwarts: { slytherin: 5 }, ilvermorny: { wampus: 5 } }
            ]},
            { text: "What does success mean to you?", options: [
                { text: "Leaving a legacy of bravery", hogwarts: { gryffindor: 5 }, ilvermorny: { thunderbird: 3 } },
                { text: "Having a close-knit family", hogwarts: { hufflepuff: 5 }, ilvermorny: { pukwudgie: 4 } },
                { text: "Making a groundbreaking discovery", hogwarts: { ravenclaw: 5 }, ilvermorny: { horned: 5 } },
                { text: "Achieving power and influence", hogwarts: { slytherin: 5 }, ilvermorny: { wampus: 5 } }
            ]},
            { text: "The Sorting Hat final question: 'Where does your heart truly belong?'", options: [
                { text: "Where the brave dare", hogwarts: { gryffindor: 10 }, ilvermorny: { thunderbird: 5 } },
                { text: "Where the loyal stay true", hogwarts: { hufflepuff: 10 }, ilvermorny: { pukwudgie: 5 } },
                { text: "Where the wise seek knowledge", hogwarts: { ravenclaw: 10 }, ilvermorny: { horned: 5 } },
                { text: "Where the ambitious rise", hogwarts: { slytherin: 10 }, ilvermorny: { wampus: 5 } }
            ]}
        ];
    }
    
    init() {
        const startBtn = document.getElementById('startBtn');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const revealBtn = document.getElementById('revealBtn');
        const shareBtn = document.getElementById('shareBtn');
        const speakBtn = document.getElementById('speakResultBtn');
        const retakeBtn = document.getElementById('retakeBtn');
        
        if (startBtn) startBtn.addEventListener('click', () => this.startQuiz());
        if (prevBtn) prevBtn.addEventListener('click', () => this.previousQuestion());
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextQuestion());
        if (revealBtn) revealBtn.addEventListener('click', () => this.calculateResult());
        if (shareBtn) shareBtn.addEventListener('click', () => this.shareResult());
        if (speakBtn) speakBtn.addEventListener('click', () => this.speakResult());
        if (retakeBtn) retakeBtn.addEventListener('click', () => this.retakeQuiz());
        
        const totalSpan = document.getElementById('totalQuestions');
        if (totalSpan) totalSpan.textContent = this.questions.length;
        
        this.renderQuestion();
    }
    
    startQuiz() {
        if (window.gsap) {
            gsap.to('#introScreen', { opacity: 0, duration: 0.5, onComplete: () => {
                document.getElementById('introScreen').style.display = 'none';
                document.getElementById('quizScreen').style.display = 'block';
                gsap.fromTo('#quizScreen', { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.6 });
            }});
        } else {
            document.getElementById('introScreen').style.display = 'none';
            document.getElementById('quizScreen').style.display = 'block';
        }
        this.resetPoints();
        this.answers = [];
        this.currentQuestion = 0;
        this.renderQuestion();
        this.audio.playMagicSound();
    }
    
    resetPoints() {
        this.housePoints = { gryffindor: 0, hufflepuff: 0, ravenclaw: 0, slytherin: 0 };
        this.ilmPoints = { thunderbird: 0, wampus: 0, horned: 0, pukwudgie: 0 };
    }
    
    renderQuestion() {
        const q = this.questions[this.currentQuestion];
        const questionText = document.getElementById('questionText');
        const optionsGrid = document.getElementById('optionsGrid');
        
        if (questionText) questionText.textContent = q.text;
        
        const optionsHtml = q.options.map((opt, idx) => `
            <button class="option-btn ${this.answers[this.currentQuestion] === idx ? 'selected' : ''}" data-index="${idx}">
                ${opt.text}
            </button>
        `).join('');
        
        if (optionsGrid) optionsGrid.innerHTML = optionsHtml;
        
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.dataset.index);
                this.answers[this.currentQuestion] = idx;
                this.updatePointsForCurrentQuestion();
                document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                if (window.gsap) {
                    gsap.to(btn, { scale: 1.05, duration: 0.1, yoyo: true, repeat: 1 });
                }
            });
        });
        
        const progress = ((this.currentQuestion + 1) / this.questions.length) * 100;
        const progressBar = document.getElementById('quizProgress');
        if (progressBar) {
            if (window.gsap) {
                gsap.to(progressBar, { width: `${progress}%`, duration: 0.5 });
            } else {
                progressBar.style.width = `${progress}%`;
            }
        }
        
        const counterSpan = document.getElementById('questionCounter');
        if (counterSpan) counterSpan.textContent = this.currentQuestion + 1;
        
        const isLast = this.currentQuestion === this.questions.length - 1;
        const nextBtn = document.getElementById('nextBtn');
        const revealBtn = document.getElementById('revealBtn');
        const prevBtn = document.getElementById('prevBtn');
        
        if (nextBtn) nextBtn.style.display = isLast ? 'none' : 'inline-block';
        if (revealBtn) revealBtn.style.display = isLast ? 'inline-block' : 'none';
        if (prevBtn) prevBtn.disabled = this.currentQuestion === 0;
        
        const questionCard = document.getElementById('questionCard');
        if (questionCard && window.gsap) {
            gsap.fromTo(questionCard, { rotationY: -10, opacity: 0 }, { rotationY: 0, opacity: 1, duration: 0.5 });
        }
    }
    
    updatePointsForCurrentQuestion() {
        this.resetPoints();
        for (let i = 0; i <= this.currentQuestion; i++) {
            const answerIdx = this.answers[i];
            if (answerIdx !== undefined) {
                const q = this.questions[i];
                const answer = q.options[answerIdx];
                if (answer.hogwarts) {
                    for (const [house, points] of Object.entries(answer.hogwarts)) {
                        this.housePoints[house] += points;
                    }
                }
                if (answer.ilvermorny) {
                    for (const [house, points] of Object.entries(answer.ilvermorny)) {
                        this.ilmPoints[house] += points;
                    }
                }
            }
        }
    }
    
    previousQuestion() {
        if (this.currentQuestion > 0) {
            this.currentQuestion--;
            this.renderQuestion();
        }
    }
    
    nextQuestion() {
        if (this.answers[this.currentQuestion] === undefined) {
            alert("Please select an answer before continuing!");
            return;
        }
        if (this.currentQuestion < this.questions.length - 1) {
            this.currentQuestion++;
            this.renderQuestion();
        }
    }
    
    calculateResult() {
        this.updatePointsForCurrentQuestion();
        
        const primaryHouse = Object.entries(this.housePoints).reduce((a, b) => a[1] > b[1] ? a : b)[0];
        const primaryIlm = Object.entries(this.ilmPoints).reduce((a, b) => a[1] > b[1] ? a : b)[0];
        
        const total = Object.values(this.housePoints).reduce((a, b) => a + b, 0);
        const percentages = {};
        for (const [house, points] of Object.entries(this.housePoints)) {
            percentages[house] = Math.round((points / total) * 100);
        }
        
        const { wand, patronus, quote, houseDesc, ilmDesc } = this.generateDetails(primaryHouse, primaryIlm);
        
        const result = { date: new Date().toISOString(), primaryHouse, primaryIlm, percentages, wand, patronus };
        this.saveResult(result);
        this.displayResult(primaryHouse, primaryIlm, percentages, wand, patronus, quote, houseDesc, ilmDesc);
        
        this.audio.playRevealSound();
        burstConfetti(primaryHouse);
        
        if (window.gsap) {
            gsap.fromTo('#resultCard', { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.2)" });
        }
        
        document.getElementById('quizScreen').style.display = 'none';
        document.getElementById('resultScreen').style.display = 'block';
    }
    
    generateDetails(house, ilm) {
        const details = {
            gryffindor: { wand: "Holly wood, Phoenix feather core, 11 inches", patronus: "Stag", desc: "Brave at heart, noble in action. You are daring, chivalrous, and rush into danger when others would flee.",
                quote: "\"It takes a great deal of bravery to stand up to our enemies, but just as much to stand up to our friends.\" — Albus Dumbledore" },
            hufflepuff: { wand: "Cedar wood, Unicorn hair core, 10 inches", patronus: "Badger", desc: "Loyal and just, you value hard work, patience, and treat all with equal respect.",
                quote: "\"You might belong in Hufflepuff, where they are just and loyal, those patient Hufflepuffs are true and unafraid of toil.\" — Sorting Hat" },
            ravenclaw: { wand: "Black walnut, Dragon heartstring core, 12 inches", patronus: "Eagle", desc: "Wise beyond years, you value intelligence, creativity, and learning above all.",
                quote: "\"Wit beyond measure is man's greatest treasure.\" — Rowena Ravenclaw" },
            slytherin: { wand: "Snakewood, Basilisk horn core, 13 inches", patronus: "Snake", desc: "Ambitious and cunning, you achieve your goals and shape your own destiny.",
                quote: "\"We Slytherins look after our own.\" — Horace Slughorn" }
        };
        
        const ilmDetails = {
            thunderbird: { name: "Thunderbird", desc: "Soul of a warrior — you favor adventure, change, and the open sky." },
            wampus: { name: "Wampus", desc: "Body of a warrior — you favor physical prowess, strategy, and strength." },
            horned: { name: "Horned Serpent", desc: "Mind of a scholar — you favor intellect, wisdom, and hidden knowledge." },
            pukwudgie: { name: "Pukwudgie", desc: "Heart of a healer — you favor compassion, care, and nurturing others." }
        };
        
        return {
            wand: details[house].wand,
            patronus: details[house].patronus,
            quote: details[house].quote,
            houseDesc: details[house].desc,
            ilmDesc: `${ilmDetails[ilm].name}: ${ilmDetails[ilm].desc}`
        };
    }
    
    displayResult(house, ilm, percentages, wand, patronus, quote, houseDesc, ilmDesc) {
        const houseEmoji = { gryffindor: "🦁", hufflepuff: "🦡", ravenclaw: "🦅", slytherin: "🐍" };
        const ilmEmoji = { thunderbird: "⚡", wampus: "🐆", horned: "🐍", pukwudgie: "🫀" };
        
        const houseTitle = document.getElementById('houseTitle');
        if (houseTitle) houseTitle.innerHTML = `${houseEmoji[house]} ${house.charAt(0).toUpperCase() + house.slice(1)}!`;
        
        const houseDescEl = document.getElementById('houseDescription');
        if (houseDescEl) houseDescEl.textContent = houseDesc;
        
        const wandText = document.getElementById('wandText');
        if (wandText) wandText.textContent = wand;
        
        const patronusText = document.getElementById('patronusText');
        if (patronusText) patronusText.textContent = patronus;
        
        const ilmText = document.getElementById('ilmText');
        if (ilmText) ilmText.innerHTML = ilmDesc;
        
        const quoteSpan = document.querySelector('.famous-quote span');
        if (quoteSpan) quoteSpan.textContent = quote;
        
        const houseBadge = document.querySelector('.house-badge');
        if (houseBadge) {
            houseBadge.className = `house-badge ${house}`;
            houseBadge.innerHTML = houseEmoji[house];
        }
        
        const ilmBadge = document.querySelector('.ilm-badge');
        if (ilmBadge) {
            ilmBadge.className = `ilm-badge ${ilm}`;
            ilmBadge.innerHTML = ilmEmoji[ilm];
        }
        
        const container = document.getElementById('housePercentages');
        if (container) {
            const houseDisplay = { gryffindor: "🦁 Gryffindor", hufflepuff: "🦡 Hufflepuff", ravenclaw: "🦅 Ravenclaw", slytherin: "🐍 Slytherin" };
            
            container.innerHTML = Object.entries(percentages).map(([h, p]) => `
                <div class="percentage-bar">
                    <div class="percentage-label"><span>${houseDisplay[h]}</span><span>${p}%</span></div>
                    <div class="percentage-fill fill-${h}" style="width: 0%;"></div>
                </div>
            `).join('');
            
            setTimeout(() => {
                document.querySelectorAll('.percentage-fill').forEach((fill, i) => {
                    fill.style.width = `${Object.values(percentages)[i]}%`;
                });
            }, 100);
        }
        
        this.renderHistory();
    }
    
    speakResult() {
        const houseTitle = document.getElementById('houseTitle');
        const wandText = document.getElementById('wandText');
        const patronusText = document.getElementById('patronusText');
        
        let house = 'Gryffindor';
        if (houseTitle) {
            house = houseTitle.innerText.split(' ')[0].toLowerCase().replace('!', '');
        }
        
        const message = `The Sorting Hat has spoken! You belong to ${house}! Your wand is ${wandText ? wandText.innerText : 'unknown'}. Your patronus is ${patronusText ? patronusText.innerText : 'unknown'}.`;
        this.speech.speak(message, house);
    }
    
    saveResult(result) {
        this.savedResults.unshift(result);
        if (this.savedResults.length > 5) this.savedResults.pop();
        localStorage.setItem('grandSortingEnhanced', JSON.stringify(this.savedResults));
    }
    
    loadSavedResults() {
        const saved = localStorage.getItem('grandSortingEnhanced');
        return saved ? JSON.parse(saved) : [];
    }
    
    renderHistory() {
        const container = document.getElementById('historyList');
        if (!container) return;
        
        if (this.savedResults.length === 0) {
            container.innerHTML = '<div class="history-item"><span>✦ No souls recorded yet ✦</span></div>';
            return;
        }
        
        const houseEmoji = { gryffindor: "🦁", hufflepuff: "🦡", ravenclaw: "🦅", slytherin: "🐍" };
        const ilmEmoji = { thunderbird: "⚡", wampus: "🐆", horned: "🐍", pukwudgie: "🫀" };
        
        container.innerHTML = this.savedResults.map(r => `
            <div class="history-item">
                <span>${houseEmoji[r.primaryHouse]} ${r.primaryHouse}</span>
                <span>${ilmEmoji[r.primaryIlm]} ${r.primaryIlm}</span>
                <span>${new Date(r.date).toLocaleDateString()}</span>
            </div>
        `).join('');
    }
    
    async shareResult() {
     const card = document.getElementById('resultCard');
     const toast = document.createElement('div');
     toast.innerHTML = '📸 Capturing your destiny...';
     toast.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.8);color:#ffd700;padding:0.8rem 1.5rem;border-radius:50px;z-index:1000;';
     document.body.appendChild(toast);
    
    // Temporarily replace gradient text with solid color for capture
     const houseTitle = document.getElementById('houseTitle');
     const originalText = houseTitle.innerHTML;
     const originalColor = houseTitle.style.color;
    
    // Get the actual house name without emoji
     let houseName = originalText.replace(/[🦁🦡🦅🐍]/g, '').trim();
    
    // Set solid color based on house for better capture
     let solidColor = '#ffd700';
     if (houseName.toLowerCase().includes('gryffindor')) solidColor = '#ae0001';
     else if (houseName.toLowerCase().includes('hufflepuff')) solidColor = '#ecb939';
     else if (houseName.toLowerCase().includes('ravenclaw')) solidColor = '#222f5b';
     else if (houseName.toLowerCase().includes('slytherin')) solidColor = '#2a623d';
    
    // Temporarily modify styles for better capture
     houseTitle.style.background = 'none';
     houseTitle.style.webkitBackgroundClip = 'unset';
     houseTitle.style.backgroundClip = 'unset';
     houseTitle.style.color = solidColor;
    
     try {
         if (typeof html2canvas === 'undefined') {
            toast.innerHTML = '❌ html2canvas not loaded';
            setTimeout(() => toast.remove(), 2000);
            return;
        }
        
        // Add temporary background to ensure visibility
         card.style.backgroundColor = 'rgba(10, 10, 26, 0.95)';
        
         const canvas = await html2canvas(card, { 
            scale: 2, 
            backgroundColor: '#0a0a1a',
            logging: false,
            useCORS: true
        });
        
         const link = document.createElement('a');
         link.download = `sorting-ceremony-${Date.now()}.png`;
         link.href = canvas.toDataURL('image/png');
         link.click();
         toast.innerHTML = '✅ Destiny preserved!';
         setTimeout(() => toast.remove(), 2000);
        
     } catch (error) {
        console.error('Share error:', error);
        toast.innerHTML = '❌ Try again';
        setTimeout(() => toast.remove(), 2000);
     } finally {
        // Restore original styles
        houseTitle.style.background = 'linear-gradient(135deg, #ffd700, #ff8c00)';
        houseTitle.style.webkitBackgroundClip = 'text';
        houseTitle.style.backgroundClip = 'text';
        houseTitle.style.color = 'transparent';
        card.style.backgroundColor = '';
    }
}
    
    retakeQuiz() {
        this.resetPoints();
        this.answers = [];
        this.currentQuestion = 0;
        if (window.gsap) {
            gsap.to('#resultScreen', { opacity: 0, duration: 0.3, onComplete: () => {
                document.getElementById('resultScreen').style.display = 'none';
                document.getElementById('introScreen').style.display = 'block';
                gsap.fromTo('#introScreen', { opacity: 0 }, { opacity: 1, duration: 0.5 });
            }});
        } else {
            document.getElementById('resultScreen').style.display = 'none';
            document.getElementById('introScreen').style.display = 'block';
        }
    }
}

// Start the magic
window.app = new GrandSortingHat();

}); // End DOMContentLoaded