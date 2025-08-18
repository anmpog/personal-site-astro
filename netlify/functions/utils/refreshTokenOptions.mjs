// Options for POST request for refreshing auth token
export const refreshTokenOptions = {
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
