// scripts.js
document.addEventListener('DOMContentLoaded', () => {
    // Cart state
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Smooth scrolling for nav links
    document.querySelectorAll('.nav-link').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#')) {
                document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });
            } else {
                window.location.href = targetId;
            }
        });
    });

    // Navbar shadow on scroll
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Scroll-triggered animations
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.animate__animated');
        elements.forEach(element => {
            const rect = element.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.8) {
                element.classList.add('animate__animated');
            }
        });
    };

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Initial check

    // Initialize carousels (for homepage)
    if (document.getElementById('testimonialCarousel')) {
        const testimonialCarousel = new bootstrap.Carousel(document.getElementById('testimonialCarousel'), {
            interval: 7000,
            wrap: true
        });
    }

    // Product filter (for products page)
    const productSearch = document.getElementById('productSearch');
    const categoryFilter = document.getElementById('categoryFilter');
    const priceFilter = document.getElementById('priceFilter');
    const productGrid = document.getElementById('productGrid');

    if (productSearch && productGrid) {
        const products = [
            { id: 1, title: 'Vitamin C 1000mg', price: 12.99, category: 'vitamins', image: 'product1.jpg' },
            { id: 2, title: 'Ibuprofen 200mg', price: 8.99, category: 'otc', image: 'product2.jpg' },
            { id: 3, title: 'Adhesive Bandages', price: 4.99, category: 'supplies', image: 'product3.jpg' },
            { id: 4, title: 'Hand Sanitizer 8oz', price: 6.99, category: 'hygiene', image: 'product4.jpg' }
        ];

        function renderProducts(filteredProducts) {
            productGrid.innerHTML = filteredProducts.map(product => `
                <div class="col-md-3 col-6 mb-4">
                    <div class="card product-card h-100">
                        <img src="${product.image}" class="card-img-top" alt="${product.title}">
                        <div class="card-body">
                            <h5 class="card-title">${product.title}</h5>
                            <p class="card-text">$${product.price.toFixed(2)}</p>
                            <p class="card-text"><small class="text-muted">${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</small></p>
                            <button class="btn btn-primary w-100" data-bs-toggle="modal" data-bs-target="#productModal" data-product-id="${product.id}">View Details</button>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        function filterProducts() {
            const searchTerm = productSearch.value.toLowerCase();
            const category = categoryFilter.value;
            const priceRange = priceFilter.value;

            let filteredProducts = products.filter(product => {
                const matchesSearch = product.title.toLowerCase().includes(searchTerm);
                const matchesCategory = !category || product.category === category;
                let matchesPrice = true;
                if (priceRange) {
                    const [min, max] = priceRange.split('-').map(Number);
                    matchesPrice = product.price >= min && (max ? product.price <= max : true);
                }
                return matchesSearch && matchesCategory && matchesPrice;
            });

            renderProducts(filteredProducts);
        }

        productSearch.addEventListener('input', filterProducts);
        categoryFilter.addEventListener('change', filterProducts);
        priceFilter.addEventListener('change', filterProducts);

        // Initial render
        renderProducts(products);

        // Modal content update
        productGrid.addEventListener('click', (e) => {
            const button = e.target.closest('button[data-product-id]');
            if (button) {
                const productId = button.getAttribute('data-product-id');
                const product = products.find(p => p.id == productId);
                if (product) {
                    document.getElementById('modalProductTitle').textContent = product.title;
                    document.getElementById('modalProductPrice').textContent = `$${product.price.toFixed(2)}`;
                    document.getElementById('modalProductCategory').textContent = `Category: ${product.category.charAt(0).toUpperCase() + product.category.slice(1)}`;
                    document.getElementById('modalProductDescription').textContent = `High-quality ${product.title} for your health needs.`;
                    document.getElementById('modalProductImage').src = product.image;
                    document.getElementById('modalProductImage').alt = product.title;
                    document.getElementById('addToCart').setAttribute('data-product-id', product.id);
                }
            }
        });
    }

    // Prescription Form and Dashboard (for prescriptions page)
    const refillForm = document.getElementById('refillForm');
    const userDashboard = document.getElementById('userDashboard');
    const prescriptionTable = document.getElementById('prescriptionTable');

    if (refillForm) {
        const isLoggedIn = true;
        if (isLoggedIn && userDashboard) {
            userDashboard.style.display = 'block';
            const prescriptions = [
                { rxNumber: 'RX123456', medication: 'Lisinopril 10mg', status: 'Ready', refillDate: '2025-09-01' },
                { rxNumber: 'RX789012', medication: 'Metformin 500mg', status: 'Pending', refillDate: '2025-08-25' }
            ];

            prescriptionTable.innerHTML = prescriptions.map(p => `
                <tr>
                    <td>${p.rxNumber}</td>
                    <td>${p.medication}</td>
                    <td>${p.status}</td>
                    <td>${p.refillDate}</td>
                    <td><button class="btn btn-primary btn-sm">Refill</button></td>
                </tr>
            `).join('');
        }

        refillForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const rxNumber = document.getElementById('rxNumber').value;
            const patientName = document.getElementById('patientName').value;
            const patientDOB = document.getElementById('patientDOB').value;
            const spinner = document.getElementById('refillSpinner');

            if (rxNumber && patientName && patientDOB) {
                spinner.classList.remove('d-none');
                setTimeout(() => {
                    spinner.classList.add('d-none');
                    const modal = new bootstrap.Modal(document.getElementById('refillModal'));
                    modal.show();
                    refillForm.reset();
                }, 1000);
            } else {
                alert('Please fill out all required fields.');
            }
        });
    }

    // Booking Form (for services page)
    const bookingForm = document.getElementById('bookingForm');
    const appointmentDate = document.getElementById('appointmentDate');

    if (bookingForm && appointmentDate) {
        const today = new Date().toISOString().split('T')[0];
        appointmentDate.setAttribute('min', today);

        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const serviceType = document.getElementById('serviceType').value;
            const appointmentDate = document.getElementById('appointmentDate').value;
            const appointmentTime = document.getElementById('appointmentTime').value;
            const patientName = document.getElementById('patientName').value;
            const spinner = document.getElementById('bookingSpinner');

            if (serviceType && appointmentDate && appointmentTime && patientName) {
                spinner.classList.remove('d-none');
                setTimeout(() => {
                    spinner.classList.add('d-none');
                    const modal = new bootstrap.Modal(document.getElementById('bookingModal'));
                    modal.show();
                    bookingForm.reset();
                }, 1000);
            } else {
                alert('Please fill out all required fields.');
            }
        });
    }

    // Blog Filter (for blog page)
    const blogSearch = document.getElementById('blogSearch');
    const blogCategoryFilter = document.getElementById('categoryFilter');
    const blogGrid = document.getElementById('blogGrid');

    if (blogSearch && blogGrid) {
        const posts = [
            {
                id: 1,
                title: 'Managing Seasonal Allergies',
                category: 'wellness',
                summary: 'Tips to stay symptom-free this season.',
                content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
                image: 'blog1.jpg'
            },
            {
                id: 2,
                title: 'Understanding Drug Interactions',
                category: 'medication',
                summary: 'What to know before mixing medications.',
                content: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
                image: 'blog2.jpg'
            },
            {
                id: 3,
                title: 'Boost Your Immunity',
                category: 'lifestyle',
                summary: 'Simple habits for a healthier you.',
                content: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.',
                image: 'blog3.jpg'
            }
        ];

        function renderPosts(filteredPosts) {
            blogGrid.innerHTML = filteredPosts.map(post => `
                <div class="col-md-4 col-12 mb-4">
                    <div class="card blog-card h-100">
                        <img src="${post.image}" class="card-img-top" alt="${post.title}">
                        <div class="card-body">
                            <h5 class="card-title">${post.title}</h5>
                            <p class="card-text">${post.summary}</p>
                            <p class="card-text"><small class="text-muted">Category: ${post.category.charAt(0).toUpperCase() + post.category.slice(1)}</small></p>
                            <button class="btn btn-outline-primary w-100" data-bs-toggle="modal" data-bs-target="#postModal" data-post-id="${post.id}">Read More</button>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        function filterPosts() {
            const searchTerm = blogSearch.value.toLowerCase();
            const category = blogCategoryFilter.value;

            let filteredPosts = posts.filter(post => {
                const matchesSearch = post.title.toLowerCase().includes(searchTerm) || post.summary.toLowerCase().includes(searchTerm);
                const matchesCategory = !category || post.category === category;
                return matchesSearch && matchesCategory;
            });

            renderPosts(filteredPosts);
        }

        blogSearch.addEventListener('input', filterPosts);
        blogCategoryFilter.addEventListener('change', filterPosts);

        // Initial render
        renderPosts(posts);

        // Modal content update
        blogGrid.addEventListener('click', (e) => {
            const button = e.target.closest('button[data-post-id]');
            if (button) {
                const postId = button.getAttribute('data-post-id');
                const post = posts.find(p => p.id == postId);
                if (post) {
                    document.getElementById('modalPostTitle').textContent = post.title;
                    document.getElementById('modalPostCategory').textContent = `Category: ${post.category.charAt(0).toUpperCase() + post.category.slice(1)}`;
                    document.getElementById('modalPostContent').innerHTML = `<p>${post.content}</p>`;
                    document.getElementById('modalPostImage').src = post.image;
                    document.getElementById('modalPostImage').alt = post.title;
                }
            }
        });
    }

    // Contact Form (for contact page)
    const contactForm = document.getElementById('contactForm');
    const liveChatButton = document.getElementById('liveChatButton');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const contactName = document.getElementById('contactName').value;
            const contactEmail = document.getElementById('contactEmail').value;
            const contactMessage = document.getElementById('contactMessage').value;
            const spinner = document.getElementById('contactSpinner');

            if (contactName && contactEmail && contactMessage) {
                spinner.classList.remove('d-none');
                setTimeout(() => {
                    spinner.classList.add('d-none');
                    const modal = new bootstrap.Modal(document.getElementById('contactModal'));
                    modal.show();
                    contactForm.reset();
                }, 1000);
            } else {
                alert('Please fill out all required fields.');
            }
        });
    }

    if (liveChatButton) {
        liveChatButton.addEventListener('click', () => {
            alert('Live chat feature coming soon! Please use the contact form for now.');
        });
    }

    // Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const loginEmail = document.getElementById('loginEmail').value;
            const loginPassword = document.getElementById('loginPassword').value;
            const spinner = document.getElementById('loginSpinner');

            if (loginEmail && loginPassword) {
                spinner.classList.remove('d-none');
                setTimeout(() => {
                    spinner.classList.add('d-none');
                    alert('Login successful! (Mock authentication)');
                    loginForm.reset();
                    const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
                    loginModal.hide();
                }, 1000);
            } else {
                alert('Please fill out all required fields.');
            }
        });
    }

    // Cart Functionality
    const addToCartButtons = document.querySelectorAll('#addToCart');
    const cartItemsContainer = document.getElementById('cartItems');
    const cartEmpty = document.getElementById('cartEmpty');
    const cartTotal = document.getElementById('cartTotal');
    const cartCount = document.getElementById('cartCount');

    function updateCartUI() {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '';
            cartEmpty.style.display = 'block';
            cartTotal.textContent = 'Total: $0.00';
            cartCount.textContent = '0';
        } else {
            cartEmpty.style.display = 'none';
            cartItemsContainer.innerHTML = cart.map(item => `
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <div>
                        <h6>${item.title}</h6>
                        <p class="mb-0">$${item.price.toFixed(2)} x ${item.quantity}</p>
                    </div>
                    <button class="btn btn-danger btn-sm remove-from-cart" data-product-id="${item.id}">Remove</button>
                </div>
            `).join('');
            const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
            cartTotal.textContent = `Total: $${total.toFixed(2)}`;
            cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    if (addToCartButtons) {
        addToCartButtons.forEach(button => {
            button.addEventListener('click', () => {
                const productId = parseInt(button.getAttribute('data-product-id'));
                const product = [
                    { id: 1, title: 'Vitamin C 1000mg', price: 12.99 },
                    { id: 2, title: 'Ibuprofen 200mg', price: 8.99 },
                    { id: 3, title: 'Adhesive Bandages', price: 4.99 },
                    { id: 4, title: 'Hand Sanitizer 8oz', price: 6.99 }
                ].find(p => p.id === productId);
                const quantityInput = document.getElementById('modalProductQuantity');
                const quantity = parseInt(quantityInput.value) || 1;

                if (product) {
                    const cartItem = cart.find(item => item.id === productId);
                    if (cartItem) {
                        cartItem.quantity += quantity;
                    } else {
                        cart.push({ ...product, quantity });
                    }
                    updateCartUI();
                    const productModal = bootstrap.Modal.getInstance(document.getElementById('productModal'));
                    productModal.hide();
                }
            });
        });
    }

    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-from-cart')) {
                const productId = parseInt(e.target.getAttribute('data-product-id'));
                cart = cart.filter(item => item.id !== productId);
                updateCartUI();
            }
        });
    }

    // Initial cart render
    updateCartUI();
});

window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});