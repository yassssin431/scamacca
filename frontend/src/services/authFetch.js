import { getToken } from './auth'

export class ApiAccessError extends Error {
  constructor(message, status, data = null) {
    super(message)
    this.name = 'ApiAccessError'
    this.status = status
    this.data = data
    this.isAuthError = status === 401
    this.isForbidden = status === 403
  }
}

const parseResponseBody = async (response) => {
  const text = await response.text()

  if (!text) return null

  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

export const normalizeApiData = (data, fallback = []) => {
  if (Array.isArray(data)) return data
  if (data && typeof data === 'object' && 'data' in data) {
    return data.data ?? fallback
  }
  if (data == null) return fallback
  return data
}

export const authFetch = async (url, options = {}) => {
  const token = getToken()

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
    })

    const data = await parseResponseBody(response)

    return {
      ok: response.ok,
      status: response.status,
      data,
      json: async () => data,
    }
  } catch (error) {
    return {
      ok: false,
      status: 0,
      data: null,
      error: error.message,
      json: async () => null,
    }
  }
}

export const apiRequest = async (url, options = {}) => {
  const response = await authFetch(url, options)

  if (!response.ok) {
    throw new ApiAccessError(
      response.data?.message || response.error || 'Request failed',
      response.status,
      response.data
    )
  }

  return response.data
}

export const readData = async (url, fallback = []) => {
  const data = await apiRequest(url)
  return normalizeApiData(data, fallback)
}

export const readOptionalData = async (url, fallback = []) => {
  const response = await authFetch(url)

  if (response.ok) {
    return normalizeApiData(response.data, fallback)
  }

  if (response.status === 401 || response.status === 403) {
    return fallback
  }

  throw new ApiAccessError(
    response.data?.message || response.error || 'Request failed',
    response.status,
    response.data
  )
}
