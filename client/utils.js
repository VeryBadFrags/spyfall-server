export function addRemoveClass(element, cssClass) {
  if (element.classList.contains(cssClass)) {
    element.classList.remove(cssClass);
  } else {
    element.classList.add(cssClass);
  }
}

export function resetClickableElements() {
  document
    .querySelectorAll(".strike")
    .forEach((elem) => elem.classList.remove("strike"));
}
