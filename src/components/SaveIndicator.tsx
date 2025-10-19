import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, CloudArrowUp } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'

interface SaveIndicatorProps {
  isSaving: boolean
  lastSaved?: number
}

export function SaveIndicator({ isSaving, lastSaved }: SaveIndicatorProps) {
  const [showSaved, setShowSaved] = useState(false)

  useEffect(() => {
    if (!isSaving && lastSaved) {
      setShowSaved(true)
      const timer = setTimeout(() => setShowSaved(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [isSaving, lastSaved])

  return (
    <AnimatePresence>
      {(isSaving || showSaved) && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="flex items-center gap-1.5 text-xs text-muted-foreground"
        >
          {isSaving ? (
            <>
              <CloudArrowUp className="w-4 h-4 animate-pulse" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4 text-green-600" weight="fill" />
              <span className="text-green-600">Saved</span>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
