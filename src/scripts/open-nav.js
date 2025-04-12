document.querySelector('.hamburger').addEventListener('click', () => {
  document.querySelector('.nav-links').classList.toggle('expanded')
  document.body.classList.toggle('block-scroll')

  // Need to add class to HTML element to get same scroll-block on Safari
  document.documentElement.classList.toggle('block-scroll')
})
