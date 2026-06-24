import Link from 'next/link'
import Image from 'next/image'
import FadeUp from '@/components/FadeUp'
import BeforeAfterSlider from '@/components/BeforeAfterSlider'
import AccordionItem from '@/components/AccordionItem'
import InlineOrderFlow from '@/components/InlineOrderFlow'
import PageTracker from '@/components/PageTracker'
import ScrollToPricingBtn from '@/components/ScrollToPricingBtn'
import PhotoLightbox from '@/components/PhotoLightbox'

const OCCASIONS = ["Valentine's Day", "New Baby", "Wedding Gift", "Anniversary", "Mother's Day", "Just Because", "Birthday", "Graduation"]

const FAQS = [
  {
    q: "What kind of photo do I need to send?",
    a: "A close-up of your eye in good natural light — even a smartphone photo works perfectly. Hold your phone about 6 inches from your eye, make sure the iris is sharp and in focus. We'll show you exactly how after you choose your size. If your photo isn't usable for any reason, we'll ask you to retake it before charging anything.",
  },
  {
    q: "How long does it take?",
    a: "AI enhancement happens within minutes of your order. Once you approve your preview (usually the same day), we send it straight to print. Your canvas arrives in 5–7 business days, gift-boxed and ready to hang.",
  },
  {
    q: "What if I don't like how it looks?",
    a: "Every order includes a free revision before we print a single thing. You see the AI-enhanced preview first and can request changes — colour, contrast, crop — before you approve. We don't touch the press until you say go.",
  },
  {
    q: "Do you ship across the US?",
    a: "Yes — free tracked shipping to all 50 states. Arrives 5–7 business days after you approve your preview.",
  },
  {
    q: "Can I send it as a gift to a different address?",
    a: "Absolutely. Enter the recipient's address at checkout. We ship directly to them with no pricing info in the package.",
  },
  {
    q: "What is the Stardust effect?",
    a: "Stardust adds AI-generated golden light particles around your iris — like your eye is at the center of a galaxy. Our most popular upgrade at +$30.",
  },
]

const TESTIMONIALS = [
  {
    quote: "I gave this to my wife for our anniversary. She cried. It's unlike anything I've ever seen on a wall.",
    name: "James T.",
    location: "Austin, TX",
  },
  {
    quote: "The detail the AI pulled out of my photo is genuinely shocking. I had no idea my eye looked like that.",
    name: "Sarah M.",
    location: "Brooklyn, NY",
  },
  {
    quote: "Ordered the 24×24 for my studio. Every single person who walks in asks about it first.",
    name: "Marcus L.",
    location: "Los Angeles, CA",
  },
  {
    quote: "Really straightforward process. Uploaded the photo, got the preview the same day, approved it, and it arrived well packed. Happy with how it turned out.",
    name: "Daniel K.",
    location: "Chicago, IL",
  },
  {
    quote: "Got the duo print for my parents. They put it in the living room and it genuinely looks like something from a gallery.",
    name: "Tom R.",
    location: "London, UK",
  },
  {
    quote: "I was a little unsure at first but the preview before printing made it easy. Exactly what I wanted.",
    name: "Elena V.",
    location: "Toronto, CA",
  },
]

const TRUST_ITEMS = [
  { icon: '🔒', label: 'Secure checkout' },
  { icon: '🎨', label: 'Free AI enhancement' },
  { icon: '✏️', label: 'Free revision before printing' },
  { icon: '🚚', label: 'Free US shipping' },
  { icon: '⭐', label: '5-star rated' },
]

export default function LandingPage() {
  return (
    <div className="bg-[#0a0a0a] text-white overflow-x-hidden">
      <PageTracker />

      {/* ── NAV ─────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-5"
        style={{ background: 'linear-gradient(to bottom, rgba(10,10,10,0.95) 0%, transparent 100%)' }}
      >
        <span className="font-serif text-xl font-bold tracking-tight">
          Eye<span style={{ color: '#C8883A' }}>Canvas</span>
        </span>
        <div className="flex items-center gap-6">
          <a href="#how-it-works" className="hidden md:block text-sm text-white/60 hover:text-white transition-colors">How it works</a>
          <ScrollToPricingBtn className="hidden md:block text-sm text-white/60 hover:text-white transition-colors" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Pricing</ScrollToPricingBtn>
          <ScrollToPricingBtn
            className="px-5 py-2.5 rounded-full text-sm font-semibold text-[#0a0a0a] transition-all hover:brightness-110"
            style={{ background: '#C8883A', border: 'none', cursor: 'pointer' }}
          >
            Get started
          </ScrollToPricingBtn>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative w-full h-screen min-h-[600px] flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/iris-hero.jpg"
            alt="Eye iris"
            fill
            priority
            className="object-cover"
            style={{ objectPosition: 'center' }}
          />
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.48)' }} />
          <div className="absolute inset-0" style={{
            background: 'radial-gradient(ellipse 70% 70% at 50% 50%, transparent 20%, rgba(0,0,0,0.55) 80%, rgba(0,0,0,0.88) 100%)'
          }} />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] mb-6 tracking-tight">
            Your eye is<br />
            <span style={{ color: '#C8883A' }}>a universe.</span>
          </h1>
          {/* 17 — updated subtext */}
          <p className="text-lg md:text-xl text-white/75 mb-10 font-light tracking-wide max-w-xl mx-auto">
            We reveal details invisible to the naked eye — then print them at gallery scale.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            {/* 1 — from $99 */}
            <ScrollToPricingBtn
              className="w-full sm:w-auto px-8 py-4 rounded-full font-semibold text-base text-[#0a0a0a] shadow-lg transition-all hover:brightness-110 hover:scale-[1.02]"
              style={{ background: '#C8883A', boxShadow: '0 0 40px rgba(200,136,58,0.4)', border: 'none', cursor: 'pointer' }}
            >
              Create Mine — from $99
            </ScrollToPricingBtn>
            <ScrollToPricingBtn
              className="w-full sm:w-auto px-8 py-4 rounded-full font-semibold text-base text-white border border-white/40 backdrop-blur-sm hover:bg-white/10 transition-all"
              style={{ background: 'none', cursor: 'pointer' }}
            >
              Give as a Gift
            </ScrollToPricingBtn>
          </div>

          {/* 2 — social proof text updated */}
          <div className="flex items-center justify-center gap-2 text-sm text-white/60">
            <span style={{ color: '#C8883A' }}>★★★★★</span>
            <span>Loved by customers across the US</span>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
            <rect x="6" y="1" width="4" height="8" rx="2" fill="currentColor" opacity="0.4"/>
            <path d="M8 16 L4 20 L8 24 L12 20 Z" fill="currentColor" opacity="0.4"/>
          </svg>
        </div>
      </section>

      {/* 11 — TRUST BAR */}
      <div style={{ background: '#111', borderTop: '1px solid #1a1a1a', borderBottom: '1px solid #1a1a1a', padding: '14px 24px' }}>
        <div className="max-w-5xl mx-auto" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          {TRUST_ITEMS.map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0 }}>
              <span style={{ color: '#C8883A', fontSize: 14 }}>{item.icon}</span>
              <span style={{ fontSize: 13, color: '#888' }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── EMOTIONAL HOOK ───────────────────────────────── */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
            <FadeUp>
              <div className="relative">
                <div className="grid grid-cols-2 gap-4 items-end">
                  <div className="relative rounded-2xl overflow-hidden aspect-square border border-white/10">
                    <Image
                      src="/iris-blur.png"
                      alt="Original phone photo"
                      fill
                      loading="lazy"
                      className="object-cover"
                      style={{ filter: 'blur(3px) brightness(0.5) saturate(0.3)' }}
                    />
                    <div className="absolute inset-0 flex items-end p-3">
                      <span className="text-xs font-semibold text-white/50 bg-black/50 px-2 py-1 rounded-full tracking-wider">YOUR PHOTO</span>
                    </div>
                  </div>
                  <div className="relative rounded-2xl overflow-hidden aspect-square border-4 border-white/10 scale-110"
                    style={{ boxShadow: '0 30px 80px rgba(200,136,58,0.2), 0 4px 20px rgba(0,0,0,0.8)' }}>
                    <Image
                      src="/iris-hero.jpg"
                      alt="Canvas print result"
                      fill
                      loading="lazy"
                      className="object-cover"
                      style={{ filter: 'brightness(1.1) saturate(1.5) contrast(1.1)' }}
                    />
                    <div className="absolute inset-0" style={{ boxShadow: 'inset 0 0 30px rgba(0,0,0,0.4)' }} />
                    <div className="absolute inset-0 flex items-end p-3">
                      <span className="text-xs font-semibold px-2 py-1 rounded-full tracking-wider" style={{ background: 'rgba(200,136,58,0.85)', color: '#fff' }}>YOUR CANVAS</span>
                    </div>
                  </div>
                </div>
              </div>
            </FadeUp>

            <FadeUp delay={0.15}>
              <div>
                <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 leading-tight">
                  From your phone.<br />
                  <span style={{ color: '#C8883A' }}>To their wall.</span>
                </h2>
                <p className="text-white/60 text-lg leading-relaxed mb-6">
                  Every iris is as unique as a fingerprint. We use AI to reveal details invisible to the naked eye — intricate fibers, hidden colour shifts, the exact geometry that makes your eye yours.
                </p>
                <p className="text-white/60 text-lg leading-relaxed mb-10">
                  Then we print them at gallery scale.
                </p>
                {/* 18 — amber text button with underline on hover */}
                <ScrollToPricingBtn
                  className="hover:underline"
                  style={{
                    color: '#C8883A', background: 'none', border: 'none', cursor: 'pointer',
                    padding: 0, fontSize: 15, fontWeight: 600,
                  }}
                >
                  See what yours looks like →
                </ScrollToPricingBtn>
              </div>
            </FadeUp>
          </div>

          {/* 13 — Photo gallery with lightbox */}
          <FadeUp delay={0.1}>
            <PhotoLightbox />
          </FadeUp>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────── */}
      <section id="how-it-works" className="py-24 md:py-32 px-6" style={{ background: '#0f0f0f' }}>
        <div className="max-w-6xl mx-auto">
          <FadeUp>
            <div className="text-center mb-20">
              <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: '#C8883A' }}>The process</p>
              <h2 className="font-serif text-4xl md:text-5xl font-bold">Three steps.<br/>One masterpiece.</h2>
            </div>
          </FadeUp>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12 mb-24">
            {[
              {
                n: '01',
                title: 'Snap a close-up',
                desc: "Any smartphone works. Tap your eye to focus, hold still for 2 seconds. That's it — we handle everything else.",
                extra: null,
              },
              {
                n: '02',
                title: 'We enhance with AI',
                desc: 'Our model upscales your photo 4× and reveals microscopic detail — hidden fibers, colour gradients, depth — that prints stunningly at 24 inches.',
                extra: null,
              },
              {
                n: '03',
                title: 'Arrives gift-ready',
                desc: 'Gallery-wrapped canvas on a solid frame, packed in a luxury box with a hanging kit. Ships in 5–7 days. Free.',
                extra: 'Every order includes a hanging kit. Ready to give.',
              },
            ].map((step, i) => (
              <FadeUp key={step.n} delay={i * 0.12}>
                <div className="relative p-8 rounded-2xl border border-white/8 hover:border-[#C8883A]/30 transition-colors"
                  style={{ background: '#121212' }}>
                  <div className="font-serif text-6xl font-bold mb-6 leading-none" style={{ color: 'rgba(200,136,58,0.18)' }}>
                    {step.n}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{step.desc}</p>
                  {/* 19 — extra line for step 03 */}
                  {step.extra && <p className="text-white/40 text-sm mt-3 italic">{step.extra}</p>}
                </div>
              </FadeUp>
            ))}
          </div>

          {/* Before/after slider */}
          <FadeUp>
            <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
              <div className="w-full md:w-1/2 flex justify-center">
                <BeforeAfterSlider />
              </div>
              <div className="w-full md:w-1/2">
                <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: '#C8883A' }}>AI Enhancement</p>
                <h3 className="font-serif text-3xl md:text-4xl font-bold mb-6 leading-tight">
                  Drag to see what the AI reveals.
                </h3>
                <p className="text-white/55 leading-relaxed mb-4">
                  Real-ESRGAN upscales your photo to 4× its original resolution — then sharpens every fiber, every colour shift, every microscopic detail.
                </p>
                <p className="text-white/55 leading-relaxed mb-8">
                  The result is a file so sharp it prints perfectly at 24 inches. Museum quality. From your phone.
                </p>
                {/* 12 — CTA below slider */}
                <ScrollToPricingBtn
                  className="w-full md:w-auto px-8 py-4 rounded-full font-bold text-base text-[#0a0a0a] transition-all hover:brightness-110"
                  style={{ background: '#C8883A', border: 'none', cursor: 'pointer', display: 'block', textAlign: 'center' }}
                >
                  See what MY eye looks like →
                </ScrollToPricingBtn>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── CONFIGURATOR ─────────────────────────────────── */}
      <section id="pricing" className="py-24 md:py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <FadeUp>
            <div className="text-center mb-16">
              <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: '#C8883A' }}>Build yours</p>
              <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">Choose your canvas</h2>
              {/* 20 — emotional subtext */}
              <p className="text-white/50">Every canvas is unique. Yours will never exist again.</p>
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <InlineOrderFlow />
          </FadeUp>
        </div>
      </section>

      {/* ── OCCASIONS ────────────────────────────────────── */}
      <section className="py-16 overflow-hidden" style={{ background: '#0f0f0f' }}>
        <div className="max-w-5xl mx-auto px-6">
          <FadeUp>
            <p className="text-center text-white/40 text-sm font-medium mb-8 tracking-wide uppercase text-xs">Perfect for</p>
          </FadeUp>
          <div className="flex flex-wrap justify-center gap-3">
            {OCCASIONS.map((o, i) => (
              <FadeUp key={o} delay={i * 0.05}>
                {/* 6 — occasions hover with amber */}
                <ScrollToPricingBtn
                  className="px-5 py-2.5 rounded-full border text-sm transition-all border-white/10 text-white/60 bg-white/[0.03] hover:border-[#C8883A] hover:text-[#C8883A]"
                  style={{ cursor: 'pointer' }}
                >
                  {o}
                </ScrollToPricingBtn>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF ─────────────────────────────────── */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <FadeUp>
            <div className="text-center mb-16">
              <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: '#C8883A' }}>Stories</p>
              <h2 className="font-serif text-4xl md:text-5xl font-bold">People who took the leap.</h2>
            </div>
          </FadeUp>

          <div className="grid md:grid-cols-3 gap-6 items-stretch">
            {TESTIMONIALS.map((t, i) => {
              const photos = ['/feedback-1.png', '/feedback-2.png', '/feedback-3.jpg', '/feedback-4.jpeg', '/feedback-6.jpeg', '/feedback-5.png']
              const hasPhoto = i < photos.length
              // 4 — Elena V. (index 5) gets gradient + iris SVG
              const isElena = i === 5

              return (
                <FadeUp key={t.name} delay={i * 0.1} className="flex">
                  <div className="flex flex-col rounded-2xl overflow-hidden border border-white/8 group w-full"
                    style={{ background: isElena ? 'linear-gradient(135deg, #1c0e00 0%, #0d0d0d 100%)' : '#111' }}>
                    {hasPhoto && !isElena && (
                      <div className="relative shrink-0" style={{ height: 220 }}>
                        <Image src={photos[i]} alt="Canvas on wall" fill loading="lazy" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(17,17,17,1) 0%, rgba(17,17,17,0.3) 60%, transparent 100%)' }} />
                      </div>
                    )}
                    {isElena && (
                      <div className="relative shrink-0 flex items-center justify-center" style={{ height: 220 }}>
                        <svg width="60" height="60" viewBox="0 0 60 60" fill="none" opacity="0.25">
                          <circle cx="30" cy="30" r="28" stroke="#C8883A" strokeWidth="1.5"/>
                          <circle cx="30" cy="30" r="20" stroke="#C8883A" strokeWidth="1"/>
                          {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg, di) => {
                            const r = deg * Math.PI / 180
                            return <line key={di} x1={30+9*Math.cos(r)} y1={30+9*Math.sin(r)} x2={30+20*Math.cos(r)} y2={30+20*Math.sin(r)} stroke="#C8883A" strokeWidth="0.8"/>
                          })}
                          <circle cx="30" cy="30" r="7" fill="#1a0f00" stroke="#C8883A" strokeWidth="1"/>
                          <circle cx="33" cy="27" r="2" fill="#fff" opacity="0.4"/>
                        </svg>
                      </div>
                    )}
                    <div className="flex flex-col justify-between p-6 pt-4 grow" style={{ paddingTop: (hasPhoto || isElena) ? 16 : 24 }}>
                      <p className="text-white/80 text-sm leading-relaxed italic mb-4">"{t.quote}"</p>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 shrink-0">
                          <Image src="/iris.svg" alt="" width={32} height={32} loading="lazy" className="object-cover" style={{ filter: 'brightness(0.8)' }} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{t.name}</p>
                          <p className="text-xs text-white/40">{t.location}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </FadeUp>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────── */}
      <section className="py-24 md:py-32 px-6" style={{ background: '#0f0f0f' }}>
        <div className="max-w-2xl mx-auto">
          <FadeUp>
            <div className="text-center mb-14">
              <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: '#C8883A' }}>FAQ</p>
              <h2 className="font-serif text-4xl font-bold">Good questions.</h2>
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <div>
              {FAQS.map(faq => (
                <AccordionItem key={faq.q} q={faq.q} a={faq.a} />
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── FOOTER CTA ───────────────────────────────────── */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/iris.svg" alt="" fill loading="lazy" className="object-cover opacity-20" style={{ filter: 'blur(2px) saturate(0.8)' }} />
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(10,10,10,0.4) 0%, rgba(10,10,10,0.92) 100%)' }} />
        </div>

        <FadeUp>
          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <h2 className="font-serif text-5xl md:text-6xl font-bold mb-4 leading-tight">
              Every eye<br />tells a story.
            </h2>
            <p className="text-white/55 text-lg mb-10">
              What does yours look like at 24 inches?
            </p>
            <ScrollToPricingBtn
              className="inline-block px-10 py-5 rounded-full font-bold text-lg text-[#0a0a0a] transition-all hover:brightness-110 hover:scale-105"
              style={{ background: '#C8883A', boxShadow: '0 0 60px rgba(200,136,58,0.35)', border: 'none', cursor: 'pointer' }}
            >
              Start My Portrait
            </ScrollToPricingBtn>
            <p className="mt-6 text-white/30 text-sm">Ships in 5–7 business days · Free revision included</p>
          </div>
        </FadeUp>
      </section>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer className="border-t border-white/8 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="font-serif text-lg font-bold">Eye<span style={{ color: '#C8883A' }}>Canvas</span></span>
          <div className="flex flex-col items-center gap-3">
            <p className="text-white/30 text-sm">© {new Date().getFullYear()} EyeCanvas. All rights reserved.</p>
            {/* Payment methods */}
            <div className="flex items-center gap-3">
              <span className="text-white/20 text-xs uppercase tracking-wider">Secure payment via</span>
              {/* Stripe wordmark */}
              <svg width="44" height="18" viewBox="0 0 44 18" fill="none" style={{ opacity: 0.45 }}>
                <path d="M5.27 6.77C5.27 5.96 5.94 5.63 7.04 5.63c1.56 0 3.53.47 5.09 1.31V2.21C10.57 1.48 9.02 1.2 7.04 1.2 2.82 1.2 0 3.33 0 7.01c0 5.8 8 4.87 8 7.38 0 .97-.85 1.28-2 1.28-1.74 0-3.97-.72-5.73-1.68v4.78c1.95.85 3.93 1.21 5.73 1.21 4.34 0 7.33-2.07 7.33-5.8-.02-6.25-8.06-5.14-8.06-7.41zM21.5 1.57l-3.06.65-.01 10.04c0 1.85 1.39 3.22 3.25 3.22 1.03 0 1.78-.19 2.2-.42v-3.68c-.4.16-2.37.73-2.37-1.1V6.1h2.37V2.27h-2.37l-.01-.7zM26.57 3.4v11.88h4.08V2.44l-4.08.96zM30.65.76c0-1.14-.89-2-2.06-2s-2.04.86-2.04 2c0 1.13.87 2 2.04 2s2.06-.87 2.06-2zM37.43 6.3c-1.17 0-1.92.55-2.34 1.34l-.16-1.13h-3.62v12.77l4.05-.86.01-3.1c.43.31 1.07.75 2.12.75 2.15 0 4.11-1.68 4.11-5.42C41.6 7.95 39.62 6.3 37.43 6.3zm-.72 8.16c-.7 0-1.13-.25-1.41-.56l-.02-4.37c.31-.35.74-.58 1.43-.58 1.09 0 1.85 1.22 1.85 2.75 0 1.56-.74 2.76-1.85 2.76z" fill="white"/>
              </svg>
              {/* Divider */}
              <span style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.12)' }} />
              {/* Apple Pay mark */}
              <svg width="40" height="18" viewBox="0 0 40 18" fill="none" style={{ opacity: 0.45 }}>
                <path d="M7.3 2.3c-.5.6-1.3 1.1-2.1 1-.1-.8.3-1.7.8-2.2C6.5.5 7.4 0 8.1 0c.1.8-.2 1.7-.8 2.3zm.8 1.2c-1.2-.1-2.2.7-2.8.7-.6 0-1.5-.6-2.4-.6C1.7 3.7.4 4.7 0 6.2c-1 2.9.7 7.1 1.7 9.5.5 1.2 1.1 2.4 2 2.3.8 0 1.1-.5 2.1-.5 1 0 1.3.5 2.1.5.9 0 1.5-1.2 2-2.3.5-1.1.8-2.1.8-2.2-.1 0-1.7-.6-1.7-2.5 0-1.6 1.3-2.4 1.4-2.5-.8-1.1-2-1.3-2.3-1.3zm7.4-1.6v14.3h2.3V12h3.2c2.9 0 4.9-2 4.9-4.9 0-3-1.9-4.9-4.7-4.9h-5.7zm2.3 1.9h2.6c2 0 3.1 1.1 3.1 2.9 0 1.9-1.1 2.9-3.1 2.9h-2.6V3.8zM30 9.6c-1 0-1.8.5-2.2 1.4l-.1-.1V9.7h-2.1v8.5h2.2V14c0-1.5.6-2.4 1.8-2.4.4 0 .7.1.9.2l.4-2.1c-.3-.1-.6-.1-.9-.1zm3.4 8.8c1.1 0 2-.5 2.5-1.3l.1 1.1h2v-5.7c0-2-1.3-3.1-3.4-3.1-1.8 0-3.1.9-3.3 2.4l2.1.2c.1-.6.6-1 1.2-1 .8 0 1.2.4 1.2 1.1v.4l-1.8.1c-1.9.1-2.9.9-2.9 2.4 0 1.5 1 2.4 2.3 2.4zm.6-1.7c-.7 0-1.2-.4-1.2-.9 0-.7.5-1 1.5-1.1l1.4-.1v.4c0 1-.8 1.7-1.7 1.7z" fill="white"/>
              </svg>
              {/* Visa */}
              <svg width="36" height="12" viewBox="0 0 36 12" fill="none" style={{ opacity: 0.38 }}>
                <path d="M15.2 0L13 12h3.2L18.4 0h-3.2zM25.4 0l-3 7.8-.3-1.6S21 2.3 17.3 0h4.4l1.6 8.2L25.8 0h3.5L24.4 12h-3.3L25.4 0zM11.7 0L8.4 8.1 8 6.5C7.3 4 4.9 1.6 2.2.5L5.2 12h3.3L15 0h-3.3zM2.1 0H.1L0 .7C5 2 8.4 5.1 9.7 9.1L8.1.7C7.8.2 6.9 0 5.6 0H2.1z" fill="#1A1F71"/>
                <path d="M2.1 0H.1L0 .7C5 2 8.4 5.1 9.7 9.1L8.1.7C7.8.2 6.9 0 5.6 0H2.1z" fill="#F7A600"/>
              </svg>
              {/* Mastercard */}
              <svg width="30" height="18" viewBox="0 0 30 18" fill="none" style={{ opacity: 0.38 }}>
                <circle cx="10" cy="9" r="9" fill="#EB001B"/>
                <circle cx="20" cy="9" r="9" fill="#F79E1B"/>
                <path d="M15 3.5a9 9 0 010 11A9 9 0 0115 3.5z" fill="#FF5F00"/>
              </svg>
            </div>
          </div>
          <div className="flex gap-6 text-sm text-white/30">
            <a href="#" className="hover:text-white/60 transition-colors">Privacy</a>
            <a href="#" className="hover:text-white/60 transition-colors">Terms</a>
            <a href="#" className="hover:text-white/60 transition-colors">Contact</a>
          </div>
        </div>
      </footer>

    </div>
  )
}
