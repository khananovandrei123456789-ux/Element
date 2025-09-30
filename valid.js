// Элементы формы
const form = document.querySelector('[data-js-form]');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');
const errorSpans = document.querySelectorAll('[data-js-form-field-errors]');

// Объект с ошибками
const errors = {
    name: '',
    email: '',
    message: ''
};

// Функции валидации
const validators = {
    // Валидация имени
    name: function(value) {
        errors.name = '';
        
        if (!value.trim()) {
            errors.name = 'Full Name is required';
            return false;
        }
        
        if (value.length < 5) {
            errors.name = 'Name must be at least 5 characters';
            return false;
        }
        
        if (value.length > 50) {
            errors.name = 'Name must be less than 50 characters';
            return false;
        }
        
        if (!/^[a-zA-Zа-яА-ЯёЁ\s\-']+$/.test(value)) {
            errors.name = 'Name can only contain letters, spaces, hyphens and apostrophes';
            return false;
        }
        
        return true;
    },
    
    // Валидация email
    email: function(value) {
        errors.email = '';
        
        if (!value.trim()) {
            errors.email = 'Email is required';
            return false;
        }
        
        if (value.length < 5) {
            errors.email = 'Email must be at least 5 characters';
            return false;
        }
        
        if (value.length > 50) {
            errors.email = 'Email must be less than 50 characters';
            return false;
        }
        
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            errors.email = 'Please enter a valid email address';
            return false;
        }
        
        return true;
    },
    
    // Валидация сообщения
    message: function(value) {
        errors.message = '';
        
        if (!value.trim()) {
            errors.message = 'Message is required';
            return false;
        }
        
        if (value.length < 5) {
            errors.message = 'Message must be at least 5 characters';
            return false;
        }
        
        if (value.length > 300) {
            errors.message = 'Message must be less than 300 characters';
            return false;
        }
        
        return true;
    }
};

// Функция отображения ошибок
function showErrors() {
    // Очищаем все ошибки
    errorSpans.forEach(span => {
        span.textContent = '';
        span.style.display = 'none';
    });
    
    // Показываем актуальные ошибки
    for (const field in errors) {
        if (errors[field]) {
            const errorSpan = document.getElementById(`${field}-errors`);
            if (errorSpan) {
                errorSpan.textContent = errors[field];
                errorSpan.style.display = 'block';
            }
            
            // Добавляем класс ошибки к полю ввода
            const input = document.getElementById(field);
            if (input) {
                input.classList.add('error');
            }
        }
    }
}

// Функция очистки ошибок
function clearErrors() {
    errors.name = '';
    errors.email = '';
    errors.message = '';
    
    errorSpans.forEach(span => {
        span.textContent = '';
        span.style.display = 'none';
    });
    
    // Убираем классы ошибок
    [nameInput, emailInput, messageInput].forEach(input => {
        if (input) {
            input.classList.remove('error');
        }
    });
}

// Валидация в реальном времени при уходе с поля
nameInput.addEventListener('blur', function() {
    validators.name(this.value);
    showErrors();
});

emailInput.addEventListener('blur', function() {
    validators.email(this.value);
    showErrors();
});

messageInput.addEventListener('blur', function() {
    validators.message(this.value);
    showErrors();
});

// Очистка ошибок при фокусе на поле
[nameInput, emailInput, messageInput].forEach(input => {
    input.addEventListener('focus', function() {
        this.classList.remove('error');
        const errorSpan = document.getElementById(`${this.id}-errors`);
        if (errorSpan) {
            errorSpan.style.display = 'none';
        }
    });
});

// Обработчик отправки формы
form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Валидируем все поля
    const isNameValid = validators.name(nameInput.value);
    const isEmailValid = validators.email(emailInput.value);
    const isMessageValid = validators.message(messageInput.value);
    
    // Показываем ошибки
    showErrors();
    
    // Если все валидно - отправляем форму
    if (isNameValid && isEmailValid && isMessageValid) {
    const submitBtn = form.querySelector('.btnModalSubmit');
    const originalText = submitBtn.value;
    submitBtn.value = 'Sending...';
    submitBtn.disabled = true;

    fetch( 'https://api.yourdomain.com/contact',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            message: messageInput.value.trim(),
            source: 'website_contact_form'
        })
    })
    .then(async response => {
        const data = await response.json();
        
        if (response.status === 200 || response.status === 201) {
            return { success: true, data };
        } else if (response.status === 400) {
            throw new Error(data.message || 'Validation error');
        } else if (response.status === 429) {
            throw new Error('Too many requests. Please try again later.');
        } else {
            throw new Error(data.message || 'Server error');
        }
    })
    .then(result => {
        console.log('Success:', result.data);
        showSuccessPopup();
        form.reset();
        clearErrors();

    })
    .catch(error => {
        console.error('Error:', error);
        showErrorPopup(error.message || 'Failed to send message. Please try again.');
    })
    .finally(() => {
        submitBtn.value = originalText;
        submitBtn.disabled = false;
    });
        
        // Показываем попап успешной отправки
        showSuccessPopup();
        
        // Очищаем форму
        form.reset();
        clearErrors();
    }
});

// Функция показа попапа успешной отправки
function showSuccessPopup() {
    // Создаем элемент попапа
    const successPopup = document.createElement('div');
    successPopup.className = 'success-popup';
    successPopup.innerHTML = `
        <div class="success-popup-content">
            <div class="success-icon">✓</div>
            <h3>Success!</h3>
            <p>Your message successfully sent</p>
            <button class="success-close-btn">OK</button>
        </div>
    `;
    
    // Добавляем стили
    successPopup.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        opacity: 0;
        animation: fadeIn 0.3s ease forwards;
    `;
    
    const popupContent = successPopup.querySelector('.success-popup-content');
    popupContent.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 10px;
        text-align: center;
        max-width: 400px;
        width: 90%;
        transform: scale(0.8);
        animation: scaleIn 0.3s ease 0.1s forwards;
    `;
    
    // Добавляем в body
    document.body.appendChild(successPopup);
    
    // Обработчик закрытия по кнопке
    const closeBtn = successPopup.querySelector('.success-close-btn');
    closeBtn.addEventListener('click', function() {
        closeSuccessPopup(successPopup);
    });
    
    // Закрытие по клику вне попапа
    successPopup.addEventListener('click', function(e) {
        if (e.target === successPopup) {
            closeSuccessPopup(successPopup);
        }
    });
    
    // Закрытие по Escape
    document.addEventListener('keydown', function closeOnEscape(e) {
        if (e.key === 'Escape') {
            closeSuccessPopup(successPopup);
            document.removeEventListener('keydown', closeOnEscape);
        }
    });
}

// Функция закрытия попапа
function closeSuccessPopup(popup) {
    popup.style.animation = 'fadeOut 0.3s ease forwards';
    setTimeout(() => {
        if (popup.parentNode) {
            popup.parentNode.removeChild(popup);
        }
    }, 300);
}

// Функция для ручной проверки формы
function validateForm() {
    const isNameValid = validators.name(nameInput.value);
    const isEmailValid = validators.email(emailInput.value);
    const isMessageValid = validators.message(messageInput.value);
    
    showErrors();
    return isNameValid && isEmailValid && isMessageValid;
}

// Функция сброса формы
function resetForm() {
    form.reset();
    clearErrors();
}

