import { useState, useEffect } from 'preact/hooks'

export default function useFetch(url, method) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(null)
    const fetchData = async () => {
      try {
        const res = await fetch(url, {
          method: method,
          signal: controller.signal,
        })

        const data = await res.json()

        if (!data.success) {
          setError(data.message)
        } else if (data.success) {
          setData(data.data)
        }
      } catch (error) {
        if (error.name !== 'AbortError') setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    return () => {
      controller.abort()
    }
  }, [url, method])

  return { data, loading, error }
}
