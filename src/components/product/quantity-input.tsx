import { MinusIcon, PlusIcon } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

interface Props extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
	value: number
	onChange: (value: number) => void
}

export const QuantityInput = ({ value, onChange, disabled }: Props) => {
	const handleIncrement = () => {
		onChange(value + 1)
	}

	const handleDecrement = () => {
		onChange(value - 1)
	}

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange(parseInt(e.target.value))
	}

	return (
		<div className="grid gap-4">
			<label className="sr-only" htmlFor={`quantity-input-${value}`}>
				Quantity
			</label>
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Button
						disabled={disabled || value <= 0}
						variant="outline"
						size="icon"
						onClick={handleDecrement}
						className="h-8 w-8"
						aria-label="Decrease quantity"
					>
						<MinusIcon className="h-4 w-4" aria-hidden="true" />
					</Button>
					<Input
						disabled={disabled}
						id={`quantity-input-${value}`}
						type="number"
						value={value}
						onChange={handleInputChange}
						className="w-16 text-center"
						min="0"
						aria-label="Quantity"
					/>
					<Button
						disabled={disabled}
						variant="outline"
						size="icon"
						onClick={handleIncrement}
						className="h-8 w-8"
						aria-label="Increase quantity"
					>
						<PlusIcon className="h-4 w-4" aria-hidden="true" />
					</Button>
				</div>
			</div>
		</div>
	)
}
