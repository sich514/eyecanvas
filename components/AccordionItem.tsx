'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function AccordionItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className="border-b border-white/10 py-5 cursor-pointer"
      onClick={() => setOpen(o => !o)}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="font-semibold text-white text-base">{q}</span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.25 }}
          className="text-2xl leading-none shrink-0"
          style={{ color: '#C8883A' }}
        >
          +
        </motion.span>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <p className="mt-3 text-white/60 text-sm leading-relaxed pr-8">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
