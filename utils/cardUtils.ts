import { useState, useEffect } from 'react';

export interface Card {
  id: number;
  value: string;
  x: number;
  y: number;
  z?: number;
  rotation: number;
  suit?: string;
  rank?: string;
}

export const generateDeck = (): Card[] => {
  const deck: Card[] = Array.from({ length: 52 }, (_, index) => ({
    id: index,
    value: '',
    x: 0,
    y: 0,
    z: 0,
    rotation: 0,
  }));

  const suits = ['H', 'D', 'C', 'S'];
  const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K'];

  let i = 0;
  for (const suit of suits) {
    for (const rank of ranks) {
      deck[i].suit = suit;
      deck[i].rank = rank;
      deck[i].value = `${rank}${suit}`;
      i++;
    }
  }

  return deck;
};

export const shuffleDeck = (deck: Card[]): Card[] => {
  const shuffledDeck = [...deck];
  for (let i = shuffledDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledDeck[i], shuffledDeck[j]] = [shuffledDeck[j], shuffledDeck[i]];
  }
  return shuffledDeck;
}

export function calculateCardPosition(
  index: number,
  totalCards: number,
  containerWidth: number,
  containerHeight: number,
  arrangement: string
): { x: number; y: number; z?: number; rotation: number; scale?: number } {
  switch (arrangement) {
    case 'grid':
      return calculateGridPosition(index, totalCards, containerWidth, containerHeight);
    case 'circular':
      return calculateCircularPosition(index, totalCards, containerWidth, containerHeight);
    case 'spiral':
      return calculateSpiralPosition(index, totalCards, containerWidth, containerHeight);
    default:
      return calculateGridPosition(index, totalCards, containerWidth, containerHeight);
  }
}

function calculateGridPosition(
  index: number,
  totalCards: number,
  containerWidth: number,
  containerHeight: number
): { x: number; y: number; rotation: number } {
  const cols = Math.ceil(Math.sqrt(totalCards));
  const rows = Math.ceil(totalCards / cols);
  const cellWidth = containerWidth / cols;
  const cellHeight = containerHeight / rows;
  const col = index % cols;
  const row = Math.floor(index / cols);
  const x = col * cellWidth + cellWidth / 2;
  const y = row * cellHeight + cellHeight / 2;
  const rotation = Math.random() * 10 - 5;

  return { x, y, rotation };
}

function calculateCircularPosition(
  index: number,
  totalCards: number,
  containerWidth: number,
  containerHeight: number
): { x: number; y: number; rotation: number } {
  const angle = (index / totalCards) * Math.PI * 2;
  const radius = Math.min(containerWidth, containerHeight) * 0.4;
  const x = containerWidth / 2 + Math.cos(angle) * radius;
  const y = containerHeight / 2 + Math.sin(angle) * radius;
  const rotation = (angle * 180) / Math.PI;

  return { x, y, rotation };
}

function calculateSpiralPosition(
  index: number,
  totalCards: number,
  containerWidth: number,
  containerHeight: number
): { x: number; y: number; rotation: number } {
  const a = 0.1;
  const b = 5;
  const angle = a * index;
  const radius = b * Math.sqrt(angle);
  const x = containerWidth / 2 + radius * Math.cos(angle);
  const y = containerHeight / 2 + radius * Math.sin(angle);
  const rotation = (angle * 180) / Math.PI;

  return { x, y, rotation };
}

export function useWindowSize() {
  const [size, setSize] = useState([window.innerWidth, window.innerHeight]);

  useEffect(() => {
    const handleResize = () => {
      setSize([window.innerWidth, window.innerHeight]);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}

