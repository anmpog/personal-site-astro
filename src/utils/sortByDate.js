// Function for returning most recent posts first.

export function sortByDate(a, b) {
  return new Date(b.data.pubDate) - new Date(a.data.pubDate)
}
