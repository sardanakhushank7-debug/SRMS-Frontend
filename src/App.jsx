
import { useMemo, useState } from 'react';
import './App.css';

const menuItems = [
  {
    id: 1,
    name: 'Creamy Chicken Alfredo',
    category: 'Main Course',
    price: 18.99,
    description: 'Creamy parmesan sauce, grilled chicken and fresh herbs.',
    image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=800&q=85',
    tag: 'Bestseller',
    vegetarian: false,
  },
  {
    id: 2,
    name: 'Margherita Pizza',
    category: 'Main Course',
    price: 16.99,
    description: 'Fresh mozzarella, basil and our classic tomato sauce.',
    image: 'https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=800&q=85',
    tag: 'Popular',
    vegetarian: true,
  },
  {
    id: 3,
    name: 'Garden Fresh Salad',
    category: 'Starters',
    price: 9.99,
    description: 'Crisp greens, cherry tomatoes and house-made dressing.',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=85',
    tag: 'Fresh',
    vegetarian: true,
  },
  {
    id: 4,
    name: 'Chocolate Lava Cake',
    category: 'Desserts',
    price: 8.49,
    description: 'Warm chocolate cake with a rich, gooey centre.',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=85',
    tag: 'Sweet favourite',
    vegetarian: true,
  },
  {
    id: 5,
    name: 'Crispy Chicken Burger',
    category: 'Main Course',
    price: 15.49,
    description: 'Golden crispy chicken, lettuce and creamy house sauce.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=85',
    tag: 'Chef’s pick',
    vegetarian: false,
  },
  {
    id: 6,
    name: 'Classic Bruschetta',
    category: 'Starters',
    price: 8.99,
    description: 'Toasted bread topped with tomatoes, basil and olive oil.',
    image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&w=800&q=85',
    tag: 'Light bite',
    vegetarian: true,
  },
  {
    id: 7,
    name: 'Berry Cheesecake',
    category: 'Desserts',
    price: 7.99,
    description: 'Smooth cheesecake finished with fresh berry sauce.',
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=85',
    tag: 'House favourite',
    vegetarian: true,
  },
  {
    id: 8,
    name: 'Fresh Lemonade',
    category: 'Drinks',
    price: 4.49,
    description: 'Freshly squeezed lemons, mint and a touch of sweetness.',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765edfd4?auto=format&fit=crop&w=800&q=85',
    tag: 'Refreshing',
    vegetarian: true,
  },
];

const categories = [
  'All',
  'Starters',
  'Main Course',
  'Desserts',
  'Drinks',
];

function App() {
  // Menu and navigation state keep the interface interactive without a backend.
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchText, setSearchText] = useState('');
  const [vegetarianOnly, setVegetarianOnly] = useState(false);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    orderType: 'Pickup',
    address: '',
  });

  // Filter the menu using the selected category, search text, and vegetarian option.
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory =
        activeCategory === 'All' ||
        item.category === activeCategory;

      const matchesSearch =
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.description.toLowerCase().includes(searchText.toLowerCase());

      const matchesVegetarian =
        !vegetarianOnly || item.vegetarian;

      return matchesCategory && matchesSearch && matchesVegetarian;
    });
  }, [activeCategory, searchText, vegetarianOnly]);

  // Calculate the cart badge count and subtotal from the current cart items.
  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Add a new item or increase the quantity if it is already in the cart.
  function addToCart(menuItem) {
    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (item) => item.id === menuItem.id
      );

      if (existingItem) {
        return currentCart.map((item) =>
          item.id === menuItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...currentCart, { ...menuItem, quantity: 1 }];
    });

    setNotice(`${menuItem.name} added to your cart`);
    setTimeout(() => setNotice(''), 2500);
  }

  // Update an item's quantity; remove it automatically when it reaches zero.
  function changeQuantity(id, amount) {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + amount }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function goToMenu() {
    document.getElementById('menu')?.scrollIntoView({
      behavior: 'smooth',
    });
    setMobileMenuOpen(false);
  }

  // Open the checkout form only when there is at least one item in the cart.
  function handleCheckout() {
    if (cart.length === 0) return;

    setCartOpen(false);
    setCheckoutOpen(true);
  }

  // Keep form inputs in one object so each field can update independently.
  function updateCustomer(event) {
    const { name, value } = event.target;
    setCustomer((currentCustomer) => ({
      ...currentCustomer,
      [name]: value,
    }));
  }

  // Simulate placing an order on the frontend; no payment or server request is made.
  function placeOrder(event) {
    event.preventDefault();

    if (cart.length === 0) return;

    const tax = cartTotal * 0.05;
    const deliveryFee = customer.orderType === 'Delivery' ? 4.99 : 0;

    setConfirmedOrder({
      number: `SV-${Date.now().toString().slice(-6)}`,
      customer: { ...customer },
      items: [...cart],
      total: cartTotal + tax + deliveryFee,
      subtotal: cartTotal,
      tax,
      deliveryFee,
    });

    setCart([]);
    setCheckoutOpen(false);
  }

  return (
    <div className="app">
      <div className="announcement">
        <span>✦</span> Good food, good mood. Your table is waiting.
        <span className="announcement-right">Made fresh, served with love.</span>
      </div>

      <header className="navbar">
        <a className="brand" href="#home" aria-label="Savor home">
          <span className="brand-icon">S.</span>
          <span>
            <strong>savor</strong>
            <small>GOOD FOOD. GREAT MOMENTS.</small>
          </span>
        </a>

        <button
          className="mobile-menu-button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>

        <nav className={mobileMenuOpen ? 'nav-links nav-open' : 'nav-links'}>
          <a className="nav-active" href="#home" onClick={() => setMobileMenuOpen(false)}>
            Home
          </a>
          <a href="#menu" onClick={() => setMobileMenuOpen(false)}>Our Menu</a>
          <a href="#about" onClick={() => setMobileMenuOpen(false)}>Our Story</a>
          <a href="#contact" onClick={() => setMobileMenuOpen(false)}>Contact</a>
        </nav>

        <div className="nav-actions">
          <button className="cart-button" onClick={() => setCartOpen(true)}>
            <span>♧</span> My Cart
            <span className="cart-count">{cartCount}</span>
          </button>
        </div>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-content">
            <div className="eyebrow">
              <span className="eyebrow-line" />
              YOUR NEW FAVOURITE SPOT
            </div>

            <h1>
              A little taste
              <br />
              of <span>happiness.</span>
            </h1>

            <p>
              Thoughtfully prepared dishes, fresh ingredients,
              and flavours that bring everyone to the table.
            </p>

            <div className="hero-actions">
              <button className="primary-button" onClick={goToMenu}>
                Explore our menu <span>↗</span>
              </button>
              <a className="text-link" href="#about">
                Get to know us <span>→</span>
              </a>
            </div>

            <div className="hero-social-proof">
              <div className="avatar-stack">
                <span>J</span>
                <span>A</span>
                <span>M</span>
                <span>K</span>
              </div>
              <div>
                <div className="stars">★★★★★</div>
                <small>Loved by food lovers everywhere</small>
              </div>
            </div>
          </div>

          <div className="hero-image-wrap">
            <img
              className="hero-image"
              src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=90"
              alt="Beautifully presented food on a restaurant table"
            />
            <div className="image-note">
              <span className="note-icon">✳</span>
              <div>
                <strong>Made with love</strong>
                <small>Freshness in every bite</small>
              </div>
            </div>
            <div className="hero-image-caption">
              <span>01 / FRESHLY PREPARED</span>
              <span>✳</span>
            </div>
          </div>

          <div className="hero-decoration">SAVOUR THE MOMENT</div>
        </section>

        <section className="benefits">
          <div className="benefit-item">
            <span className="benefit-icon">✳</span>
            <div>
              <strong>Fresh ingredients</strong>
              <small>Quality in every bite</small>
            </div>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon">♡</span>
            <div>
              <strong>Made with love</strong>
              <small>Prepared just for you</small>
            </div>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon">♧</span>
            <div>
              <strong>Something for everyone</strong>
              <small>Options for every craving</small>
            </div>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon">⌁</span>
            <div>
              <strong>Easy ordering</strong>
              <small>Your favourites, your way</small>
            </div>
          </div>
        </section>

        <section className="menu-section" id="menu">
          <div className="section-heading">
            <div>
              <div className="eyebrow">
                <span className="eyebrow-line" />
                GOOD THINGS ARE COOKING
              </div>
              <h2>Made to make you <span>happy.</span></h2>
              <p>From the first bite to the last, find your new favourite.</p>
            </div>
            <span className="menu-mark">S.</span>
          </div>

          <div className="menu-toolbar">
            <div className="category-list">
              {categories.map((category) => (
                <button
                  key={category}
                  className={activeCategory === category ? 'category-button selected' : 'category-button'}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>

            <label className="search-box">
              <span>⌕</span>
              <input
                type="search"
                placeholder="Find something delicious..."
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
              />
            </label>
          </div>

          <label className="vegetarian-filter">
            <input
              type="checkbox"
              checked={vegetarianOnly}
              onChange={(event) => setVegetarianOnly(event.target.checked)}
            />
            Show vegetarian options only
          </label>

          <div className="menu-grid">
            {filteredItems.map((item) => (
              <article className="food-card" key={item.id}>
                <div className="food-image-wrap">
                  <img src={item.image} alt={item.name} className="food-image" />
                  <span className="food-tag">{item.tag}</span>
                  {item.vegetarian && (
                    <span className="veg-indicator" title="Vegetarian">V</span>
                  )}
                </div>
                <div className="food-card-content">
                  <div className="food-card-topline">
                    <span className="food-category">{item.category}</span>
                    <span className="food-price">${item.price.toFixed(2)}</span>
                  </div>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <button className="add-button" onClick={() => addToCart(item)}>
                    <span>+</span> Add to cart
                  </button>
                </div>
              </article>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="empty-results">
              <span>⌕</span>
              <h3>No dishes found</h3>
              <p>Try another search or choose a different category.</p>
              <button
                className="primary-button"
                onClick={() => {
                  setSearchText('');
                  setActiveCategory('All');
                  setVegetarianOnly(false);
                }}
              >
                Clear filters
              </button>
            </div>
          )}

          <div className="menu-bottom">
            <p>Good food is always a good idea.</p>
            <span>✳ MADE FRESH AT SAVOR</span>
          </div>
        </section>

        <section className="about-section" id="about">
          <div className="about-image">
            <img
              src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1000&q=85"
              alt="Warm and welcoming restaurant interior"
            />
            <div className="about-stamp">GOOD FOOD<br />GOOD COMPANY<br />GOOD TIMES</div>
          </div>
          <div className="about-content">
            <div className="eyebrow">
              <span className="eyebrow-line" />
              A PLACE AT OUR TABLE
            </div>
            <h2>More than a meal.<br />It's a <span>feeling.</span></h2>
            <p>
              At Savor, we believe the best moments happen around the table.
              We're here for your quick lunch, your family dinner, and all
              the little celebrations in between.
            </p>
            <p>
              Fresh flavours, welcoming vibes, and something delicious
              waiting just for you.
            </p>
            <button className="primary-button" onClick={goToMenu}>
              Find your favourite <span>↗</span>
            </button>
          </div>
        </section>
      </main>

      <footer className="footer" id="contact">
        <a className="brand footer-brand" href="#home">
          <span className="brand-icon">S.</span>
          <span>
            <strong>savor</strong>
            <small>GOOD FOOD. GREAT MOMENTS.</small>
          </span>
        </a>
        <p>Made with love, served with a smile.</p>
        <div className="footer-links">
          <a href="#menu">Menu</a>
          <a href="#about">Our story</a>
          <a href="mailto:hello@savor.example">Contact</a>
        </div>
        <small className="copyright">© 2026 Savor Restaurant · SODV2201 Student Project</small>
      </footer>

      {notice && <div className="toast" role="status">{notice}</div>}

      {cartOpen && (
        <div className="cart-overlay" onClick={() => setCartOpen(false)}>
          <aside className="cart-panel" onClick={(event) => event.stopPropagation()}>
            <div className="cart-header">
              <div>
                <span className="eyebrow">YOUR SELECTION</span>
                <h2>Your cart <span>({cartCount})</span></h2>
              </div>
              <button className="close-button" onClick={() => setCartOpen(false)} aria-label="Close cart">
                ✕
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="cart-empty">
                <span>♧</span>
                <h3>Your cart is taking a break.</h3>
                <p>Add something delicious to get started.</p>
                <button className="primary-button" onClick={() => setCartOpen(false)}>
                  Explore the menu
                </button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map((item) => (
                    <div className="cart-item" key={item.id}>
                      <img src={item.image} alt="" />
                      <div className="cart-item-details">
                        <strong>{item.name}</strong>
                        <span>${item.price.toFixed(2)} each</span>
                        <div className="quantity-controls">
                          <button onClick={() => changeQuantity(item.id, -1)} aria-label={`Remove one ${item.name}`}>−</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => changeQuantity(item.id, 1)} aria-label={`Add one ${item.name}`}>+</button>
                        </div>
                      </div>
                      <strong className="cart-item-total">
                        ${(item.price * item.quantity).toFixed(2)}
                      </strong>
                    </div>
                  ))}
                </div>
                <div className="cart-summary">
                  <div><span>Subtotal</span><strong>${cartTotal.toFixed(2)}</strong></div>
                  <small>Taxes and delivery will be calculated at checkout.</small>
                  <button className="primary-button checkout-button" onClick={handleCheckout}>
                    Continue to checkout <span>→</span>
                  </button>
                  <p className="demo-note">Student demo: no real payment is collected.</p>
                </div>
              </>
            )}
          </aside>
        </div>
      )}

      {checkoutOpen && (
        <div className="cart-overlay checkout-overlay" onClick={() => setCheckoutOpen(false)}>
          <section
            className="checkout-panel"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="checkout-title"
          >
            <div className="cart-header">
              <div>
                <span className="eyebrow">ONE LAST STEP</span>
                <h2 id="checkout-title">Checkout</h2>
              </div>
              <button className="close-button" onClick={() => setCheckoutOpen(false)} aria-label="Close checkout">✕</button>
            </div>

            <form className="checkout-form" onSubmit={placeOrder}>
              <label>
                Full name
                <input name="name" value={customer.name} onChange={updateCustomer} required />
              </label>
              <label>
                Email address
                <input name="email" type="email" value={customer.email} onChange={updateCustomer} required />
              </label>
              <label>
                Phone number
                <input name="phone" type="tel" value={customer.phone} onChange={updateCustomer} required />
              </label>
              <label>
                Order type
                <select name="orderType" value={customer.orderType} onChange={updateCustomer}>
                  <option value="Pickup">Pickup</option>
                  <option value="Delivery">Delivery</option>
                </select>
              </label>
              {customer.orderType === 'Delivery' && (
                <label>
                  Delivery address
                  <textarea name="address" value={customer.address} onChange={updateCustomer} required rows="3" />
                </label>
              )}

              <div className="checkout-total">
                <div><span>Subtotal</span><strong>${cartTotal.toFixed(2)}</strong></div>
                <div><span>Estimated tax (5%)</span><strong>${(cartTotal * 0.05).toFixed(2)}</strong></div>
                <div><span>Delivery fee</span><strong>${(customer.orderType === 'Delivery' ? 4.99 : 0).toFixed(2)}</strong></div>
                <div className="checkout-grand-total">
                  <span>Total</span>
                  <strong>${(cartTotal + cartTotal * 0.05 + (customer.orderType === 'Delivery' ? 4.99 : 0)).toFixed(2)}</strong>
                </div>
              </div>
              <button className="primary-button checkout-button" type="submit">
                Place demo order <span>→</span>
              </button>
              <p className="demo-note">Student demo only. No payment details are collected.</p>
            </form>
          </section>
        </div>
      )}

      {confirmedOrder && (
        <div className="cart-overlay" onClick={() => setConfirmedOrder(null)}>
          <section
            className="checkout-panel order-confirmation"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-confirmation-title"
          >
            <div className="success-mark">✓</div>
            <span className="eyebrow">ORDER RECEIVED</span>
            <h2 id="order-confirmation-title">Thank you, {confirmedOrder.customer.name}!</h2>
            <p>Your demo order has been created successfully.</p>
            <div className="order-number">
              <span>Order number</span>
              <strong>{confirmedOrder.number}</strong>
            </div>
            <div className="confirmed-order-items">
              {confirmedOrder.items.map((item) => (
                <div key={item.id}>
                  <span>{item.quantity} × {item.name}</span>
                  <strong>${(item.price * item.quantity).toFixed(2)}</strong>
                </div>
              ))}
            </div>
            <div className="checkout-total">
              <div><span>Subtotal</span><strong>${confirmedOrder.subtotal.toFixed(2)}</strong></div>
              <div><span>Estimated tax</span><strong>${confirmedOrder.tax.toFixed(2)}</strong></div>
              <div><span>Delivery fee</span><strong>${confirmedOrder.deliveryFee.toFixed(2)}</strong></div>
              <div className="checkout-grand-total"><span>Total</span><strong>${confirmedOrder.total.toFixed(2)}</strong></div>
            </div>
            <p className="demo-note">This order is only stored in the current page state, not sent to a restaurant server.</p>
            <button className="primary-button checkout-button" onClick={() => setConfirmedOrder(null)}>
              Back to Savor <span>→</span>
            </button>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
