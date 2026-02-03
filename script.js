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
        form: null
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
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
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
        
        if (elements.form) {
            elements.form.addEventListener('submit', handleFormSubmit);
        }
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
        } catch (error) {
            console.error('Erro ao inicializar scripts:', error);
        }
    }

    // Inicia a aplicação
    init();

})();
