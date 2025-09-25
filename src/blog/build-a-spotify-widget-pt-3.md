---
title: Building a Spotify Widget With Astro, Preact and Netlify Functions Pt. 3
slug: building-a-spotify-widget-with-astro-preact-and-netlify-functions-pt-3
pubDate: 2025-11-15
description: Building a Netlify serverless function to fetch data from the Spotify API and return it to the client.
author: Anthony Pogliano
tags: [serverless, netlify, preact, react]
---

In the last article, we walked through how to register our application on the Spotify developer portal so we could get a client ID and a client secret to use in authorizing requests to the the Spotify API. After we did that, we created a collection in the open source API client Bruno so we could more easily complete the OAuth2.0 Authorizaion Code handshake and get a refresh token that we could store and use to get access tokens when we make requests to Spotify.

In this article, we are going to flesh out the serverless function we built in Part 1 of the series so that it actually makes requests to the Spotify API and gets us data that we can use to add some personality to our portolio sites. Obviously the possiblities extend beyond that – but that's the use case that prompted this article.

## Requesting Access Tokens

To start issuing requests for data from the Spotify API, let's start building our function out to do this. The first step will be to declare an options object we will need to issue requests for access tokens, since we are going to ask for a new access token every time we make a request to Spotify.

<!-- In the last article, I made mention of some design considerations in building this application. Because serverless functions do not keep state reliably, we face some challenges in building out an appropriately "real-world" application.

In a more traditional server environment, we would implement some sort of local caching strategy that would allow us to hang onto the access tokens issued by the Spotify authentication server. Then, before issuing any request to the Spotify API, we would first check to see if our stored access token is unexpired, and if it were valid we would then use it to issue a request immediately to the Spotify Web API.

In cases where an access token is expired, we would have to use our refresh token – which does not automatically expire – to request a new access token. Then, we would use that access token to get data from Spotify.

While I probably made that sound overly complex, the point is: we are explicitly opting to request a fresh access token _every time_ we request data from Spotify since we have a harder time storing the access token than we would if we were using a more traditional server. In the context of a small, low-traffic site this feels like an acceptable performance trade off: we have to issue at least two requests every time we want data from Spotify, but we don't have to figure out how to implement a reliable in-memory cache for a serverless function.

> To the best of my knowledge, the refresh tokens issued by the Spotify Auth service do not expire due to a time limit. They can, however, be revoked by us or Spotify.

With all that in mind, let's build the first part of our function for fetching data from Spotify. If you've been following along, in your root directory there should be a folder `netlify/functions/getTopArtists.mjs`. You can delete any code in the file, but you should leave the function declaration. Add the following to your file: -->

```js title="netlify/functions/getTopArtists.mjs" "data:" add={2-17}
export default function getTopArtists() {
  const refreshTokenOptions = {
    method: 'POST',
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization:
        'Basic ' +
        new Buffer.from(
          process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET
        ).toString('base64'),
    },
    data: {
      grant_type: 'refresh_token',
      refresh_token: process.env.REFRESH_TOKEN,
    },
  }
}
```

This `refreshTokenOptions` object is just an object literal configured to be used in our requests for a new access token per the [Spotify documentation](https://developer.spotify.com/documentation/web-api/tutorials/refreshing-tokens) on refresh tokens. The documentation shows an example of how to issue a request for a new access token from a Node environment – our options are largely the same as those shown in the official documentation with the exception of the inclusion of a `data` field in place of a `form` field. You'll also notice that we access our refresh token, client secret, and client ID at build time when our app is reading environment variables from our configuration.

Now that we have an options object defined, we need a way to make requests. I opted to use Axios to make requests. You will need to install Axios in order to use it. I use yarn as a package manager, so my install command looks like:

```bash
yarn add axios
```

After we have a way to fetch data, we can expand our code from above to look like this:

```js title="netlify/functions/getTopArtists.mjs" add={6-14} "async"
export default async function getTopArtists() {
  const refreshTokenOptions = {
    // refresh token options
  }

  try {
    const {
      data: { access_token },
    } = await axios.request(refreshTokenOptions)

    console.log('Access token: ', access_token)
  } catch (error) {
    console.log('There was an error: ', error)
  }
}
```

Make note of the fact that we made our `getTopArtists` function into an async function! If we've done everything correctly, we should be able to run our app using the Netlify CLI and see our app fetching tokens from Spotify if we interact with our user interface – in this case a button that sends a request to our serverless function.

In part one of this guide we installed the Netlify CLI, which allows us to run our app in a way that mirrors our deployment environment locally. It will serve the functions we put in our `netlify/functions` folder to us. To run the CLI, use the following command while you're in your project's root directory:

```bash
netlify dev
```

The console output should show you what port your project is running on – by default Netlify CLI will try to run your project at `http://localhost:8888`. In part 1 of this guide we also built a really basic UI that consists of just a button to trigger a request to our serverless function. As we've written everything so far, you should be able to click the button and see a response similar to this from the Spotify auth server in your console:

```bash
Request from ::ffff:127.0.0.1: GET /.netlify/functions/getTopArtists
Access token:  BQASJYHiTnmVDrzSixxptaHKeCWiY3cDbQNLY5vTvntfSCen2hJkG8bLlOSvBlEui43O9xtPlf5gDL6fY1ZYSROcLLIIZ5nxJTPj_1W57nsMvqM8mv4lD-WvjgcRBxPHsafnf5S8FsBGCmT9NR4eECZF9ybgWI5dsAc_U5S942spUvBbod6IX-2T2lXO5eFM5ln4og8n1iTpjSsZbamh5M9e_Cvk
Response with status 204 in 287 ms.
```

> I deleted random characters from that access token... don't even try it.

At this point we are using our refresh token to request the access tokens we need to get data from Spotify's Web API. Next, we will build a subsequent request that uses the access token to get data from protected endpoints on the API.

## Requesting Data From Spotify

Now that we are getting access tokens, it's time to exchange them for data. To do this, we will pass the access token we get from the request we just built to another request:

```js title = 'netlify/functions/getTopArtists.mjs' del={11} add={12-21} "Bearer ${access_token}"
export default async function getTopArtists() {
  const refreshTokenOptions = {
    // refresh token options
  }

  try {
    const {
      data: { access_token },
    } = await axios.request(refreshTokenOptions)

    console.log('Access token: ', access_token)
    const { data } = await axios.get(
      'https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=6',
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    )

    console.log('Data from spotify: ', data)
  } catch (error) {
    console.log('There was an error: ', error)
  }
}
```

If we've done this correctly, when you click the button in the UI of your application, you should see a log in your developer console that indicates you've fetched a list of 6 artists from Spotify.

Next we are going to take a look at how to format our data to be a little more readable, and then send our formatted data back to the client so that we can do something with it in our UI.

## Formatting Our Data and Sending it To The Client

The data we get back from Spotify is fairly busy. It includes a lot of fields that I didn't really feel like I needed to land in the client, so I trimmed the data down a little bit to make it a little more ergonomic by the time it gets to the client. The [Top Items documentation](https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks) details the shape of the data, as well as the options available to us to modify what we get back from a request.

```js title = 'netlify/functions/getTopArtists.mjs' del={20} add={21-39} "time_range=medium_term&limit=6"
export default async function getTopArtists() {
  const refreshTokenOptions = {
    // refresh token options
  }

  try {
    const {
      data: { access_token },
    } = await axios.request(refreshTokenOptions)

    const { data } = await axios.get(
      'https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=6',
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    )

    console.log('Data from spotify: ', data)
    const formattedArtistsList = data.items.map((artist) => {
      return {
        artistName: artist.name,
        artistImages: artist.images,
        artistLinks: artist.external_urls,
      }
    })

    const successResponse = new Response(
      JSON.stringify({
        success: true,
        data: formattedArtistsList,
      }),
      {
        status: 200,
      }
    )

    return successResponse
  } catch (error) {
    console.log('There was an error: ', error)
  }
}
```

First, we formatted the data we get back from the Spotify API to get rid of fields we don't plan on displaying in our client. Because Netlify's serverless functions must return either a [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) or `undefined`, we build a new `Response` object to send to the client.

We use the `Response` constructor to – stay with me now - instantiate a `Response` object to send to the client. We include a `success` field to make the data easier to handle on the client, a data field that will contain the data we get back from the Spotify API in the event of a successful request, and we also manually set a status code for our response. Finally, we return the `successResponse` to the client in the event that everything in our `try` block goes off without a hitch.

At this point, if you click the button in the UI of your client application, you should be able to inspect the network tab in the dev tools to see data from Spotify landing in the browser.

In the case that something fails while trying to get data from Spotify, it would be nice to return a response to the client that gives some indication of what went wrong. Right now, our `catch` block only logs errors on the development server.

```js title = 'netlify/functions/getTopArtists.mjs' del={9} add={10-24}
export default async function getTopArtists() {
  const refreshTokenOptions = {
    // refresh token options
  }

  try {
    // code for fetching tokens and then exchanging them for Spotify data
  } catch (error) {
    console.log('There was an error: ', error)
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
      }
    )

    return failureResponse
  }
}
```

So far, the client only logs errors, but you can test your error handling at this point by throwing an `Error` in the `try` block of the `getTopArtists` function. Then, fire a request from your UI. In the network tab, you should be able to see that our serverless function sends an object with a success field, a message field, and a status code indicating that an error occurred with the serverless function – in this case a generic 500 code.

## Displaying our Data in the UI

Now that we are triggering requests to our serverless function from our UI and the function is returning data from the Spotify API to the UI, we can update our client application to display the data. Let's get the rudiments of a more legitimate application in place so that we don't have to keep checking the network panel to see if our data is making it to the browser!

In your code editor, navigate to your UI component at `src/components/GetTopArtists.jsx`. Let's make some changes so that our UI can represent the presence or absence of data, or the presence of an error. To start with, make the following changes:

```js title='src/components/GetTopArtists.jsx' add={1, 4-6, 10, 16, 19, 23, 27-46} del={15, 18, 22}
import { useState } from 'preact/hooks'

function GetTopArtists() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleFetch() {
    try {
      setLoading(true)
      const res = await fetch('/api/getTopArtists')
      const json = await res.json()

      if (json.success) {
        console.log(json.data)
        setData(json.data)
      } else {
        console.log('Something weird happened')
        setError(json.message)
      }
    } catch (error) {
      throw new Error('There was an error fetching your data')
      setError('Client error')
    }
  }
  return (
    <div style={{ maxWidth: '550px' }}>
      <button onClick={handleFetch}>Fetch Data</button>
      {loading ? <p>Loading...</p> : null}
      {error ? <p>There was an error fetching data: {error}</p> : null}
      {data ? (
        <div>
          {data.map((artist) => {
            return (
              <a href={artist.artistLinks.spotify}>
                <h2>{artist.artistName}</h2>
                <img
                  src={artist.artistImages[1].url}
                  alt={`${artist.artistName} image`}
                />
              </a>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}

export default GetTopArtists
```

This should give us a functional, but basic, UI to display the data we get back from the Spotify API.

First, we instantiated three different state variables that will hold our data state, our loading state, and our error state if applicable. Then, in our `handleFetch` function, we update our code to use our various state setters as opposed to simply logging the data or errors. Additionally, our `handleFetch` function was fleshed out a bit more: we make sure to always set our loading state to `true` before our fetch request fires, and we always make sure to set our loading state back to `false` after we have fetched (or attempted to fetch) data from our endpoint.

Then, in our UI markup, we make use of conditional rendering to represent our `loading`, `data` and `error` states.

At this point, if we click our "Fetch Data" button, we should see:

1. Our UI show indication that the data is being fetched by way of displaying a "Loading" text
2. Our UI should show an indication of either:

   - Data succesfully returning from the Spotify API by way of rendered text and images representing the top six artists we've been listening to in the last six months
   - An error occuring by displaying some generic text with a message from our API endpoint

## Next Steps

At this point, I think I've achieved everything I hoped to achieve in writing this article. I've explained how to register an application on Spotify's API. I've walked through authorizing that application using an API client and using authorization tokens to get access to protected endpoints on Spotify's web API. I've detailed the decisions that informed the way we built the application.

There are some more considerations to make. Right now, our UI does not really reflect a very realistic use-case: we probably want to load our data automatically after the containing page or element is loaded on our site. We likely also want to style the data that comes back from Spotify in a little more aesthetically pleasing manner.

There are also optimizations we can make to our serverless function that felt outside the scope of this article. I want to mention a few of them in case you want to keep hacking on this mini-app. I myself need to make a few of these optimizations!

One such optimization would be to take advantage of caching behavior – both in our browser, as well as on Netlify's CDN. Netlify's [documentation on caching](https://docs.netlify.com/build/caching/caching-overview/#default-caching-behavior) details the special headers you can set to make the Netlify CDN aware of which data you want to cache.

One thing to be aware of when making caching optimizations is that testing the caching headers will require you to deploy your application – the Netlify CLI does not give you feedback on how your Netlify-specific cache control headers are working.

In part two of this article series, I discussed the pitfalls of using an in-memory cache with serverless functions to cut down on the need to request access tokens on _every_ request to Spotify. The primary issue is that Netlify functions do not reliably hold state. After a serverless function executes, its execution context persists for a short (but unpredictable) amount of time, meaning that our in-memory cache would be unreliable.

An optimization that might address the unreliability of serverless functions' short-lived execution contexts would be using [Netlify Blobs](https://docs.netlify.com/build/data-and-storage/netlify-blobs/) in our Netlify functions to achieve caching the access tokens issued by Spotify's auth server. Netlify Blobs provide us a way to persist data in a key/value format that outlasts the lifetime of a serverless function's execution context. This could give us a mechanism for storing access tokens and cutting down on the need to ask Spotify's authorization server for a new access token before every single resource request we make to the web API.

On top of those optimizations, I'm sure there are patterns that are more robust, more maintainable, simpler to parse... that's the beauty of coding. There's no such thing as perfect! However, I think I have presented a good, if long-winded, explanation of how to consume this API.

Stay tuned for future articles!
