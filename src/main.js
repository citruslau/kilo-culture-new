import '../tokens.css';
import './style.css';

const facebook = 'https://www.facebook.com/KiloCultureDavao';
const arrow = '<span aria-hidden="true">↗</span>';
const base = import.meta.env.BASE_URL;

const trainingOptions = [
  { title: 'Powerlifting', label: 'Squat. Bench. Deadlift.', description: 'Make time for the big three. A space for deliberate training, steady progress, and the people who understand why you keep showing up.', image: `${base}images/training.jpg`, alt: 'A Kilo Culture lifter in pink knee sleeves squatting with spotters' },
  { title: 'Strength foundations', label: 'Your first rep starts here.', description: 'New to the bar? This sample training option introduces the basics, building confidence with each session. Ask the team about available support.', image: `${base}images/community.jpg`, alt: 'The Kilo Culture community celebrating together' },
  { title: 'Meet preparation', label: 'From the gym to the platform.', description: 'A sample pathway for lifters with a meet in mind. Train with purpose, find your rhythm, and be part of a team that celebrates the effort.', image: `${base}images/team-results.jpg`, alt: 'Kilo Culture team results from the 2025 Mindanao Equipped Powerlifting Championships' },
];

document.querySelector('#app').innerHTML = `
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header">
    <a class="brand" href="#home" aria-label="Kilo Culture home">
      <img src="${base}images/logo.png" alt="" width="48" height="48" />
      <span>KILO CULTURE<small>POWERLIFTING · DAVAO</small></span>
    </a>
    <nav id="primary-nav" class="primary-nav" aria-label="Main navigation">
      <a href="#culture">The culture</a><a href="#training">Training</a><a href="#membership">Membership</a><a href="#visit">Visit us</a>
    </nav>
    <a href="#visit" class="header-cta">Come lift with us ${arrow}</a>
    <button class="menu-toggle" aria-expanded="false" aria-controls="primary-nav" aria-label="Open navigation"><span></span><span></span></button>
  </header>

  <main id="main">
    <section class="hero" id="home" aria-labelledby="hero-title">
      <div class="hero-copy">
        <p class="location-label"><span class="location-dot" aria-hidden="true"></span> BANGKAL, DAVAO CITY</p>
        <h1 id="hero-title">STRONGER.<br><span>TOGETHER.</span></h1>
        <p class="hero-lede">More than a place to lift.<br>A culture you become part of.</p>
        <p class="hero-description">A private powerlifting training facility in Davao. Built around the barbell, the work, and the people beside you.</p>
        <div class="hero-actions"><a class="button button-primary" href="#membership">Find your membership ${arrow}</a><a class="text-link" href="#culture">Meet the culture <span aria-hidden="true">↓</span></a></div>
        <div class="hero-footnote"><span>24/7 MEMBER ACCESS</span><span>YOUR TIME. YOUR TRAINING.</span></div>
      </div>
      <figure class="hero-photo"><img src="${base}images/powerlifting.jpg" alt="Kilo Culture lifter on the platform, surrounded by spotters" fetchpriority="high" width="2048" height="1365" /><figcaption><span>EVERY REP HAS A STORY.</span><span>Kilo Culture on the platform</span></figcaption></figure>
    </section>

    <div class="discipline-strip" aria-label="Our lifting culture"><span>SQUAT</span><i aria-hidden="true">/</i><span>BENCH</span><i aria-hidden="true">/</i><span>DEADLIFT</span><i aria-hidden="true">/</i><span>REPEAT</span><p>One bar. A shared pursuit.</p></div>

    <section class="culture section-space" id="culture" aria-labelledby="culture-title">
      <figure class="community-photo"><img src="${base}images/community.jpg" alt="Kilo Culture lifters celebrating with medals and trophies" loading="lazy" width="2048" height="1366" /><figcaption>THE PEOPLE MAKE THE PLACE.</figcaption></figure>
      <div class="culture-copy"><h2 id="culture-title">HEAVY LIFTS.<br>GOOD COMPANY.</h2><p class="section-lede">The weight is personal.<br>The journey doesn't have to be.</p><p>Some days, it's a new personal best. Other days, it's simply showing up. There's a place for both here.</p><p>Kilo Culture brings together people who care about getting stronger. From the training floor to the competition platform, this is a community built around a shared love of lifting.</p><a class="text-link" href="${facebook}" target="_blank" rel="noopener noreferrer">See life at Kilo Culture ${arrow}</a><div class="culture-signoff"><img src="${base}images/logo.png" alt="" width="56" height="56" /><span>Local roots.<br><strong>Shared strength.</strong></span></div></div>
    </section>

    <section class="training section-space" id="training" aria-labelledby="training-title">
      <div class="section-heading"><h2 id="training-title">MAKE THE<br>BAR YOUR OWN.</h2><div><p>Find your reason to show up.<br>Then keep building on it.</p><small>Training options below are sample content.</small></div></div>
      <div class="training-layout"><div class="training-options">${trainingOptions.map((option, index) => `<div class="training-option ${index === 0 ? 'selected' : ''}"><h3><button type="button" class="training-trigger" aria-expanded="${index === 0}" aria-controls="training-panel-${index}" data-training="${index}">${option.title}<span aria-hidden="true">${index === 0 ? '−' : '+'}</span></button></h3><div class="training-panel" id="training-panel-${index}" ${index === 0 ? '' : 'hidden'}><p class="training-label">${option.label}</p><p>${option.description}</p><a class="text-link" href="#visit">Ask about training ${arrow}</a></div></div>`).join('')}</div><figure class="training-photo"><img id="training-image" src="${trainingOptions[0].image}" alt="${trainingOptions[0].alt}" loading="lazy" width="2048" height="1365" /><figcaption id="training-caption">${trainingOptions[0].label}</figcaption></figure></div>
    </section>

    <section class="membership section-space" id="membership" aria-labelledby="membership-title">
      <div class="membership-intro"><h2 id="membership-title">MORE TIME<br>UNDER THE BAR.</h2><p>Make room for training in your week.<br>Start with the option that fits you.</p><p class="sample-note">Sample rates for this website preview.<br>Confirm current memberships with the team.</p></div>
      <div class="membership-options"><article class="membership-row"><div><span class="plan-label">START AT YOUR PACE</span><h3>Day pass</h3><p>One session. Get a feel for the culture.</p></div><div class="plan-action"><p class="price">₱200<small>/ visit · sample</small></p><button class="button button-outline" data-plan="Day pass">Explore day pass ${arrow}</button></div></article><article class="membership-row"><div><span class="plan-label">MAKE IT A ROUTINE</span><h3>Monthly membership</h3><p>Your next chapter, one training day at a time.</p></div><div class="plan-action"><p class="price">₱1,200<small>/ month · sample</small></p><button class="button button-primary" data-plan="Monthly membership">Explore membership ${arrow}</button></div></article><p class="membership-footnote">Find your routine. Ask the team about membership and visitor access.</p></div>
    </section>

    <section class="faq section-space" aria-labelledby="faq-title"><div><h2 id="faq-title">FIRST TIME?<br>YOU'RE WELCOME.</h2><p>A few things before your first session.</p></div><div class="faq-list"><details><summary>Do I need to be a powerlifter?<span aria-hidden="true">+</span></summary><p>You can be curious about lifting without competing. Message the team about your experience and goals to find out whether the facility is a good fit.</p></details><details><summary>Can I drop by and have a look?<span aria-hidden="true">+</span></summary><p>It's a private training facility, so get in touch before your visit. The team can confirm when someone will be available to show you around.</p></details><details><summary>When can members train?<span aria-hidden="true">+</span></summary><p>Kilo Culture's public page lists 24/7 member access. Ask the team about access arrangements and visitor availability before arriving.</p></details><details><summary>Are these the current rates?<span aria-hidden="true">+</span></summary><p>The displayed rates and training options are sample content for this local website prototype. Contact Kilo Culture to confirm current pricing and availability.</p></details></div></section>

    <section class="visit" id="visit" aria-labelledby="visit-title"><div class="visit-copy"><p class="location-label">SEE YOU IN DAVAO.</p><h2 id="visit-title">YOUR NEXT REP<br>STARTS HERE.</h2><p>100 Cordillera Street, Central Park Subdivision,<br>Brgy. Talomo, Davao City, Philippines</p><a class="button button-primary" href="${facebook}" target="_blank" rel="noopener noreferrer">Visit our Facebook page ${arrow}</a><div class="contact-links"><a href="tel:+639950962050">0995 096 2050 ${arrow}</a><a href="mailto:kiloculturedavao@gmail.com">Send us an email ${arrow}</a></div><a class="text-link map-link" href="https://www.google.com/maps/search/?api=1&query=Kilo+Culture+100+Cordillera+Street+Davao+City" target="_blank" rel="noopener noreferrer">Find Kilo Culture on Maps ${arrow}</a></div><div class="visit-mark" aria-hidden="true"><img src="${base}images/logo.png" alt="" width="200" height="200" /><span>THE BAR BRINGS<br>US TOGETHER.</span></div></section>
  </main>
  <footer class="site-footer"><a class="footer-brand" href="#home">KILO CULTURE</a><p>Powerlifting. People. Davao.</p><div><a href="${facebook}" target="_blank" rel="noopener noreferrer">Facebook ${arrow}</a><a href="#home">Back to top ↑</a></div><small>Local website preview · Sample memberships and training options</small></footer>
  <dialog class="membership-dialog" aria-labelledby="dialog-title"><button class="dialog-close" aria-label="Close membership preview">×</button><p class="plan-label">MEMBERSHIP PREVIEW</p><h2 id="dialog-title"></h2><p class="dialog-description"></p><div class="dialog-detail"><span>Sample rate</span><strong id="dialog-price"></strong></div><p>This is a local design preview. Contact the team to confirm current rates, access, and availability.</p><a class="button button-primary" href="#visit" id="dialog-visit">View contact details ${arrow}</a></dialog>
`;

const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#primary-nav');
const closeMenu = () => { menuToggle.setAttribute('aria-expanded', 'false'); menuToggle.setAttribute('aria-label', 'Open navigation'); nav.classList.remove('is-open'); };
menuToggle.addEventListener('click', () => {
  const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!expanded));
  menuToggle.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  nav.classList.toggle('is-open', !expanded);
});
nav.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });

document.querySelectorAll('.training-trigger').forEach(button => {
  button.addEventListener('click', () => {
    const index = Number(button.dataset.training);
    const expanded = button.getAttribute('aria-expanded') !== 'true';
    document.querySelectorAll('.training-trigger').forEach((trigger, triggerIndex) => {
      const selected = expanded && index === triggerIndex;
      trigger.setAttribute('aria-expanded', String(selected));
      trigger.querySelector('span').textContent = selected ? '−' : '+';
      trigger.closest('.training-option').classList.toggle('selected', selected);
      document.getElementById(`training-panel-${triggerIndex}`).hidden = !selected;
    });
    if (!expanded) return;
    const image = document.querySelector('#training-image');
    image.src = trainingOptions[index].image;
    image.alt = trainingOptions[index].alt;
    document.querySelector('#training-caption').textContent = trainingOptions[index].label;
  });
});

const dialog = document.querySelector('.membership-dialog');
document.querySelectorAll('[data-plan]').forEach(button => button.addEventListener('click', () => {
  const monthly = button.dataset.plan === 'Monthly membership';
  document.querySelector('#dialog-title').textContent = button.dataset.plan;
  document.querySelector('.dialog-description').textContent = monthly ? 'Make training part of your routine.' : 'Come get a feel for the culture.';
  document.querySelector('#dialog-price').textContent = monthly ? '₱1,200 / month' : '₱200 / visit';
  dialog.showModal();
}));
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
document.querySelector('#dialog-visit').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) { const bounds = dialog.getBoundingClientRect(); if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close(); } });
