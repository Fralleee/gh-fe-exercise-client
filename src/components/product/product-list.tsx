import { PropsWithChildren } from 'react'

export const ProductList = ({ children }: PropsWithChildren<unknown>) => (
	<ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">{children}</ul>
)
