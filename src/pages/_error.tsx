import { PageStatus } from '~/components/layout/page-status'

export default function PageError() {
	return (
		<PageStatus
			title="Page not found"
			status="Oops, something went wrong!"
			message="We're sorry, but an unexpected error has occurred. Please try again later or contact support if the issue persists."
		/>
	)
}
