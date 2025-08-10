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
    date: new Date().toLocaleString()
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

  history.forEach(item => {
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
