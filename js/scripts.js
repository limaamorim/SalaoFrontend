window.addEventListener('DOMContentLoaded', event => {

    const navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) return;
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink');
        } else {
            navbarCollapsible.classList.add('navbar-shrink');
        }
    };

    navbarShrink();
    document.addEventListener('scroll', navbarShrink);

    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%'
        });
    }

    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(document.querySelectorAll('#navbarResponsive .nav-link'));
    responsiveNavItems.forEach(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });

    const serviceModals = document.querySelectorAll('.portfolio-modal');
    serviceModals.forEach(modal => {
        modal.addEventListener('show.bs.modal', function () {
            modal.querySelector('.modal-content').classList.add('animate__animated', 'animate__fadeInUp');
        });
        modal.addEventListener('hidden.bs.modal', function () {
            this.querySelector('.modal-content').classList.remove('animate__animated', 'animate__fadeInUp');
        });
    });

    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const hover = item.querySelector('.portfolio-hover');
            if (hover) hover.style.opacity = '1';
        });
        item.addEventListener('mouseleave', () => {
            const hover = item.querySelector('.portfolio-hover');
            if (hover) hover.style.opacity = '0';
        });
    });

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;

            submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Enviando...';
            submitButton.disabled = true;

            setTimeout(() => {
                const alertDiv = document.createElement('div');
                alertDiv.className = 'alert alert-success mt-3';
                alertDiv.textContent = 'Mensagem enviada com sucesso! Entraremos em contato em breve.';
                this.appendChild(alertDiv);
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
                this.reset();
                setTimeout(() => alertDiv.remove(), 5000);
            }, 1500);
        });
    }

    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 800, easing: 'ease-in-out', once: true });
    }
});

document.querySelectorAll('.service-price-badge').forEach(badge => {
    badge.addEventListener('mouseenter', () => badge.style.transform = 'scale(1.1)');
    badge.addEventListener('mouseleave', () => badge.style.transform = 'scale(1)');
});

function animateTimeline() {
    const timelineItems = document.querySelectorAll('.timeline > li');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    timelineItems.forEach(item => observer.observe(item));
}
document.addEventListener('DOMContentLoaded', animateTimeline);

// Feedback

document.querySelectorAll('.avaliacao').forEach(avaliacao => {
    avaliacao.querySelectorAll('.star-icon').forEach(star => {
        star.addEventListener('click', () => {
            const value = parseInt(star.dataset.avaliacao);
            avaliacao.querySelectorAll('.star-icon').forEach(s => s.classList.remove('ativo'));
            for (let i = 0; i < value; i++) {
                avaliacao.children[i].classList.add('ativo');
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const feedbackForm = document.getElementById('feedbackForm');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const mensagem = feedbackForm.mensagem.value.trim();
            const avaliacao = document.querySelectorAll('.avaliacao .ativo').length;
            const usuario = JSON.parse(localStorage.getItem('usuario'));

            if (!usuario || !usuario.id) return alert('Você precisa estar logado para enviar feedback.');
            if (!mensagem || avaliacao === 0) return alert('Por favor, preencha todos os campos.');

            try {
                const response = await fetch('https://salaobackend-1.onrender.com/feedback', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ mensagem, avaliacao, usuario: usuario.id })
                });

                const result = await response.text();

                if (response.ok) {
                    alert('Obrigado pelo feedback!');
                    feedbackForm.reset();
                    document.querySelectorAll('.avaliacao .ativo').forEach(star => star.classList.remove('ativo'));
                    await carregarFeedbacks();
                } else {
                    alert('Erro: ' + result);
                }
            } catch (error) {
                alert('Erro ao enviar feedback.');
                console.error(error);
            }
        });
    }
});

async function carregarFeedbacks() {
    const feedbackContainer = document.getElementById('feedback-slides');
    const indicadores = document.querySelector('.carousel-indicators');
    if (!feedbackContainer) return;

    try {
        const response = await fetch('https://salaobackend-1.onrender.com/feedback');
        const feedbacks = await response.json();

        feedbackContainer.innerHTML = '';
        indicadores.innerHTML = '';

        feedbacks.forEach((f, index) => {
            const ativo = index === 0 ? 'active' : '';
            const estrelas = '★'.repeat(f.avaliacao) + '☆'.repeat(5 - f.avaliacao);
            const data = new Date(f.criado_em).toLocaleDateString('pt-BR', {
                day: '2-digit', month: 'short', year: 'numeric'
            });

            const item = `
                <div class="carousel-item ${ativo}" data-bs-interval="8000">
                    <div class="d-flex flex-column align-items-center justify-content-center p-4" style="min-height: 400px;">
                        <img src="img/icone.png" class="rounded-circle mb-3" width="80" alt="">
                        <h5 class="mb-2">${f.nome} ${f.sobrenome}</h5>
                        <div class="mb-3" style="color: gold; font-size: 20px;">${estrelas}</div>
                        <blockquote class="blockquote text-center mx-auto" style="max-width: 600px;">
                            <p class="mb-0">"${f.mensagem}"</p>
                        </blockquote>
                        <small class="text-muted mt-3">${data}</small>
                    </div>
                </div>`;

            const indicador = `<button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="${index}" class="${ativo}" aria-label="Slide ${index + 1}"></button>`;

            feedbackContainer.innerHTML += item;
            indicadores.innerHTML += indicador;
        });

        if (feedbacks.length > 0) {
            new bootstrap.Carousel(document.getElementById('carouselExampleDark'));
        }
    } catch (error) {
        console.error('Erro ao carregar feedbacks:', error);
    }
}
document.addEventListener('DOMContentLoaded', carregarFeedbacks);
