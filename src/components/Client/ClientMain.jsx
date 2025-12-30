import productsBG from "../../assets/Images/productsBG.jpg";

export default function ClientMain() {
  return (
    <div 
      className="relative w-full h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center"
      style={{
        backgroundImage: `url(${productsBG})`,
      }}
    >
      <div className="absolute inset-0 bg-black/40"></div>
      <h1 className="relative z-10 text-4xl font-playfair md:text-5xl lg:text-6xl font-bold text-white text-center px-4">
        Discover our products
      </h1>
    </div>
  );
}

