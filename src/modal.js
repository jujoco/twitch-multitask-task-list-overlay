export function openModal() {
  document.getElementById("modal").classList.remove("hidden");
  document.getElementById("modal").classList.add("flex");
}

export function closeModal() {
  document.getElementById("modal").classList.remove("flex");
  document.getElementById("modal").classList.add("hidden");
}