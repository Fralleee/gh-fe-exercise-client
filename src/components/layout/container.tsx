import { PropsWithChildren } from 'react'
import { cn } from '~/lib/utils'

interface Props {
	className?: string
}

export const Container = ({ children, className }: PropsWithChildren<Props>) => (
	<main className={cn('mx-auto max-w-sm px-2 py-12 sm:container sm:px-6', className)}>{children}</main>
)
