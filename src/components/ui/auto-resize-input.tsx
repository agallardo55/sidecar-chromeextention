import * as React from "react"
import { cn } from "@/lib/utils"

interface AutoResizeInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  minRows?: number
  maxRows?: number
}

const AutoResizeInput = React.forwardRef<HTMLTextAreaElement, AutoResizeInputProps>(
  ({ className, minRows = 1, maxRows = 6, onChange, ...props }, ref) => {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null)
    
    const resizeTextarea = React.useCallback(() => {
      const textarea = textareaRef.current
      if (!textarea) return
      
      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = 'auto'
      
      // Calculate the new height based on content
      const lineHeight = parseInt(getComputedStyle(textarea).lineHeight) || 20
      const minHeight = lineHeight * minRows
      const maxHeight = lineHeight * maxRows
      const scrollHeight = textarea.scrollHeight
      
      // Set the new height within bounds
      const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight)
      textarea.style.height = `${newHeight}px`
    }, [minRows, maxRows])
    
    // Resize on mount and when value changes
    React.useEffect(() => {
      resizeTextarea()
    }, [resizeTextarea, props.value])
    
    // Handle window resize
    React.useEffect(() => {
      window.addEventListener('resize', resizeTextarea)
      return () => window.removeEventListener('resize', resizeTextarea)
    }, [resizeTextarea])
    
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      resizeTextarea()
      onChange?.(e)
    }
    
    return (
      <textarea
        ref={(node) => {
          // Handle both refs
          if (typeof ref === 'function') {
            ref(node)
          } else if (ref) {
            ref.current = node
          }
          textareaRef.current = node
        }}
        className={cn(
          "flex w-full rounded-xl border border-input bg-background px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:border-ring transition-all duration-200 resize-none overflow-hidden leading-6",
          className
        )}
        rows={minRows}
        onChange={handleChange}
        {...props}
      />
    )
  }
)
AutoResizeInput.displayName = "AutoResizeInput"

export { AutoResizeInput }
