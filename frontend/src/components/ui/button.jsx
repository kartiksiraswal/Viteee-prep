import React from "react"

const Button = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-gray-950";
  const variants = {
    default: "bg-gray-50 text-gray-900 hover:bg-gray-50/90",
    outline: "border border-gray-800 hover:bg-gray-800 hover:text-gray-50",
  };
  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} ref={ref} {...props} />
  )
})
Button.displayName = "Button"
export { Button }
