import { ArrowLeft } from "lucide-react";

interface ProgressHeaderProps {
  step: number;
  onBack?: () => void;
}

export default function ProgressHeader({ step, onBack }: ProgressHeaderProps) {
  return (
    <div className="bg-white">
      <div className="flex items-start gap-2 px-4 pt-4 pb-1">
        <button
          onClick={onBack}
          className="mt-[2px]" 
          aria-label="Go back"
          type="button"
        >
          <ArrowLeft className="w-6 h-6 text-[#26cc73]" strokeWidth={2.5} />
        </button>
        <div>
          <div
            className="font-bold text-lg text-black leading-none"
            style={{ fontFamily: "'Century Gothic', sans-serif" }}
          >
            Book Your Adventure
          </div>
          <div
            className="text-[12px] text-gray-400 font-semibold leading-tight"
            style={{ fontFamily: "'Century Gothic', sans-serif" }}
          >
            Step {step} of 4
          </div>
        </div>
      </div>
      <div className="px-4 pb-2">
        <div className="w-full h-2 bg-[#e9f4f1] rounded-full">
          <div
            className="h-2 bg-[#26cc73] rounded-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
