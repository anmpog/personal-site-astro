import axios from 'axios'
import { refreshTokenOptions } from './utils/refreshTokenOptions.mjs'
import removeDuplicates from './utils/removeDuplicates'

export default async function getRecentTracks() {
  try {
    const {
      data: { access_token },
    } = await axios.request(refreshTokenOptions)

    const recentTracksRequestHeaders = {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=600, stale-while-revalidate=60',
      'netlify-cdn-cache-control':
        'public,s-maxage=600,durable,stale-while-revalidate=60',
    }

    const headers = new Headers(recentTracksRequestHeaders)

    const { data } = await axios.get(
      'https://api.spotify.com/v1/me/player/recently-played?limit=10',
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    )

    const formattedTracksList = data.items.map(({ track }) => {
      return {
        trackId: track.id,
        trackName: track.name,
        artistsOnTrack: track.artists,
        trackImages: track.album.images,
        trackUrls: track.album.external_urls,
      }
    })

    // Spotify will return same track if you listen to it repeatedly
    const deduplicatedFormattedTracksList = removeDuplicates(
      formattedTracksList,
      'trackId'
    )

    const successResponse = new Response(
      JSON.stringify({
        success: true,
        data: deduplicatedFormattedTracksList,
      }),
      {
        status: 200,
        headers: headers,
      }
    )

    return successResponse
  } catch (error) {
    const message = error.message
      ? error.message
      : 'Unknown Error in getRecentTracks'

    const failureResponse = new Response(
      JSON.stringify({
        success: false,
        message: message,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )

    return failureResponse
  }
}
