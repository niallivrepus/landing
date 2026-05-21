import * as React from "react"

import { cn } from "../../lib/utils"

interface NumbersProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * The starting number (inclusive)
     * @default 0
     */
    start?: number
    /**
     * The ending number (inclusive)
     * @default 9
     */
    end?: number
    /**
     * Optional highlighted/selected number
     */
    selected?: number
}

const NUMBERS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const

const Numbers = React.forwardRef<HTMLDivElement, NumbersProps>(
    ({ className, start = 0, end = 9, selected, ...props }, ref) => {
        const visibleNumbers = NUMBERS.filter((n) => n >= start && n <= end)

        return (
            <div
                ref={ref}
                className={cn("flex flex-col gap-1 font-mono text-2xl text-light-space", className)}
                data-slot="numbers"
                {...props}
            >
                {visibleNumbers.map((num) => (
                    <span
                        key={num}
                        className={cn(
                            "leading-none tabular-nums",
                            selected === num && "text-light-space",
                            selected !== undefined && selected !== num && "text-smoke-3"
                        )}
                    >
                        {num}
                    </span>
                ))}
            </div>
        )
    }
)

Numbers.displayName = "Numbers"

export { Numbers, type NumbersProps }
