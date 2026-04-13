// ===================== CANVAS =====================
const canvas = document.getElementById('waterCanvas');

if (canvas) {
    const ctx = canvas.getContext('2d');

    let width = window.innerWidth;
    let height = window.innerHeight;
    let animationId;

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    const PARTICLE_COUNT = isMobile ? 60 : 150;
    const BIG_BUBBLES_COUNT = isMobile ? 10 : 20;

    let particles = [];
    let bigBubbles = [];
    let waveOffset = 0;

    const waves = [
        { amplitude: 30, frequency: 0.005, speed: 0.02, color: 'rgba(42,169,255,0.15)' },
        { amplitude: 20, frequency: 0.008, speed: 0.03, color: 'rgba(42,169,255,0.1)' },
        { amplitude: 15, frequency: 0.012, speed: 0.04, color: 'rgba(100,200,255,0.08)' }
    ];

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.y = Math.random() * height;
            this.phase = Math.random() * Math.PI * 2;
            this.radius = Math.random() * 3 + 1;
            this.speedY = Math.random() * 0.6 + 0.2;
            this.opacity = Math.random() * 0.5 + 0.3;
            this.wobble = Math.random() * Math.PI * 2;
            this.wobbleSpeed = Math.random() * 0.03 + 0.01;
        }

        update() {
            this.y += this.speedY;
            this.wobble += this.wobbleSpeed;

            let targetX = width / 2 + Math.sin(this.y * 0.02 + this.phase) * (width * 0.3);

            this.x = targetX + Math.sin(this.wobble) * 0.5;

            if (this.y > height + 30) {
                this.y = -30;
                this.phase = Math.random() * Math.PI * 2;
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(42,169,255,${this.opacity})`;
            ctx.fill();
        }
    }

    function init() {
        particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());

        bigBubbles = Array.from({ length: BIG_BUBBLES_COUNT }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 8 + 4,
            speedY: Math.random() * 0.15 + 0.05,
            opacity: Math.random() * 0.3 + 0.15
        }));
    }

    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        init();
    }

    function drawWaves() {
        waveOffset += 0.2;

        for (let w of waves) {
            ctx.beginPath();

            for (let x = 0; x < width; x += 10) {
                const y = height * 0.7 + Math.sin(x * w.frequency + waveOffset * w.speed) * w.amplitude;

                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }

            ctx.strokeStyle = w.color;
            ctx.stroke();
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        drawWaves();

        for (let b of bigBubbles) {
            b.y -= b.speedY;

            if (b.y < 0) {
                b.y = height;
                b.x = Math.random() * width;
            }

            ctx.beginPath();
            ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(42,169,255,${b.opacity})`;
            ctx.fill();
        }

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        animationId = requestAnimationFrame(animate);
    }

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(resizeCanvas, 150);
    });

    resizeCanvas();
    init();
    animate();
}


// ===================== INTERSECTION OBSERVER (SEKCJE) =====================
const sections = document.querySelectorAll('.section');

if (sections.length) {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.4 });

    sections.forEach(section => observer.observe(section));
}


// ===================== THEME TOGGLE =====================
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle?.querySelector('i');

if (themeToggle && themeIcon) {
    const saved = localStorage.getItem('theme');

    if (saved === 'light') {
        document.body.classList.add('light');
        themeIcon.classList.replace('fa-sun', 'fa-moon');
    }

    themeToggle.addEventListener('click', () => {
        const isLight = document.body.classList.toggle('light');

        localStorage.setItem('theme', isLight ? 'light' : 'dark');

        if (isLight) {
            themeIcon.classList.replace('fa-sun', 'fa-moon');
        } else {
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        }
    });
}


// ===================== MOBILE MENU =====================
const menuIcon = document.getElementById('menuIcon');
const navLinks = document.getElementById('navLinks');

if (menuIcon && navLinks) {
    menuIcon.addEventListener('click', () => {
        navLinks.classList.toggle('open');
    });
}


// ===================== SMOOTH SCROLL =====================
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        const target = document.querySelector(link.getAttribute('href'));
        if (!target) return;

        e.preventDefault();

        window.scrollTo({
            top: target.offsetTop - 70,
            behavior: 'smooth'
        });
    });
});


// ===================== NAV ACTIVE (OPTIMIZED SCROLL SPY) =====================
const navContainer = document.getElementById('navLinks');
const navItems = navContainer ? navContainer.querySelectorAll('a') : [];
const allSections = document.querySelectorAll('section[id]');

let scrollTicking = false;

function updateScrollSpy() {
    const pos = window.scrollY + 150;

    allSections.forEach(sec => {
        const top = sec.offsetTop;
        const bottom = top + sec.offsetHeight;
        const id = sec.id;

        if (pos >= top && pos < bottom) {
            navItems.forEach(a => {
                a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
            });
        }
    });
}

window.addEventListener('scroll', () => {
    if (!scrollTicking) {
        requestAnimationFrame(() => {
            updateScrollSpy();
            scrollTicking = false;
        });
        scrollTicking = true;
    }
});


// ===================== PROJECT CARDS EFFECTS (SAFE) =====================
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.project-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--x', `${e.clientX - rect.left}px`);
            card.style.setProperty('--y', `${e.clientY - rect.top}px`);
        });

        card.addEventListener('mouseleave', () => {
            card.style.setProperty('--x', '50%');
            card.style.setProperty('--y', '50%');
        });
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (!entry.isIntersecting) return;

            const card = entry.target;
            const delay = Math.min(index * 0.08, 0.6);

            card.style.transitionDelay = `${delay}s`;
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';

            observer.unobserve(card);
        });
    }, { threshold: 0.3 });

    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
});


// ===================== MAP =====================
const mapElement = document.getElementById('map');

if (mapElement && typeof L !== "undefined") {
    const map = L.map('map').setView([52.3676, 4.9041], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
    }).addTo(map);
}