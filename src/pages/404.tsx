import { PageStatus } from '~/components/layout/page-status'

export default function NotFoundPage() {
	return (
		<PageStatus
			title="Page not found"
			status="Oops, page not found!"
			message="The page you're looking for doesn't seem to exist. Please check the URL or try navigating back to the homepage."
		/>
	)
}
