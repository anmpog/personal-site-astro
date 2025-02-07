import axios from 'axios'

export default async function getTopArtists(accessToken) {
  const response = await axios
    .get(
      'https://api.spotify.com/v1/me/top/artists/?time_range=medium_term&limit=6',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
    .then(({ data }) => {
      const artistsList = data.items.map(artist => {
        return {
          artistName: artist.name,
          artistImages: artist.images,
          artistLinks: artist.external_urls,
        }
      })
      return {
        data: artistsList,
        message: null,
        success: true,
      }
    })
    .catch(error => {
      return {
        data: null,
        message: error.message,
        success: false,
      }
    })
  return response
}
