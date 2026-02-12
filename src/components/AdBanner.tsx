import { useState } from 'react';
import { X, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdBanner() {
  const [visible, setVisible] = useState(true);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="relative overflow-hidden bg-gradient-to-r from-electric/20 via-hotpink/15 to-coral/20 border-b border-electric/20"
        >
          <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-center gap-2 text-sm">
            <Zap className="w-4 h-4 text-electric" />
            <span className="text-gray-300">
              <span className="font-semibold text-electric">WattClub</span> members save 15% on every charge.{' '}
              <button className="text-coral hover:text-coral-dim underline underline-offset-2 transition-colors">
                Learn more
              </button>
            </span>
            <button
              onClick={() => setVisible(false)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Close banner"
            >
              <X className="w-3.5 h-3.5 text-gray-400" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
