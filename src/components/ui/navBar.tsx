"use client";
import React, { useMemo, useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { House, LineSquiggle, MapPin, User } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

const NOTCH_WIDTH = 80;
const NOTCH_HEIGHT = 25;
const CONTROL_POINT_OFFSET = 25;
const TAB_BAR_HEIGHT = 80;

const createTabBarPath = (
    currentTabIndex: number,
    totalTabs: number,
    containerWidth: number
) => {
    const TAB_WIDTH = containerWidth / totalTabs;

    let path = `M0,0`;

    const curveStart =
        TAB_WIDTH * currentTabIndex +
        TAB_WIDTH / 2 -
        (NOTCH_WIDTH / 2 + CONTROL_POINT_OFFSET);
    path += `L${curveStart},0`;

    path += `Q${TAB_WIDTH * currentTabIndex + TAB_WIDTH / 2 - NOTCH_WIDTH / 2},0
                ${
                    TAB_WIDTH * currentTabIndex +
                    TAB_WIDTH / 2 -
                    NOTCH_WIDTH / 2 +
                    CONTROL_POINT_OFFSET / 1.55
                },${NOTCH_HEIGHT}`;

    path += `L${TAB_WIDTH * currentTabIndex + TAB_WIDTH / 2 - 14},${
        NOTCH_HEIGHT + 8.8
    } `;

    path += `Q${TAB_WIDTH * currentTabIndex + TAB_WIDTH / 2},${
        NOTCH_HEIGHT + 15
    } `;
    path += `${TAB_WIDTH * currentTabIndex + TAB_WIDTH / 2 + 14},${
        NOTCH_HEIGHT + 8.8
    } `;

    path += `L${
        TAB_WIDTH * currentTabIndex +
        TAB_WIDTH / 2 +
        NOTCH_WIDTH / 2 -
        CONTROL_POINT_OFFSET / 1.55
    },${NOTCH_HEIGHT}`;

    path += `Q${TAB_WIDTH * currentTabIndex + TAB_WIDTH / 2 + NOTCH_WIDTH / 2},0
                ${
                    TAB_WIDTH * currentTabIndex +
                    TAB_WIDTH / 2 +
                    NOTCH_WIDTH / 2 +
                    CONTROL_POINT_OFFSET
                },0`;

    path += `L${containerWidth},0`;
    path += `L${containerWidth},${TAB_BAR_HEIGHT} L0,${TAB_BAR_HEIGHT} Z`;

    return path;
};

export default function NavBar() {
    const router = useRouter();
    const pathname = usePathname();
    const navRef = useRef<HTMLElement | null>(null);
    const [containerWidth, setContainerWidth] = useState(0);

    const navItems = useMemo(
        () => [
            {
                label: "Explore",
                key: "explore",
                icon: <House size={26} strokeWidth={1.5} />,
                path: "/home",
            },
            {
                label: "My Trips",
                key: "trips",
                icon: <LineSquiggle size={26} strokeWidth={1.5} />,
                path: "/wishlist",
            },
            {
                label: "Profile",
                key: "profile",
                icon: <User size={26} strokeWidth={1.5} />,
                path: "/user_profile",
            },
        ],
        []
    );

    const handleTabClick = async (path: string) => {
        const protectedPages = ["/wishlist", "/user_profile"];
        if (protectedPages.includes(path)) {
            const {
                data: { session },
            } = await supabase.auth.getSession();
            if (!session) {
                router.push("/auth/login"); // redirect to login if not logged in
                return;
            }
        }
        router.push(path); // otherwise go to the page
    };

    const activeIndex = navItems.findIndex((item) => item.path === pathname);
    const totalTabs = navItems.length;

    useEffect(() => {
        const updateWidth = () => {
            if (navRef.current) {
                // clientWidth is the inner width that matches how flex distributes space
                setContainerWidth(navRef.current.clientWidth);
            }
        };

        updateWidth();
        window.addEventListener("resize", updateWidth);
        return () => window.removeEventListener("resize", updateWidth);
    }, []);

    const svgPath = useMemo(() => {
        if (containerWidth > 0) {
            return createTabBarPath(
                activeIndex === -1 ? 0 : activeIndex,
                totalTabs,
                containerWidth
            );
        }
        return "";
    }, [activeIndex, totalTabs, containerWidth]);

    const baseColor = "text-[#959494]";

    return (
        <div className="fixed inset-x-0 bottom-0 z-50 w-full">
            <nav
                ref={navRef}
                className="relative h-20 bg-transparent flex items-end w-full max-w-none "
                aria-label="Bottom Navigation"
            >
                {containerWidth > 0 && (
                    <svg
                        viewBox={`0 0 ${containerWidth} ${TAB_BAR_HEIGHT}`}
                        preserveAspectRatio="none"
                        width="100%"
                        height={TAB_BAR_HEIGHT}
                        className="absolute bottom-0 left-0 right-0 z-0"
                        style={{
                            filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.1))",
                        }}
                        aria-hidden
                    >
                        <path d={svgPath} fill="#FFFFFF" />
                    </svg>
                )}

                <div className="flex h-full w-full relative z-10 pb-2">
                    {navItems.map((item, idx) => {
                        const isActive = pathname === item.path;
                        const iconTranslateY = isActive ? "-20px" : "0px";

                        return (
                            <button
                                key={item.key}
                                onClick={() => handleTabClick(item.path)}
                                className="flex-1 flex flex-col items-center justify-center h-full transition-all duration-300 ease-in-out focus:outline-none relative z-10"
                                aria-label={item.label}
                                aria-current={isActive ? "page" : undefined}
                            >
                                <div
                                    className={`w-[50px] h-[50px] rounded-full flex items-center justify-center transition-all duration-300 ease-in-out ${
                                        isActive
                                            ? "bg-[#28B872] shadow-lg"
                                            : "bg-transparent"
                                    }`}
                                    style={{
                                        transform: `translateY(${iconTranslateY})`,
                                        boxShadow: isActive
                                            ? "0 4px 10px rgba(0, 0, 0, 0.1)"
                                            : "none",
                                    }}
                                >
                                    <div
                                        className={
                                            isActive ? "text-white" : baseColor
                                        }
                                    >
                                        {item.icon}
                                    </div>
                                </div>

                                <span
                                    className={`text-xs mt-1 transition-all duration-300 ${
                                        isActive
                                            ? "text-[#28B872] font-semibold"
                                            : baseColor
                                    }`}
                                    style={{
                                        fontFamily: "'Fredoka', sans-serif",
                                    }}
                                >
                                    {item.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
}
