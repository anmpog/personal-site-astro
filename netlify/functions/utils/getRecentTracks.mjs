import axios from 'axios'
import removeDuplicates from './removeDuplicates'

export default async function getRecentTracks(accessToken) {
  const response = await axios
    .get('https://api.spotify.com/v1/me/player/recently-played?limit=10', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(({ data }) => {
      const trackList = data.items.map(({ track }) => {
        return {
          trackName: track.name,
          artistsOnTrack: track.artists,
          trackImages: track.album.images,
          trackUrls: track.album.external_urls,
        }
      })

      // Spotify will return same track if you listen to it repeatedly
      const deduplicatedRecentTracksResult = removeDuplicates(
        trackList,
        'trackName'
      )

      return {
        data: deduplicatedRecentTracksResult,
        message: null,
        success: true,
      }
    })
    .catch((error) => {
      return {
        data: null,
        message: `There was an error fetching recent tracks: ${error.message}`,
        success: false,
      }
    })

  return response
}
