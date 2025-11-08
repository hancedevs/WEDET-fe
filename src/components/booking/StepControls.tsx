import { ArrowLeft, ArrowRight } from "lucide-react";

interface Props {
    step: number;
    onNext?: () => void;
    onPrev?: () => void;
    disableNext?: boolean;
}

export default function StepControls({
    step,
    onNext,
    onPrev,
    disableNext,
}: Props) {
    return (
        <div className="flex items-center justify-between px-6 py-3 mb-18 select-none">
            {/* Previous */}
            {step === 1 ? (
                <div />
            ) : (
                <button
                    onClick={onPrev}
                    type="button"
                    className="flex items-center gap-2 text-gray-400 font-bold text-xl focus:outline-none hover:text-gray-500 transition"
                    style={{ fontFamily: "'Red Hat', sans-serif" }}
                >
                    <ArrowLeft className="w-6 h-6" />
                    Previous
                </button>
            )}

            {/* Next */}
            <button
                onClick={onNext}
                type="submit"
                disabled={disableNext}
                className={`flex items-center gap-2 text-[#26cc73] font-bold text-xl focus:outline-none transition
          ${
              disableNext
                  ? "opacity-50 pointer-events-none"
                  : "hover:text-[#179a53]"
          }`}
                style={{ fontFamily: "'Red Hat', sans-serif" }}
            >
                Next
                <ArrowRight className="w-6 h-6" />
            </button>
        </div>
    );
}
