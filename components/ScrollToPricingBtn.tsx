'use client'

interface Props {
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
}

export default function ScrollToPricingBtn({ className, style, children }: Props) {
  const scroll = () => {
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })
  }
  return (
    <button onClick={scroll} className={className} style={style}>
      {children}
    </button>
  )
}
