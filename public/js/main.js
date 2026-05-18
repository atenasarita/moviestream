// MovieStream — client-side JS
// Sync segment fields based on select
const planSelect = document.getElementById("plan_select");
if (planSelect) {
  const planNames = { "1": "Premium", "2": "Básico", "3": "Estudiante" };
  planSelect.addEventListener("change", () => {
    const nameInput = document.querySelector('[name="plan_name"]');
    if (nameInput) nameInput.value = planNames[planSelect.value] || "";
  });
}
