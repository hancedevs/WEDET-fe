import { ProfileOption } from "@/types/type";
import { User, X } from "lucide-react";

function SettingsTab({
    profile,
    actionOptions,
    handleLogout,
}: {
    profile: any;
    actionOptions: ProfileOption[];
    handleLogout: () => Promise<void>;
}) {
    return (
        <div className="lg:w-[500px]">
            <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
                <ul className="space-y-4">
                    {actionOptions.map((option, index) => (
                        <li key={index}>
                            <button
                                onClick={option.onClick}
                                className="flex items-center gap-3 w-full text-left py-2 hover:bg-gray-50 rounded-lg transition"
                                style={{
                                    fontFamily: "'Century Gothic', sans-serif",
                                }}
                            >
                                <div
                                    className={`p-2 rounded-full ${option.color} bg-gray-50`}
                                >
                                    {option.icon}
                                </div>
                                <span className="text-lg font-medium text-gray-700">
                                    {option.label}
                                </span>
                            </button>
                        </li>
                    ))}
                    {/* Logout Button in Settings Tab (Matching Image 2) */}
                    <li>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full text-left py-2 hover:bg-red-50 rounded-lg transition"
                        >
                            <div className="p-2 rounded-full text-red-500 bg-gray-50">
                                <X className="w-5 h-5" />
                            </div>
                            <span className="text-lg font-medium text-red-600">
                                Logout
                            </span>
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default SettingsTab;
