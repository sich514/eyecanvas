'use client'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>

export default function ScrollToPricingBtn({ onClick, children, ...rest }: Props) {
  const scroll = (e: React.MouseEvent<HTMLButtonElement>) => {
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })
    onClick?.(e)
  }
  return (
    <button onClick={scroll} {...rest}>
      {children}
    </button>
  )
}
