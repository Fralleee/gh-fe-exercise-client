import Head from 'next/head'

const BASE_TITLE = 'GH Super Shop'

export const PageTitle = ({ title }: { title: string }) => {
	const headTitle = `${title} | ${BASE_TITLE}`
	return (
		<Head>
			<title>{headTitle}</title>
		</Head>
	)
}
