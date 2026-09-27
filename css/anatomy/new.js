
        // Menu Data
      const menuItems = [
            {
                id: 1,
                name: "Kitfo",
                description: "Traditional minced raw beef marinated with mitmita and niter kibbeh, served with injera and ayib.it is a rich and comforting dish full of authentic Ethiopian flavor.traditional food",
                price: 500,
                image: "kitfo.jpg",
                rating: 4.8
            },
            {
                id: 2,
                name: "Doro Wat",
                description : "Doro Wot is a classic Ethiopian chicken stew slowly cooked with onions, berbere spice, and seasoned butter. Served with tender chicken and a boiled egg alongside fresh injera, it is a rich and comforting dish full of authentic Ethiopian flavor.",
                price: 1700,
                image: "doro.jpg",
                rating: 4.7
            },
            {
                id: 3,
                name: "Tibs",
                description: "Tibs is a delicious Ethiopian dish made with tender pieces of beef sautéed with onions, tomatoes, fresh peppers, and aromatic Ethiopian spices. Served hot with fresh injera, our Tibs offers a rich, flavorful taste of Ethiopian tradition.",
                price: 480,
                image: "tibs.jpg",
                rating: 4.6
            },
            {
                id: 4,
                name: "special",
                description: "Injera is a traditional Ethiopian flatbread made from teff flour, known for its unique spongy texture and slightly sour taste. It serves as the base for many Ethiopian dishes, allowing you to scoop up flavorful stews and vegetables in a communal dining experience.",
                price: 280,
                image: "special.jpg",
                rating: 4.5
            },
            {
                id: 5,
                name: "beyaynet",
                description: "Injera pieces stir-fried with berbere spice, onions, and tomatoes, often served for breakfast.",
                price: 160,
                image: "beyaynat.jpg",
                rating: 4.4
            },
            {
                id: 6,
                name: "beyaynet",
                description: "Beyaynetu is a colorful traditional Ethiopian platter featuring a delicious variety of flavorful dishes served together on fresh injera. It brings together spicy stews, seasoned vegetables, lentils, greens, and fresh Ethiopian sides, creating a perfect balance of different tastes and textures.",
                price: 150,
                image: "beyaynet.jpg",
                rating: 4.9
            },
        ];

        // Shopping Cart
        let cart = [];
        
        // DOM Elements
        const menuGrid = document.getElementById('menuGrid');
        const cartBtn = document.getElementById('cartBtn');
        const cartModal = document.getElementById('cartModal');
        const closeCart = document.getElementById('closeCart');
        const overlay = document.getElementById('overlay');
        const cartItems = document.getElementById('cartItems');
        const cartCount = document.getElementById('cartCount');
        const cartTotal = document.getElementById('cartTotal');
        const emptyCartMessage = document.getElementById('emptyCartMessage');
        const checkoutBtn = document.getElementById('checkoutBtn');
        const mobileToggle = document.getElementById('mobileToggle');
        const mainNav = document.getElementById('mainNav');

        // Generate menu items
        function renderMenuItems() {
            menuGrid.innerHTML = '';
            
            menuItems.forEach(item => {
                const foodCard = document.createElement('div');
                foodCard.className = 'food-card';
                
                const stars = '★'.repeat(Math.floor(item.rating)) + '☆'.repeat(5 - Math.floor(item.rating));
                
                foodCard.innerHTML = `
                    <div class="food-img">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="food-info">
                        <h3>${item.name}</h3>
                        <p class="food-description">${item.description}</p>
                        <div class="food-price">
                            <div class="price">${item.price} BR</div>
                            <div class="rating">${stars} ${item.rating}</div>
                        </div>
                        <button class="order-btn" data-id="${item.id}">Add to Order</button>
                    </div>
                `;
                
                menuGrid.appendChild(foodCard);
            });
            
            // Add event listeners to order buttons
            document.querySelectorAll('.order-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const itemId = parseInt(this.getAttribute('data-id'));
                    addToCart(itemId);
                });
            });
        }

        // Add item to cart
        function addToCart(itemId) {
            const item = menuItems.find(i => i.id === itemId);
            
            // Check if item is already in cart
            const existingItem = cart.find(i => i.id === itemId);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    ...item,
                    quantity: 1
                });
            }
            
            updateCart();
            showNotification(`${item.name} added to cart!`);
        }

        // Update cart UI
        function updateCart() {
            // Update cart count
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            cartCount.textContent = totalItems;
            
            // Update cart items
            cartItems.innerHTML = '';
            
            if (cart.length === 0) {
                emptyCartMessage.style.display = 'block';
                cartTotal.textContent = '0 BR';
                return;
            }
            
            emptyCartMessage.style.display = 'none';
            
            let totalPrice = 0;
            
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                totalPrice += itemTotal;
                
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                
                cartItem.innerHTML = `
                    <div class="cart-item-img">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <div class="cart-item-price">${item.price} BR × ${item.quantity} = ${itemTotal} BR</div>
                        <div class="cart-item-actions">
                            <button class="decrease-item" data-id="${item.id}">-</button>
                            <span>${item.quantity}</span>
                            <button class="increase-item" data-id="${item.id}">+</button>
                            <button class="remove-item" data-id="${item.id}"><i class="fas fa-trash"></i></button>
                        </div>
                    </div>
                `;
                
                cartItems.appendChild(cartItem);
            });
            
            // Update total
            cartTotal.textContent = `${totalPrice} BR`;
            
            // Add event listeners to cart item buttons
            document.querySelectorAll('.increase-item').forEach(button => {
                button.addEventListener('click', function() {
                    const itemId = parseInt(this.getAttribute('data-id'));
                    changeQuantity(itemId, 1);
                });
            });
            
            document.querySelectorAll('.decrease-item').forEach(button => {
                button.addEventListener('click', function() {
                    const itemId = parseInt(this.getAttribute('data-id'));
                    changeQuantity(itemId, -1);
                });
            });
            
            document.querySelectorAll('.remove-item').forEach(button => {
                button.addEventListener('click', function() {
                    const itemId = parseInt(this.getAttribute('data-id'));
                    removeFromCart(itemId);
                });
            });
        }

        // Change item quantity
        function changeQuantity(itemId, change) {
            const itemIndex = cart.findIndex(i => i.id === itemId);
            
            if (itemIndex !== -1) {
                cart[itemIndex].quantity += change;
                
                // Remove item if quantity is 0 or less
                if (cart[itemIndex].quantity <= 0) {
                    cart.splice(itemIndex, 1);
                }
                
                updateCart();
            }
        }

        // Remove item from cart
        function removeFromCart(itemId) {
            cart = cart.filter(item => item.id !== itemId);
            updateCart();
            showNotification('Item removed from cart');
        }

        // Show notification
        function showNotification(message) {
            // Create notification element
            const notification = document.createElement('div');
            notification.className = 'notification';
            notification.textContent = message;
            notification.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                background-color: var(--accent-color);
                color: white;
                padding: 15px 25px;
                border-radius: 8px;
                box-shadow: var(--shadow);
                z-index: 1001;
                animation: slideIn 0.3s ease, fadeOut 0.3s ease 2s forwards;
            `;
            
            // Add styles for animation
            const style = document.createElement('style');
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
            `;
            document.head.appendChild(style);
            
            document.body.appendChild(notification);
            
            // Remove notification after animation
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 2300);
        }

        // Toggle cart modal
        cartBtn.addEventListener('click', () => {
            cartModal.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        closeCart.addEventListener('click', () => {
            cartModal.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        });

        overlay.addEventListener('click', () => {
            cartModal.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = 'auto';
            mainNav.classList.remove('active');
        });

        // Checkout button
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                showNotification('Your cart is empty!');
                return;
            }
            
            showNotification('Proceeding to checkout...');
            // In a real application, you would redirect to a checkout page
            // or open a checkout modal
        });

        // Mobile menu toggle
        mobileToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            overlay.classList.toggle('active');
            document.body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : 'auto';
        });

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    // Close mobile menu if open
                    mainNav.classList.remove('active');
                    overlay.classList.remove('active');
                    document.body.style.overflow = 'auto';
                    
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Initialize the page

   
renderMenuItems();

updateCart();


