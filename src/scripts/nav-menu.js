const navMenuButton = document.getElementById('nav-menu-button')
const backdropElement = document.getElementById('backdrop')
const navMenuLinks = document.getElementById('nav-links-wrapper')

// Utility Functions
function blockScroll() {
  document.body.classList.add('block-scroll')
  backdropElement.classList.add('blur')
  document.documentElement.classList.add('block-scroll')
}

function unblockScroll() {
  document.body.classList.remove('block-scroll')
  backdropElement.classList.remove('blur')
  document.documentElement.classList.remove('block-scroll')
}

function openNavMenu() {
  navMenuButton.setAttribute('aria-expanded', 'true')
  navMenuLinks.classList.add('expanded')
  blockScroll()

  window.addEventListener('click', detectClickOutsideMenu, true)
  window.addEventListener('keydown', detectEscKeyPress, true)
}

function closeNavMenu() {
  navMenuButton.setAttribute('aria-expanded', 'false')
  navMenuLinks.classList.remove('expanded')
  unblockScroll()

  window.removeEventListener('click', detectClickOutsideMenu, true)
  window.removeEventListener('keydown', detectEscKeyPress, true)
}

function detectEscKeyPress(event) {
  if (event.keyCode === 27) {
    closeNavMenu()
  }

  return null
}

function detectClickOutsideMenu(event) {
  if (
    !navMenuLinks.contains(event.target) &&
    !navMenuButton.contains(event.target)
  ) {
    closeNavMenu()
  }

  return null
}

// Listener for menu button
navMenuButton.addEventListener('click', () => {
  if (navMenuButton.getAttribute('aria-expanded') === 'false') {
    openNavMenu()
  } else if (navMenuButton.getAttribute('aria-expanded') === 'true') {
    closeNavMenu()
  }
})
