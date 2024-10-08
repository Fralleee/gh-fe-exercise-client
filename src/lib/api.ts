export class ClientError extends Error {
	name = 'ClientError'
}

const DEFAULT_RETRIES = 5

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const fetchWithRetry = async <T>(
	url: string,
	fetchOptions: RequestInit = {},
	retries = DEFAULT_RETRIES,
	delay = 1000,
): Promise<T> => {
	const { signal, ...restOptions } = fetchOptions

	try {
		const response = await fetch(url, { ...restOptions, signal })

		if (response.ok) {
			return response.json()
		}

		if ([401, 403, 404].includes(response.status)) {
			throw new ClientError(response.statusText)
		}

		throw new Error(response.statusText)
	} catch (error) {
		if (error instanceof Error && error.name === 'AbortError') throw error
		if (error instanceof ClientError || retries <= 1) throw error

		await wait(delay)
		return fetchWithRetry(url, fetchOptions, retries - 1, delay)
	}
}
