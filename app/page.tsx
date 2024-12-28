'use client'

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import HomePage from '../components/HomePage';
import CardArrangement from '../components/CardArrangement';

export default function Home() {
  const [names, setNames] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const handleGenerate = (inputNames: string[]) => {
    setNames(inputNames);
    setShowPreview(true);
  }

  const handleBack = () => {
    setShowPreview(false)
  }

  return (
    <main className="min-h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        {!showPreview ? (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <HomePage onGenerate={handleGenerate} />
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '-100%' }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <CardArrangement names={names} onBack={handleBack} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
};

