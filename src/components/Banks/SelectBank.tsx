import { useState } from "react";
import { CreditCard, Landmark } from "lucide-react";
import Image from "next/image";

export default function PaymentMethods() {
    const [payment, setPayment] = useState<string | null>(null);
    const [selectedBank, setSelectedBank] = useState<string | null>(null);

    const banks = [
        {
            name: "Commercial Bank of Ethiopia",
            short: "CBE",
            logo: "/cbe.png", // ✅ Replace with your real logo path
        },
        {
            name: "Bank of Abyssinia",
            short: "Abyssinia",
            logo: "/abyssinia.png",
        },
        {
            name: "Awash Bank",
            short: "Awash",
            logo: "/awash.png",
        },
    ];

    return (
        <div>
            <span className="text-sm font-bold text-[#BEBEBE] ml-2 mt-4">
                Payment method
            </span>

            <div className="bg-white rounded-[28px] border-2 border-[#E8E8E8] shadow-[0_2px_8px_#00000010] px-4 py-4 mt-2">
                <div className="flex gap-2">
                    <button
                        className={`flex items-center gap-2 border-2 w-full justify-center py-2 rounded-full text-base font-bold transition
                            ${
                                payment === "tell_birr"
                                    ? "bg-[#28B872] text-white shadow-[0_1.5px_8px_#28B87222] border-none"
                                    : "bg-white text-[#BEBEBE] border border-[#E8E8E8]"
                            }`}
                        onClick={() => {
                            setPayment("tell_birr");
                            setSelectedBank(null);
                        }}
                    >
                        <Image
                            src={"/telebirr.png"}
                            alt={"telebirr"}
                            width={40}
                            height={40}
                            className="object-contain"
                        />
                        TeleBirr
                    </button>

                    {/* Bank Transfer */}
                    <button
                        className={`flex items-center border-2 gap-2 w-full justify-center py-2 rounded-full text-base font-bold transition
                            ${
                                payment === "bank_transfer"
                                    ? "bg-[#28B872] text-white shadow-[0_1.5px_8px_#28B87222] border-none"
                                    : "bg-white text-[#BEBEBE] border border-[#E8E8E8]"
                            }`}
                        onClick={() => setPayment("bank_transfer")}
                    >
                        <Landmark size={20} />
                        Bank Transfer
                    </button>
                </div>

                {/* Bank List */}
                {payment === "bank_transfer" && (
                    <div className="mt-4 flex flex-col gap-3">
                        {banks.map((bank) => (
                            <button
                                key={bank.short}
                                onClick={() => setSelectedBank(bank.short)}
                                className={`flex items-center gap-3 border-2 rounded-[20px] py-2 px-3 transition text-left
                                    ${
                                        selectedBank === bank.short
                                            ? "border-[#28B872] bg-[#F3FFF8] shadow-[0_2px_6px_#28B87222]"
                                            : "border-[#E8E8E8] bg-white"
                                    }`}
                            >
                                <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center">
                                    <Image
                                        src={bank.logo}
                                        alt={bank.name}
                                        width={40}
                                        height={40}
                                        className="object-contain"
                                    />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-[#333]">
                                        {bank.name}
                                    </p>
                                    <p className="text-xs text-[#999]">
                                        {bank.short}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
