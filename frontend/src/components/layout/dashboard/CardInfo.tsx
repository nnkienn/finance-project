"use client";
import Image from "next/image";

interface CreditCardProps {
  name: string;
  number: string;
  holder: string;
  expiry: string;
  balance: number;
  up: number;
  down: number;
  currency: string;
  status: string;
}

export default function CardInfo({
  name,
  number,
  holder,
  expiry,
  balance,
  up,
  down,
  currency,
  status,
}: CreditCardProps) {
  return (
    <div className="flex flex-col items-start gap-4">
      {/* CREDIT CARD */}
      <div className="relative h-[180px] w-[300px] rounded-2xl p-5 text-white shadow-md overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#7B2CBF] via-[#FF3CAC] to-[#784BA0]" />

        {/* Pattern overlay */}
        <svg
          className="absolute inset-0 w-full h-full opacity-50"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 400 250"
          preserveAspectRatio="none"
        >
          <g stroke="white" strokeWidth="0.5" fill="none" strokeOpacity="0.3">
            <path d="M0 40 Q100 60 200 40 T400 40" />
            <path d="M0 80 Q100 100 200 80 T400 80" />
            <path d="M0 120 Q100 140 200 120 T400 120" />
            <path d="M0 160 Q100 180 200 160 T400 160" />
            <path d="M0 200 Q100 220 200 200 T400 200" />
          </g>
        </svg>

        {/* Card content */}
        <div className="relative flex flex-col h-full justify-between">
          {/* Top row */}
          <div className="flex items-center justify-between text-sm font-semibold">
            <span>{name}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="white"
              strokeWidth={2}
            >
              <path d="M6.34 6.34a8 8 0 0111.32 0M9.17 9.17a4 4 0 015.66 0M12 12h.01" />
            </svg>
          </div>

          {/* Middle */}
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wide">
            <span>{holder}</span>
            <span>{expiry}</span>
          </div>

          {/* Card number */}
          <p className="text-[18px] font-[600] tracking-[0.25em] font-mono">
            {number}
          </p>
        </div>

        {/* Badge */}
        <div className="absolute bottom-4 right-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="50"
            height="30"
            viewBox="0 0 60 40"
            className="opacity-90"
          >
            <polygon points="0,40 10,0 20,0 10,40" fill="#f9c87c" />
            <polygon points="15,40 25,0 35,0 25,40" fill="#ffa433" />
            <polygon points="30,40 40,0 50,0 40,40" fill="#ff6b00" />
          </svg>
        </div>
      </div>

      {/* INFO BOX */}
   <div className="bg-white rounded-2xl shadow p-5 w-[300px]">
  {/* Balance */}
  <div className="mb-3">
    <span className="text-sm text-gray-500 block">Your Balance</span>
    <div className="flex items-center gap-3">
      <span className="font-bold text-xl">${balance.toLocaleString()}</span>
      <span className="text-green-500 text-sm font-medium">↑ {up}%</span>
      <span className="text-red-500 text-sm font-medium">↓ {down}%</span>
    </div>
  </div>

  {/* Divider */}
  <hr className="my-4 border-gray-200" />

  {/* Currency & Status */}
  <div className="flex justify-between text-sm">
    <div>
      <span className="text-gray-500 block">Currency</span>
      <span className="font-semibold">{currency}</span>
    </div>
    <div>
      <span className="text-gray-500 block">Status</span>
      <span className="font-semibold text-green-600">{status}</span>
    </div>
  </div>
</div>

    </div>
  );
}
