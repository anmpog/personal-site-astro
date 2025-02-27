import axios from 'axios'
import getRecentTracks from './utils/getRecentTracks.mjs'
import getTopArtists from './utils/getTopArtists.mjs'

// Options for POST request for refreshing auth token
const refreshTokenOptions = {
  method: 'POST',
  url: process.env.SPOTIFY_ACCESS_TOKEN_URL,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization:
      'Basic ' +
      new Buffer.from(
        process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
      ).toString('base64'),
  },
  data: {
    grant_type: 'refresh_token',
    refresh_token: process.env.SPOTIFY_REFRESH_TOKEN,
  },
}

export default async function getSpotifyData(req) {
  if (req.method === 'OPTIONS') {
    const optionsResponse = new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:8000',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET',
      },
    })

    return optionsResponse
  }

  if (req.method === 'GET') {
    let accessToken = ''

    try {
      const { data } = await axios.request(refreshTokenOptions)
      accessToken = data.access_token

      const getRecentTracksResponse = await getRecentTracks(accessToken)
      const getTopArtistsResponse = await getTopArtists(accessToken)

      const successResponse = new Response(
        JSON.stringify({ getRecentTracksResponse, getTopArtistsResponse }),
        {
          status: 200,
        }
      )

      return successResponse
    } catch (error) {
      const failureResponse = new Response(error.message, {
        statusText: `There was an error accessing Spotify: ${error.message}`,
        status: 500,
      })

      return failureResponse
    }
  }
}
