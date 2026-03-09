let historyList = [];

export function addToHistory(expr, result) {
  // Add newest calculation first
  historyList.unshift({ expr, result });
  renderHistory();
}

export function renderHistory() {
  const historyContainer = document.querySelector(".history-list");
  historyContainer.innerHTML = "";

  historyList.forEach((item) => {
    const div = document.createElement("div");
    div.classList.add("history-item");
    div.innerHTML = `<span>${item.expr}</span> = <strong>${item.result}</strong>`;

    div.addEventListener("click", () => {
      const display = document.querySelector(".display-area input");
      display.value = item.result;
    });

    historyContainer.appendChild(div);
  });
}

export function clearHistory() {
  historyList = [];
  renderHistory();
}
