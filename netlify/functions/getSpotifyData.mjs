import axios from 'axios'
import getRecentTracks from './utils/getRecentTracks.mjs'
import getTopArtists from './utils/getTopArtists.mjs'
import { CacheHeaders } from 'cdn-cache-control'

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
    console.log('Get request to getSpotifyData')

    try {
      const { data } = await axios.request(refreshTokenOptions)
      accessToken = data.access_token

      const getRecentTracksResponse = await getRecentTracks(accessToken)
      const getTopArtistsResponse = await getTopArtists(accessToken)
      const cacheControlHeaders = new CacheHeaders(
        { 'Content-Type': 'application/json', 'My-header': 'testing' },
        'netlify'
      )

      console.log('Cache control headers: ', cacheControlHeaders)
      console.log('Testing structure of headers obj: ', {
        ...cacheControlHeaders,
      })

      const successResponse = new Response(
        JSON.stringify({
          getRecentTracksResponse,
          getTopArtistsResponse,
          success: true,
        }),
        {
          status: 200,
          headers: cacheControlHeaders,
        }
      )

      return successResponse
    } catch (error) {
      const failureResponse = new Response(
        JSON.stringify({
          message: error.message,
          success: false,
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      )

      return failureResponse
    }
  }
}
