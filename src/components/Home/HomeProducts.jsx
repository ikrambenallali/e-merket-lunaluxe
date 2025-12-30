import { useState } from "react";
import { Link } from "react-router-dom";

function Product({ src }) {
  const [isHover, setIsHover] = useState(false);
  
  return (
    <div className="w-full">
      <div 
        className="relative overflow-hidden group"
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        <img 
          src={src} 
          alt="Product" 
          className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        
        <div 
          className={`absolute inset-0 font-playfair bg-black/75 flex flex-col justify-between items-center p-6 text-brandWhite transition-all duration-500
            ${isHover ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
        >
          <div className="flex-1 flex flex-col justify-center text-center">
            <span className="inline-block bg-brandRed text-brandWhite text-sm font-dm px-3 py-1 mb-3 mx-auto">
              -20% OFFER
            </span>
            <h3 className="text-2xl font-semibold mb-4">GLOW SERUM</h3>
            <p className="font-dm text-sm leading-relaxed px-2">
              A brightening ampoule that balances tone and refines the look of pores for glowy, radiant skin
            </p>
          </div>
          
          <Link to={'/login'} className="text-center w-full bg-white cursor-pointer text-black py-3 font-dm text-base font-medium hover:bg-hoverBrandRed hover:text-brandWhite transition-all duration-300 transform hover:scale-105">
            Add To Cart - $15.40
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function HomeProducts() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="font-semibold font-playfair uppercase text-brandRed text-center text-3xl sm:text-4xl mb-12">
        Sélection d’Essentiels LunaLuxe
      </h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        <Product src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=500&fit=crop" />
        <Product src="https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400&h=500&fit=crop" />
        <Product src="https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=400&h=500&fit=crop" />
        <Product src="https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=500&fit=crop" />
      </div>
      
      <div className="flex justify-center mt-12">
        <Link to={'/login'}
         className="px-8 py-3 text-center cursor-pointer text-lg font-dm min-w-[200px] text-brandWhite bg-brandRed hover:bg-hoverBrandRed shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 uppercase tracking-wide">
          Voir Plus
        </Link>
      </div>
    </div>
  );
}