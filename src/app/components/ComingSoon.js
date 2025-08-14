import { Button } from "./ui/button";
import Link from "next/link";

export default function ComingSoon() {
  return (
    <div className="min-h-screen bg-[#f4fff6] flex items-center justify-center p-4">
      <div className="w-full max-w-lg mx-auto text-center space-y-6">
        {/* Icon Container */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-green-100 rounded-full flex items-center justify-center shadow-lg">
            <svg 
              className="w-10 h-10 sm:w-12 sm:h-12 text-green-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" 
              />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
            Carbon Calculator
          </h1>
          
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-md mx-auto">
            Calculate your carbon footprint and discover personalized offset opportunities to make a real environmental impact.
          </p>
        </div>

        {/* Coming Soon Badge */}
        <div className="flex justify-center my-6">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full">
            <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Coming Soon</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4">
          <Link href='/marketplace'><Button
            className="bg-green-600 hover:bg-green-700 text-white font-medium px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            aria-label="Return to marketplace"
          >
            Back to Marketplace
          </Button></Link>
        </div>

        {/* Additional Info */}
        <div className="pt-6 border-t border-gray-200 mt-8">
          <p className="text-sm text-gray-500 leading-relaxed">
            Get notified when our carbon calculator launches and start tracking your environmental impact.
          </p>
        </div>
      </div>
    </div>
  );
}