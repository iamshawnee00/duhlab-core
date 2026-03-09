import { useState } from 'react';
import { Coins, ArrowLeft, Gift, ShoppingBag } from 'lucide-react';
import { projectId } from '../utils/supabase/info';

interface RewardsShopProps {
  onBack: () => void;
  userCoins: number;
  accessToken: string | null;
  onCoinsUpdate: (coins: number) => void;
}

const VOUCHERS = [
  {
    id: 1,
    title: "Amazon Gift Card",
    price: 500,
    image: "amazon",
    color: "#FF9900"
  },
  {
    id: 2,
    title: "Grab Voucher",
    price: 300,
    image: "grab",
    color: "#00B14F"
  },
  {
    id: 3,
    title: "Starbucks Coffee",
    price: 250,
    image: "starbucks",
    color: "#00704A"
  },
  {
    id: 4,
    title: "Netflix Premium",
    price: 800,
    image: "netflix",
    color: "#E50914"
  },
  {
    id: 5,
    title: "Spotify Premium",
    price: 400,
    image: "spotify",
    color: "#1DB954"
  },
  {
    id: 6,
    title: "Uber Rides",
    price: 350,
    image: "uber",
    color: "#000000"
  }
];

export function RewardsShop({ onBack, userCoins, accessToken, onCoinsUpdate }: RewardsShopProps) {
  const [selectedVoucher, setSelectedVoucher] = useState<number | null>(null);

  const handleRedeem = async (voucherId: number) => {
    const voucher = VOUCHERS.find(v => v.id === voucherId);
    if (!voucher) return;
    
    if (userCoins < voucher.price) {
      alert('You don\'t have enough coins for this reward!');
      return;
    }

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-e7b4487d/spend-coins`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            amount: voucher.price,
            itemName: voucher.title,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log('Coins spent successfully:', data);
        onCoinsUpdate(data.newBalance);
        alert(`Successfully redeemed ${voucher.title}!`);
        setSelectedVoucher(null);
      } else {
        console.error('Spend coins error:', data.error);
        alert(`Failed to redeem: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Failed to spend coins:', error);
      alert('Failed to process redemption. Please try again.');
    }
  };

  return (
    <div className="h-full w-full bg-[#F5F7FA] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-[#EAEAEA] px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-[#F5F7FA] flex items-center justify-center hover:bg-[#EAEAEA] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#192A56]" />
          </button>

          {/* Coin Balance */}
          <div className="bg-[#FFC045] rounded-full px-4 py-2 flex items-center gap-2 shadow-[0px_4px_0px_#E1A32A]">
            <Coins className="w-5 h-5 text-[#192A56]" />
            <span className="text-[#192A56] font-heading" style={{ fontSize: '18px', fontWeight: 700 }}>
              {userCoins}
            </span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-[#192A56] font-heading" style={{ fontSize: '28px', fontWeight: 700, lineHeight: '36px' }}>
          Rewards Shop
        </h1>
        <p className="text-[#636E72] font-sans mt-1" style={{ fontSize: '14px', fontWeight: 400, lineHeight: '20px' }}>
          Redeem your coins for amazing rewards
        </p>
      </div>

      {/* Voucher Grid */}
      <div className="flex-1 overflow-auto px-6 py-6">
        <div className="grid grid-cols-2 gap-4 pb-6">
          {VOUCHERS.map((voucher) => (
            <div
              key={voucher.id}
              className="bg-white rounded-[16px] border border-[#EAEAEA] shadow-[0px_4px_12px_rgba(0,0,0,0.05)] overflow-hidden"
            >
              {/* Voucher Image Placeholder */}
              <div 
                className="h-32 flex items-center justify-center relative overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${voucher.color}20 0%, ${voucher.color}10 100%)` }}
              >
                <div className="absolute inset-0 opacity-5" style={{
                  backgroundImage: `repeating-linear-gradient(
                    45deg,
                    transparent,
                    transparent 10px,
                    ${voucher.color}40 10px,
                    ${voucher.color}40 20px
                  )`
                }} />
                
                {/* Icon */}
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center relative z-10"
                  style={{ backgroundColor: voucher.color }}
                >
                  {voucher.image === "amazon" && (
                    <ShoppingBag className="w-8 h-8 text-white" />
                  )}
                  {voucher.image === "grab" && (
                    <ShoppingBag className="w-8 h-8 text-white" />
                  )}
                  {voucher.image === "starbucks" && (
                    <Gift className="w-8 h-8 text-white" />
                  )}
                  {voucher.image === "netflix" && (
                    <Gift className="w-8 h-8 text-white" />
                  )}
                  {voucher.image === "spotify" && (
                    <Gift className="w-8 h-8 text-white" />
                  )}
                  {voucher.image === "uber" && (
                    <ShoppingBag className="w-8 h-8 text-white" />
                  )}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-4">
                {/* Title */}
                <h3 className="text-[#192A56] font-heading mb-3" style={{ fontSize: '16px', fontWeight: 600, lineHeight: '22px' }}>
                  {voucher.title}
                </h3>

                {/* Redeem Button */}
                <button className="w-full h-10 bg-[#FFC045] rounded-full text-[#192A56] font-heading shadow-[0px_3px_0px_#E1A32A] active:translate-y-[2px] active:shadow-[0px_1px_0px_#E1A32A] transition-all flex items-center justify-center gap-2"
                  style={{ fontSize: '14px', fontWeight: 700 }}
                  onClick={() => handleRedeem(voucher.id)}
                >
                  <Coins className="w-4 h-4" />
                  {voucher.price}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}