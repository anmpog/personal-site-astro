let stopAnimationTimer: ReturnType<typeof setTimeout>

window.addEventListener('resize', () => {
  const navMenuLinks = document.getElementById('nav-menu-links') as HTMLElement

  navMenuLinks.classList.add('stop-animation')

  clearTimeout(stopAnimationTimer)

  stopAnimationTimer = setTimeout(() => {
    navMenuLinks.classList.remove('stop-animation')
  }, 300)
})
