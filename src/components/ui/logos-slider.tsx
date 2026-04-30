import { InfiniteSlider } from '@/components/ui/infinite-slider';
import { ProgressiveBlur } from '@/components/ui/progressive-blur';
import { 
  FaStripe, 
  FaCcVisa, 
  FaCcMastercard, 
  FaCcApplePay, 
  FaPaypal, 
  FaGooglePay, 
  FaBitcoin, 
  FaEthereum 
} from 'react-icons/fa';
import { SiAmericanexpress, SiWise, SiRevolut, SiRobinhood } from 'react-icons/si';

const fintechLogos = [
  { id: "stripe", Icon: FaStripe, color: "#635BFF", label: "Stripe" },
  { id: "visa", Icon: FaCcVisa, color: "#1A1F71", label: "Visa" },
  { id: "mastercard", Icon: FaCcMastercard, color: "#EB001B", label: "Mastercard" },
  { id: "applepay", Icon: FaCcApplePay, color: "#000000", label: "Apple Pay" },
  { id: "paypal", Icon: FaPaypal, color: "#003087", label: "PayPal" },
  { id: "googlepay", Icon: FaGooglePay, color: "#4285F4", label: "Google Pay" },
  { id: "bitcoin", Icon: FaBitcoin, color: "#F7931A", label: "Bitcoin" },
  { id: "ethereum", Icon: FaEthereum, color: "#3C3C3D", label: "Ethereum" },
  { id: "amex", Icon: SiAmericanexpress, color: "#007BC1", label: "Amex" },
  { id: "wise", Icon: SiWise, color: "#00B9FF", label: "Wise" },
  { id: "revolut", Icon: SiRevolut, color: "#000000", label: "Revolut" },
  { id: "robinhood", Icon: SiRobinhood, color: "#00C805", label: "Robinhood" },
];

export function LogosSlider() {
  return (
    <div className="relative w-full overflow-hidden bg-background/50 backdrop-blur-sm border-y border-border/50 py-10">
      <InfiniteSlider 
        className="flex h-full w-full items-center" 
        duration={40}
        gap={80}
      >
        {fintechLogos.map((logo) => (
          <div 
            key={logo.id} 
            className="flex items-center gap-3 px-4 group cursor-pointer"
          >
            <div className="p-2 rounded-xl bg-white/5 border border-white/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-white/10 group-hover:border-primary/30">
               <logo.Icon className="w-8 h-8 opacity-50 transition-opacity group-hover:opacity-100" style={{ color: logo.color }} />
            </div>
            <span className="text-sm font-display font-medium text-text-secondary/40 uppercase tracking-widest group-hover:text-text-secondary transition-colors">
              {logo.label}
            </span>
          </div>
        ))}
      </InfiniteSlider>
      
      {/* Cinematic Progressive Blurs */}
      <ProgressiveBlur
        className="pointer-events-none absolute top-0 left-0 h-full w-[150px] z-10"
        direction="left"
        blurIntensity={1.5}
      />
      <ProgressiveBlur
        className="pointer-events-none absolute top-0 right-0 h-full w-[150px] z-10"
        direction="right"
        blurIntensity={1.5}
      />
    </div>
  );
}
