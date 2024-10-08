import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

// https://gist.github.com/ca0v/73a31f57b397606c9813472f7493a940
export const debounce = <F extends (...args: Parameters<F>) => ReturnType<F>>(func: F, waitFor: number) => {
	let timeout: NodeJS.Timeout

	const debounced = (...args: Parameters<F>) => {
		clearTimeout(timeout)
		timeout = setTimeout(() => func(...args), waitFor)
	}

	return debounced
}
