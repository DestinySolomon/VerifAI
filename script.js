

  // Add background shadow to navs when scrolling
  window.addEventListener('scroll', function () {
    const subNav = document.getElementById('subNav');
    const mainNav = document.getElementById('mainNav');

    if (window.scrollY > 20) {
      subNav.classList.add('scrolled');
      mainNav.classList.add('scrolled');
    } else {
      subNav.classList.remove('scrolled');
      mainNav.classList.remove('scrolled');
    }
  });




// Counter Animation
const counters = document.querySelectorAll(".counter");
counters.forEach((counter) => {
  const updateCount = () => {
    const target = +counter.getAttribute("data-target");
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
const groups = document.querySelectorAll(".testimonial-group");
let current = 0;
setInterval(() => {
  groups[current].classList.remove("active");
  current = (current + 1) % groups.length;
  groups[current].classList.add("active");
}, 6000);

// JS to toggle chatbot
const chatbotToggle = document.getElementById("chatbotToggle");
const chatbotWindow = document.getElementById("chatbotWindow");
const closeChat = document.getElementById("closeChat");

chatbotToggle.addEventListener("click", () => {
  chatbotWindow.style.display = "flex";
});

closeChat.addEventListener("click", () => {
  chatbotWindow.style.display = "none";
});


// Footer
document.getElementById("year").textContent = new Date().getFullYear();

const topBtn = document.getElementById("backToTop");
topBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
