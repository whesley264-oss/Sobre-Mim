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

            document.getElementById('modal-img').src = card.dataset.img;
            document.getElementById('modal-title').textContent = card.dataset.title;
            document.getElementById('modal-description').textContent = card.dataset.description;
            document.getElementById('modal-tech-list').textContent = card.dataset.tech;
            document.getElementById('modal-github-link').href = card.dataset.githubUrl;

            // Reset stats and fetch new ones
            modalStars.textContent = '--';
            modalForks.textContent = '--';
            fetchGitHubStats(card.dataset.repo);

            modal.style.display = 'block';
        });
    });

    const closeModal = () => {
        modal.style.display = 'none';
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
});
