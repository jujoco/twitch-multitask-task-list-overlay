export function openModal(id = "modal") {
  document.getElementById(id).classList.remove("hidden");
  document.getElementById(id).classList.add("flex");
}

export function closeModal(id = "modal") {
  document.getElementById(id).classList.remove("flex");
  document.getElementById(id).classList.add("hidden");
}
