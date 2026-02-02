import { Smartphone } from "lucide-react";

export default function LoginHero() {
  return (
    <div className="flex min-h-screen w-1/2 flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#5b7fff] to-[#4158ff] px-12">
      <div className="flex flex-col items-center text-center">
        <div className="mb-12">
          <Smartphone 
            className="text-white/90" 
            size={200} 
            strokeWidth={1}
          />
        </div>
        
        <h1 className="mb-3 text-5xl font-bold text-white">
          Plutus is personal
        </h1>
        <h2 className="mb-6 text-5xl font-bold text-white">
          finance, made simple.
        </h2>
        
        <p className="max-w-md text-lg text-white/90">
          All your accounts, cards, savings,
          <br />
          and investments in one place.
        </p>
      </div>
    </div>
  );
}
