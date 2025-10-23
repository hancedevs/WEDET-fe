import { Skeleton } from "../ui/skeleton";

const UserProfileSkeleton = () => {
    return (
        <div
            className="min-h-screen bg-gray-50 pb-24 lg:w-[500px]"
            style={{ fontFamily: "'Century Gothic', sans-serif" }}
        >
            <div className="max-w-xl mx-auto p-4">
                <div className="flex items-center justify-between mb-8">
                    <Skeleton className="h-9 w-9 rounded-full" />
                    <div className="flex gap-4">
                        <Skeleton className="h-9 w-20 rounded-xl" />
                        <Skeleton className="h-9 w-20 rounded-xl" />
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-lg p-6 mb-8 border border-gray-100">
                    <div className="flex items-start gap-4">
                        <Skeleton className="w-16 h-16 rounded-full" />
                        <div className="flex-1 min-w-0 space-y-2">
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                    </div>
                </div>

                {/* Tab Content Area (Bookings or Settings) */}
                <Skeleton className="h-10 w-full mb-4 rounded-xl" />
                <div className="bg-white rounded-3xl shadow-lg p-4 border border-gray-100 space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="flex justify-between items-center py-2"
                        >
                            <Skeleton className="h-5 w-1/3" />
                            <Skeleton className="h-5 w-1/4" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserProfileSkeleton;
