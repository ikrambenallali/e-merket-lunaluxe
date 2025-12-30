import bgVideo from '../../assets/Videos/bgVideo.mp4';
import posterImg from '../../assets/Images/productsBG.jpg';

export default function Header() {
  return (
    <header className="relative h-screen w-full overflow-hidden flex flex-col justify-between">

    <img
      src={posterImg}
      className="absolute top-0 left-0 h-full w-full object-cover"
      alt="LunaLuxe"
    />

    <video
      className="absolute top-0 left-0 h-full w-full object-cover opacity-0 transition-opacity duration-500"
      src={bgVideo}
      poster={posterImg}
      autoPlay
      muted
      fetchPriority="high"
      loop
      playsInline
      onLoadedData={(e) => e.target.classList.remove('opacity-0')}
    ></video>

      {/* overlay to darken video */}
      <div className="absolute top-0 left-0 h-full w-full bg-black/40 z-0"></div>
      
      <div className="font-playfair relative z-10 flex flex-col justify-center h-full pl-6 sm:pl-12 md:pl-20 lg:pl-32 text-left w-[90%] md:w-[50%]">
        <h1 className="text-brandWhite uppercase text-2xl sm:text-3xl md:text-4xl font-semibold leading-snug">
        At LunaLuxe, beauty shines like the moon—effortless, powerful, and captivating.
        </h1>

        <button className="mt-8 px-8 py-3 w-fit text-lg font-montserrat text-brandWhite bg-brandRed 
          hover:bg-hoverBrandRed cursor-pointer hover:scale-105 hover:shadow-[0_4px_20px_rgba(181,72,58,0.4)] 
           shadow-md transition-all duration-300 ease-in-out"
        >
          Learn More
        </button>

        {/* Stats */}
        <div className="flex flex-wrap gap-6 sm:gap-10 mt-10 text-brandWhite text-lg sm:text-xl font-montserrat">
          <div className="flex items-center gap-3">
            <div>
              <span className="font-playfair text-2xl sm:text-3xl font-semibold block">
                +15000
              </span>
              <span className="text-brandWhite">Sells</span>
            </div>
            <div className="hidden sm:block h-10 border-r-2 border-white"></div>
          </div>
          <div className="flex items-center gap-3">
            <div>
              <span  className="font-playfair text-2xl sm:text-3xl font-semibold block">
                +200
              </span>
              <span className="text-brandWhite">Product</span>
            </div>
            <div className="hidden sm:block h-10 border-r-2 border-white"></div>
          </div>
          <div className="flex items-center gap-3">
            <div>
              <span className="font-playfair text-2xl sm:text-3xl font-semibold block" style={{fontFamily: "'Playfair Display', serif"}}>
                +35
              </span>
              <span className="text-brandWhite">Users</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
