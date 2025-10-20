// --- Lógica do Preloader ---
window.onload = () => {
    const preloader = document.getElementById('preloader');
    const mainContent = document.getElementById('main-content');

    // Esconde o preloader com um fade-out
    preloader.style.opacity = '0';

    // Remove o preloader e mostra o conteúdo principal após a transição
    setTimeout(() => {
        preloader.style.display = 'none';
        mainContent.style.visibility = 'visible';
    }, 500); // Deve ser igual à duração da transição no CSS
};

document.addEventListener('DOMContentLoaded', () => {
    // Atribuição de elementos da paleta de comandos
    commandPalette = document.getElementById('command-palette');
    commandInput = document.getElementById('command-input');
    commandResults = document.getElementById('command-results');

    const themeToggle = document.getElementById('theme-toggle');
    const langToggle = document.getElementById('lang-toggle');
    const body = document.body;
    let typed; // Variável para a instância do Typed.js

    // --- Lógica de Internacionalização ---
    const setLanguage = (lang) => {
        document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
        localStorage.setItem('language', lang);
        langToggle.textContent = lang.toUpperCase();

        document.querySelectorAll('[data-lang-key]').forEach(element => {
            const key = element.dataset.langKey;
            const translation = translations[lang][key];

            if (key === 'homeTitle') {
                // Lógica especial para o título com a animação
                if (typed) typed.destroy();
                document.querySelector('#typing-text').textContent = ''; // Limpa antes de iniciar
                typed = new Typed('#typing-text', {
                    strings: ['Whesley'],
                    typeSpeed: 100, backSpeed: 50, loop: true, showCursor: true, cursorChar: '|'
                });
                element.childNodes[0].nodeValue = translation; // Altera apenas o "Olá, eu sou o"
            } else if (element.placeholder) {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        });
    };

    // Prioridade: 1. URL Param, 2. LocalStorage, 3. Navigator
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    const savedLang = localStorage.getItem('language') || (navigator.language.startsWith('pt') ? 'pt' : 'en');

    setLanguage(urlLang || savedLang);

    langToggle.addEventListener('click', () => {
        const currentLang = localStorage.getItem('language') || 'pt';
        const newLang = currentLang === 'pt' ? 'en' : 'pt';
        setLanguage(newLang);
    });

    // --- Lógica de Troca de Tema ---
    const applyTheme = (theme) => {
        if (theme === 'light') {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            themeToggle.textContent = '☀️';
            localStorage.setItem('theme', 'light');
        } else {
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
            themeToggle.textContent = '🌙';
            localStorage.setItem('theme', 'dark');
        }
    };

    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = localStorage.getItem('theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
    });

    // --- Lógica de Rolagem Suave ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // --- Inicialização da Biblioteca de Animações (AOS) ---
    AOS.init({
        duration: 800, // Duração da animação em ms
        once: true,    // Animação acontece apenas uma vez
        offset: 50,    // "Gatilho" da animação um pouco antes do elemento aparecer
    });

    // --- Lógica do Botão Voltar ao Topo ---
    const backToTopButton = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) { // Mostra o botão após rolar 300px
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // --- Lógica do Modal de Projetos ---
    const modal = document.getElementById('project-modal');
    const detailButtons = document.querySelectorAll('.project-details-btn');
    const closeModalBtn = document.querySelector('.close-btn');

    const modalStars = document.getElementById('modal-stars');
    const modalForks = document.getElementById('modal-forks');

    const fetchGitHubStats = async (repo) => {
        try {
            const response = await fetch(`https://api.github.com/repos/${repo}`);
            if (!response.ok) throw new Error('Repo not found');
            const data = await response.json();

            modalStars.textContent = data.stargazers_count;
            modalForks.textContent = data.forks_count;
        } catch (error) {
            console.error('Failed to fetch GitHub stats:', error);
            modalStars.textContent = 'N/A';
            modalForks.textContent = 'N/A';
        }
    };

    detailButtons.forEach(button => {
        button.addEventListener('click', () => {
            const card = button.closest('.project-card');

            // Lazy Loading: Define o src da imagem apenas ao abrir o modal
            document.getElementById('modal-img').src = card.dataset.img;

            document.getElementById('modal-title').textContent = card.dataset.title;
            document.getElementById('modal-description').textContent = card.dataset.description;
            document.getElementById('modal-tech-list').textContent = card.dataset.tech;
            document.getElementById('modal-github-link').href = card.dataset.githubUrl;

            // Reset stats and fetch new ones
            modalStars.textContent = '--';
            modalForks.textContent = '--';
            fetchGitHubStats(card.dataset.repo);

            // Update share links
            const projectTitle = card.dataset.title;
            const projectUrl = card.dataset.githubUrl;
            document.getElementById('share-twitter').href = `https://twitter.com/intent/tweet?text=Confira este projeto incrível de Whesley: ${projectTitle}&url=${projectUrl}`;
            document.getElementById('share-linkedin').href = `https://www.linkedin.com/shareArticle?mini=true&url=${projectUrl}&title=${projectTitle}&summary=Um projeto de Whesley.dev`;

            modal.style.display = 'block';
        });
    });

    const closeModal = () => {
        modal.style.display = 'none';
        // Lazy Loading: Limpa o src da imagem ao fechar para liberar memória
        document.getElementById('modal-img').src = '';
    };

    closeModalBtn.addEventListener('click', closeModal);

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            closeModal();
        }
    });

    // --- Lógica do Banner de Cookies ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookieBtn = document.getElementById('cookie-accept-btn');

    if (!localStorage.getItem('cookiesAccepted')) {
        setTimeout(() => {
            cookieBanner.classList.add('show');
        }, 2000); // Mostra o banner após 2 segundos
    }

    acceptCookieBtn.addEventListener('click', () => {
        cookieBanner.classList.remove('show');
        localStorage.setItem('cookiesAccepted', 'true');
    });

    // --- Inicialização do Particles.js ---
    if (document.getElementById('particles-js')) {
        particlesJS('particles-js', {
            "particles": { "number": { "value": 80, "density": { "enable": true, "value_area": 800 } }, "color": { "value": "#ffffff" }, "shape": { "type": "circle", "stroke": { "width": 0, "color": "#000000" }, "polygon": { "nb_sides": 5 }, "image": { "src": "img/github.svg", "width": 100, "height": 100 } }, "opacity": { "value": 0.5, "random": false, "anim": { "enable": false, "speed": 1, "opacity_min": 0.1, "sync": false } }, "size": { "value": 3, "random": true, "anim": { "enable": false, "speed": 40, "size_min": 0.1, "sync": false } }, "line_linked": { "enable": true, "distance": 150, "color": "#ffffff", "opacity": 0.4, "width": 1 }, "move": { "enable": true, "speed": 6, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false, "attract": { "enable": false, "rotateX": 600, "rotateY": 1200 } } }, "interactivity": { "detect_on": "canvas", "events": { "onhover": { "enable": true, "mode": "repulse" }, "onclick": { "enable": true, "mode": "push" }, "resize": true }, "modes": { "grab": { "distance": 400, "line_linked": { "opacity": 1 } }, "bubble": { "distance": 400, "size": 40, "duration": 2, "opacity": 8, "speed": 3 }, "repulse": { "distance": 200, "duration": 0.4 }, "push": { "particles_nb": 4 }, "remove": { "particles_nb": 2 } } }, "retina_detect": true
        });
    }

    // --- Lógica do Cursor Personalizado ---
    const cursor = document.querySelector('.custom-cursor');
    if (cursor) {
        window.addEventListener('mousemove', e => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        document.querySelectorAll('a, button, .skill-icon').forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });
    }

    // --- Lógica de Copiar E-mail ---
    const copyEmailBtn = document.getElementById('copy-email-btn');
    const emailAddress = document.getElementById('email-address').textContent;

    copyEmailBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(emailAddress).then(() => {
            const originalIcon = copyEmailBtn.innerHTML;
            copyEmailBtn.innerHTML = '<i class="fas fa-check"></i>';
            copyEmailBtn.title = 'Copiado!';

            setTimeout(() => {
                copyEmailBtn.innerHTML = originalIcon;
                copyEmailBtn.title = 'Copiar e-mail';
            }, 2000);
        }).catch(err => {
            console.error('Falha ao copiar e-mail: ', err);
        });
    });

    // --- Notificação de Aba Inativa ---
    let originalTitle = document.title;
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            document.title = 'Ei, volte aqui! 👋';
        } else {
            document.title = originalTitle;
        }
    });

// --- Funções Globais da Paleta de Comandos ---
let commandPalette, commandInput, commandResults;
const sections = [
    { name: 'Início', id: 'home', key: 'navHome' },
    { name: 'Sobre', id: 'about', key: 'navAbout' },
    { name: 'Jornada', id: 'journey', key: 'navJourney' },
    { name: 'Habilidades', id: 'skills', key: 'navSkills' },
    { name: 'Projetos', id: 'projects', key: 'navProjects' },
    { name: 'Contato', id: 'contact', key: 'navContact' }
];

const openPalette = () => {
    commandPalette.style.display = 'block';
    commandInput.focus();
    renderResults('');
};

const closePalette = () => {
    commandPalette.style.display = 'none';
    commandInput.value = '';
};

const renderResults = (query) => {
    commandResults.innerHTML = '';
    const currentLang = localStorage.getItem('language') || 'pt';
    const filteredSections = sections.filter(section =>
        translations[currentLang][section.key].toLowerCase().includes(query.toLowerCase())
    );

    filteredSections.forEach((section, index) => {
        const li = document.createElement('li');
        li.textContent = translations[currentLang][section.key];
        li.dataset.sectionId = section.id;
        if (index === 0) {
            li.classList.add('selected');
        }
        li.addEventListener('click', () => {
            document.getElementById(section.id).scrollIntoView({ behavior: 'smooth' });
            closePalette();
        });
        commandResults.appendChild(li);
    });
};


document.addEventListener('DOMContentLoaded', () => {
    // ... (código anterior do DOMContentLoaded)

    // --- Lógica da Paleta de Comandos ---
    window.addEventListener('keydown', e => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            openPalette();
        }
    });

    commandInput.addEventListener('input', () => renderResults(commandInput.value));
    commandPalette.addEventListener('click', (e) => {
        if (e.target === commandPalette) {
            closePalette();
        }
    });

    // --- Título da Página Dinâmico ---
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.5 };
    const observer = new IntersectionObserver((entries) => {
        const currentLang = localStorage.getItem('language') || 'pt';
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                const sectionKey = `nav${sectionId.charAt(0).toUpperCase() + sectionId.slice(1)}`;
                const sectionName = translations[currentLang][sectionKey] || 'Portfólio';
                document.title = `Whesley | ${sectionName}`;
            }
        });
    }, observerOptions);

    document.querySelectorAll('main section').forEach(section => {
        observer.observe(section);
    });

    // --- Navegação por Teclado (Fechar com ESC) ---
    window.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            if (modal.style.display === 'block') {
                closeModal();
            }
            if (commandPalette.style.display === 'block') {
                closePalette();
            }
        }
    });
});

// --- Registro do Service Worker para PWA ---
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log('ServiceWorker registrado com sucesso:', registration);
        }).catch(error => {
            console.log('Falha no registro do ServiceWorker:', error);
        });
    });
}
