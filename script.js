// Данные донатных пакетов
const donationPackages = [
    {
        id: 1,
        name: "Стартовый",
        price: 99,
        features: ["Префикс в чате", "Цветной ник", "Доступ к /hat", "3 ключа от кейсов"],
        popular: false
    },
    {
        id: 2,
        name: "Игрок",
        price: 199,
        features: ["Все из предыдущего", "Доступ к /fly", "Дополнительные варпы", "7 ключей от кейсов"],
        popular: false
    },
    {
        id: 3,
        name: "Ветеран",
        price: 349,
        features: ["Все из предыдущего", "Доп. наборы ресурсов", "Доступ к /fix", "15 ключей от кейсов"],
        popular: false
    },
    {
        id: 4,
        name: "Мастер",
        price: 499,
        features: ["Все из предыдущего", "Эксклюзивный плащ", "Личный питомец", "25 ключей от кейсов"],
        popular: true
    },
    {
        id: 5,
        name: "Легенда",
        price: 799,
        features: ["Все из предыдущего", "Доступ к /ec", "Личные эффекты", "50 ключей от кейсов"],
        popular: false
    },
    {
        id: 6,
        name: "Император",
        price: 1299,
        features: ["Все из предыдущего", "Личный остров в SkyBlock", "Ускорение ферм x2", "100 ключей от кейсов"],
        popular: false
    },
    {
        id: 7,
        name: "Бог",
        price: 1999,
        features: ["Все из предыдущего", "VIP-комната в лобби", "Личный цвет в чате", "200 ключей от кейсов"],
        popular: true
    },
    {
        id: 8,
        name: "Творец",
        price: 2999,
        features: ["Все из предыдущего", "Создание личной команды", "Доступ к приватным играм", "350 ключей от кейсов"],
        popular: false
    },
    {
        id: 9,
        name: "Властелин",
        price: 4999,
        features: ["Все из предыдущего", "Уникальный титул", "Личный контент-менеджер", "500 ключей от кейсов"],
        popular: false
    },
    {
        id: 10,
        name: "Абсолют",
        price: 9999,
        features: ["ВСЕ доступные привилегии", "Личный NPC на сервере", "Участие в разработке", "1000 ключей от кейсов"],
        popular: true
    }
];

// Корзина покупок
let cart = [];
let purchaseHistory = [];

// DOM элементы
let cartCountElement;
let cartTotalElement;
let cartItemsElement;
let purchaseHistoryElement;
let paymentModal;

// Инициализация после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация элементов
    initElements();
    
    // Загрузка данных из localStorage
    loadFromStorage();
    
    // Обновление отображения корзины
    updateCartDisplay();
    
    // Создание кнопок покупки
    setupPurchaseButtons();
    
    // Настройка модального окна оплаты
    setupPaymentModal();
    
    // Отображение истории покупок
    displayPurchaseHistory();
});

// Инициализация DOM элементов
function initElements() {
    // Создаем элементы для корзины, если их нет
    if (!document.getElementById('cartIcon')) {
        createCartIcon();
    }
    
    cartCountElement = document.getElementById('cartCount');
    cartTotalElement = document.getElementById('cartTotal');
    cartItemsElement = document.getElementById('cartItems');
    purchaseHistoryElement = document.getElementById('purchaseHistory');
    paymentModal = document.getElementById('paymentModal');
}

// Создание иконки корзины в навигации
function createCartIcon() {
    const navMenu = document.querySelector('.nav-menu');
    
    const cartLi = document.createElement('li');
    cartLi.id = 'cartLi';
    
    const cartLink = document.createElement('a');
    cartLink.href = '#';
    cartLink.id = 'cartIcon';
    cartLink.innerHTML = '<i class="fas fa-shopping-cart"></i> <span id="cartCount">0</span>';
    
    cartLi.appendChild(cartLink);
    navMenu.appendChild(cartLi);
    
    // Создаем модальное окно корзины
    createCartModal();
    
    // Создаем модальное окно оплаты
    createPaymentModal();
    
    // Создаем секцию истории покупок
    createHistorySection();
}

// Создание модального окна корзины
function createCartModal() {
    const modalHTML = `
        <div id="cartModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2><i class="fas fa-shopping-cart"></i> Корзина покупок</h2>
                    <span class="close-modal">&times;</span>
                </div>
                <div class="modal-body">
                    <div id="cartEmpty" class="cart-empty">
                        <i class="fas fa-shopping-cart fa-3x"></i>
                        <h3>Корзина пуста</h3>
                        <p>Добавьте донат-пакеты из списка выше</p>
                    </div>
                    <div id="cartContent" class="cart-content" style="display: none;">
                        <div id="cartItems"></div>
                        <div class="cart-summary">
                            <div class="cart-total">
                                <span>Итого:</span>
                                <span id="cartTotal">0 ₽</span>
                            </div>
                            <button id="checkoutBtn" class="btn btn-secondary">Перейти к оплате</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Добавляем стили для модального окна
    addModalStyles();
    
    // Настройка обработчиков событий для корзины
    setupCartModalEvents();
}

// Создание модального окна оплаты
function createPaymentModal() {
    const modalHTML = `
        <div id="paymentModal" class="modal">
            <div class="modal-content payment-modal">
                <div class="modal-header">
                    <h2><i class="fas fa-credit-card"></i> Оформление заказа</h2>
                    <span class="close-modal">&times;</span>
                </div>
                <div class="modal-body">
                    <form id="paymentForm">
                        <div class="form-section">
                            <h3>Информация об игроке</h3>
                            <div class="form-group">
                                <label for="playerNickname">Никнейм в Minecraft *</label>
                                <input type="text" id="playerNickname" required placeholder="Введите ваш ник">
                            </div>
                            <div class="form-group">
                                <label for="playerEmail">Email *</label>
                                <input type="email" id="playerEmail" required placeholder="example@mail.com">
                            </div>
                        </div>
                        
                        <div class="form-section">
                            <h3>Метод оплаты</h3>
                            <div class="payment-methods">
                                <div class="payment-method">
                                    <input type="radio" id="card" name="paymentMethod" value="card" checked>
                                    <label for="card">
                                        <i class="fab fa-cc-visa"></i>
                                        <i class="fab fa-cc-mastercard"></i>
                                        Банковская карта
                                    </label>
                                </div>
                                <div class="payment-method">
                                    <input type="radio" id="yoomoney" name="paymentMethod" value="yoomoney">
                                    <label for="yoomoney">
                                        <i class="fas fa-wallet"></i>
                                        ЮMoney
                                    </label>
                                </div>
                                <div class="payment-method">
                                    <input type="radio" id="qiwi" name="paymentMethod" value="qiwi">
                                    <label for="qiwi">
                                        <i class="fas fa-mobile-alt"></i>
                                        QIWI
                                    </label>
                                </div>
                                <div class="payment-method">
                                    <input type="radio" id="crypto" name="paymentMethod" value="crypto">
                                    <label for="crypto">
                                        <i class="fab fa-bitcoin"></i>
                                        Криптовалюта
                                    </label>
                                </div>
                            </div>
                        </div>
                        
                        <div id="cardDetails" class="form-section">
                            <h3>Данные карты</h3>
                            <div class="form-group">
                                <label for="cardNumber">Номер карты *</label>
                                <input type="text" id="cardNumber" placeholder="1234 5678 9012 3456" maxlength="19">
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="cardExpiry">Срок действия *</label>
                                    <input type="text" id="cardExpiry" placeholder="MM/YY" maxlength="5">
                                </div>
                                <div class="form-group">
                                    <label for="cardCVC">CVC *</label>
                                    <input type="text" id="cardCVC" placeholder="123" maxlength="3">
                                </div>
                            </div>
                        </div>
                        
                        <div class="order-summary">
                            <h3>Ваш заказ</h3>
                            <div id="orderItems"></div>
                            <div class="order-total">
                                <span>Общая сумма:</span>
                                <span id="orderTotal">0 ₽</span>
                            </div>
                        </div>
                        
                        <div class="form-footer">
                            <button type="submit" id="confirmPayment" class="btn">Оплатить</button>
                            <button type="button" id="cancelPayment" class="btn btn-cancel">Отмена</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Настройка обработчиков событий для оплаты
    setupPaymentModalEvents();
}

// Создание секции истории покупок
function createHistorySection() {
    // Ищем подходящее место для вставки истории покупок
    const donationsSection = document.querySelector('.donations');
    if (donationsSection) {
        const historyHTML = `
            <div class="history-section" style="margin-top: 80px; padding-top: 50px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
                <h2 class="section-title">История покупок</h2>
                <div id="purchaseHistory" class="history-container">
                    <div class="history-empty">
                        <i class="fas fa-history fa-3x"></i>
                        <h3>История покупок пуста</h3>
                        <p>Здесь будут отображаться ваши предыдущие покупки</p>
                    </div>
                </div>
            </div>
        `;
        
        donationsSection.insertAdjacentHTML('beforeend', historyHTML);
        purchaseHistoryElement = document.getElementById('purchaseHistory');
    }
}

// Добавление стилей для модальных окон
function addModalStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Стили для модальных окон */
        .modal {
            display: none;
            position: fixed;
            z-index: 2000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(5px);
        }
        
        .modal-content {
            background: linear-gradient(135deg, #0c1519 0%, #0f1a20 100%);
            margin: 5% auto;
            padding: 0;
            width: 90%;
            max-width: 800px;
            border-radius: 15px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
            animation: modalFadeIn 0.3s ease;
        }
        
        @keyframes modalFadeIn {
            from { opacity: 0; transform: translateY(-50px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .modal-header {
            padding: 20px 30px;
            background: rgba(42, 157, 143, 0.1);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-radius: 15px 15px 0 0;
        }
        
        .modal-header h2 {
            color: var(--primary);
            font-size: 1.5rem;
        }
        
        .close-modal {
            color: #aaa;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
            transition: color 0.3s;
        }
        
        .close-modal:hover {
            color: var(--secondary);
        }
        
        .modal-body {
            padding: 30px;
            max-height: 70vh;
            overflow-y: auto;
        }
        
        /* Стили для корзины */
        .cart-empty {
            text-align: center;
            padding: 40px 20px;
            color: #aaa;
        }
        
        .cart-empty i {
            margin-bottom: 20px;
            color: var(--gray);
        }
        
        .cart-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px;
            background: rgba(255, 255, 255, 0.03);
            border-radius: 10px;
            margin-bottom: 10px;
            border: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .cart-item-info h4 {
            color: var(--primary);
            margin-bottom: 5px;
        }
        
        .cart-item-price {
            font-weight: bold;
            color: var(--light);
            font-size: 1.2rem;
        }
        
        .cart-item-actions {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .cart-item-quantity {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .quantity-btn {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background: rgba(42, 157, 143, 0.2);
            color: var(--primary);
            border: none;
            cursor: pointer;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .quantity-btn:hover {
            background: rgba(42, 157, 143, 0.4);
        }
        
        .cart-item-quantity span {
            min-width: 20px;
            text-align: center;
        }
        
        .remove-item {
            background: rgba(231, 111, 81, 0.2);
            color: var(--secondary);
            border: none;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .remove-item:hover {
            background: rgba(231, 111, 81, 0.4);
        }
        
        .cart-summary {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .cart-total {
            display: flex;
            justify-content: space-between;
            font-size: 1.5rem;
            font-weight: bold;
            margin-bottom: 20px;
            color: var(--light);
        }
        
        /* Стили для формы оплаты */
        .form-section {
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .form-section h3 {
            color: var(--primary);
            margin-bottom: 15px;
            font-size: 1.2rem;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        .form-row {
            display: flex;
            gap: 20px;
        }
        
        .form-row .form-group {
            flex: 1;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 8px;
            color: #ccc;
            font-weight: 500;
        }
        
        .form-group input {
            width: 100%;
            padding: 12px 15px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            color: var(--light);
            font-size: 1rem;
            transition: all 0.3s;
        }
        
        .form-group input:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 2px rgba(42, 157, 143, 0.2);
        }
        
        .payment-methods {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 15px;
        }
        
        .payment-method {
            position: relative;
        }
        
        .payment-method input {
            position: absolute;
            opacity: 0;
            width: 0;
            height: 0;
        }
        
        .payment-method label {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 15px;
            background: rgba(255, 255, 255, 0.03);
            border: 2px solid rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.3s;
            text-align: center;
        }
        
        .payment-method label i {
            font-size: 1.5rem;
            margin-bottom: 10px;
            color: var(--primary);
        }
        
        .payment-method input:checked + label {
            border-color: var(--primary);
            background: rgba(42, 157, 143, 0.1);
        }
        
        .order-summary {
            background: rgba(255, 255, 255, 0.03);
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
        }
        
        .order-items {
            margin-bottom: 15px;
        }
        
        .order-item {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .order-item:last-child {
            border-bottom: none;
        }
        
        .order-total {
            display: flex;
            justify-content: space-between;
            font-size: 1.3rem;
            font-weight: bold;
            color: var(--light);
            padding-top: 15px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .form-footer {
            display: flex;
            gap: 15px;
            justify-content: flex-end;
        }
        
        .btn-cancel {
            background: rgba(255, 255, 255, 0.1);
            color: #ccc;
        }
        
        .btn-cancel:hover {
            background: rgba(255, 255, 255, 0.2);
        }
        
        /* Стили для истории покупок */
        .history-container {
            background: rgba(255, 255, 255, 0.03);
            border-radius: 15px;
            padding: 30px;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .history-empty {
            text-align: center;
            padding: 40px 20px;
            color: #aaa;
        }
        
        .history-empty i {
            margin-bottom: 20px;
            color: var(--gray);
        }
        
        .history-item {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 15px;
            border-left: 4px solid var(--primary);
        }
        
        .history-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }
        
        .history-title {
            color: var(--primary);
            font-weight: bold;
            font-size: 1.1rem;
        }
        
        .history-date {
            color: #aaa;
            font-size: 0.9rem;
        }
        
        .history-details {
            display: flex;
            justify-content: space-between;
            color: #ccc;
            margin-bottom: 10px;
        }
        
        .history-status {
            display: inline-block;
            padding: 5px 10px;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: bold;
        }
        
        .status-completed {
            background: rgba(42, 157, 143, 0.2);
            color: var(--primary);
        }
        
        .status-pending {
            background: rgba(233, 196, 106, 0.2);
            color: var(--warning);
        }
        
        /* Адаптивность модальных окон */
        @media (max-width: 768px) {
            .modal-content {
                width: 95%;
                margin: 10% auto;
            }
            
            .form-row {
                flex-direction: column;
                gap: 0;
            }
            
            .payment-methods {
                grid-template-columns: 1fr;
            }
        }
    `;
    
    document.head.appendChild(style);
}

// Настройка кнопок покупки
function setupPurchaseButtons() {
    document.querySelectorAll('.donation-card .btn').forEach((button, index) => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (index < donationPackages.length) {
                addToCart(donationPackages[index]);
                showNotification(`Донат "${donationPackages[index].name}" добавлен в корзину!`, 'success');
            }
        });
    });
}

// Настройка событий модального окна корзины
function setupCartModalEvents() {
    const cartModal = document.getElementById('cartModal');
    const cartIcon = document.getElementById('cartIcon');
    const closeModal = document.querySelector('#cartModal .close-modal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    // Открытие корзины
    if (cartIcon) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            cartModal.style.display = 'block';
        });
    }
    
    // Закрытие корзины
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            cartModal.style.display = 'none';
        });
    }
    
    // Закрытие при клике вне окна
    window.addEventListener('click', function(e) {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });
    
    // Переход к оплате
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                showNotification('Корзина пуста! Добавьте товары перед оплатой.', 'error');
                return;
            }
            
            cartModal.style.display = 'none';
            openPaymentModal();
        });
    }
}

// Настройка событий модального окна оплаты
function setupPaymentModalEvents() {
    const paymentModal = document.getElementById('paymentModal');
    const closePaymentModal = document.querySelector('#paymentModal .close-modal');
    const cancelPaymentBtn = document.getElementById('cancelPayment');
    const paymentForm = document.getElementById('paymentForm');
    const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
    
    // Изменение метода оплаты
    paymentMethods.forEach(method => {
        method.addEventListener('change', function() {
            updatePaymentMethodDetails(this.value);
        });
    });
    
    // Закрытие окна оплаты
    if (closePaymentModal) {
        closePaymentModal.addEventListener('click', function() {
            paymentModal.style.display = 'none';
        });
    }
    
    if (cancelPaymentBtn) {
        cancelPaymentBtn.addEventListener('click', function() {
            paymentModal.style.display = 'none';
        });
    }
    
    // Закрытие при клике вне окна
    window.addEventListener('click', function(e) {
        if (e.target === paymentModal) {
            paymentModal.style.display = 'none';
        }
    });
    
    // Обработка формы оплаты
    if (paymentForm) {
        paymentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            processPayment();
        });
    }
    
    // Маска для номера карты
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{4})/g, '$1 ').trim();
            e.target.value = value.substring(0, 19);
        });
    }
    
    // Маска для срока действия карты
    const cardExpiryInput = document.getElementById('cardExpiry');
    if (cardExpiryInput) {
        cardExpiryInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value.substring(0, 5);
        });
    }
    
    // Маска для CVC
    const cardCVCInput = document.getElementById('cardCVC');
    if (cardCVCInput) {
        cardCVCInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '').substring(0, 3);
        });
    }
}

// Обновление деталей в зависимости от метода оплаты
function updatePaymentMethodDetails(method) {
    const cardDetails = document.getElementById('cardDetails');
    
    if (method === 'card') {
        cardDetails.style.display = 'block';
    } else {
        cardDetails.style.display = 'none';
    }
}

// Добавление доната в корзину
function addToCart(packageItem) {
    // Проверяем, есть ли уже такой пакет в корзине
    const existingItemIndex = cart.findIndex(item => item.id === packageItem.id);
    
    if (existingItemIndex !== -1) {
        // Увеличиваем количество
        cart[existingItemIndex].quantity += 1;
    } else {
        // Добавляем новый товар
        cart.push({
            ...packageItem,
            quantity: 1,
            addedAt: new Date()
        });
    }
    
    // Обновляем отображение корзины
    updateCartDisplay();
    
    // Сохраняем в localStorage
    saveToStorage();
}

// Удаление доната из корзины
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCartDisplay();
    saveToStorage();
}

// Изменение количества товара
function updateCartItemQuantity(itemId, newQuantity) {
    const itemIndex = cart.findIndex(item => item.id === itemId);
    
    if (itemIndex !== -1) {
        if (newQuantity < 1) {
            removeFromCart(itemId);
        } else {
            cart[itemIndex].quantity = newQuantity;
            updateCartDisplay();
            saveToStorage();
        }
    }
}

// Обновление отображения корзины
function updateCartDisplay() {
    // Обновляем счетчик в иконке корзины
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
    }
    
    // Обновляем отображение самой корзины
    updateCartModalDisplay();
}

// Обновление модального окна корзины
function updateCartModalDisplay() {
    const cartEmpty = document.getElementById('cartEmpty');
    const cartContent = document.getElementById('cartContent');
    const cartItemsElement = document.getElementById('cartItems');
    
    if (!cartItemsElement) return;
    
    if (cart.length === 0) {
        // Корзина пуста
        if (cartEmpty) cartEmpty.style.display = 'block';
        if (cartContent) cartContent.style.display = 'none';
    } else {
        // Корзина не пуста
        if (cartEmpty) cartEmpty.style.display = 'none';
        if (cartContent) cartContent.style.display = 'block';
        
        // Очищаем содержимое
        cartItemsElement.innerHTML = '';
        
        // Добавляем товары
        let totalPrice = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            totalPrice += itemTotal;
            
            const cartItemHTML = `
                <div class="cart-item" data-id="${item.id}">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>${item.price} ₽ × ${item.quantity}</p>
                    </div>
                    <div class="cart-item-actions">
                        <div class="cart-item-price">${itemTotal} ₽</div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn minus" data-id="${item.id}">-</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn plus" data-id="${item.id}">+</button>
                        </div>
                        <button class="remove-item" data-id="${item.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            
            cartItemsElement.insertAdjacentHTML('beforeend', cartItemHTML);
        });
        
        // Обновляем итоговую сумму
        const cartTotalElement = document.getElementById('cartTotal');
        if (cartTotalElement) {
            cartTotalElement.textContent = `${totalPrice} ₽`;
        }
        
        // Добавляем обработчики событий для кнопок
        setupCartItemEvents();
    }
}

// Настройка событий для элементов корзины
function setupCartItemEvents() {
    // Кнопки увеличения/уменьшения количества
    document.querySelectorAll('.quantity-btn.minus').forEach(button => {
        button.addEventListener('click', function() {
            const itemId = parseInt(this.getAttribute('data-id'));
            const item = cart.find(item => item.id === itemId);
            
            if (item) {
                updateCartItemQuantity(itemId, item.quantity - 1);
            }
        });
    });
    
    document.querySelectorAll('.quantity-btn.plus').forEach(button => {
        button.addEventListener('click', function() {
            const itemId = parseInt(this.getAttribute('data-id'));
            const item = cart.find(item => item.id === itemId);
            
            if (item) {
                updateCartItemQuantity(itemId, item.quantity + 1);
            }
        });
    });
    
    // Кнопки удаления
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            const itemId = parseInt(this.getAttribute('data-id'));
            removeFromCart(itemId);
        });
    });
}

// Открытие модального окна оплаты
function openPaymentModal() {
    const paymentModal = document.getElementById('paymentModal');
    const orderItems = document.getElementById('orderItems');
    const orderTotal = document.getElementById('orderTotal');
    
    if (!paymentModal || !orderItems) return;
    
    // Заполняем информацию о заказе
    orderItems.innerHTML = '';
    let totalPrice = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;
        
        const orderItemHTML = `
            <div class="order-item">
                <span>${item.name} × ${item.quantity}</span>
                <span>${itemTotal} ₽</span>
            </div>
        `;
        
        orderItems.insertAdjacentHTML('beforeend', orderItemHTML);
    });
    
    // Устанавливаем итоговую сумму
    if (orderTotal) {
        orderTotal.textContent = `${totalPrice} ₽`;
    }
    
    // Очищаем форму
    const paymentForm = document.getElementById('paymentForm');
    if (paymentForm) {
        paymentForm.reset();
    }
    
    // Показываем окно
    paymentModal.style.display = 'block';
}

// Обработка оплаты
function processPayment() {
    const playerNickname = document.getElementById('playerNickname').value.trim();
    const playerEmail = document.getElementById('playerEmail').value.trim();
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    
    // Валидация
    if (!playerNickname || !playerEmail) {
        showNotification('Пожалуйста, заполните все обязательные поля.', 'error');
        return;
    }
    
    // Имитация процесса оплаты
    showNotification('Идет обработка платежа...', 'info');
    
    // Имитация задержки оплаты
    setTimeout(() => {
        // Создаем покупку
        const purchase = {
            id: Date.now(),
            items: [...cart],
            total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            playerNickname,
            playerEmail,
            paymentMethod,
            date: new Date(),
            status: 'completed'
        };
        
        // Добавляем в историю
        purchaseHistory.push(purchase);
        
        // Очищаем корзину
        cart = [];
        
        // Обновляем отображение
        updateCartDisplay();
        displayPurchaseHistory();
        
        // Сохраняем в localStorage
        saveToStorage();
        
        // Закрываем окно оплаты
        document.getElementById('paymentModal').style.display = 'none';
        
        // Показываем успешное сообщение
        showNotification(`Оплата прошла успешно! Привилегии будут выданы игроку ${playerNickname} в течение 5 минут.`, 'success');
        
        // Показываем детали покупки
        setTimeout(() => {
            showPurchaseDetails(purchase);
        }, 1000);
    }, 2000);
}

// Показ деталей покупки
function showPurchaseDetails(purchase) {
    const itemsList = purchase.items.map(item => 
        `${item.name} (${item.quantity} шт.) - ${item.price * item.quantity} ₽`
    ).join('<br>');
    
    const paymentMethodsMap = {
        'card': 'Банковская карта',
        'yoomoney': 'ЮMoney',
        'qiwi': 'QIWI',
        'crypto': 'Криптовалюта'
    };
    
    const detailsHTML = `
        <div style="text-align: left;">
            <h3 style="color: var(--primary); margin-bottom: 15px;">Детали покупки</h3>
            <p><strong>ID заказа:</strong> ${purchase.id}</p>
            <p><strong>Игрок:</strong> ${purchase.playerNickname}</p>
            <p><strong>Email:</strong> ${purchase.playerEmail}</p>
            <p><strong>Способ оплаты:</strong> ${paymentMethodsMap[purchase.paymentMethod]}</p>
            <p><strong>Дата:</strong> ${purchase.date.toLocaleString()}</p>
            <p><strong>Статус:</strong> <span style="color: var(--success); font-weight: bold;">Завершено</span></p>
            <p><strong>Товары:</strong><br>${itemsList}</p>
            <p><strong>Итоговая сумма:</strong> ${purchase.total} ₽</p>
        </div>
    `;
    
    showNotification(detailsHTML, 'info', 10000);
}

// Отображение истории покупок
function displayPurchaseHistory() {
    if (!purchaseHistoryElement) return;
    
    if (purchaseHistory.length === 0) {
        purchaseHistoryElement.innerHTML = `
            <div class="history-empty">
                <i class="fas fa-history fa-3x"></i>
                <h3>История покупок пуста</h3>
                <p>Здесь будут отображаться ваши предыдущие покупки</p>
            </div>
        `;
    } else {
        let historyHTML = '';
        
        // Сортируем покупки по дате (новые сначала)
        const sortedHistory = [...purchaseHistory].sort((a, b) => new Date(b.date) - new Date(a.date));
        
        sortedHistory.forEach(purchase => {
            const date = new Date(purchase.date);
            const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
            
            // Формируем список товаров
            const itemsList = purchase.items.map(item => 
                `${item.name} × ${item.quantity}`
            ).join(', ');
            
            historyHTML += `
                <div class="history-item">
                    <div class="history-header">
                        <div class="history-title">Заказ #${purchase.id}</div>
                        <div class="history-date">${formattedDate}</div>
                    </div>
                    <div class="history-details">
                        <div>Игрок: ${purchase.playerNickname}</div>
                        <div>${purchase.total} ₽</div>
                    </div>
                    <div style="margin-bottom: 10px; color: #ccc; font-size: 0.9rem;">
                        ${itemsList}
                    </div>
                    <div class="history-status status-${purchase.status}">
                        ${purchase.status === 'completed' ? 'Завершено' : 'В обработке'}
                    </div>
                </div>
            `;
        });
        
        purchaseHistoryElement.innerHTML = historyHTML;
    }
}

// Уведомления
function showNotification(message, type = 'info', duration = 3000) {
    // Удаляем предыдущие уведомления
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Создаем уведомление
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    // Иконки для разных типов уведомлений
    const icons = {
        'success': 'fas fa-check-circle',
        'error': 'fas fa-exclamation-circle',
        'info': 'fas fa-info-circle'
    };
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="${icons[type] || icons.info}"></i>
            <div>${message}</div>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    // Добавляем стили для уведомления
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #0c1519 0%, #0f1a20 100%);
                color: white;
                padding: 15px 20px;
                border-radius: 10px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
                border-left: 4px solid var(--primary);
                z-index: 3000;
                display: flex;
                align-items: center;
                justify-content: space-between;
                min-width: 300px;
                max-width: 500px;
                animation: slideIn 0.3s ease;
                border: 1px solid rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
            }
            
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            .notification-success {
                border-left-color: var(--success);
            }
            
            .notification-error {
                border-left-color: var(--danger);
            }
            
            .notification-info {
                border-left-color: var(--primary);
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 15px;
                flex: 1;
            }
            
            .notification-content i {
                font-size: 1.5rem;
            }
            
            .notification-success .notification-content i {
                color: var(--success);
            }
            
            .notification-error .notification-content i {
                color: var(--danger);
            }
            
            .notification-info .notification-content i {
                color: var(--primary);
            }
            
            .notification-close {
                background: none;
                border: none;
                color: #aaa;
                font-size: 1.5rem;
                cursor: pointer;
                margin-left: 15px;
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: background 0.3s;
            }
            
            .notification-close:hover {
                background: rgba(255, 255, 255, 0.1);
                color: white;
            }
            
            @media (max-width: 768px) {
                .notification {
                    min-width: auto;
                    max-width: 90%;
                    left: 5%;
                    right: 5%;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Кнопка закрытия
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });
    
    // Автоматическое закрытие
    if (duration > 0) {
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }
        }, duration);
        
        // Добавляем анимацию закрытия
        if (!document.querySelector('#notification-close-animation')) {
            const closeStyle = document.createElement('style');
            closeStyle.id = 'notification-close-animation';
            closeStyle.textContent = `
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(closeStyle);
        }
    }
}

// Сохранение данных в localStorage
function saveToStorage() {
    try {
        localStorage.setItem('kredworld_cart', JSON.stringify(cart));
        localStorage.setItem('kredworld_purchase_history', JSON.stringify(purchaseHistory));
    } catch (e) {
        console.error('Ошибка при сохранении в localStorage:', e);
    }
}

// Загрузка данных из localStorage
function loadFromStorage() {
    try {
        const savedCart = localStorage.getItem('kredworld_cart');
        const savedHistory = localStorage.getItem('kredworld_purchase_history');
        
        if (savedCart) {
            cart = JSON.parse(savedCart);
        }
        
        if (savedHistory) {
            purchaseHistory = JSON.parse(savedHistory);
        }
    } catch (e) {
        console.error('Ошибка при загрузке из localStorage:', e);
    }
}

// Экспортируем функции для использования в консоли (для отладки)
window.donationSystem = {
    cart,
    purchaseHistory,
    donationPackages,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart: function() {
        cart = [];
        updateCartDisplay();
        saveToStorage();
    },
    clearHistory: function() {
        purchaseHistory = [];
        displayPurchaseHistory();
        saveToStorage();
    }
};
