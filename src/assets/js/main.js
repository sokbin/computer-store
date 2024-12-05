/* script.js */

/**
 * jQuery code for smooth scrolling, shopping cart, and form submission.
 * 
 * @returns {void}
 */
$(document).ready(function () {
    // Smooth scrolling for links
    $('a[href^="#"]').on('click', function (event) {
        const targetId = $(this).attr('href');
        if (targetId && targetId !== '#') {
            const target = $(targetId);
            if (target.length) {
                event.preventDefault();
                $('html, body').stop().animate({
                    scrollTop: target.offset().top
                }, 1000);
            }
        }
    });

    // Shopping cart script
    $('.btn-success').click(function () {
        alert("Item added to cart successfully!");
    });

    // Form submission alert
    $('form').submit(function (event) {
        event.preventDefault();
        alert("Message sent successfully!");
        // Add your form submission logic here
    });

    // Update cart count if the element exists
    if ($('#cart-count').length) {
        updateCartCount();
    } else {
        console.error('Cart count element not found');
    }

    // Ensure navbar toggler functionality
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');

    navbarToggler.addEventListener('click', function () {
        navbarCollapse.classList.toggle('show');
    });
});

/**
 * Script for pagination navigation.
 * 
 * @param {number} productsPerPage Number of products per page
 * @param {jQuery} productList jQuery object containing the product list
 * @param {jQuery} pagination jQuery object containing the pagination element
 * @param {number} currentPage Current page number
 * @param {jQuery} products jQuery object containing the products
 * 
 * @returns {void}
 */
$(document).ready(function () {
    const productsPerPage = 9;
    const productList = $('#product-list');
    if (!productList.length) {
        console.error('Product list element not found');
        return;
    }
    const products = productList.find('.col-md-4');
    const pagination = $('#pagination');
    let currentPage = 1;

    // Function to show products for the current page
    function showPage(page) {
        const start = (page - 1) * productsPerPage;
        const end = start + productsPerPage;

        products.each(function (index) {
            if (index >= start && index < end) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    }

    // Function to setup pagination controls
    function setupPagination() {
        const pageCount = Math.ceil(products.length / productsPerPage);
        pagination.html('');

        // Previous button
        const prevLi = $('<li class="page-item"><a class="page-link" href="javascript:void(0)" aria-label="Previous">Previous</a></li>');
        prevLi.on('click', function (e) {
            e.preventDefault();
            if (currentPage > 1) {
                currentPage--;
                showPage(currentPage);
                updatePagination();
            }
        });
        pagination.append(prevLi);

        // Page number buttons
        for (let i = 1; i <= pageCount; i++) {
            const li = $(`<li class="page-item"><a class="page-link" href="javascript:void(0)">${i}</a></li>`);
            li.on('click', function (e) {
                e.preventDefault();
                currentPage = i;
                showPage(currentPage);
                updatePagination();
            });
            pagination.append(li);
        }

        // Next button
        const nextLi = $('<li class="page-item"><a class="page-link" href="javascript:void(0)" aria-label="Next">Next</a></li>');
        nextLi.on('click', function (e) {
            e.preventDefault();
            if (currentPage < pageCount) {
                currentPage++;
                showPage(currentPage);
                updatePagination();
            }
        });
        pagination.append(nextLi);

        updatePagination();
    }

    // Function to update pagination controls
    function updatePagination() {
        const pageItems = pagination.find('.page-item');
        pageItems.removeClass('active');
        pageItems.eq(currentPage).addClass('active');

        // Disable previous button if on the first page
        pageItems.first().toggleClass('disabled', currentPage === 1);

        // Disable next button if on the last page
        pageItems.last().toggleClass('disabled', currentPage === pageItems.length - 2);
    }

    // Initialize pagination if there are more products than the products per page
    if (products.length > productsPerPage) {
        showPage(1);
        setupPagination();
    }

    // Update cart count
    updateCartCount();

    // Remove item from cart
    $('#cart-items').on('click', '.remove-item', function () {
        const productId = $(this).data('id');
        removeFromCart(productId); // Use the removeFromCart function
    });
});

/**
 * Update the cart count displayed on the page.
 * 
 * @returns {void}
 */
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.reduce((total, product) => total + product.quantity, 0);
    const cartCountElement = $('#cart-count');
    if (cartCountElement.length) {
        cartCountElement.text(cartCount);
    } else {
        console.error('Cart count element not found');
    }
}

/**
 * Add a product to the cart.
 * 
 * @param {number} productId The ID of the product to add
 * @returns {void}
 */
function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const product = products.find(p => p.id == productId);
    const existingProduct = cart.find(p => p.id == productId);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        product.quantity = 1;
        cart.push(product);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${product.name} has been added to your cart.`);
    updateCartCount();
}

/**
 * Remove a product from the cart.
 * 
 * @param {number} productId The ID of the product to remove
 * @returns {void}
 */
function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(p => p.id != productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    loadCart(); // Ensure the cart is reloaded after removing an item
}

/**
 * Format the price of a product.
 * 
 * @param {Object} product The product object
 * @returns {string} The formatted price
 */
function formatPrice(product) {
    return `$${parseFloat(product.price.replace('$', '')).toFixed(2)}`;
}