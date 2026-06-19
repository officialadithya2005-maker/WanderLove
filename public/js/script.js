// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

// Add star heart pop animation and a lightweight chatbot widget
document.addEventListener('DOMContentLoaded', () => {
  // Inject styles for heart pop and chat widget
  const style = document.createElement('style');
  style.innerHTML = `
  @keyframes popHeart { 0% { transform: translateY(0) scale(0.6); opacity: 1; } 60% { transform: translateY(-24px) scale(1.2); opacity: 1; } 100% { transform: translateY(-60px) scale(1.6); opacity: 0; } }
  .heart-pop { position: absolute; font-size: 22px; color: #ff4d6d; pointer-events: none; animation: popHeart 900ms cubic-bezier(.2,.9,.2,1) forwards; z-index: 9999; }
  .chat-toggle { position: fixed; right: 18px; bottom: 18px; background: #0d6efd; color: white; border-radius: 999px; width:56px; height:56px; display:flex; align-items:center; justify-content:center; box-shadow: 0 6px 18px rgba(13,110,253,0.25); cursor:pointer; z-index:10000; }
  .chat-window { position: fixed; right: 18px; bottom: 86px; width: 320px; max-height: 480px; background: white; border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.12); overflow: hidden; display: flex; flex-direction: column; z-index:10000; }
  .chat-messages { padding: 12px; overflow-y: auto; flex: 1; }
  .chat-input { display:flex; gap:8px; padding:8px; border-top:1px solid #eee; }
  .chat-msg { margin:6px 0; padding:8px 10px; border-radius:10px; max-width:80%; }
  .chat-msg.user { background:#0d6efd; color:white; margin-left:auto; }
  .chat-msg.bot { background:#f1f3f5; color:#111; margin-right:auto; }
  `;
  document.head.appendChild(style);

  // Heart pop on star radio change
  document.querySelectorAll('.starability-heartbeat input[type="radio"]').forEach(r => {
    r.addEventListener('change', (e) => {
      if (!e.target.checked) return;
      const id = e.target.id;
      const label = document.querySelector(`label[for="${id}"]`);
      if (!label) return;
      const rect = label.getBoundingClientRect();
      const heart = document.createElement('span');
      heart.className = 'heart-pop';
      heart.innerHTML = '❤';
      document.body.appendChild(heart);
      // position roughly above the label
      heart.style.left = `${rect.left + rect.width/2 - 12 + window.scrollX}px`;
      heart.style.top = `${rect.top - 10 + window.scrollY}px`;
      heart.addEventListener('animationend', () => heart.remove());
    });
  });

  // Simple chatbot UI
  if (!document.querySelector('#chat-toggle')) {
    const toggle = document.createElement('div');
    toggle.id = 'chat-toggle';
    toggle.className = 'chat-toggle';
    toggle.innerHTML = '<i class="fa-solid fa-comment-dots"></i>';
    document.body.appendChild(toggle);

    const win = document.createElement('div');
    win.id = 'chat-window';
    win.className = 'chat-window';
    win.style.display = 'none';
    win.innerHTML = `
      <div style="padding:10px; border-bottom:1px solid #eee; font-weight:600;">Wanderlove Assistant</div>
      <div class="chat-messages" id="chat-messages"></div>
      <div class="chat-input">
        <input id="chat-input" placeholder="How can I help? e.g., 'search Mumbai'" style="flex:1; padding:8px; border-radius:8px; border:1px solid #ddd;" />
        <button id="chat-send" class="btn btn-sm btn-primary">Send</button>
      </div>
    `;
    document.body.appendChild(win);

    const messages = win.querySelector('#chat-messages');
    const input = win.querySelector('#chat-input');
    const send = win.querySelector('#chat-send');

    function botReply(text) {
      const m = document.createElement('div');
      m.className = 'chat-msg bot';
      m.textContent = text;
      messages.appendChild(m);
      messages.scrollTop = messages.scrollHeight;
    }

    function userMsg(text) {
      const m = document.createElement('div');
      m.className = 'chat-msg user';
      m.textContent = text;
      messages.appendChild(m);
      messages.scrollTop = messages.scrollHeight;
    }

    // Basic keyword handling
    function handleQuery(q) {
      const normalized = q.toLowerCase();
      if (normalized.includes('search') || normalized.includes('find') || normalized.match(/\b(mumbai|delhi|bangalore|chennai|kolkata|goa)\b/)) {
        botReply("I can search locations — please use the search box on the top and type a city or area, or tell me which city you'd like to search.");
        return;
      }
      if (normalized.includes('review') || normalized.includes('rating')) {
        botReply('To leave a review, open a listing page and use the "Leave a review" form with the stars and comments.');
        return;
      }
      if (normalized.includes('help') || normalized.includes('assist')) {
        botReply('Ask me to search a city, explain how to leave reviews, or how to list a property.');
        return;
      }
      botReply("Sorry, I don't understand that yet. Try 'search Mumbai' or 'how to leave a review'.");
    }

    toggle.addEventListener('click', () => {
      if (win.style.display === 'none') {
        win.style.display = 'flex';
        messages.innerHTML = '';
        botReply('Hi! I can help with searching locations and leaving reviews. Try "search Mumbai".');
      } else {
        win.style.display = 'none';
      }
    });

    send.addEventListener('click', () => {
      const q = input.value.trim();
      if (!q) return;
      userMsg(q);
      input.value = '';
      setTimeout(() => handleQuery(q), 300);
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        send.click();
      }
    });
  }
});