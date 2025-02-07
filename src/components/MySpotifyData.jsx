import { useState, useEffect } from 'preact/hooks'

const myHeaders = new Headers({
  'Content-Type': 'application/json',
  Accept: 'application/json',
})

const TopTrackSkeleton = () => {
  return (
    <>
      <h3>Top Artists</h3>
      <p>
        The six artists I've been listening to the most over the past 6 months
      </p>
      <div class='grid grid-cols-2 gap-4'>
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            class='flex animate-pulse flex-col overflow-hidden rounded-md bg-slate-300 no-underline outline outline-1 outline-slate-400'
          >
            <div class='m-0 aspect-square h-auto w-full bg-slate-400 object-cover' />
            <p class='h-6 w-4/5 self-center rounded-xl bg-slate-400 text-base font-bold'>
              &nbsp;
            </p>
          </div>
        ))}
      </div>
      <h3>Recent Tracks</h3>
      <p>My ten(ish) most recently listened-to tracks</p>
      <div class='grid auto-rows-auto grid-cols-1 gap-4'>
        {[...Array(8)].map((_, i) => {
          return (
            <div
              key={i}
              class='background flex animate-pulse flex-row gap-2 overflow-hidden rounded-md bg-slate-300 no-underline outline outline-1 outline-slate-400'
            >
              <div class='m-0 aspect-square h-28 w-28 bg-slate-400' />
              <div class='flex w-full flex-col justify-center gap-2'>
                <span class='m-0 h-6 w-40 rounded-xl bg-slate-400 text-base'>
                  &nbsp;
                </span>
                <span class='m-0 h-4 w-44 rounded-xl bg-slate-400 text-base'>
                  &nbsp;
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

const MySpotifyData = () => {
  const [topTracksResponse, setTopTracksResponse] = useState(null)
  const [topArtistsResponse, setTopArtistsResponse] = useState(null)
  const [spotifyDataLoading, setSpotifyDataLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    setSpotifyDataLoading(true)
    fetch(`api/getSpotifyData`, {
      headers: myHeaders,
    })
      .then((res) => res.json())
      .then((data) => {
        setTopTracksResponse(data.topTracksResponseData)
        setTopArtistsResponse(data.topArtistsResponseData)
      })
      .catch(() => setError('There was an error reaching Spotify.'))
      .finally(() => {
        console.log(topArtistsResponse, topTracksResponse)
        setSpotifyDataLoading(false)
      })
  }, [])

  if (spotifyDataLoading) {
    return <TopTrackSkeleton />
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>
      </div>
    )
  }
  return (
    <>
      <h3>Top Artists</h3>
      <p>
        The six artists I've been listening to the most over the past 6 months
      </p>
      {topArtistsResponse?.success ? (
        <>
          <div class='grid grid-cols-2 gap-4'>
            {topArtistsResponse.data.map((artist) => (
              <a
                key={artist.artistName}
                href={artist.artistLinks.spotify}
                rel='noopener noreferrer'
                target='_blank'
                class='overflow-hidden rounded-md no-underline outline outline-1'
              >
                <img
                  src={artist.artistImages[1].url}
                  alt={`${artist.artistName} Artwork`}
                  class='m-0 aspect-square h-auto w-full object-cover'
                />
                <p class='truncate px-1 text-center text-base font-bold'>
                  {artist.artistName}
                </p>
              </a>
            ))}
          </div>
        </>
      ) : (
        <p>There was a problem fetching top artists.</p>
      )}
      <h3>Recent Tracks</h3>
      <p>My ten(ish) most recently listened-to tracks</p>
      {topTracksResponse?.success ? (
        <>
          <div class='grid auto-rows-auto grid-cols-1 gap-4'>
            {topTracksResponse.data.map((track) => {
              return (
                <a
                  key={track.trackName}
                  href={track.trackUrls.spotify}
                  rel='noopener noreferrer'
                  target='_blank'
                  class='flex flex-row gap-2 overflow-hidden rounded-md no-underline outline outline-1'
                >
                  <img
                    src={track.trackImages[1].url}
                    alt={`${track.trackName} Artwork`}
                    class='m-0 aspect-square h-auto w-28 object-cover'
                  />
                  <div class='flex w-full flex-col justify-center'>
                    <p class='m-0 pe-2 text-base font-bold'>
                      {track.trackName}
                    </p>
                    <p class='m-0 pe-2'>
                      {track.artistsOnTrack.map((artist, index, artistsArr) => {
                        if (
                          artistsArr.length > 1 &&
                          index < artistsArr.length - 1
                        ) {
                          return `${artist.name}, `
                        } else {
                          return `${artist.name}`
                        }
                      })}
                    </p>
                  </div>
                </a>
              )
            })}
          </div>
        </>
      ) : (
        <p>There was an error fetching top tracks.</p>
      )}
    </>
  )
}

export default MySpotifyData
