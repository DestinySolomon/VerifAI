
  // Counter Animation
  const counters = document.querySelectorAll('.counter');
  counters.forEach(counter => {
    const updateCount = () => {
      const target = +counter.getAttribute('data-target');
      const count = +counter.innerText;
      const increment = target / 200;

      if (count < target) {
        counter.innerText = Math.ceil(count + increment);
        setTimeout(updateCount, 15);
      } else {
        counter.innerText = target;
      }
    };
    updateCount();
  });

  // Testimonial Rotation
  const groups = document.querySelectorAll('.testimonial-group');
  let current = 0;
  setInterval(() => {
    groups[current].classList.remove('active');
    current = (current + 1) % groups.length;
    groups[current].classList.add('active');
  }, 6000);



  // JS to toggle chatbot
const chatbotToggle = document.getElementById('chatbotToggle');
const chatbotWindow = document.getElementById('chatbotWindow');
const closeChat = document.getElementById('closeChat');

chatbotToggle.addEventListener('click', () => {
  chatbotWindow.style.display = 'flex';
});

closeChat.addEventListener('click', () => {
  chatbotWindow.style.display = 'none';
});


