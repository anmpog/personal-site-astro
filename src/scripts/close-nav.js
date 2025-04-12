const navMenuButton = document.getElementById('nav-menu-button')
const navMenuLinks = document.getElementById('nav-menu-links')

function closeMenu() {
  navMenuLinks.classList.remove('expanded')
  document.body.classList.remove('block-scroll')

  // Removing class from html element - needed for Safari scroll block
  document.documentElement.classList.remove('block-scroll')
}

// Close menu on esc key
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && navMenuLinks.classList.contains('expanded')) {
    closeMenu()
  }
})

// Close menu on click outside menu
window.addEventListener('click', (event) => {
  if (
    !navMenuLinks.contains(event.target) &&
    !navMenuButton.contains(event.target)
  ) {
    closeMenu()
  }
})

// Close menu on resize
window.addEventListener('resize', () => {
  closeMenu()
})
