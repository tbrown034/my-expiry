"use client";

import Link from "next/link";
import { useState } from "react";

export default function About() {
  const [hoveredTech, setHoveredTech] = useState(null);

  const techStack = [
    { 
      name: "Next.js", 
      icon: (
        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.5725 0c-.1763 0-.3098.0013-.3584.0067-.0516.0053-.2159.021-.3636.0328-3.4088.3073-6.6017 2.1463-8.624 4.9728C1.1004 6.584.3802 8.3666.1082 10.255c-.0962.659-.108.8537-.108 1.7474s.012 1.0884.108 1.7476c.652 4.506 3.8591 8.2919 8.2087 9.6945.7789.2511 1.6.4223 2.5337.5255.3636.04 1.9354.04 2.299 0 1.6117-.1783 2.9772-.577 4.3237-1.2643.2065-.1056.2464-.1337.2183-.1573-.0188-.0139-.8987-1.1938-1.9543-2.62l-1.919-2.592-2.4047-3.5583c-1.3231-1.9564-2.4117-3.556-2.4211-3.556-.0094-.0026-.0187 1.5787-.0235 3.509-.0067 3.3802-.0093 3.5162-.0516 3.596-.061.115-.108.1618-.2064.2134-.075.0374-.1408.0445-.495.0445h-.406l-.1078-.068a.4383.4383 0 01-.1572-.1712l-.0493-.1056.0053-4.703.0067-4.7054.0726-.0915c.0376-.0493.1174-.1125.1736-.143.0962-.047.1338-.0517.5396-.0517.4787 0 .5584.0187.6827.1547.0353.0377 1.3373 1.9987 2.895 4.3608a10760.433 10760.433 0 004.7344 7.1706l1.9002 2.8782.096-.0633c.8518-.5536 1.7525-1.3418 2.4657-2.1627 1.5179-1.7429 2.4963-3.868 2.8247-6.134.0961-.6591.1078-.8531.1078-1.7475 0-.8937-.012-1.0884-.1078-1.7474-.6522-4.506-3.8592-8.2919-8.2087-9.6945-.7672-.2487-1.5836-.4161-2.4985-.5108-.169-.0176-1.0835-.0366-1.6123-.037zm4.0685 7.217c.3473 0 .4082.0053.4857.047.1127.0562.204.1686.237.2909.0186.0683.0234 1.3581.0186 4.3618l-.0067 4.2792-.7436-1.14-.7461-1.14v-3.066c0-1.982.0093-3.0963.0234-3.1502.0375-.1313.1196-.2346.2323-.2955.0961-.0494.1313-.054.4997-.054z"/>
        </svg>
      ), 
      color: "from-gray-700 to-black" 
    },
    { 
      name: "React", 
      icon: (
        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38a2.167 2.167 0 0 0-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44a23.476 23.476 0 0 0-3.107-.534A23.892 23.892 0 0 0 12.769 4.7c1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442a22.73 22.73 0 0 0-3.113.538 15.02 15.02 0 0 1-.254-1.42c-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.36-.034-.471 0-.92.014-1.36.034.44-.572.895-1.096 1.36-1.564zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87a25.64 25.64 0 0 1-4.412.005 26.64 26.64 0 0 1-1.185-1.87c-.37-.64-.71-1.29-1.018-1.946.308-.655.646-1.31 1.013-1.95.38-.66.773-1.286 1.18-1.86.72-.05 1.462-.084 2.202-.093zm-8.27 3.226c1.074.37 2.234.672 3.45.895.21.772.457 1.557.728 2.364-.272.808-.52 1.593-.73 2.365-1.216.222-2.376.525-3.45.895-.784-.333-1.365-.855-1.64-1.475-.16-.36-.216-.725-.216-1.094 0-.369.056-.733.216-1.094.275-.62.856-1.142 1.642-1.475zm15.495 1.09c.784.333 1.365.855 1.64 1.475.16.36.216.725.216 1.094 0 .369-.056.733-.216 1.094-.275.62-.856 1.142-1.64 1.475-1.074-.37-2.234-.673-3.45-.895a24.547 24.547 0 0 1-.728-2.364c.272-.808.52-1.593.73-2.365 1.216-.222 2.376-.525 3.45-.895zm-7.425 5.306c.47 0 .92-.014 1.36-.034-.44.572-.895 1.096-1.36 1.564-.455-.468-.91-.992-1.36-1.564.44.02.89.034 1.36.034zm-2.89 1.607c.41-.375.852-.715 1.318-1.026.466-.31.956-.58 1.468-.82-.512.24-1.002.51-1.468.82-.466.31-.908.65-1.318 1.026zm5.78 0c-.41-.375-.852-.715-1.318-1.026-.466-.31-.956-.58-1.468-.82.512.24 1.002.51 1.468.82.466.31.908.65 1.318 1.026zm-8.27 3.226c-.784-.333-1.365-.855-1.64-1.475-.16-.36-.216-.725-.216-1.094 0-.369.056-.733.216-1.094.275-.62.856-1.142 1.64-1.475 1.074.37 2.234.672 3.45.895-.21.772-.457 1.557-.728 2.364.272.808.52 1.593.73 2.365-1.216-.222-2.376-.525-3.45-.895zm15.495-1.09c.784.333 1.365.855 1.64 1.475.16.36.216.725.216 1.094 0 .369-.056.733-.216 1.094-.275.62-.856 1.142-1.64 1.475-1.074-.37-2.234-.673-3.45-.895.21-.772.457-1.557.728-2.364-.272-.808-.52-1.593-.73-2.365 1.216.222 2.376.525 3.45.895z"/>
        </svg>
      ), 
      color: "from-blue-400 to-blue-600" 
    },
    { 
      name: "Tailwind", 
      icon: (
        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z"/>
        </svg>
      ), 
      color: "from-cyan-400 to-teal-600" 
    },
    { 
      name: "Prisma", 
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
        </svg>
      ), 
      color: "from-indigo-400 to-purple-600" 
    },
    { 
      name: "OpenAI", 
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ), 
      color: "from-green-400 to-emerald-600" 
    }
  ];

  const features = [
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: "AI-Powered Intelligence",
      description: "Advanced AI automatically determines shelf life, categorizes items, and provides smart expiry predictions.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      title: "Save Money",
      description: "Reduce food waste by up to 40% with smart tracking and timely notifications about approaching expiry dates.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: "Receipt Scanning",
      description: "Simply snap a photo of your receipt and let AI extract all items with predicted expiry dates. Coming soon!",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Batch Processing",
      description: "Add multiple items at once with batch processing. Perfect for weekly grocery hauls and meal prep.",
      color: "from-orange-500 to-red-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-blue-500/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-2xl transform rotate-3">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-5xl font-black bg-gradient-to-r from-gray-900 via-emerald-600 to-green-600 bg-clip-text text-transparent">
                My Expiry
              </h1>
            </div>
            <p className="text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
              An open-source solution for grocery tracking, built from personal frustration and a passion for <span className="font-bold text-emerald-600">solving real problems</span>
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Sustainable Living
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                AI-Powered
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                Open Source
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Coming Soon CTA Section */}
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-3xl p-12 border border-gray-300 opacity-75">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-600 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h2 className="text-4xl font-bold mb-6 text-gray-700">
            User Accounts Coming Soon
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Enhanced features including cloud sync, personalized recommendations, and advanced analytics are currently in development.
          </p>
          <div className="inline-flex items-center gap-3 px-8 py-4 bg-gray-300 text-gray-600 font-bold rounded-2xl cursor-not-allowed">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Coming Soon
          </div>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="bg-white/50 backdrop-blur-sm border-t border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-4">Built with Modern Technology</h2>
          <p className="text-gray-600 text-center mb-12">Leveraging the latest tools and frameworks for optimal performance</p>
          
          <div className="flex justify-center items-center gap-8 flex-wrap">
            {techStack.map((tech, index) => (
              <div 
                key={index}
                className="group relative"
                onMouseEnter={() => setHoveredTech(index)}
                onMouseLeave={() => setHoveredTech(null)}
              >
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${tech.color} flex items-center justify-center shadow-lg transform transition-all duration-300 ${hoveredTech === index ? 'scale-110 rotate-6' : ''}`}>
                  {tech.icon}
                </div>
                <div className={`absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm font-semibold text-gray-700 transition-all duration-300 ${hoveredTech === index ? 'opacity-100' : 'opacity-0'}`}>
                  {tech.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Developer Story - Main Focus */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-4">Why I Built My Expiry</h2>
        <p className="text-xl text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          The real story behind this open-source project — I'm the real product here
        </p>
        
        <div className="bg-gradient-to-br from-gray-900 to-emerald-900 rounded-3xl p-12 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 opacity-50"></div>
          <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-2xl">
                  TB
                </div>
                <div>
                  <h2 className="text-3xl font-bold">Trevor Brown</h2>
                  <p className="text-emerald-300 text-lg">Award-Winning Journalist Turned Full-Stack Developer</p>
                </div>
              </div>
              
              <p className="text-lg leading-relaxed mb-6 text-gray-100">
                From the suburbs of Chicago to Bloomington, Indiana, I've transformed from an award-winning investigative 
                journalist into a passionate full-stack developer. After earning Reporter of the Year (2020) and Writer of 
                the Year (2021) honors, I transitioned to tech in 2022 to merge storytelling with code.
              </p>
              
              <p className="text-lg leading-relaxed mb-8 text-gray-100">
                My Expiry started as a personal project — I was frustrated watching groceries expire in my own fridge. Rather than 
                just complain, I built something about it. This open-source app reflects my core beliefs: solve real problems, 
                keep interfaces clean, and always be building. Feel free to contribute, fork, or suggest improvements on GitHub.
              </p>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <div className="text-lg font-bold text-emerald-300 mb-1">JS/TS</div>
                  <div className="text-sm text-gray-300">JavaScript & TypeScript</div>
                </div>
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <div className="text-lg font-bold text-emerald-300 mb-1">CSS</div>
                  <div className="text-sm text-gray-300">Tailwind & Styling</div>
                </div>
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <div className="text-lg font-bold text-emerald-300 mb-1">Full-Stack</div>
                  <div className="text-sm text-gray-300">Next.js, Postgres, Vercel</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <a 
                  href="https://github.com/tbrown034" 
                  target="_blank"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub
                </a>
                <a 
                  href="https://www.linkedin.com/in/trevorabrown/" 
                  target="_blank"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  LinkedIn
                </a>
                <a 
                  href="https://trevorthewebdeveloper.com/" 
                  target="_blank"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                  </svg>
                  Portfolio
                </a>
                <a 
                  href="#" 
                  className="inline-flex items-center gap-2 px-5 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Resume
                </a>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="relative">
                <div className="w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-blue-500/20 rounded-3xl backdrop-blur-sm border border-white/20 flex flex-col items-center justify-center p-6">
                  <div className="text-center mb-6">
                    <div className="flex justify-center mb-4">
                      <svg className="w-12 h-12 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                    <div className="text-lg font-semibold mb-2">From Newsrooms to Code</div>
                    <div className="text-emerald-300 text-sm mb-4">Building digital stories</div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <a 
                      href="https://oklahomanwatch.org/author/trevor-brown/" 
                      target="_blank"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg font-medium transition-all duration-300 text-sm backdrop-blur-sm border border-white/30"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      View My Journalism
                    </a>
                    <a 
                      href="https://github.com/tbrown034?tab=repositories" 
                      target="_blank"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg font-medium transition-all duration-300 text-sm backdrop-blur-sm border border-white/30"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                      View My Coding Projects
                    </a>
                  </div>
                </div>
                <div className="absolute -top-3 -right-3 w-6 h-6 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full opacity-80"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 mb-4">
              <span className="text-gray-600">Built with</span>
              <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-600">and a passion for sustainability</span>
            </div>
            <div className="flex justify-center items-center gap-6 text-sm text-gray-500">
              <a href="mailto:trevorbrown.web@gmail.com" className="hover:text-emerald-600 transition-colors">Contact</a>
              <span>•</span>
              <a href="https://github.com/tbrown034" className="hover:text-emerald-600 transition-colors">GitHub</a>
              <span>•</span>
              <a href="https://trevorthewebdeveloper.com" className="hover:text-emerald-600 transition-colors">Portfolio</a>
              <span>•</span>
              <span>© 2024 Trevor Brown</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}