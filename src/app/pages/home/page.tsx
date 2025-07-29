"use client";
import Header from "@/app/components/ui/Header";
import TopRecomanded from "@/app/components/ui/TopRecomanded";
function Page() {
  return (
    <div className="relative">
      <div className="fixed top-0 left-0 w-full z-50">
        <div>
          <Header />
        </div>
      </div>
      <div className="pt-20">
        <TopRecomanded />
      </div>
    </div>
  );
}

export default Page;
