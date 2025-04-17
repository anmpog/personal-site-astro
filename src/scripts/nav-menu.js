const navMenuButton = document.getElementById('nav-menu-button')
const navMenuLinks = document.getElementById('nav-menu-links')

// Utility Functions
function blockScroll() {
  document.body.classList.add('block-scroll')
  document.documentElement.classList.add('block-scroll')
}

function unblockScroll() {
  document.body.classList.remove('block-scroll')
  document.documentElement.classList.remove('block-scroll')
}

function openNavMenu() {
  navMenuLinks.classList.add('expanded')
  blockScroll()
  navMenuButton.setAttribute('aria-expanded', 'true')

  window.addEventListener('click', detectClickOutsideMenu, true)
  window.addEventListener('keydown', detectEscKeyPress, true)
}

function closeNavMenu() {
  navMenuLinks.classList.remove('expanded')
  unblockScroll()
  navMenuButton.setAttribute('aria-expanded', 'false')

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
}

// Listener for menu button
navMenuButton.addEventListener('click', () => {
  if (navMenuButton.getAttribute('aria-expanded') === 'false') {
    openNavMenu()
  } else if (navMenuButton.getAttribute('aria-expanded') === 'true') {
    closeNavMenu()
  }
})
