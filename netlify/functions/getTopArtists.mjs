import axios from 'axios'
import { refreshTokenOptions } from './utils/refreshTokenOptions.mjs'

export default async function getTopArtists() {
  try {
    const {
      data: { access_token },
    } = await axios.request(refreshTokenOptions)

    const topArtistsRequestHeaders = {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=604800, stale-while-revalidate=86400',
      'netlify-cdn-cache-control':
        'public,s-maxage=604800,durable,stale-while-revalidate=86400',
    }

    const headers = new Headers(topArtistsRequestHeaders)

    const { data } = await axios.get(
      'https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=6',
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    )

    const formattedArtistsData = data.items.map((artist) => {
      return {
        artistName: artist.name,
        artistImages: artist.images,
        artistLinks: artist.external_urls,
      }
    })

    const successResponse = new Response(
      JSON.stringify({
        success: true,
        data: formattedArtistsData,
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
      : 'Unknown error in getTopArtists'

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
