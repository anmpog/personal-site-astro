import { useState, useEffect } from 'preact/hooks'
import SpotifyLogo from '../assets/svg/SpotifyLogo'

const myHeaders = new Headers({
  'Content-Type': 'application/json',
  Accept: 'application/json',
})

const TopArtistsSkeleton = () => {
  return (
    <div class='grid grid-cols-2 gap-4 sm:grid-cols-3'>
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          class='flex animate-pulse flex-col overflow-hidden rounded-xs bg-slate-300 no-underline outline-1 outline-slate-400 md:rounded-sm'
        >
          <div class='m-0 aspect-square h-auto w-full bg-slate-400 object-cover' />
          <div className='flex h-16 items-center justify-center'>
            <p class='h-5 w-4/5 self-center rounded-xl bg-slate-400 sm:h-7'>
              &nbsp;
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

const RecentTracksSkeleton = () => {
  return (
    <div class='grid auto-rows-auto grid-cols-1 gap-4 sm:grid-cols-2'>
      {[...Array(10)].map((_, i) => {
        return (
          <div
            key={i}
            class='background flex animate-pulse flex-row gap-2 overflow-hidden rounded-xs bg-slate-300 no-underline outline-1 outline-slate-400 md:rounded-sm'
          >
            <div class='m-0 aspect-square h-28 w-28 bg-slate-400' />
            <div class='flex w-full flex-col justify-center gap-2'>
              <span class='m-0 h-6 w-40 rounded-xl bg-slate-400 text-base sm:h-7 sm:w-32'>
                &nbsp;
              </span>
              <span class='m-0 h-5 w-44 rounded-xl bg-slate-400 text-base sm:h-6 sm:w-36'>
                &nbsp;
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

const SpotifyErrorMessage = ({ message }) => {
  return (
    <div class='flex h-28 items-center gap-2 overflow-hidden rounded-xs bg-red-200 p-2 align-middle italic outline-1 outline-red-400 md:rounded-sm'>
      <span class='iconify ion--alert-circle-outline inline-block text-3xl'></span>
      <p class='m-0'>{message}</p>
    </div>
  )
}

const ClientErrorMessage = ({ message }) => {
  return (
    <div class='my-auto flex flex-col gap-3 overflow-hidden rounded-xs bg-red-200 px-2 py-4 outline-1 outline-red-400 md:rounded-sm'>
      <h4 class='m-0 italic'>
        There was supposed to be some data here, but something went wrong. Yell
        at Anthony for breaking things.
      </h4>
      <p class='m-0'>Hint: {message}</p>
    </div>
  )
}

const MySpotifyData = () => {
  const [recentTracksResponseData, setRecentTracksResponseData] = useState(null)
  const [topArtistsResponseData, setTopArtistsResponseData] = useState(null)
  const [spotifyDataLoading, setSpotifyDataLoading] = useState(false)
  const [spotifyError, setSpotifyError] = useState({
    getRecentTracksError: null,
    getTopArtistsError: null,
  })
  const [clientError, setClientError] = useState(null)

  useEffect(() => {
    setSpotifyDataLoading(true)
    fetch(`api/getSpotifyData`, {
      headers: myHeaders,
    })
      .then((res) => res.json())
      .then((data) => {
        const { getTopArtistsResponse, getRecentTracksResponse } = data

        if (getRecentTracksResponse.success) {
          setRecentTracksResponseData(getRecentTracksResponse.data)
        } else if (!getRecentTracksResponse.success) {
          setSpotifyError({
            ...spotifyError,
            getRecentTracksError: getRecentTracksResponse.message,
          })
        }

        if (getTopArtistsResponse.success) {
          setTopArtistsResponseData(getTopArtistsResponse.data)
        } else if (!getTopArtistsResponse.success) {
          setSpotifyError({
            ...spotifyError,
            getTopArtistsError: getTopArtistsResponse.message,
          })
        }
      })
      .catch((error) => {
        console.error(error.message)
        setClientError('Client Error')
      })
      .finally(() => {
        setSpotifyDataLoading(false)
      })
  }, [])

  if (clientError) {
    return <ClientErrorMessage message={clientError} />
  }

  return (
    <div class='flex flex-col gap-6'>
      <div>
        <div class='mb-2 flex flex-col justify-end bg-(--color-heading) p-1 outline-1 outline-slate-900 sm:p-2'>
          <h3 class='mt-[1.5em] flex items-center gap-2 text-neutral-100'>
            Top Artists
            <div class='inline-block h-6 w-6 text-neutral-100'>
              <SpotifyLogo />
            </div>
          </h3>
          <p class='my-0 text-neutral-100'>
            The six artists I've been listening to the most over the past 6
            months:
          </p>
        </div>

        {(!topArtistsResponseData && !spotifyError.getTopArtistsError) ||
        spotifyDataLoading ? (
          <TopArtistsSkeleton />
        ) : null}

        {topArtistsResponseData ? (
          <div class='md: grid grid-cols-2 gap-4 sm:grid-cols-3'>
            {topArtistsResponseData.map((artist) => (
              <a
                key={artist.artistName}
                href={artist.artistLinks.spotify}
                rel='noopener noreferrer'
                target='_blank'
                class='overflow-hidden rounded-xs no-underline outline-1 outline-slate-900 md:rounded-sm'
              >
                <img
                  src={artist.artistImages[1].url}
                  alt={`${artist.artistName} Artwork`}
                  class='m-0 aspect-square h-auto w-full object-cover'
                />
                <div className='flex h-16 items-center justify-center'>
                  <p class='truncate px-1 text-center text-sm font-bold sm:text-lg'>
                    {artist.artistName}
                  </p>
                </div>
              </a>
            ))}
          </div>
        ) : null}

        {spotifyError?.getTopArtistsError ? (
          <SpotifyErrorMessage message={spotifyError.getTopArtistsError} />
        ) : null}
      </div>

      <div>
        <div class='mb-2 flex flex-col justify-end bg-(--color-heading) p-1 outline-1 outline-slate-900 sm:p-2'>
          <h3 class='mt-[1.5em] flex items-center gap-2 text-neutral-100'>
            Recent Tracks
            <div class='h-6 w-6 text-neutral-100'>
              <SpotifyLogo />
            </div>
          </h3>
          <p class='my-0 text-neutral-100'>
            My ten(ish) most recently listened-to tracks:
          </p>
        </div>

        {(!recentTracksResponseData && !spotifyError.getRecentTracksError) ||
        spotifyDataLoading ? (
          <RecentTracksSkeleton />
        ) : null}

        {recentTracksResponseData ? (
          <div class='grid auto-rows-auto grid-cols-1 gap-4 sm:grid-cols-2'>
            {recentTracksResponseData.map((track) => {
              return (
                <a
                  key={track.trackName}
                  href={track.trackUrls.spotify}
                  rel='noopener noreferrer'
                  target='_blank'
                  class='flex flex-row gap-2 overflow-hidden rounded-xs no-underline outline-1 outline-slate-900 md:rounded-sm'
                >
                  <img
                    src={track.trackImages[1].url}
                    alt={`${track.trackName} Artwork`}
                    class='m-0 aspect-square h-auto w-28 object-cover'
                  />
                  <div class='flex w-full flex-col justify-center'>
                    <p class='m-0 pe-2 text-base font-bold sm:text-lg'>
                      {track.trackName}
                    </p>
                    <p class='m-0 pe-2 text-sm sm:text-base'>
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
        ) : null}

        {spotifyError?.getRecentTracksError ? (
          <SpotifyErrorMessage message={spotifyError.getRecentTracksError} />
        ) : null}
      </div>
    </div>
  )
}

export default MySpotifyData
