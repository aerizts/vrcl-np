import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface HomePageProps {
  onGenerate: (names: string[]) => void
}

const HomePage: React.FC<HomePageProps> = ({ onGenerate }) => {
  const [showPopup, setShowPopup] = useState(false)
  const [nameInput, setNameInput] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNameInput(e.target.value)
  }

  const handleSubmit = () => {
    const names = nameInput
      .split(/[^\p{L}\p{N}\s]+/u)
      .flatMap(segment => segment.split(/\s+/))
      .map(name => name.trim())
      .filter(name => name !== '')
    onGenerate(names)
  }

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
      <style jsx>{`
  .glass-textarea {
    position: relative;
  }
  .glass-textarea::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 80%);
    transform: rotate(30deg);
    pointer-events: none;
  }
  .glass-textarea::placeholder {
    text-shadow: 0 0 10px rgba(255,255,255,0.5);
  }
`}</style>
      <style jsx global>{`
        .animate-spin {
          animation: spin 20s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
      <motion.button
        onClick={() => setShowPopup(true)}
        className="px-4 py-2 text-white bg-white/15 backdrop-filter backdrop-blur-lg rounded-md transition-all duration-300 border-2 border-white/40 shadow-[0_6px_8px_-1px_rgba(0,0,0,0.1),0_4px_6px_-1px_rgba(0,0,0,0.06)] hover:bg-white/25 hover:border-white/60 hover:shadow-[0_12px_20px_-3px_rgba(0,0,0,0.15),0_8px_10px_-2px_rgba(0,0,0,0.1)] active:shadow-[inset_0_3px_6px_0_rgba(0,0,0,0.1)]"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.25)', y: -3, boxShadow: '0 12px 20px -3px rgba(0,0,0,0.2), 0 8px 10px -2px rgba(0,0,0,0.15)' }}
        whileTap={{ scale: 0.98, backgroundColor: 'rgba(255, 255, 255, 0.2)', y: 1, boxShadow: 'inset 0 3px 6px 0 rgba(0,0,0,0.15)' }}
      >
        <span 
          className="relative z-10 font-semibold text-lg"
          style={{
            color: '#d5d5d5',
            textShadow: '0 0 2px #a0a0a0, 0 0 5px #c0c0c0, 0 0 10px #e0e0e0',
            background: 'linear-gradient(to bottom, #f4f4f4, #c0c0c0)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Import Namelist
        </span>
        <div className="absolute inset-0 bg-white bg-opacity-30 rounded-lg filter blur-sm transition-opacity duration-300 opacity-0 group-hover:opacity-100"></div>
      </motion.button>

      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50"
          >
            <motion.div 
              className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPopup(false)}
            ></motion.div>
            <motion.div 
              className="relative bg-gradient-to-br from-purple-400/10 to-blue-400/10 backdrop-filter backdrop-blur-2xl p-8 shadow-2xl w-[400px] max-w-90vw overflow-hidden"
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 120 }}
              style={{
                maskImage: 'radial-gradient(circle at center, black 20%, transparent 70%)',
                WebkitMaskImage: 'radial-gradient(circle at center, black 20%, transparent 70%)',
                boxShadow: '0 0 60px 30px rgba(255,255,255,0.05), inset 0 0 30px 15px rgba(255,255,255,0.05)'
              }}
            >
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-purple-300/5 to-blue-300/5"
                animate={{
                  opacity: [0.3, 0.5, 0.3],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
              <div className="relative z-10 h-full flex flex-col">
                <h2 className="text-2xl font-semibold mb-4 text-white"></h2>
                <textarea
                  className="glass-textarea w-full h-[calc(100%-80px)] p-4 border border-white/30 rounded-md mb-4 bg-white/10 backdrop-filter backdrop-blur-md text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-[inset_0_2px_4px_rgba(255,255,255,0.1)] relative overflow-hidden z-50"
                  value={nameInput}
                  onChange={handleInputChange}
                  placeholder="Enter names separated by commas or new lines"
                />
                <div className="flex justify-end space-x-4">
                  <motion.button
                    onClick={() => setShowPopup(false)}
                    className="px-4 py-2 text-white bg-white/10 backdrop-filter backdrop-blur-md rounded-md transition-all duration-300 hover:bg-white/20 hover:shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={handleSubmit}
                    className="px-4 py-2 text-white bg-white/10 backdrop-filter backdrop-blur-md rounded-md transition-all duration-300 border border-white/30 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] hover:bg-white/20 hover:border-white/50 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)] active:shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.06)]"
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.2)', y: -2 }}
                    whileTap={{ scale: 0.95, backgroundColor: 'rgba(255, 255, 255, 0.1)', y: 1 }}
                  >
                    Generate
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default HomePage

