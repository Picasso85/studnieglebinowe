// ===================== CANVAS – FALE I BĄBELKI =====================
const canvas = document.getElementById('waterCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    let animationId = null;
    let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    const PARTICLE_COUNT = isMobile ? 60 : 150;
    const BIG_BUBBLES_COUNT = isMobile ? 10 : 20;

    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        initParticlesAndBubbles();
    }

    let particles = [];
    let bigBubbles = [];
    let waveOffset = 0;

    const waves = [
        { amplitude: 30, frequency: 0.005, speed: 0.02, color: 'rgba(42,169,255,0.15)' },
        { amplitude: 20, frequency: 0.008, speed: 0.03, color: 'rgba(42,169,255,0.1)' },
        { amplitude: 15, frequency: 0.012, speed: 0.04, color: 'rgba(100,200,255,0.08)' }
    ];

    class WaterParticle {
        constructor() {
            this.y = Math.random() * height;
            this.phase = Math.random() * Math.PI * 2;
            this.x = width / 2 + Math.sin(this.y * 0.02 + this.phase) * (width * 0.3);
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
            this.x += (targetX - this.x) * 0.1;
            this.x += Math.sin(this.wobble) * 0.2;

            if (this.y > height + 30) {
                this.y = -30;
                this.phase = Math.random() * Math.PI * 2;
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(42, 169, 255, ${this.opacity})`;
            ctx.fill();
        }
    }

    function initParticlesAndBubbles() {
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(new WaterParticle());
        }

        bigBubbles = [];
        for (let i = 0; i < BIG_BUBBLES_COUNT; i++) {
            bigBubbles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 8 + 4,
                speedY: Math.random() * 0.15 + 0.05,
                opacity: Math.random() * 0.3 + 0.15
            });
        }
    }

    function drawWaves() {
        waveOffset += 0.2;

        for (let w of waves) {
            ctx.beginPath();
            for (let x = 0; x < width; x += 10) {
                let y = height * 0.7 + Math.sin(x * w.frequency + waveOffset * w.speed) * w.amplitude;
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.strokeStyle = w.color;
            ctx.stroke();
        }
    }

    function animateWater() {
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

        animationId = requestAnimationFrame(animateWater);
    }

    window.addEventListener('resize', () => {
        resizeCanvas();
        if (animationId) cancelAnimationFrame(animationId);
        animateWater();
    });

    resizeCanvas();
    initParticlesAndBubbles();
    animateWater();
}

// ===================== INTERSECTION OBSERVER =====================
const sections = document.querySelectorAll('.section');
if (sections.length) {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('active');
        });
    }, { threshold: 0.5 });

    sections.forEach(section => observer.observe(section));
}

// ===================== THEME =====================
// ===================== THEME TOGGLE Z IKNĄ SŁOŃCA =====================
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle?.querySelector('i');

if (themeToggle && themeIcon) {
    // Sprawdź zapisany motyw
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    } else {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light');
        const isLight = document.body.classList.contains('light');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        
        // Zmiana ikony: w trybie ciemnym pokazujemy słońce (bo można przełączyć na jasny)
        if (isLight) {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        } else {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    });
}

// ===================== MOBILE MENU =====================
const menuIcon = document.getElementById('menuIcon');
const navLinks = document.getElementById('navLinks');   // to jest pojedynczy element (kontener)

if (menuIcon && navLinks) {
    menuIcon.addEventListener('click', () => {
        navLinks.classList.toggle('open');
    });
}

// ===================== SMOOTH SCROLL =====================
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (!target) return;

        e.preventDefault();
        window.scrollTo({
            top: target.offsetTop - 70,
            behavior: 'smooth'
        });
    });
});

// ===================== NAVBAR + SOCIALS =====================
const socials = document.getElementById("topSocials");

if (socials) {
    window.addEventListener("scroll", () => {
        if (window.scrollY > 0) {
            socials.classList.add("hide");
        } else {
            socials.classList.remove("hide");
        }
    });
}

// ===================== FORM =====================
const form = document.getElementById("contactForm");
if (form) {
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        alert("Dziękujemy! Skontaktujemy się wkrótce.");
        form.reset();
    });
}

// ===================== MAPA (LEAFLET) =====================
const mapElement = document.getElementById('map');
if (mapElement) {
    const map = L.map('map').setView([52.3676, 4.9041], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
    }).addTo(map);
}

// ===================== SCROLL SPY (poprawiony) =====================
// Uwaga: navLinks to pojedynczy element (kontener .nav-links)
// Pobieramy wszystkie linki wewnątrz niego
const navLinksContainer = document.getElementById('navLinks');
const navLinkItems = navLinksContainer ? navLinksContainer.querySelectorAll('a') : [];

window.addEventListener("scroll", () => {
    let scrollPos = window.scrollY + 150;
    const allSections = document.querySelectorAll("section[id]");

    allSections.forEach(sec => {
        const top = sec.offsetTop;
        const bottom = top + sec.offsetHeight;
        const id = sec.getAttribute("id");

        if (scrollPos >= top && scrollPos < bottom) {
            navLinkItems.forEach(a => {
                a.classList.remove("active");
                if (a.getAttribute("href") === "#" + id) {
                    a.classList.add("active");
                }
            });
        }
    });
});

// ===================== EFEKTY DLA SEKCJI REALIZACJE =====================
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.project-card');
    const images = document.querySelectorAll('.project-image[data-parallax]');

    // 1. Światło podążające za kursorem
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);
        });
        card.addEventListener('mouseleave', () => {
            card.style.setProperty('--x', '50%');
            card.style.setProperty('--y', '50%');
        });
    });

    // 2. Parallax obrazków
    if (images.length) {
        const applyParallax = () => {
            images.forEach(img => {
                const card = img.closest('.project-card');
                if (!card) return;
                const rect = card.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                if (rect.top < windowHeight && rect.bottom > 0) {
                    const scrollPercent = (window.scrollY + rect.top) / (windowHeight + rect.height);
                    const translateY = (scrollPercent - 0.5) * 30;
                    img.style.transform = `translateY(${translateY}px) scale(${img.dataset.scale || 1})`;
                } else {
                    img.style.transform = `translateY(0px) scale(${img.dataset.scale || 1})`;
                }
            });
        };
        window.addEventListener('scroll', applyParallax);
        window.addEventListener('resize', applyParallax);
        applyParallax();
    }

    // 3. Animacja wejścia kart Z OPÓŹNIENIEM (kolejno)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;
                // Pobieramy indeks karty, aby ustawić opóźnienie
                const index = Array.from(cards).indexOf(card);
                // Opóźnienie = 0.05s * indeks (max 0.6s)
                const delay = Math.min(index * 0.08, 0.8);
                card.style.transitionDelay = `${delay}s`;
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
                observer.unobserve(card);
            }
        });
    }, { threshold: 0.6 }); // próg 15% widoczności

    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(25px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        card.style.transitionDelay = '0s'; // na początku brak opóźnienia
        observer.observe(card);
    });
});

// Wymuszenie poprawnego układu po załadowaniu (fix rozjeżdżania)
window.addEventListener('load', function() {
    // Delikatne przeliczenie layoutu
    document.body.style.display = 'none';
    setTimeout(() => {
        document.body.style.display = '';
    }, 10);
    
    // Wymuszenie repaintu dla kart
    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => {
        card.style.transform = 'translateZ(0)';
        setTimeout(() => {
            card.style.transform = '';
        }, 20);
    });
});