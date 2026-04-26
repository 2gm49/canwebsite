// Shared nav + footer injection for CAN static site

const NAV_HTML = `
<nav class="nav" id="main-nav">
  <a href="/" class="nav-logo">
    <div class="nav-logo-badge">CAN</div>
    <div>
      <span class="nav-logo-name">Croydon Alliance Network</span>
      <span class="nav-logo-sub">ER:LC Alliance Network</span>
    </div>
  </a>
  <ul class="nav-links" id="nav-links">
    <li><a href="/">Home</a></li>
    <li><a href="/about/">About</a></li>
    <li><a href="/team/">Team</a></li>
    <li><a href="/servers/">Servers</a></li>
    <li><a href="/rules/">Rules</a></li>
    <li class="nav-cta"><a href="/join/">Join Us</a></li>
  </ul>
  <button class="nav-hamburger" id="hamburger" aria-label="Toggle menu">
    <span></span><span></span><span></span>
  </button>
</nav>
<div class="nav-mobile" id="nav-mobile">
  <a href="/">Home</a>
  <a href="/about/">About</a>
  <a href="/team/">Team</a>
  <a href="/servers/">Servers</a>
  <a href="/rules/">Rules</a>
  <a href="/join/" class="mobile-cta">Join Us</a>
</div>
`;

const FOOTER_HTML = `
<footer class="footer">
  <div class="footer-inner">
    <div class="footer-top">
      <div>
        <div class="footer-brand-name">Croydon <em>Alliance</em> Network</div>
        <p class="footer-brand-desc">CAN is an ER:LC alliance network dedicated to bringing quality roleplay servers together under one professional network.</p>
      </div>
      <div class="footer-col">
        <h4>Navigation</h4>
        <ul class="footer-links">
          <li><a href="/">Home</a></li>
          <li><a href="/about/">About</a></li>
          <li><a href="/team/">The Team</a></li>
          <li><a href="/servers/">Servers</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Network</h4>
        <ul class="footer-links">
          <li><a href="/rules/">Rules</a></li>
          <li><a href="/join/">Join Us</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>&copy; ${new Date().getFullYear()} Croydon Alliance Network. All rights reserved.</span>
      <span class="footer-badge">ER:LC Network</span>
    </div>
  </div>
</footer>
`;

// Inject nav at top of body
document.body.insertAdjacentHTML('afterbegin', NAV_HTML);

// Inject footer at end of body
document.body.insertAdjacentHTML('beforeend', FOOTER_HTML);

// Active link highlighting
const path = window.location.pathname;
document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === '/' ? path === '/' : path.startsWith(href)) {
    link.classList.add('active');
  }
});

// Mobile menu toggle
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('nav-mobile').classList.toggle('open');
});

document.querySelectorAll('.nav-mobile a').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('nav-mobile').classList.remove('open');
  });
});

// Join form handler (only on /join/)
const form = document.getElementById('can-form');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = form.querySelector('.form-submit');
    const msg = document.getElementById('form-msg');
    const fd = new FormData(form);
    const data = Object.fromEntries(fd.entries());

    btn.disabled = true;
    btn.textContent = 'Submitting…';
    msg.className = 'form-msg';

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        msg.textContent = '✓ Application submitted! We\'ll be in touch via Discord.';
        msg.className = 'form-msg success show';
        form.reset();
      } else {
        throw new Error(json.error || 'Submission failed');
      }
    } catch (err) {
      msg.textContent = `Something went wrong: ${err.message}. Please try again.`;
      msg.className = 'form-msg error show';
    } finally {
      btn.disabled = false;
      btn.textContent = 'Submit Application';
    }
  });
}
