import Link from 'next/link'
import Image from 'next/image'
import FadeUp from '@/components/FadeUp'
import BeforeAfterSlider from '@/components/BeforeAfterSlider'
import AccordionItem from '@/components/AccordionItem'
import InlineOrderFlow from '@/components/InlineOrderFlow'
import PageTracker from '@/components/PageTracker'
import ScrollToPricingBtn from '@/components/ScrollToPricingBtn'

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
        {/* Full-bleed iris background */}
        <div className="absolute inset-0">
          <Image
            src="/iris-hero.jpg"
            alt="Eye iris"
            fill
            priority
            className="object-cover"
            style={{ objectPosition: 'center' }}
          />
          {/* Dark overlay */}
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.48)' }} />
          {/* Radial vignette — darker at edges */}
          <div className="absolute inset-0" style={{
            background: 'radial-gradient(ellipse 70% 70% at 50% 50%, transparent 20%, rgba(0,0,0,0.55) 80%, rgba(0,0,0,0.88) 100%)'
          }} />
        </div>

        {/* Hero content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] mb-6 tracking-tight">
            Your eye is<br />
            <span style={{ color: '#C8883A' }}>a universe.</span>
          </h1>
          <p className="text-lg md:text-2xl text-white/75 mb-10 font-light tracking-wide">
            Turn it into fine art.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <ScrollToPricingBtn
              className="w-full sm:w-auto px-8 py-4 rounded-full font-semibold text-base text-[#0a0a0a] shadow-lg transition-all hover:brightness-110 hover:scale-[1.02]"
              style={{ background: '#C8883A', boxShadow: '0 0 40px rgba(200,136,58,0.4)', border: 'none', cursor: 'pointer' }}
            >
              Create Mine — from $79
            </ScrollToPricingBtn>
            <ScrollToPricingBtn
              className="w-full sm:w-auto px-8 py-4 rounded-full font-semibold text-base text-white border border-white/40 backdrop-blur-sm hover:bg-white/10 transition-all"
              style={{ background: 'none', cursor: 'pointer' }}
            >
              Give as a Gift
            </ScrollToPricingBtn>
          </div>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-2 text-sm text-white/60">
            <span style={{ color: '#C8883A' }}>★★★★★</span>
            <span>1,100+ portraits printed</span>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
            <rect x="6" y="1" width="4" height="8" rx="2" fill="currentColor" opacity="0.4"/>
            <path d="M8 16 L4 20 L8 24 L12 20 Z" fill="currentColor" opacity="0.4"/>
          </svg>
        </div>
      </section>

      {/* ── EMOTIONAL HOOK ───────────────────────────────── */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
            {/* Before / after visual */}
            <FadeUp>
              <div className="relative">
                {/* Phone mock → Canvas mock */}
                <div className="grid grid-cols-2 gap-4 items-end">
                  {/* Blurry "phone photo" side */}
                  <div className="relative rounded-2xl overflow-hidden aspect-square border border-white/10">
                    <Image
                      src="/iris-blur.png"
                      alt="Original phone photo"
                      fill
                      className="object-cover"
                      style={{ filter: 'blur(3px) brightness(0.5) saturate(0.3)' }}
                    />
                    <div className="absolute inset-0 flex items-end p-3">
                      <span className="text-xs font-semibold text-white/50 bg-black/50 px-2 py-1 rounded-full tracking-wider">YOUR PHOTO</span>
                    </div>
                  </div>
                  {/* Large canvas side */}
                  <div className="relative rounded-2xl overflow-hidden aspect-square border-4 border-white/10 scale-110"
                    style={{ boxShadow: '0 30px 80px rgba(200,136,58,0.2), 0 4px 20px rgba(0,0,0,0.8)' }}>
                    <Image
                      src="/iris-hero.jpg"
                      alt="Canvas print result"
                      fill
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

            {/* Copy */}
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
                <ScrollToPricingBtn
                  className="inline-flex items-center gap-2 font-semibold text-sm transition-colors"
                  style={{ color: '#C8883A', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  See what yours looks like →
                </ScrollToPricingBtn>
              </div>
            </FadeUp>
          </div>

          {/* Wall photos grid */}
          <FadeUp delay={0.1}>
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                '/Home-Design-©-Iris-Galerie-13-scaled.avif',
                '/Home-Design-©-Iris-Galerie-16-scaled.avif',
                '/Home-Design-©-Iris-Galerie-2.avif',
                '/Home-Design-©-Iris-Galerie-6-scaled.avif',
              ].map((src) => (
                <div key={src} className="relative overflow-hidden rounded-2xl border border-white/8 group aspect-[3/4]">
                  <Image
                    src={src}
                    alt="Canvas print on wall"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500" />
                </div>
              ))}
            </div>
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
              },
              {
                n: '02',
                title: 'We enhance with AI',
                desc: 'Our model upscales your photo 4× and reveals microscopic detail — hidden fibers, colour gradients, depth — that prints stunningly at 24 inches.',
              },
              {
                n: '03',
                title: 'Arrives gift-ready',
                desc: 'Gallery-wrapped canvas on a solid frame, packed in a luxury box with a hanging kit. Ships in 5–7 days. Free.',
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
                <p className="text-white/55 leading-relaxed">
                  The result is a file so sharp it prints perfectly at 24 inches. Museum quality. From your phone.
                </p>
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
              <p className="text-white/50">Every size includes AI enhancement, free revision, and tracked shipping.</p>
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
                <ScrollToPricingBtn
                  className="px-5 py-2.5 rounded-full border border-white/10 text-sm text-white/60 hover:text-[#C8883A] hover:border-[#C8883A]/40 transition-all"
                  style={{ background: 'rgba(255,255,255,0.03)', cursor: 'pointer' }}
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
              return (
                <FadeUp key={t.name} delay={i * 0.1} className="flex">
                  <div className="flex flex-col rounded-2xl overflow-hidden border border-white/8 group w-full" style={{ background: '#111' }}>
                    {hasPhoto && (
                      <div className="relative shrink-0" style={{ height: 220 }}>
                        <Image src={photos[i]} alt="Canvas on wall" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(17,17,17,1) 0%, rgba(17,17,17,0.3) 60%, transparent 100%)' }} />
                      </div>
                    )}
                    <div className="flex flex-col justify-between p-6 pt-4 grow" style={{ paddingTop: hasPhoto ? 16 : 24 }}>
                      <p className="text-white/80 text-sm leading-relaxed italic mb-4">"{t.quote}"</p>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 shrink-0">
                          <Image src="/iris.svg" alt="" width={32} height={32} className="object-cover" style={{ filter: 'brightness(0.8)' }} />
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
        {/* Iris background, very dark */}
        <div className="absolute inset-0">
          <Image src="/iris.svg" alt="" fill className="object-cover opacity-20" style={{ filter: 'blur(2px) saturate(0.8)' }} />
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
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-serif text-lg font-bold">Eye<span style={{ color: '#C8883A' }}>Canvas</span></span>
          <p className="text-white/30 text-sm">© {new Date().getFullYear()} EyeCanvas. All rights reserved.</p>
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
