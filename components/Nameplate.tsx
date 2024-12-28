import React from 'react';
import { motion } from 'framer-motion';

interface NameplateProps {
  name: string;
  fontSize?: string;
  width?: string;
  height?: string;
  zIndex?: number;
  isEnlarged?: boolean;
}

const formatName = (name: string) => {
  if (name.length === 2) {
    return name.split('').join('\u2004\u2004\u2004\u2004');
  } else if (name.length === 3) {
    return name.split('').join('\u2004');
  }
  return name;
};

const Nameplate: React.FC<NameplateProps> = ({ 
  name, 
  fontSize = '40px', 
  width = '200px', 
  height = '98px', 
  zIndex = 0,
  isEnlarged = false
}) => {
  const enlargedWidth = '200mm';
  const enlargedHeight = '98mm';
  const enlargedFontSize = '135pt';

  return (
    <motion.div
      className="bg-cover bg-center shadow-md flex items-center justify-center"
      style={{
        width: isEnlarged ? enlargedWidth : width,
        height: isEnlarged ? enlargedHeight : height,
        backgroundImage: "url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/nameplate-bg-mgGiV1dlgWoAAmuviXnUTD9fF57xpw.png')",
        backgroundColor: 'white',
        backgroundBlendMode: 'normal',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
        zIndex,
      }}
      animate={{
        y: isEnlarged ? 0 : [0, -5, 0],
        boxShadow: isEnlarged
          ? '0 10px 15px rgba(0, 0, 0, 0.2), 0 5px 8px rgba(0, 0, 0, 0.15)'
          : [
              '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
              '0 6px 8px rgba(0, 0, 0, 0.15), 0 3px 5px rgba(0, 0, 0, 0.12)',
              '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
            ],
      }}
      transition={{
        duration: isEnlarged ? 0.3 : 2,
        repeat: isEnlarged ? 0 : Infinity,
        ease: "easeInOut"
      }}
    >
      <span 
        className="text-black font-stzhongsong font-light text-glow whitespace-pre"
        style={{
          fontSize: isEnlarged ? enlargedFontSize : fontSize,
          textShadow: '1px 1px 2px rgba(255,255,255,0.8), -1px -1px 2px rgba(255,255,255,0.8)',
        }}
      >
        {formatName(name)}
      </span>
    </motion.div>
  );
};

export default Nameplate;

