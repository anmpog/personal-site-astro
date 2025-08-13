import { useState, useEffect } from 'preact/hooks'
import SpotifyLogo from '../assets/svg/SpotifyLogo'
import AlertIcon from '../assets/svg/AlertIcon'

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
          class='rounded-xs flex animate-pulse flex-col overflow-hidden border border-slate-400 bg-slate-300 no-underline md:rounded-sm'
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
            class='rounded-xs flex animate-pulse flex-row gap-2 overflow-hidden border border-slate-400 bg-slate-300 no-underline outline-1 outline-slate-400 md:rounded-sm'
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
    <div class='rounded-xs flex h-28 items-center gap-2 overflow-hidden border border-red-400 bg-red-200 p-2 align-middle md:rounded-sm'>
      <div class='aspect-square h-8 w-auto self-center text-red-500 sm:h-12'>
        <AlertIcon />
      </div>
      <p class='m-0 italic'>{message}</p>
    </div>
  )
}

const ClientErrorMessage = ({
  message = 'Something went wrong on the client...',
}) => {
  return (
    <div class='rounded-xs my-auto flex flex-row gap-4 overflow-hidden border border-red-400 bg-red-200 px-6 py-8 md:rounded-sm'>
      <div class='aspect-square h-8 w-auto self-center text-red-500 sm:h-12'>
        <AlertIcon />
      </div>
      <div>
        <h4>
          There was supposed to be some data here, but something went wrong...
        </h4>
        <p class='mt-[1em] italic'>Hint: {message}</p>
      </div>
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

  // I want respective skeletons to show immediately (because fetch wont
  // trigger until useEffect fires. I want skeletons to remain if there
  // is no (respective) error or data – indicating that fetching has not
  // completed. Successful fetch should result in either data or an error.
  // Loading state is always set to false after attempting to fetch data.
  // I think technically it doesn't matter if the spotifyDataLoading value
  // is referenced because the other two variables reliably indicate the
  // desired behavior...but I love to doubt myself and honestly I'm tired
  // of thinking about this sh!t right now so it stays. But at least I'm using
  // derived state?
  const displayTopArtistsSkeleton =
    (!topArtistsResponseData && !spotifyError.getTopArtistsError) ||
    spotifyDataLoading

  const displayRecentTracksSkeleton =
    (!recentTracksResponseData && !spotifyError.getTopArtistsError) ||
    spotifyDataLoading

  useEffect(() => {
    setSpotifyDataLoading(true)
    fetch(`/api/getSpotifyData`, {
      headers: myHeaders,
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          setClientError(data.message)
        } else {
          const { getTopArtistsResponse, getRecentTracksResponse } = data

          if (getRecentTracksResponse.success) {
            setRecentTracksResponseData(getRecentTracksResponse.data)
          } else if (!getRecentTracksResponse.success) {
            setSpotifyError((prev) => ({
              ...prev,
              getRecentTracksError: getRecentTracksResponse.message,
            }))
          }

          if (getTopArtistsResponse.success) {
            setTopArtistsResponseData(getTopArtistsResponse.data)
          } else if (!getTopArtistsResponse.success) {
            setSpotifyError((prev) => ({
              ...prev,
              getTopArtistsError: getTopArtistsResponse.message,
            }))
          }
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
        <div class='bg-heading mb-2 flex flex-col justify-end border border-slate-900 p-1 sm:p-2'>
          <h2 class='mt-[1.5em] flex items-center gap-2 text-neutral-100'>
            Top Artists
            <div class='inline-block h-6 w-6 text-neutral-100'>
              <SpotifyLogo />
            </div>
          </h2>
          <p class='my-0 text-neutral-100'>
            The six artists I've been listening to the most over the past 6
            months:
          </p>
        </div>

        {displayTopArtistsSkeleton ? <TopArtistsSkeleton /> : null}

        {topArtistsResponseData ? (
          <div class='md: grid grid-cols-2 gap-4 sm:grid-cols-3'>
            {topArtistsResponseData.map((artist) => (
              <a
                key={artist.artistName}
                href={artist.artistLinks.spotify}
                rel='noopener noreferrer'
                target='_blank'
                class='rounded-xs overflow-hidden border border-slate-900 no-underline md:rounded-sm'
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
        <div class='bg-heading mb-2 flex flex-col justify-end border border-slate-900 p-1 sm:p-2'>
          <h2 class='mt-[1.5em] flex items-center gap-2 text-neutral-100'>
            Recent Tracks
            <div class='h-6 w-6 text-neutral-100'>
              <SpotifyLogo />
            </div>
          </h2>
          <p class='my-0 text-neutral-100'>
            My ten(ish) most recently listened-to tracks:
          </p>
        </div>

        {displayRecentTracksSkeleton ? <RecentTracksSkeleton /> : null}

        {recentTracksResponseData ? (
          <div class='grid auto-rows-auto grid-cols-1 gap-4 sm:grid-cols-2'>
            {recentTracksResponseData.map((track) => {
              return (
                <a
                  key={track.trackName}
                  href={track.trackUrls.spotify}
                  rel='noopener noreferrer'
                  target='_blank'
                  class='rounded-xs flex flex-row gap-2 overflow-hidden border border-slate-900 no-underline md:rounded-sm'
                >
                  <img
                    src={track.trackImages[1].url}
                    alt={`${track.trackName} Artwork`}
                    class='m-0 aspect-square h-auto w-28 object-cover'
                  />
                  <div class='flex w-full flex-col justify-center'>
                    <p class='m-0 pe-2 text-base font-bold leading-tight sm:text-lg sm:leading-tight'>
                      {track.trackName}
                    </p>
                    <p class='m-0 pe-2 text-sm font-normal sm:text-base'>
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
