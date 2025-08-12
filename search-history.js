document.addEventListener("DOMContentLoaded", () => {
  console.log("Page loaded, rendering search history...");
  renderSearchHistory();
});

function saveSearchHistory(imageSrc, name, confidence) {
  let history = JSON.parse(localStorage.getItem("searchHistory")) || [];

  history.unshift({
    image: imageSrc,
    name: name,
    confidence: confidence,
    date: new Date().toLocaleString(),
  });

  if (history.length > 10) history.pop();

  localStorage.setItem("searchHistory", JSON.stringify(history));
  console.log("Saved history:", history); // DEBUG
}

function renderSearchHistory() {
  let history = JSON.parse(localStorage.getItem("searchHistory")) || [];
  console.log("Rendering history:", history); // DEBUG

  const tableBody = document.getElementById("searchHistoryTable");
  if (!tableBody) {
    console.error("⚠️ searchHistoryTable element not found!");
    return;
  }

  tableBody.innerHTML = "";

  if (history.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="4" class="text-center text-muted">No search history found</td></tr>`;
    return;
  }

  history.forEach((item) => {
    tableBody.innerHTML += `
      <tr>
        <td><img src="${item.image}" alt="Preview" class="rounded-circle" style="width:40px; height:40px; object-fit:cover;"></td>
        <td>${item.name}</td>
        <td>${item.confidence}%</td>
        <td>${item.date}</td>
      </tr>
    `;
  });
}

document.getElementById("clearHistoryBtn")?.addEventListener("click", () => {
  localStorage.removeItem("searchHistory");
  renderSearchHistory();
});

// Account page
/* ===== VerifAI account page script — safe image handling =====
   - Preserves any image set directly in the HTML.
   - If user edits/uploads a new image, that will replace the current image.
   - Saves to localStorage under STORAGE_KEY.
*/

// Constants & defaults
const STORAGE_KEY = "verifai_user_demo_v1";

const defaultUser = {
  fullName: "Dee Dev",
  email: "dee@example.com",
  username: "dee_dev",
  phone: "+234-800-123-4567",
  joined: "Aug 4, 2025",
  verified: true,
  plan: "Free",
  profilePic: "https://i.pravatar.cc/150?img=8",
  stats: { total: 24, matches: 15, mismatches: 9 },
  recentLogins: [
    { device: "Chrome (Windows)", when: "Today • Lagos, NG" },
    { device: "Safari (iPhone)", when: "Yesterday • Uyo, NG" },
    { device: "Firefox (Ubuntu)", when: "Aug 1, 2025 • Lagos, NG" },
  ],
  settings: { twoFA: false, faceAlerts: true, theme: "system" },
};

// persistence helpers
function loadUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : defaultUser;
  } catch (e) {
    return defaultUser;
  }
}
function saveUser(user) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

// small helper to mask emails
function maskEmail(email) {
  if (!email) return "";
  const [local, domain] = email.split("@");
  if (!local) return email;
  const first = local.charAt(0);
  return first + "***@" + domain;
}

// update UI from user object
// If forceImage === true, overwrite image regardless of existing HTML src
function updateUIFromUser(user, forceImage = false) {
  // Elements
  const profileEl = document.getElementById("profilePic");
  const smallEl = document.getElementById("smallPic");
  const fullNameEl = document.getElementById("fullName");
  const miniNameEl = document.getElementById("miniName");
  const miniUserEl = document.getElementById("miniUser");
  const starredEmailEl = document.getElementById("starredEmail");
  const acctUsernameEl = document.getElementById("acctUsername");
  const acctEmailEl = document.getElementById("acctEmail");
  const acctPhoneEl = document.getElementById("acctPhone");
  const acctJoinedEl = document.getElementById("acctJoined");
  const acctPlanEl = document.getElementById("acctPlan");
  const acctVerifBadgeEl = document.getElementById("acctVerifBadge");
  const verificationBadgeEl = document.getElementById("verificationBadge");

  // Only set profile images if:
  // - forceImage true OR
  // - the HTML img tag has no src attribute or empty src
  try {
    const profileAttr = profileEl ? profileEl.getAttribute("src") : null;
    if (
      profileEl &&
      (forceImage || !profileAttr || profileAttr.trim() === "")
    ) {
      profileEl.src = user.profilePic;
    }
    const smallAttr = smallEl ? smallEl.getAttribute("src") : null;
    if (smallEl && (forceImage || !smallAttr || smallAttr.trim() === "")) {
      smallEl.src = user.profilePic;
    }
  } catch (e) {
    // ignore if elements don't exist yet
    console.warn("profile image update skipped", e);
  }

  // Textual fields
  if (fullNameEl) fullNameEl.textContent = user.fullName;
  if (miniNameEl)
    miniNameEl.textContent = user.fullName.split(" ")[0] || user.fullName;
  if (miniUserEl) miniUserEl.textContent = "@" + user.username;
  if (starredEmailEl) starredEmailEl.textContent = maskEmail(user.email);
  if (acctUsernameEl) acctUsernameEl.textContent = user.username;
  if (acctEmailEl) acctEmailEl.textContent = maskEmail(user.email);
  if (acctPhoneEl) acctPhoneEl.textContent = user.phone || "—";
  if (acctJoinedEl) acctJoinedEl.textContent = user.joined;
  if (acctPlanEl) acctPlanEl.textContent = user.plan;
  if (acctVerifBadgeEl)
    acctVerifBadgeEl.textContent = user.verified ? "Verified" : "Unverified";
  if (verificationBadgeEl)
    verificationBadgeEl.style.display = user.verified ? "inline-flex" : "none";

  // Stats (animated)
  animateCounter("statTotal", user.stats.total || 0);
  animateCounter("statMatches", user.stats.matches || 0);
  animateCounter("statMismatches", user.stats.mismatches || 0);

  // Recent logins
  const recentEl = document.getElementById("recentLogins");
  if (recentEl) {
    recentEl.innerHTML = "";
    (user.recentLogins || []).forEach((item) => {
      const li = document.createElement("li");
      li.className =
        "list-group-item d-flex justify-content-between align-items-start";
      li.innerHTML = `<div><strong>${item.device}</strong><div class="muted-small">${item.when}</div></div>`;
      recentEl.appendChild(li);
    });
  }

  // toggles
  const t2 = document.getElementById("toggle2FA");
  if (t2) t2.checked = !!user.settings.twoFA;
  const tf = document.getElementById("toggleFaceAlert");
  if (tf) tf.checked = !!user.settings.faceAlerts;
  const appSel = document.getElementById("appearanceSelect");
  if (appSel) appSel.value = user.settings.theme || "system";
}

// small animated counters
function animateCounter(id, target) {
  const el = document.getElementById(id);
  if (!el) return;
  let start = Number(el.textContent) || 0;
  const duration = 600;
  const frames = Math.ceil(duration / 30);
  const step = (target - start) / frames;
  let frame = 0;
  const t = setInterval(() => {
    frame++;
    start = Math.round((start + step) * 10) / 10;
    if (frame >= frames) {
      el.textContent = target;
      clearInterval(t);
    } else {
      el.textContent = Math.round(start);
    }
  }, 30);
}

/* ===== Initialization & event wiring ===== */
let user = loadUser();
document.addEventListener("DOMContentLoaded", () => {
  // Update UI but do NOT overwrite images unless the HTML img had no src.
  updateUIFromUser(user, false);

  // Edit Profile modal wiring
  const editModalEl = document.getElementById("editProfileModal");
  const editModal = new bootstrap.Modal(editModalEl);
  document.getElementById("editProfileBtn").addEventListener("click", () => {
    // Pre-fill modal
    document.getElementById("editFullName").value = user.fullName;
    document.getElementById("editEmail").value = user.email;
    document.getElementById("editPhone").value = user.phone || "";
    document.getElementById("editPhotoUrl").value = "";
    // clear file input and preview
    const fileInput = document.getElementById("editPhotoFile");
    if (fileInput) fileInput.value = "";
    const preview = document.getElementById("modalProfilePreview");
    preview.style.display = "none";
    document.getElementById("modalProfilePreviewError").style.display = "none";
    editModal.show();
  });

  // allow image upload preview in modal
  let modalUploadedDataUrl = null;
  const editFileEl = document.getElementById("editPhotoFile");
  if (editFileEl) {
    editFileEl.addEventListener("change", (ev) => {
      const f = ev.target.files[0];
      modalUploadedDataUrl = null;
      const preview = document.getElementById("modalProfilePreview");
      const previewErr = document.getElementById("modalProfilePreviewError");
      if (!f) {
        preview.style.display = "none";
        previewErr.style.display = "none";
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        modalUploadedDataUrl = reader.result;
        preview.src = modalUploadedDataUrl;
        preview.style.display = "inline-block";
        previewErr.style.display = "none";
      };
      reader.onerror = () => {
        modalUploadedDataUrl = null;
        preview.style.display = "none";
        previewErr.style.display = "block";
      };
      reader.readAsDataURL(f);
    });
  }

  // handle edit profile submit
  document.getElementById("editProfileForm").addEventListener("submit", (e) => {
    e.preventDefault();
    // read inputs
    const newName = document.getElementById("editFullName").value.trim();
    const newEmail = document.getElementById("editEmail").value.trim();
    const newPhone = document.getElementById("editPhone").value.trim();
    const newUrl = document.getElementById("editPhotoUrl").value.trim();

    if (newName) user.fullName = newName;
    if (newEmail) user.email = newEmail;
    user.phone = newPhone || user.phone;

    // priority: uploaded file (modalUploadedDataUrl) > URL input > keep old
    if (modalUploadedDataUrl) {
      user.profilePic = modalUploadedDataUrl;
    } else if (newUrl) {
      user.profilePic = newUrl;
    }

    saveUser(user);
    // force image update because user just edited it
    updateUIFromUser(user, true);

    // hide modal
    const editModalInstance = bootstrap.Modal.getInstance(editModalEl);
    if (editModalInstance) editModalInstance.hide();
  });

  // change password modal wiring (keeps demo behavior)
  const changePassModalEl = document.getElementById("changePasswordModal");
  const changePassModal = new bootstrap.Modal(changePassModalEl);
  document
    .getElementById("changePasswordBtn")
    .addEventListener("click", () => changePassModal.show());

  document.getElementById("changePassForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const newPass = document.getElementById("newPassword").value || "";
    const confirm = document.getElementById("confirmNewPassword").value || "";
    if (newPass.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }
    if (newPass !== confirm) {
      alert("Passwords do not match");
      return;
    }
    alert("Password changed (demo). Hook a backend for real effect.");
    document.getElementById("changePassForm").reset();
    const inst = bootstrap.Modal.getInstance(changePassModalEl);
    if (inst) inst.hide();
  });

  // toggles -> persist
  const t2El = document.getElementById("toggle2FA");
  if (t2El)
    t2El.addEventListener("change", (e) => {
      user.settings.twoFA = e.target.checked;
      saveUser(user);
    });

  const faceEl = document.getElementById("toggleFaceAlert");
  if (faceEl)
    faceEl.addEventListener("change", (e) => {
      user.settings.faceAlerts = e.target.checked;
      saveUser(user);
    });

  const appSel = document.getElementById("appearanceSelect");
  if (appSel) {
    appSel.value = user.settings.theme || "system";
    appSel.addEventListener("change", (e) => {
      user.settings.theme = e.target.value;
      saveUser(user);
      applyTheme(user.settings.theme);
    });
  }
  applyTheme(user.settings.theme || "system");

  // Download data
  const dlBtn = document.getElementById("downloadDataBtn");
  if (dlBtn) {
    dlBtn.addEventListener("click", () => {
      const dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(user, null, 2));
      const a = document.createElement("a");
      a.setAttribute("href", dataStr);
      a.setAttribute("download", `verifai-data-${user.username}.json`);
      document.body.appendChild(a);
      a.click();
      a.remove();
    });
  }

  // Delete account
  const confirmDeleteModal = new bootstrap.Modal(
    document.getElementById("confirmDeleteModal")
  );
  const deleteBtn = document.getElementById("deleteAccountBtn");
  if (deleteBtn)
    deleteBtn.addEventListener("click", () => confirmDeleteModal.show());

  const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener("click", () => {
      localStorage.removeItem(STORAGE_KEY);
      confirmDeleteModal.hide();
      document.querySelector(".container").innerHTML = `
        <div class="text-center py-5">
          <h3 class="text-danger">Account deleted</h3>
          <p class="muted-small">Your demo account has been removed from this browser. Reloading to default demo...</p>
        </div>`;
      setTimeout(() => location.reload(), 1400);
    });
  }

  // Upgrade button (demo)
  const upgradeBtn = document.getElementById("upgradeBtn");
  if (upgradeBtn)
    upgradeBtn.addEventListener("click", () =>
      alert("Upgrade flow not implemented in demo.")
    );

  // expose a helper for verification flow to update counts
  window.updateUserFromVerification = function (matchInfo) {
    // matchInfo: { image, name, confidence }
    user.stats.total = (user.stats.total || 0) + 1;
    if (matchInfo.confidence >= 85)
      user.stats.matches = (user.stats.matches || 0) + 1;
    else user.stats.mismatches = (user.stats.mismatches || 0) + 1;
    user.recentLogins = user.recentLogins || [];
    user.recentLogins.unshift({
      device: "Verification",
      when: new Date().toLocaleString(),
    });
    if (user.recentLogins.length > 6) user.recentLogins.pop();
    saveUser(user);
    updateUIFromUser(user); // do not forcibly overwrite images here
  };

  // init tooltips if any
  const tts = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]') || []
  );
  tts.forEach((t) => new bootstrap.Tooltip(t));
}); // end DOMContentLoaded

// applyTheme helper
function applyTheme(choice) {
  if (choice === "dark") {
    document.documentElement.style.background = "#0f1724";
    document.body.style.background = "#0f1724";
    document.body.style.color = "#e6eef8";
  } else if (choice === "light") {
    document.documentElement.style.background = "";
    document.body.style.background = "#f5f7fb";
    document.body.style.color = "#212529";
  } else {
    // system or default
    document.documentElement.style.background = "";
    document.body.style.background = "#f5f7fb";
    document.body.style.color = "#212529";
  }
}

// toggle logic

// Theme toggle logic
const themeButtons = document.querySelectorAll(".theme-toggle");

function setTheme(theme) {
  if (theme === "dark") {
    document.body.classList.add("dark-mode");
    document.body.classList.remove("light-mode");
    localStorage.setItem("verifai-theme", "dark");
  } else if (theme === "light") {
    document.body.classList.add("light-mode");
    document.body.classList.remove("dark-mode");
    localStorage.setItem("verifai-theme", "light");
  } else {
    // System default
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.body.classList.add("dark-mode");
      document.body.classList.remove("light-mode");
    } else {
      document.body.classList.add("light-mode");
      document.body.classList.remove("dark-mode");
    }
    localStorage.setItem("verifai-theme", "system");
  }
}

themeButtons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    setTheme(btn.dataset.theme);
  });
});

// On page load, set theme from localStorage or system
(function () {
  const savedTheme = localStorage.getItem("verifai-theme");
  if (savedTheme) {
    setTheme(savedTheme);
  } else {
    setTheme("system");
  }
})();

// Listen for system theme changes if system is selected
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", (e) => {
    if (localStorage.getItem("verifai-theme") === "system") {
      setTheme("system");
    }
  });

//// werey
document
  .querySelectorAll(".dropdown-submenu .dropdown-toggle")
  .forEach(function (el) {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      let submenu = el.nextElementSibling;
      if (submenu) submenu.classList.toggle("show");
    });
  });
