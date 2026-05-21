import { useState, useRef } from "react"
import { motion } from "motion/react"
import { cn } from "../../lib/utils"

export type SwatchColor = "purple" | "blue" | "green" | "yellow" | "orange" | "red"

interface ColorSwatchProps {
    value?: SwatchColor
    onChange?: (color: SwatchColor) => void
    disabled?: boolean
    className?: string
    defaultValue?: SwatchColor
}

const COLORS: { id: SwatchColor; cssVar: string }[] = [
    { id: "purple", cssVar: "var(--color-purple-4)" },
    { id: "blue", cssVar: "var(--color-blue-4)" },
    { id: "green", cssVar: "var(--color-green-4)" },
    { id: "yellow", cssVar: "var(--color-yellow-4)" },
    { id: "orange", cssVar: "var(--color-orange-4)" },
    { id: "red", cssVar: "var(--color-red-4)" },
]

// Size of each color dot (8px) + gap (8px) = 16px per color
const COLOR_STEP = 16

export function ColorSwatch({
    value: controlledValue,
    onChange,
    disabled,
    className,
    defaultValue = "purple",
}: ColorSwatchProps) {
    const [internalValue, setInternalValue] = useState<SwatchColor>(defaultValue)
    const isControlled = controlledValue !== undefined
    const value = isControlled ? controlledValue : internalValue

    const [isDragging, setIsDragging] = useState(false)
    const isPointerDown = useRef(false)
    const dragStartX = useRef(0)
    const dragStartIndex = useRef(0)
    const containerRef = useRef<HTMLDivElement>(null)

    const currentIndex = COLORS.findIndex(c => c.id === value)

    const handleColorClick = (color: SwatchColor) => {
        if (disabled) return
        if (!isControlled) {
            setInternalValue(color)
        }
        onChange?.(color)
    }

    const updateColor = (newIndex: number) => {
        const clampedIndex = Math.max(0, Math.min(COLORS.length - 1, newIndex))
        const newColor = COLORS[clampedIndex].id
        if (!isControlled) {
            setInternalValue(newColor)
        }
        onChange?.(newColor)
    }

    const handlePointerDown = (e: React.PointerEvent) => {
        if (disabled) return
        // Only capture on container, not on buttons
        if ((e.target as HTMLElement).tagName === 'BUTTON') return

        isPointerDown.current = true
        dragStartX.current = e.clientX
        dragStartIndex.current = currentIndex
        ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    }

    const handlePointerMove = (e: React.PointerEvent) => {
        // Only process if pointer is down (click-drag, not hover)
        if (!isPointerDown.current || disabled) return

        const dragDistance = Math.abs(e.clientX - dragStartX.current)

        // Only start dragging if moved more than 5px (threshold to distinguish from click)
        if (dragDistance > 5) {
            if (!isDragging) {
                setIsDragging(true)
            }

            const signedDistance = e.clientX - dragStartX.current
            const colorsMoved = Math.round(signedDistance / COLOR_STEP)
            const newIndex = dragStartIndex.current + colorsMoved

            if (newIndex !== currentIndex) {
                updateColor(newIndex)
            }
        }
    }

    const handlePointerUp = (e: React.PointerEvent) => {
        isPointerDown.current = false
        if (isDragging) {
            setIsDragging(false)
        }
        try {
            ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
        } catch (err) {
            // Ignore if pointer capture wasn't set
        }
    }

    return (
        <div
            ref={containerRef}
            className={cn(
                "relative w-fit flex items-center gap-2 py-2.5 px-2 rounded-full",
                "bg-dark-glass-80 border-2 border-light-glass-20",
                "shadow-[inset_0px_1px_1px_0px_rgba(255,255,255,0.15)]",
                disabled && "opacity-50 pointer-events-none",
                isDragging && "cursor-grabbing",
                !isDragging && "cursor-grab",
                className
            )}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
        >
            {COLORS.map((color) => (
                <div key={color.id} className="relative size-2 shrink-0">
                    {value === color.id && (
                        <motion.div
                            className="absolute -inset-[3px] rounded-full border-[1.5px] border-[var(--color-light-space)] z-50"
                            layoutId="selection-ring"
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 30,
                            }}
                        />
                    )}
                    <button
                        type="button"
                        onClick={() => handleColorClick(color.id)}
                        disabled={disabled}
                        className="absolute inset-0 rounded-full shadow-[inset_0px_2px_2px_0px_var(--color-light-glass-20)] focus-visible:outline-none"
                        style={{ backgroundColor: color.cssVar }}
                        aria-label={`Select ${color.id}`}
                    />
                </div>
            ))}
        </div>
    )
}
