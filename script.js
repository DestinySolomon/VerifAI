// Add background shadow to navs when scrolling
window.addEventListener("scroll", function () {
  const subNav = document.getElementById("subNav");
  const mainNav = document.getElementById("mainNav");

  if (window.scrollY > 20) {
    subNav.classList.add("scrolled");
    mainNav.classList.add("scrolled");
  } else {
    subNav.classList.remove("scrolled");
    mainNav.classList.remove("scrolled");
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

//chatbot

// Basic FAQ data

const faqList = [
  {
    question: "What is VerifAI?",
    answer:
      "VerifAI is an AI-powered tool that helps detect impersonation and identity fraud in real-time.",
  },
  {
    question: "How do I upload my document?",
    answer:
      "Click the 'Upload Document' button on the verification page and select your file. We accept JPG, PNG, and PDF formats.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes. We use top-tier encryption and secure cloud storage to protect your personal information.",
  },
  {
    question: "Can I use VerifAI for business verification?",
    answer:
      "Absolutely! VerifAI supports both individual and business KYC verification.",
  },
  {
    question: "How long does verification take?",
    answer: "Most verifications are completed within 30 seconds.",
  },
];

// Chatbot FAQ logic

const chatContainer = document.getElementById("chatbot-container");
const toggleBtn = document.getElementById("chat-toggle");
const sendBtn = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");
const chatBody = document.getElementById("chat-body");

// Open/close toggle
toggleBtn.onclick = () => {
  chatContainer.style.display =
    chatContainer.style.display === "flex" ? "none" : "flex";
  chatContainer.style.flexDirection = "column";
};

// Add a message
function addMessage(content, isBot = false) {
  const msg = document.createElement("div");
  msg.className = isBot ? "bot-message" : "user-message";
  msg.innerText = content;
  chatBody.appendChild(msg);
  chatBody.scrollTop = chatBody.scrollHeight;
}

// Typing animation and response
function handleUserInput() {
  const question = userInput.value.trim();
  if (!question) return;

  addMessage(question, false);
  userInput.value = "";

  const loading = document.createElement("div");
  loading.className = "bot-message";
  loading.innerText = "Typing...";
  chatBody.appendChild(loading);
  chatBody.scrollTop = chatBody.scrollHeight;

  setTimeout(() => {
    loading.remove();
    const answer = getFAQAnswer(question);
    addMessage(answer, true);
  }, 1000);
}

// FAQ Matching
function getFAQAnswer(input) {
  const match = faqList.find((faq) =>
    input.toLowerCase().includes(faq.question.toLowerCase().split(" ")[0])
  );
  return match ? match.answer : "I'm sorry, I couldn't find an answer to that.";
}

// Send message
sendBtn.onclick = handleUserInput;
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") handleUserInput();
});

//history section

const searchInput = document.getElementById("searchInput");
const cards = document.querySelectorAll(".verification-card");

searchInput.addEventListener("input", function () {
  const searchText = searchInput.value.toLowerCase();

  cards.forEach((card) => {
    const text = card.textContent.toLowerCase();
    card.style.display = text.includes(searchText) ? "block" : "none";
  });
});

// Login Form

function togglePassword() {
  const passwordInput = document.getElementById("password");
  const toggleIcon = document.querySelector(".toggle-password");
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    toggleIcon.textContent = "🙈";
  } else {
    passwordInput.type = "password";
    toggleIcon.textContent = "👁️";
  }
}

// user dashboard page











// Footer
document.getElementById("year").textContent = new Date().getFullYear();

const topBtn = document.getElementById("backToTop");
topBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
