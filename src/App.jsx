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
  // Main menu and navigation state
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchText, setSearchText] = useState('');
  const [vegetarianOnly, setVegetarianOnly] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Shopping cart and checkout state
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [notice, setNotice] = useState('');

  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    orderType: 'Pickup',
    address: '',
  });

  // Reservation and private event state
  const [bookingType, setBookingType] = useState('table');

  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '18:00',
    guests: '2',
    eventType: 'Birthday',
    requests: '',
  });

  const [bookings, setBookings] = useState([]);

  // Chatbot state
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');

  const [chatMessages, setChatMessages] = useState([
    {
      from: 'bot',
      text: 'Hi there! Welcome to Savor. Ask me about our menu, hours, delivery, or reservations.',
    },
  ]);

  // Filter the menu by category, search text, and vegetarian preference.
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

      return (
        matchesCategory &&
        matchesSearch &&
        matchesVegetarian
      );
    });
  }, [activeCategory, searchText, vegetarianOnly]);

  // Calculate cart item count and subtotal.
  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Add an item to the cart.
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

      return [
        ...currentCart,
        { ...menuItem, quantity: 1 },
      ];
    });

    setNotice(`${menuItem.name} added to your cart`);

    setTimeout(() => {
      setNotice('');
    }, 2500);
  }

  // Increase or decrease an item's quantity.
  function changeQuantity(id, amount) {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity + amount,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  // Scroll to the menu section.
  function goToMenu() {
    document.getElementById('menu')?.scrollIntoView({
      behavior: 'smooth',
    });

    setMobileMenuOpen(false);
  }

  // Open checkout if the cart contains items.
  function handleCheckout() {
    if (cart.length === 0) return;

    setCartOpen(false);
    setCheckoutOpen(true);
  }

  // Update customer checkout fields.
  function updateCustomer(event) {
    const { name, value } = event.target;

    setCustomer((currentCustomer) => ({
      ...currentCustomer,
      [name]: value,
    }));
  }

  // Simulate placing an order without a backend or payment service.
  function placeOrder(event) {
    event.preventDefault();

    if (cart.length === 0) return;

    const tax = cartTotal * 0.05;
    const deliveryFee =
      customer.orderType === 'Delivery' ? 4.99 : 0;

    setConfirmedOrder({
      number: `SV-${Date.now().toString().slice(-6)}`,
      customer: { ...customer },
      items: [...cart],
      subtotal: cartTotal,
      tax,
      deliveryFee,
      total: cartTotal + tax + deliveryFee,
    });

    setCart([]);
    setCheckoutOpen(false);
  }

  // Update reservation form fields.
  function updateBookingForm(event) {
    const { name, value } = event.target;

    setBookingForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }

  // Submit a table reservation or private event request.
  function submitBooking(event) {
    event.preventDefault();

    const newBooking = {
      ...bookingForm,
      id: `BK-${Date.now().toString().slice(-6)}`,
      type: bookingType,
    };

    setBookings((currentBookings) => [
      ...currentBookings,
      newBooking,
    ]);

    setNotice(
      bookingType === 'table'
        ? `Table reservation received for ${bookingForm.name}!`
        : `Event request received for ${bookingForm.name}!`
    );

    setBookingForm({
      name: '',
      email: '',
      phone: '',
      date: '',
      time: '18:00',
      guests: '2',
      eventType: 'Birthday',
      requests: '',
    });

    setTimeout(() => {
      setNotice('');
    }, 3500);
  }

  // Generate predefined chatbot replies.
  function getChatReply(message) {
    const question = message.toLowerCase();

    if (
      question.includes('hour') ||
      question.includes('open') ||
      question.includes('close')
    ) {
      return 'Our demo hours are 11:00 AM to 10:00 PM daily. Please check with the restaurant for actual opening hours.';
    }

    if (
      question.includes('menu') ||
      question.includes('food') ||
      question.includes('vegetarian') ||
      question.includes('dish')
    ) {
      return 'Our menu includes starters, main courses, desserts, and drinks. Browse the menu and try the category and vegetarian filters.';
    }

    if (
      question.includes('delivery') ||
      question.includes('pickup') ||
      question.includes('order')
    ) {
      return 'Add dishes to your cart and choose Pickup or Delivery at checkout. This is a student demo, so no real order or payment is sent.';
    }

    if (
      question.includes('reserve') ||
      question.includes('table') ||
      question.includes('booking') ||
      question.includes('event') ||
      question.includes('party')
    ) {
      return 'You can request a table reservation or a private event using the booking form on this page.';
    }

    if (
      question.includes('price') ||
      question.includes('cost')
    ) {
      return 'Each dish price is displayed on its menu card. Add items to your cart to see the subtotal and estimated total.';
    }

    if (
      question.includes('hello') ||
      question.includes('hi') ||
      question.includes('hey')
    ) {
      return 'Hello! How can I help you today? Ask me about the menu, hours, delivery, or reservations.';
    }

    return 'I can help with the menu, opening hours, delivery, orders, and reservations. Try asking about one of those topics!';
  }

  // Send a message to the chatbot.
  function sendChatMessage(event) {
    event.preventDefault();

    const message = chatInput.trim();

    if (!message) return;

    const reply = getChatReply(message);

    setChatMessages((currentMessages) => [
      ...currentMessages,
      { from: 'user', text: message },
      { from: 'bot', text: reply },
    ]);

    setChatInput('');
  }

  return (
    <div className="app">
      <div className="announcement">
        <span>✦</span> Good food, good mood. Your table is waiting.
        <span className="announcement-right">
          Made fresh, served with love.
        </span>
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

        <nav
          className={
            mobileMenuOpen
              ? 'nav-links nav-open'
              : 'nav-links'
          }
        >
          <a
            className="nav-active"
            href="#home"
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </a>

          <a
            href="#menu"
            onClick={() => setMobileMenuOpen(false)}
          >
            Our Menu
          </a>

          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
          >
            Our Story
          </a>

          <a
            href="#reservations"
            onClick={() => setMobileMenuOpen(false)}
          >
            Reservations
          </a>

          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
          >
            Contact
          </a>
        </nav>

        <div className="nav-actions">
          <button
            className="cart-button"
            onClick={() => setCartOpen(true)}
          >
            <span>♧</span> My Cart
            <span className="cart-count">{cartCount}</span>
          </button>
        </div>
      </header>

      <main>
        {/* Homepage hero section */}
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
              <button
                className="primary-button"
                onClick={goToMenu}
              >
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

          <div className="hero-decoration">
            SAVOUR THE MOMENT
          </div>
        </section>

        {/* Restaurant benefits */}
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

        {/* Menu section */}
        <section className="menu-section" id="menu">
          <div className="section-heading">
            <div>
              <div className="eyebrow">
                <span className="eyebrow-line" />
                GOOD THINGS ARE COOKING
              </div>

              <h2>
                Made to make you <span>happy.</span>
              </h2>

              <p>
                From the first bite to the last, find your new favourite.
              </p>
            </div>

            <span className="menu-mark">S.</span>
          </div>

          <div className="menu-toolbar">
            <div className="category-list">
              {categories.map((category) => (
                <button
                  key={category}
                  className={
                    activeCategory === category
                      ? 'category-button selected'
                      : 'category-button'
                  }
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
                onChange={(event) =>
                  setSearchText(event.target.value)
                }
              />
            </label>
          </div>

          <label className="vegetarian-filter">
            <input
              type="checkbox"
              checked={vegetarianOnly}
              onChange={(event) =>
                setVegetarianOnly(event.target.checked)
              }
            />
            Show vegetarian options only
          </label>

          <div className="menu-grid">
            {filteredItems.map((item) => (
              <article className="food-card" key={item.id}>
                <div className="food-image-wrap">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="food-image"
                  />

                  <span className="food-tag">{item.tag}</span>

                  {item.vegetarian && (
                    <span
                      className="veg-indicator"
                      title="Vegetarian"
                    >
                      V
                    </span>
                  )}
                </div>

                <div className="food-card-content">
                  <div className="food-card-topline">
                    <span className="food-category">
                      {item.category}
                    </span>

                    <span className="food-price">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>

                  <h3>{item.name}</h3>
                  <p>{item.description}</p>

                  <button
                    className="add-button"
                    onClick={() => addToCart(item)}
                  >
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
              <p>
                Try another search or choose a different category.
              </p>

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

        {/* About Savor */}
        <section className="about-section" id="about">
          <div className="about-image">
            <img
              src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1000&q=85"
              alt="Warm and welcoming restaurant interior"
            />

            <div className="about-stamp">
              GOOD FOOD
              <br />
              GOOD COMPANY
              <br />
              GOOD TIMES
            </div>
          </div>

          <div className="about-content">
            <div className="eyebrow">
              <span className="eyebrow-line" />
              A PLACE AT OUR TABLE
            </div>

            <h2>
              More than a meal.
              <br />
              It's a <span>feeling.</span>
            </h2>

            <p>
              At Savor, we believe the best moments happen around
              the table. We're here for your quick lunch, your
              family dinner, and all the little celebrations in
              between.
            </p>

            <p>
              Fresh flavours, welcoming vibes, and something
              delicious waiting just for you.
            </p>

            <button
              className="primary-button"
              onClick={goToMenu}
            >
              Find your favourite <span>↗</span>
            </button>
          </div>
        </section>

        {/* Table reservations and private event requests */}
        <section className="reservation-section" id="reservations">
          <div className="reservation-intro">
            <div className="eyebrow">
              <span className="eyebrow-line" />
              SAVE YOUR SEAT
            </div>

            <h2>
              Make room for <span>good moments.</span>
            </h2>

            <p>
              Book a table for your next meal or tell us about
              a special gathering. We'll show a confirmation
              for this demo.
            </p>

            <div className="reservation-note">
              <strong>{bookings.length}</strong>
              <span>
                booking request
                {bookings.length === 1 ? '' : 's'} submitted
                in this session
              </span>
            </div>
          </div>

          <div className="reservation-card">
            <div
              className="booking-tabs"
              role="tablist"
              aria-label="Booking type"
            >
              <button
                type="button"
                className={
                  bookingType === 'table'
                    ? 'booking-tab active'
                    : 'booking-tab'
                }
                onClick={() => setBookingType('table')}
              >
                Table reservation
              </button>

              <button
                type="button"
                className={
                  bookingType === 'event'
                    ? 'booking-tab active'
                    : 'booking-tab'
                }
                onClick={() => setBookingType('event')}
              >
                Private event
              </button>
            </div>

            <form
              className="booking-form"
              onSubmit={submitBooking}
            >
              <div className="booking-form-heading">
                <h3>
                  {bookingType === 'table'
                    ? 'Reserve a table'
                    : 'Plan your event'}
                </h3>

                <p>
                  {bookingType === 'table'
                    ? 'A few details and your request is ready.'
                    : 'Birthdays, family dinners, and special occasions.'}
                </p>
              </div>

              <div className="booking-fields">
                <label>
                  Full name
                  <input
                    name="name"
                    value={bookingForm.name}
                    onChange={updateBookingForm}
                    required
                    placeholder="Your name"
                  />
                </label>

                <label>
                  Email address
                  <input
                    name="email"
                    type="email"
                    value={bookingForm.email}
                    onChange={updateBookingForm}
                    required
                    placeholder="you@example.com"
                  />
                </label>

                <label>
                  Phone number
                  <input
                    name="phone"
                    type="tel"
                    value={bookingForm.phone}
                    onChange={updateBookingForm}
                    required
                    placeholder="Phone number"
                  />
                </label>

                <label>
                  Date
                  <input
                    name="date"
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={bookingForm.date}
                    onChange={updateBookingForm}
                    required
                  />
                </label>

                <label>
                  Preferred time
                  <select
                    name="time"
                    value={bookingForm.time}
                    onChange={updateBookingForm}
                  >
                    <option value="11:00">11:00 AM</option>
                    <option value="12:00">12:00 PM</option>
                    <option value="13:00">1:00 PM</option>
                    <option value="17:00">5:00 PM</option>
                    <option value="18:00">6:00 PM</option>
                    <option value="19:00">7:00 PM</option>
                    <option value="20:00">8:00 PM</option>
                    <option value="21:00">9:00 PM</option>
                  </select>
                </label>

                <label>
                  Number of guests
                  <select
                    name="guests"
                    value={bookingForm.guests}
                    onChange={updateBookingForm}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20].map(
                      (count) => (
                        <option key={count} value={count}>
                          {count} {count === 1 ? 'guest' : 'guests'}
                        </option>
                      )
                    )}
                  </select>
                </label>

                {bookingType === 'event' && (
                  <label>
                    Event type
                    <select
                      name="eventType"
                      value={bookingForm.eventType}
                      onChange={updateBookingForm}
                    >
                      <option>Birthday</option>
                      <option>Family gathering</option>
                      <option>Corporate event</option>
                      <option>Anniversary</option>
                      <option>Other celebration</option>
                    </select>
                  </label>
                )}

                <label className="booking-requests">
                  {bookingType === 'table'
                    ? 'Special requests (optional)'
                    : 'Event details / menu requests (optional)'}

                  <textarea
                    name="requests"
                    value={bookingForm.requests}
                    onChange={updateBookingForm}
                    rows="3"
                    placeholder="Let us know anything we should prepare..."
                  />
                </label>
              </div>

              <button
                className="primary-button booking-submit"
                type="submit"
              >
                {bookingType === 'table'
                  ? 'Request a reservation'
                  : 'Send event request'}
                <span>→</span>
              </button>

              <p className="demo-note">
                Student project demo: requests stay in this page
                and are not sent to a restaurant.
              </p>
            </form>
          </div>
        </section>
      </main>

      {/* Footer */}
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

        <small className="copyright">
          © 2026 Savor Restaurant · SODV2201 Student Project
        </small>
      </footer>

      {notice && (
        <div className="toast" role="status">
          {notice}
        </div>
      )}

      {/* Shopping cart panel */}
      {cartOpen && (
        <div
          className="cart-overlay"
          onClick={() => setCartOpen(false)}
        >
          <aside
            className="cart-panel"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="cart-header">
              <div>
                <span className="eyebrow">YOUR SELECTION</span>
                <h2>
                  Your cart <span>({cartCount})</span>
                </h2>
              </div>

              <button
                className="close-button"
                onClick={() => setCartOpen(false)}
                aria-label="Close cart"
              >
                ✕
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="cart-empty">
                <span>♧</span>
                <h3>Your cart is taking a break.</h3>
                <p>Add something delicious to get started.</p>

                <button
                  className="primary-button"
                  onClick={() => setCartOpen(false)}
                >
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
                          <button
                            onClick={() =>
                              changeQuantity(item.id, -1)
                            }
                            aria-label={`Remove one ${item.name}`}
                          >
                            −
                          </button>

                          <span>{item.quantity}</span>

                          <button
                            onClick={() =>
                              changeQuantity(item.id, 1)
                            }
                            aria-label={`Add one ${item.name}`}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <strong className="cart-item-total">
                        ${(item.price * item.quantity).toFixed(2)}
                      </strong>
                    </div>
                  ))}
                </div>

                <div className="cart-summary">
                  <div>
                    <span>Subtotal</span>
                    <strong>${cartTotal.toFixed(2)}</strong>
                  </div>

                  <small>
                    Taxes and delivery will be calculated at checkout.
                  </small>

                  <button
                    className="primary-button checkout-button"
                    onClick={handleCheckout}
                  >
                    Continue to checkout <span>→</span>
                  </button>

                  <p className="demo-note">
                    Student demo: no real payment is collected.
                  </p>
                </div>
              </>
            )}
          </aside>
        </div>
      )}

      {/* Checkout form */}
      {checkoutOpen && (
        <div
          className="cart-overlay checkout-overlay"
          onClick={() => setCheckoutOpen(false)}
        >
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

              <button
                className="close-button"
                onClick={() => setCheckoutOpen(false)}
                aria-label="Close checkout"
              >
                ✕
              </button>
            </div>

            <form
              className="checkout-form"
              onSubmit={placeOrder}
            >
              <label>
                Full name
                <input
                  name="name"
                  value={customer.name}
                  onChange={updateCustomer}
                  required
                />
              </label>

              <label>
                Email address
                <input
                  name="email"
                  type="email"
                  value={customer.email}
                  onChange={updateCustomer}
                  required
                />
              </label>

              <label>
                Phone number
                <input
                  name="phone"
                  type="tel"
                  value={customer.phone}
                  onChange={updateCustomer}
                  required
                />
              </label>

              <label>
                Order type
                <select
                  name="orderType"
                  value={customer.orderType}
                  onChange={updateCustomer}
                >
                  <option value="Pickup">Pickup</option>
                  <option value="Delivery">Delivery</option>
                </select>
              </label>

              {customer.orderType === 'Delivery' && (
                <label>
                  Delivery address
                  <textarea
                    name="address"
                    value={customer.address}
                    onChange={updateCustomer}
                    required
                    rows="3"
                  />
                </label>
              )}

              <div className="checkout-total">
                <div>
                  <span>Subtotal</span>
                  <strong>${cartTotal.toFixed(2)}</strong>
                </div>

                <div>
                  <span>Estimated tax (5%)</span>
                  <strong>${(cartTotal * 0.05).toFixed(2)}</strong>
                </div>

                <div>
                  <span>Delivery fee</span>
                  <strong>
                    {(customer.orderType === 'Delivery'
                      ? 4.99
                      : 0
                    ).toLocaleString('en-CA', {
                      style: 'currency',
                      currency: 'CAD',
                    })}
                  </strong>
                </div>

                <div className="checkout-grand-total">
                  <span>Total</span>
                  <strong>
                    {(
                      cartTotal +
                      cartTotal * 0.05 +
                      (customer.orderType === 'Delivery' ? 4.99 : 0)
                    ).toLocaleString('en-CA', {
                      style: 'currency',
                      currency: 'CAD',
                    })}
                  </strong>
                </div>
              </div>

              <button
                className="primary-button checkout-button"
                type="submit"
              >
                Place demo order <span>→</span>
              </button>

              <p className="demo-note">
                Student demo only. No payment details are collected.
              </p>
            </form>
          </section>
        </div>
      )}

      {/* Order confirmation */}
      {confirmedOrder && (
        <div
          className="cart-overlay"
          onClick={() => setConfirmedOrder(null)}
        >
          <section
            className="checkout-panel order-confirmation"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-confirmation-title"
          >
            <div className="success-mark">✓</div>
            <span className="eyebrow">ORDER RECEIVED</span>

            <h2 id="order-confirmation-title">
              Thank you, {confirmedOrder.customer.name}!
            </h2>

            <p>Your demo order has been created successfully.</p>

            <div className="order-number">
              <span>Order number</span>
              <strong>{confirmedOrder.number}</strong>
            </div>

            <div className="confirmed-order-items">
              {confirmedOrder.items.map((item) => (
                <div key={item.id}>
                  <span>
                    {item.quantity} × {item.name}
                  </span>
                  <strong>
                    ${(item.price * item.quantity).toFixed(2)}
                  </strong>
                </div>
              ))}
            </div>

            <div className="checkout-total">
              <div>
                <span>Subtotal</span>
                <strong>${confirmedOrder.subtotal.toFixed(2)}</strong>
              </div>

              <div>
                <span>Estimated tax</span>
                <strong>${confirmedOrder.tax.toFixed(2)}</strong>
              </div>

              <div>
                <span>Delivery fee</span>
                <strong>${confirmedOrder.deliveryFee.toFixed(2)}</strong>
              </div>

              <div className="checkout-grand-total">
                <span>Total</span>
                <strong>${confirmedOrder.total.toFixed(2)}</strong>
              </div>
            </div>

            <p className="demo-note">
              This order is only stored in the current page state,
              not sent to a restaurant server.
            </p>

            <button
              className="primary-button checkout-button"
              onClick={() => setConfirmedOrder(null)}
            >
              Back to Savor <span>→</span>
            </button>
          </section>
        </div>
      )}

      {/* Floating chatbot */}
      {chatOpen && (
        <section
          className="chat-panel"
          aria-label="Savor help chat"
        >
          <div className="chat-header">
            <div>
              <strong>Savor Assistant</strong>
              <span>Here to help</span>
            </div>

            <button
              type="button"
              onClick={() => setChatOpen(false)}
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          <div className="chat-messages" aria-live="polite">
            {chatMessages.map((message, index) => (
              <div
                key={`${index}-${message.from}`}
                className={`chat-message ${
                  message.from === 'user'
                    ? 'chat-user'
                    : 'chat-bot'
                }`}
              >
                {message.text}
              </div>
            ))}
          </div>

          <form
            className="chat-form"
            onSubmit={sendChatMessage}
          >
            <input
              value={chatInput}
              onChange={(event) =>
                setChatInput(event.target.value)
              }
              placeholder="Ask us something..."
              aria-label="Type your message"
            />

            <button type="submit" aria-label="Send message">
              ➤
            </button>
          </form>
        </section>
      )}

      <button
        className="chat-launcher"
        type="button"
        onClick={() => setChatOpen((open) => !open)}
        aria-label={
          chatOpen ? 'Close help chat' : 'Open help chat'
        }
      >
        {chatOpen ? '✕' : '✦'}
        {!chatOpen && <span>Need help?</span>}
      </button>
    </div>
  );
}

export default App;