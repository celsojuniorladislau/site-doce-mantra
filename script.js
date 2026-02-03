/**
 * Dôce Mantra Spa - JavaScript Otimizado
 * Módulos: Smooth Scroll, Scroll Animations, Form Handling
 */

(function() {
    'use strict';

    // Cache de elementos DOM
    const elements = {
        anchors: null,
        fadeElements: null,
        form: null,
        menuToggle: null,
        mobileMenu: null,
        mobileMenuOverlay: null,
        mobileNavLinks: null
    };

    /**
     * Inicializa smooth scroll para links de âncora
     */
    function initSmoothScroll() {
        elements.anchors = document.querySelectorAll('a[href^="#"]');
        
        elements.anchors.forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const target = document.querySelector(targetId);
                
                if (target) {
                    // Fecha menu mobile se estiver aberto
                    if (elements.mobileMenu && elements.mobileMenu.classList.contains('active')) {
                        closeMobileMenu();
                    }
                    
                    // Calcula offset baseado na altura do nav
                    const nav = document.querySelector('nav');
                    const navHeight = nav ? nav.offsetHeight : 120;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = targetPosition - navHeight;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    /**
     * Inicializa animações de scroll usando Intersection Observer
     */
    function initScrollAnimations() {
        // Verifica suporte ao Intersection Observer
        if (!('IntersectionObserver' in window)) {
            // Fallback: adiciona classe visible a todos os elementos
            elements.fadeElements = document.querySelectorAll('.fade-in');
            elements.fadeElements.forEach(el => el.classList.add('visible'));
            return;
        }

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Para de observar após animação para melhor performance
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        elements.fadeElements = document.querySelectorAll('.fade-in');
        elements.fadeElements.forEach(el => observer.observe(el));
    }

    /**
     * Validação de formulário
     */
    function validateForm(form) {
        const nome = form.querySelector('#nome').value.trim();
        const email = form.querySelector('#email').value.trim();
        const telefone = form.querySelector('#telefone').value.trim();
        const mensagem = form.querySelector('#mensagem').value.trim();

        // Validação básica
        if (!nome || nome.length < 2) {
            showError('Por favor, insira um nome válido.');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            showError('Por favor, insira um e-mail válido.');
            return false;
        }

        const telefoneRegex = /^[\d\s\(\)\-\+]+$/;
        if (!telefone || !telefoneRegex.test(telefone) || telefone.length < 10) {
            showError('Por favor, insira um telefone válido.');
            return false;
        }

        if (!mensagem || mensagem.length < 10) {
            showError('Por favor, insira uma mensagem com pelo menos 10 caracteres.');
            return false;
        }

        return true;
    }

    /**
     * Exibe mensagem de erro
     */
    function showError(message) {
        // Remove mensagem anterior se existir
        const existingError = document.querySelector('.form-error');
        if (existingError) {
            existingError.remove();
        }

        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error';
        errorDiv.style.cssText = `
            background: #ff6b6b;
            color: white;
            padding: 1rem;
            border-radius: 10px;
            margin-bottom: 1rem;
            text-align: center;
        `;
        errorDiv.textContent = message;

        const form = elements.form;
        form.insertBefore(errorDiv, form.firstChild);

        // Remove mensagem após 5 segundos
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    /**
     * Exibe mensagem de sucesso
     */
    function showSuccess() {
        const successDiv = document.createElement('div');
        successDiv.className = 'form-success';
        successDiv.style.cssText = `
            background: #51cf66;
            color: white;
            padding: 1rem;
            border-radius: 10px;
            margin-bottom: 1rem;
            text-align: center;
        `;
        successDiv.textContent = 'Obrigado pelo contato! Entraremos em contato em breve.';

        const form = elements.form;
        form.insertBefore(successDiv, form.firstChild);

        // Remove mensagem após 5 segundos
        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    }

    /**
     * Manipula envio do formulário
     */
    function handleFormSubmit(e) {
        e.preventDefault();
        
        if (!validateForm(elements.form)) {
            return;
        }

        // Aqui você pode adicionar integração com backend/API
        // Por enquanto, apenas mostra mensagem de sucesso
        showSuccess();
        elements.form.reset();

        // Remove mensagens de erro se existirem
        const existingError = document.querySelector('.form-error');
        if (existingError) {
            existingError.remove();
        }
    }

    /**
     * Inicializa manipulação de formulário
     */
    function initFormHandling() {
        elements.form = document.querySelector('form');
        
        // Formulário removido - função mantida para compatibilidade
        if (elements.form) {
            elements.form.addEventListener('submit', handleFormSubmit);
        }
    }

    /**
     * Inicializa menu hambúrguer mobile
     */
    function initMobileMenu() {
        elements.menuToggle = document.querySelector('.menu-toggle');
        elements.mobileMenu = document.querySelector('.mobile-menu');
        elements.mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

        // Cria overlay se não existir
        if (!document.querySelector('.mobile-menu-overlay')) {
            const overlay = document.createElement('div');
            overlay.className = 'mobile-menu-overlay';
            document.body.appendChild(overlay);
            elements.mobileMenuOverlay = overlay;
        } else {
            elements.mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
        }

        if (elements.menuToggle && elements.mobileMenu) {
            // Toggle menu ao clicar no botão hambúrguer
            elements.menuToggle.addEventListener('click', function() {
                const isActive = elements.mobileMenu.classList.contains('active');
                
                if (isActive) {
                    closeMobileMenu();
                } else {
                    openMobileMenu();
                }
            });

            // Fecha menu ao clicar no overlay
            if (elements.mobileMenuOverlay) {
                elements.mobileMenuOverlay.addEventListener('click', closeMobileMenu);
            }

            // Fecha menu ao clicar em um link
            elements.mobileNavLinks.forEach(link => {
                link.addEventListener('click', function() {
                    closeMobileMenu();
                });
            });

            // Fecha menu ao pressionar ESC
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && elements.mobileMenu.classList.contains('active')) {
                    closeMobileMenu();
                }
            });
        }
    }

    /**
     * Abre o menu mobile
     */
    function openMobileMenu() {
        if (elements.mobileMenu && elements.menuToggle && elements.mobileMenuOverlay) {
            elements.mobileMenu.classList.add('active');
            elements.menuToggle.classList.add('active');
            elements.mobileMenuOverlay.classList.add('active');
            elements.menuToggle.setAttribute('aria-expanded', 'true');
            elements.mobileMenu.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden'; // Previne scroll do body
        }
    }

    /**
     * Fecha o menu mobile
     */
    function closeMobileMenu() {
        if (elements.mobileMenu && elements.menuToggle && elements.mobileMenuOverlay) {
            elements.mobileMenu.classList.remove('active');
            elements.menuToggle.classList.remove('active');
            elements.mobileMenuOverlay.classList.remove('active');
            elements.menuToggle.setAttribute('aria-expanded', 'false');
            elements.mobileMenu.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = ''; // Restaura scroll do body
        }
    }

    /**
     * Inicializa cards clicáveis com efeito de botão
     */
    function initClickableCards() {
        const clickableCards = document.querySelectorAll('.contato-item-clickable');
        
        clickableCards.forEach(card => {
            card.addEventListener('click', function(e) {
                e.preventDefault();
                const href = this.getAttribute('href');
                
                // Primeiro: adiciona classe active para descer
                this.classList.add('active');
                
                // Segundo: remove a classe após um tempo para subir
                setTimeout(() => {
                    this.classList.remove('active');
                    
                    // Terceiro: abre o link após o movimento de subir
                    setTimeout(() => {
                        if (href && href !== '#') {
                            window.open(href, '_blank', 'noopener,noreferrer');
                        }
                    }, 200); // Aguarda 200ms após subir para abrir
                }, 250); // 250ms para descer e subir
            });
        });
    }

    /**
     * Inicializa todas as funcionalidades quando o DOM estiver pronto
     */
    function init() {
        // Aguarda o DOM estar completamente carregado
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        try {
            initSmoothScroll();
            initScrollAnimations();
            initFormHandling();
            initMobileMenu();
            initClickableCards();
        } catch (error) {
            console.error('Erro ao inicializar scripts:', error);
        }
    }

    // Inicia a aplicação
    init();

})();
