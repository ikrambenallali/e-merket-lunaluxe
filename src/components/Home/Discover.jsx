import React from 'react';

export default function Discover() {
  return (
    <div className="bg-[#FBD7DB] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Left Section - Text Content */}
          <div className="space-y-8">
            {/* Main Heading */}
            <h2 
              className="text-3xl text-brandRed font-playfair sm:text-4xl lg:text-5xl font-bold leading-tight"
            >
              Discover the Difference Our Cosmetics Make
            </h2>
            
            {/* Brand Philosophy */}
            <p 
              className="text-lg font-montserrat sm:text-xl leading-relaxed opacity-90"
            >
              At SI K-Beauty, we believe that true beauty comes from products that not only enhance your appearance but also align with your values and respect the world around us.
            </p>
            
            {/* Feature Blocks Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Eco-Friendly Block */}
              <div className="space-y-3">
                <div className="w-8 h-8">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brandRed">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                    <path d="M2 17l10 5 10-5"/>
                    <path d="M2 12l10 5 10-5"/>
                  </svg>
                </div>
                <h3 
                  className="font-bold font-montserrat text-lg"
                >
                  Eco-Friendly & Sustainable
                </h3>
                <p 
                  className="text-sm font-montserrat opacity-90 leading-relaxed"
                >
                  Committed to environmental responsibility with sustainable packaging and ethically sourced ingredients.
                </p>
              </div>
              
              {/* Inclusivity Block */}
              <div className="space-y-3">
                <div className="w-8 h-8">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brandRed">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </div>
                <h3 
                  className="font-bold font-montserrat text-lg"
                >
                  Inclusivity & Diversity
                </h3>
                <p 
                  className="text-sm font-montserrat opacity-90 leading-relaxed"
                >
                  Beauty products designed for all skin types and tones, celebrating the uniqueness of every individual.
                </p>
              </div>
              
              {/* Premium Quality Block */}
              <div className="space-y-3">
                <div className="w-8 h-8">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brandRed">
                    <path d="M9 12l2 2 4-4"/>
                    <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/>
                    <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"/>
                    <path d="M12 3c0 1-1 3-3 3s-3-2-3-3 1-3 3-3 3 2 3 3"/>
                    <path d="M12 21c0-1 1-3 3-3s3 2 3 3-1 3-3 3-3-2-3-3"/>
                  </svg>
                </div>
                <h3 
                  className="font-bold font-montserrat text-lg"
                >
                  Premium Quality
                </h3>
                <p 
                  className="text-sm opacity-90 font-montserrat leading-relaxed"
                >
                  Rigorously tested formulations using only the finest ingredients for exceptional results.
                </p>
              </div>
              
              {/* Empowering Confidence Block */}
              <div className="space-y-3">
                <div className="w-8 h-8">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brandRed">
                    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                  </svg>
                </div>
                <h3 
                  className="font-bold font-montserrat text-lg"
                >
                  Empowering Confidence
                </h3>
                <p 
                  className="text-sm font-montserrat opacity-90 leading-relaxed"
                >
                  Enhancing your natural beauty to help you feel confident and radiant every day.
                </p>
              </div>
            </div>
          </div>
          
          {/* Right Section - Product Showcase */}
          <div className="relative">
            <div className="bg-linear-to-br from-[#F5F5DC] to-[#F0E68C] rounded-t-3xl rounded-b-3xl p-8 lg:p-12 relative overflow-hidden">
              {/* Product Image */}
              <div className="relative z-10">
                <img 
                  src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=700&fit=crop&q=80"
                  alt="SI K-Beauty Products"
                  className="w-full h-auto rounded-2xl shadow-2xl"
                />
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute top-4 right-4 w-16 h-16 bg-white/20 rounded-full"></div>
              <div className="absolute bottom-8 left-4 w-12 h-12 bg-white/10 rounded-full"></div>
              <div className="absolute top-1/2 left-2 w-8 h-8 bg-white/15 rounded-full"></div>
              
              {/* Stats Badges */}
              <div className="absolute top-6 right-6 z-10 bg-white rounded-xl px-4 py-3 shadow-lg">
                <div className="text-center">
                  <div 
                    className="text-2xl font-montserrat font-bold text-gray-800"
                  >
                    98%
                  </div>
                  <div 
                    className="text-xs font-montserrat text-gray-600"
                  >
                    Natural Ingredients
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-6 z-11 right-6 bg-white rounded-xl px-4 py-3 shadow-lg">
                <div className="text-center">
                  <div 
                    className="text-2xl font-montserrat font-bold text-gray-800"
                  >
                    50K+
                  </div>
                  <div 
                    className="text-xs font-montserrat text-gray-600"
                  >
                    Happy Customers
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
