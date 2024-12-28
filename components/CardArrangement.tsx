import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { generateDeck, shuffleDeck, calculateCardPosition, useWindowSize, Card } from '../utils/cardUtils';
import { loadSTZhongsongFont } from '../utils/fontLoader';
import PrintView from './PrintView';
import Nameplate from './Nameplate';
import { RefreshCw, ArrowLeft, Printer } from 'lucide-react';
import Button from './Button'; // Import Button component

interface CardArrangementProps {
  names: string[];
  onBack: () => void;
}

const ARRANGEMENT_METHODS = ['grid', 'circular', 'spiral'];

const CardArrangement: React.FC<CardArrangementProps> = ({ names, onBack }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [windowWidth, windowHeight] = useWindowSize();
  const [fontLoaded, setFontLoaded] = useState(false);
  const [currentArrangement, setCurrentArrangement] = useState('');
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [tempEditValue, setTempEditValue] = useState<string>('');
  const [editingCardPosition, setEditingCardPosition] = useState({ x: 0, y: 0, rotation: 0 });
  const shuffleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const getRandomArrangement = useCallback(() => {
    return ARRANGEMENT_METHODS[Math.floor(Math.random() * ARRANGEMENT_METHODS.length)];
  }, []);

  useEffect(() => {
    const loadFont = async () => {
      const loaded = await loadSTZhongsongFont();
      setFontLoaded(loaded);
    };
    loadFont();
  }, []);

  useEffect(() => {
    const deck = shuffleDeck(generateDeck()).slice(0, names.length);
    setCards(deck.map((card, index) => ({ ...card, value: names[index], zIndex: index })));
    setCurrentArrangement(getRandomArrangement());
  }, [names, getRandomArrangement]);

  useEffect(() => {
    const updateContainerSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };
    updateContainerSize();
    window.addEventListener('resize', updateContainerSize);
    return () => window.removeEventListener('resize', updateContainerSize);
  }, [windowWidth, windowHeight]);

  useEffect(() => {
    if (containerSize.width && containerSize.height) {
      rearrangeCards();
    }
  }, [containerSize, currentArrangement]);

  useEffect(() => {
    const shuffleInterval = 5 * 60 * 1000; // 5 minutes in milliseconds

    const shuffleAndRearrange = () => {
      setCurrentArrangement(getRandomArrangement());
      rearrangeCards();
    };

    // Initial shuffle
    shuffleAndRearrange();

    // Set up interval for future shuffles
    shuffleTimeoutRef.current = setInterval(shuffleAndRearrange, shuffleInterval);

    return () => {
      if (shuffleTimeoutRef.current) {
        clearInterval(shuffleTimeoutRef.current);
      }
    };
  }, [getRandomArrangement]);

  const rearrangeCards = useCallback(() => {
    setCards((prevCards) =>
      prevCards.map((card, index) => ({
        ...card,
        y: -containerSize.height, // Reset to above the screen
        x: Math.random() * containerSize.width, // Random horizontal position
        rotation: Math.random() * 360 - 180, // Random rotation
        zIndex: index, // Set initial z-index based on card order
        ...calculateCardPosition(index, prevCards.length, containerSize.width, containerSize.height, currentArrangement),
      }))
    );
  }, [containerSize, currentArrangement]);

  const handleRefresh = useCallback(() => {
    setCurrentArrangement(getRandomArrangement());
    rearrangeCards();
  }, [getRandomArrangement, rearrangeCards]);

  const handleDragEnd = useCallback((event: MouseEvent | TouchEvent | PointerEvent, info: any, id: number) => {
    setCards((prevCards) => {
      const maxZIndex = Math.max(...prevCards.map(c => c.zIndex));
      const updatedCards = prevCards.map((card) =>
        card.id === id
          ? {
              ...card,
              x: card.x + info.offset.x,
              y: card.y + info.offset.y,
              zIndex: maxZIndex + 1, // Move dragged card to top
            }
          : card
      );
      return updatedCards;
    });
  }, []);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleCardClick = useCallback((card: Card) => {
    setSelectedCard(card);
    setTempEditValue(card.value);
    setEditingCardPosition({ x: card.x, y: card.y, rotation: card.rotation });
    setCards((prevCards) => {
      const maxZIndex = Math.max(...prevCards.map(c => c.zIndex));
      return prevCards.map(c => 
        c.id === card.id ? { ...c, zIndex: maxZIndex + 1 } : c
      );
    });
  }, []);

  const handleCancel = useCallback(() => {
    setSelectedCard(null);
    setTempEditValue('');
  }, []);

  const handleDone = useCallback(() => {
    if (selectedCard) {
      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === selectedCard.id
            ? { ...card, value: tempEditValue }
            : card
        )
      );
      setSelectedCard(null);
      setTempEditValue('');
    }
  }, [selectedCard, tempEditValue]);

  const handleNameChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setTempEditValue(event.target.value);
  }, []);

  const createRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.classList.add('ripple');
    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  };

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100" tabIndex={0}>
      <style jsx global>{`
        @font-face {
          font-family: 'STZhongsong';
          src: url('/fonts/STZhongsong.ttf') format('truetype');
          font-weight: 300;
          font-style: normal;
          font-display: swap;
        }
        .font-stzhongsong {
          font-family: 'STZhongsong', '华文中宋', 'SimSun', serif;
          font-weight: 300;
        }
        @keyframes liquidWave {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .group:hover .bg-blue-400\/30 {
          animation: liquidWave 2s ease-in-out infinite;
        }
        .group:active .bg-blue-400\/30 {
          animation: liquidWave 0.3s ease-in-out;
        }
        @keyframes siriWave {
          0% { transform: scale(0.9); opacity: 0.6; }
          50% { transform: scale(1.1); opacity: 0.9; }
          100% { transform: scale(0.9); opacity: 0.6; }
        }
        @keyframes wave {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-wave {
          animation: wave 3s ease-in-out infinite;
        }
        .text-glow {
          transition: text-shadow 0.3s ease;
        }
        .text-glow:hover {
          text-shadow: 0 0 8px rgba(255,255,255,0.8);
        }
        .text-shadow-glow {
          text-shadow: 0 0 8px rgba(255,255,255,0.8);
        }
        @keyframes constantPulse {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.05); opacity: 1; }
        }
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
        .ripple {
          position: absolute;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.7);
          transform: scale(0);
          animation: ripple 0.6s linear;
          pointer-events: none;
        }
        @keyframes hover {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .hover-animation {
          animation: hover 3s ease-in-out infinite;
        }
        @keyframes slow-pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        .animate-slow-pulse {
          animation: slow-pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
      <div className="fixed top-0 left-0 right-0 z-50 flex flex-wrap justify-between items-start p-4 sm:p-6">
        <motion.button
          onClick={handleRefresh}
          className="relative overflow-hidden group p-2 sm:p-3 rounded-full bg-white/10 backdrop-filter backdrop-blur-md hover:bg-white/20 transition-all duration-300 pointer-events-auto"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title={`Current: ${currentArrangement}`}
        >
          <RefreshCw className="w-4 h-4 sm:w-6 sm:h-6 text-gray-800" />
        </motion.button>

        <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <motion.div
            className="px-3 py-1 sm:px-4 sm:py-2 rounded-xl flex items-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center group">
              <div className="absolute -inset-2 bg-gradient-to-br from-blue-100/20 via-purple-200/10 to-transparent rounded-full opacity-50 group-hover:opacity-75 transition-all duration-300 animate-[constantPulse_4s_ease-in-out_infinite_0.9s]"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-300/10 via-purple-400/20 to-transparent rounded-full opacity-75 group-hover:opacity-100 transition-all duration-300 animate-[constantPulse_4s_ease-in-out_infinite]"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-200/10 via-purple-300/15 to-transparent rounded-full opacity-50 group-hover:opacity-75 transition-all duration-300 animate-[constantPulse_4s_ease-in-out_infinite_0.3s]"></div>
              <div className="absolute inset-1 bg-gradient-to-r from-white/5 via-white/10 to-transparent rounded-full opacity-90 backdrop-filter backdrop-blur-sm group-hover:backdrop-blur-md transition-all duration-300 animate-[constantPulse_4s_ease-in-out_infinite_0.6s]"></div>
              <div className="absolute inset-2 flex items-center justify-center bg-white/10 rounded-full overflow-hidden group-hover:bg-white/20 transition-colors duration-300">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-transparent opacity-30 animate-slow-pulse"></div>
                <span className="relative text-white font-bold text-sm sm:text-lg z-10 group-hover:text-shadow-glow transition-all duration-300">{cards.length}</span>
              </div>
            </div>
          </motion.div>
          <motion.button
            onClick={onBack}
            className="relative overflow-hidden group px-4 py-2 sm:px-6 sm:py-3 rounded-full bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg transition-all duration-300 text-sm sm:text-base"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ 
              scale: 1.05, 
              boxShadow: "0 0 15px rgba(255,255,255,0.5)",
              transition: { duration: 0.2, ease: "easeInOut" }
            }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.span 
              className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 0.6 }}
              transition={{ duration: 0.3 }}
            ></motion.span>
            <span className="relative z-10 flex items-center justify-center text-white font-semibold">
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              Back
            </span>
          </motion.button>
          <motion.button
            onClick={handlePrint}
            className="relative overflow-hidden group px-4 py-2 sm:px-6 sm:py-3 rounded-full bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg transition-all duration-300 text-sm sm:text-base"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            whileHover={{ 
              scale: 1.05, 
              boxShadow: "0 0 15px rgba(255,255,255,0.5)",
              transition: { duration: 0.2, ease: "easeInOut" }
            }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.span 
              className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 0.6 }}
              transition={{ duration: 0.3 }}
            ></motion.span>
            <span className="relative z-10 flex items-center justify-center text-white font-semibold">
              <Printer className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              Print
            </span>
          </motion.button>
        </div>
      </div>
      <AnimatePresence>
        {cards.map((card) => (
          <motion.div
            key={card.id}
            className="absolute cursor-pointer"
            style={{
              zIndex: card.zIndex,
            }}
            initial={{ 
              opacity: 0, 
              scale: 0.5, 
              y: -containerSize.height, 
              x: Math.random() * containerSize.width,
              rotate: Math.random() * 360 - 180
            }}
            animate={{ 
              opacity: 1, 
              scale: card.scale || 1,
              x: card.x,
              y: card.y,
              rotate: card.rotation,
            }}
            transition={{ 
              type: "spring",
              damping: 12,
              stiffness: 100,
              duration: 1.5,
              delay: card.id * 0.05
            }}
            drag
            dragMomentum={false}
            onDragEnd={(event, info) => handleDragEnd(event, info, card.id)}
            whileHover={{ scale: (card.scale || 1) * 1.1, zIndex: card.zIndex + 100 }}
            whileTap={{ scale: (card.scale || 1) * 0.95 }}
            onClick={() => handleCardClick(card)}
          >
            <Nameplate name={card.value} zIndex={card.zIndex} />
          </motion.div>
        ))}
      </AnimatePresence>
      <AnimatePresence>
        {selectedCard && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative"
              initial={{ 
                scale: 0.5, 
                opacity: 0,
                x: editingCardPosition.x - containerSize.width / 2,
                y: editingCardPosition.y - containerSize.height / 2,
                rotate: editingCardPosition.rotation,
              }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                x: 0,
                y: 0,
                rotate: 0,
              }}
              exit={{ 
                scale: 0.5, 
                opacity: 0,
                x: editingCardPosition.x - containerSize.width / 2,
                y: editingCardPosition.y - containerSize.height / 2,
                rotate: editingCardPosition.rotation,
              }}
              transition={{ type: 'spring', damping: 15, stiffness: 100 }}
            >
              <Nameplate name={tempEditValue} isEnlarged={true} />
              <div className="flex justify-end mt-4 space-x-2">
                <button
                  onClick={(e) => { createRipple(e); handleCancel(); }}
                  className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md shadow hover:bg-gray-300 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={(e) => { createRipple(e); handleDone(); }}
                  className="px-3 py-1 bg-transparent text-white rounded-md shadow border border-white/30 hover:bg-white/20 transition-all duration-300"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <PrintView cards={cards} />
    </div>
  );
};

export default CardArrangement;

