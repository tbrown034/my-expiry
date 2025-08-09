'use client';

import { useState, useEffect } from 'react';

const funMessages = [
  {
    title: "🚧 Under Construction! 🚧",
    message: "This feature is still cooking in our digital kitchen! Come back when it's properly seasoned! 👨‍🍳",
    emoji: "🍳",
    color: "orange"
  },
  {
    title: "🔮 Coming Soon! ✨",
    message: "Our developers are working their magic! This feature will be fresher than your produce! 🥬",
    emoji: "🧙‍♂️",
    color: "purple"
  },
  {
    title: "🎯 Feature Locked! 🔐",
    message: "This button is taking a vacation! Don't worry, it'll be back with more energy than a caffeinated tomato! ☕🍅",
    emoji: "🌴",
    color: "blue"
  },
  {
    title: "🎪 Not Ready Yet! 🎭",
    message: "This feature is still rehearsing for its big debut! Stay tuned for the grand opening! 🎊",
    emoji: "🎪",
    color: "pink"
  }
];

export default function FunAlert({ isOpen, onClose, type = 'construction' }) {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const randomMessage = funMessages[Math.floor(Math.random() * funMessages.length)];
      setSelectedMessage(randomMessage);
      setIsAnimating(true);
    }
  }, [isOpen]);

  if (!isOpen || !selectedMessage) return null;

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(onClose, 300);
  };

  const getColorClasses = (color) => {
    switch (color) {
      case 'orange':
        return {
          bg: 'bg-gradient-to-br from-orange-50 to-amber-50',
          border: 'border-orange-200',
          text: 'text-orange-800',
          button: 'bg-orange-500 hover:bg-orange-600'
        };
      case 'purple':
        return {
          bg: 'bg-gradient-to-br from-purple-50 to-indigo-50',
          border: 'border-purple-200',
          text: 'text-purple-800',
          button: 'bg-purple-500 hover:bg-purple-600'
        };
      case 'blue':
        return {
          bg: 'bg-gradient-to-br from-blue-50 to-cyan-50',
          border: 'border-blue-200',
          text: 'text-blue-800',
          button: 'bg-blue-500 hover:bg-blue-600'
        };
      case 'pink':
        return {
          bg: 'bg-gradient-to-br from-pink-50 to-rose-50',
          border: 'border-pink-200',
          text: 'text-pink-800',
          button: 'bg-pink-500 hover:bg-pink-600'
        };
      default:
        return {
          bg: 'bg-gradient-to-br from-gray-50 to-slate-50',
          border: 'border-gray-200',
          text: 'text-gray-800',
          button: 'bg-gray-500 hover:bg-gray-600'
        };
    }
  };

  const colors = getColorClasses(selectedMessage.color);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isAnimating ? 'animate-fade-in' : 'animate-fade-out'}`}>
      {/* Backdrop with fun animation */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-all duration-300"
        onClick={handleClose}
        style={{
          background: 'radial-gradient(circle at center, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%)'
        }}
      />
      
      {/* Alert Modal */}
      <div className={`relative max-w-md w-full mx-auto ${isAnimating ? 'animate-bounce-in' : 'animate-scale-out'}`}>
        <div className={`${colors.bg} ${colors.border} border-2 rounded-2xl shadow-2xl p-8 text-center relative overflow-hidden`}>
          {/* Fun background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-4 left-4 text-6xl animate-spin-slow">⚙️</div>
            <div className="absolute top-4 right-4 text-4xl animate-bounce" style={{ animationDelay: '0.5s' }}>✨</div>
            <div className="absolute bottom-4 left-4 text-5xl animate-pulse" style={{ animationDelay: '1s' }}>🔧</div>
            <div className="absolute bottom-4 right-4 text-3xl animate-ping" style={{ animationDelay: '1.5s' }}>💫</div>
          </div>
          
          {/* Content */}
          <div className="relative z-10">
            {/* Big emoji with animation */}
            <div className="text-6xl mb-4 animate-bounce-gentle">
              {selectedMessage.emoji}
            </div>
            
            {/* Title */}
            <h3 className={`text-xl font-bold ${colors.text} mb-3`}>
              {selectedMessage.title}
            </h3>
            
            {/* Message */}
            <p className={`${colors.text} mb-6 opacity-80 leading-relaxed`}>
              {selectedMessage.message}
            </p>
            
            {/* Close button */}
            <button
              onClick={handleClose}
              className={`${colors.button} text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1 active:scale-95`}
            >
              Got it! 👍
            </button>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -top-2 -left-2 w-8 h-8 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
          <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-400 rounded-full animate-pulse opacity-75"></div>
        </div>
        
        {/* Shadow effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl transform translate-y-2 -z-10"></div>
      </div>
      
      {/* Fun floating elements */}
      <div className="absolute top-1/4 left-1/4 text-2xl animate-float opacity-30">🎈</div>
      <div className="absolute top-3/4 right-1/4 text-3xl animate-float-delayed opacity-30">🎉</div>
      <div className="absolute bottom-1/4 left-1/3 text-xl animate-float-slow opacity-30">⭐</div>
    </div>
  );
}