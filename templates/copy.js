document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("copyBtn");
  const payload = document.getElementById("payload");
  const status = document.getElementById("status");

  if (!btn || !payload) return;

  btn.addEventListener("click", async () => {
    const text = payload.textContent || "";

    try {
      await navigator.clipboard.writeText(text);
      if (status) {
        status.textContent = "Скопировано ✔";
        status.style.color = "limegreen";
      }
    } catch (e) {
      if (status) {
        status.textContent =
          "Не удалось скопировать автоматически. Выделите текст и нажмите Ctrl+C.";
        status.style.color = "red";
      }
    }
  });
});
