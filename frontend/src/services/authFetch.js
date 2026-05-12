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

// Some backend errors return JSON and some framework/network errors can return
// plain text. This parser keeps callers from crashing on non-JSON responses.
const parseResponseBody = async (response) => {
  const text = await response.text()

  if (!text) return null

  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

// Backend list responses are not always shaped the same way. This normalizes
// raw arrays and { data: [...] } envelopes into one predictable value.
export const normalizeApiData = (data, fallback = []) => {
  if (Array.isArray(data)) return data
  if (data && typeof data === 'object' && 'data' in data) {
    return data.data ?? fallback
  }
  if (data == null) return fallback
  return data
}

// Central fetch wrapper: always attaches the JWT and returns a safe object
// instead of throwing on network failure. Mutating calls use apiRequest below.
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

// Strict request helper for create/update/delete actions. It throws typed
// errors so pages can show clean toast messages.
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

// Optional reads are used for role-dependent sections. A 401/403 becomes the
// fallback value, letting the page continue with partial data instead of blanking.
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
