import { Container } from './container'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { PageTitle } from './page-title'

interface PageStatusProps {
	title: string
	status: string
	message: string
	isError?: boolean
}

export const PageStatus = ({ title, status, message, isError }: PageStatusProps) => {
	const router = useRouter()
	const isRoot = router.pathname === '/'
	return (
		<Container className="mt-16 flex flex-col items-center justify-center gap-6">
			<PageTitle title={title} />
			<Image
				src="/placeholder.svg"
				alt={status}
				width="200"
				height="200"
				className="aspect-square w-full max-w-[200px] object-contain"
			/>
			<h1 className="text-2xl font-bold">{status}</h1>
			<p
				className={isError ? 'font-semibold text-red-700' : 'text-muted-foreground'}
				role={isError ? 'alert' : undefined}
			>
				{message}
			</p>
			{!isRoot && (
				<Link
					href="/"
					className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
					prefetch={false}
				>
					Back to home
				</Link>
			)}
		</Container>
	)
}
