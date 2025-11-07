"use client";

import * as React from "react";
import { Funnel } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

const filterSchema = z.object({
    minPrice: z
        .string()
        .optional()
        .refine(
            (val) => !val || !isNaN(Number(val)),
            "Min Price must be a numberr"
        ),
    maxPrice: z
        .string()
        .optional()
        .refine(
            (val) => !val || !isNaN(Number(val)),
            "Max Price must be a number"
        ),
    nearestDate: z.boolean().default(false),
});

type FilterFormValues = z.infer<typeof filterSchema>;

export default function FilterDropdown() {
    const form = useForm<FilterFormValues>({
        resolver: zodResolver(filterSchema),
        defaultValues: { minPrice: "", maxPrice: "", nearestDate: false },
    });

    const [active, setActive] = React.useState(false);

    const onSubmit = (data: FilterFormValues) => {
        console.log("Filters Applied:", data);
        setActive(false);
    };

    return (
        <DropdownMenu onOpenChange={(open) => setActive(open)}>
            <DropdownMenuTrigger asChild>
                <div
                    className={`relative flex items-center justify-center h-10 w-10 rounded-full shadow transition border border-green-100 focus:outline-none focus:ring-2 focus:ring-green-300 cursor-pointer ${
                        active
                            ? "bg-green-50 ring-2 ring-green-500 ring-offset-2 shadow-[0_0_10px_2px_rgba(34,197,94,0.6)]"
                            : "bg-white"
                    }`}
                >
                    <Funnel
                        size={25}
                        strokeWidth={0.75}
                        className="text-green-500 transition-colors duration-200"
                    />
                </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className="w-80 bg-white rounded-2xl shadow-xl border border-gray-100 p-4"
            >
                <DropdownMenuLabel className="text-green-600 font-bold mb-4">
                    Filter Options
                </DropdownMenuLabel>

                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    <div>
                        <Label
                            htmlFor="minPrice"
                            className="text-gray-900 text-sm mb-1 block"
                        >
                            Min Price
                        </Label>
                        <Input
                            id="minPrice"
                            placeholder="No minimum"
                            type="text"
                            {...form.register("minPrice")}
                            className="w-full h-10 rounded-lg border border-gray-200 px-3 text-sm shadow-sm focus-visible:ring-[#28B872] focus-visible:ring-offset-0"
                        />
                        {form.formState.errors.minPrice && (
                            <p className="text-red-500 text-xs mt-1">
                                {form.formState.errors.minPrice.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label
                            htmlFor="maxPrice"
                            className="text-gray-900 text-sm mb-1 block"
                        >
                            Max Price
                        </Label>
                        <Input
                            id="maxPrice"
                            placeholder="No maximum"
                            type="text"
                            {...form.register("maxPrice")}
                            className="w-full h-10 rounded-lg border border-gray-200 px-3 text-sm shadow-sm focus-visible:ring-[#28B872] focus-visible:ring-offset-0"
                        />
                        {form.formState.errors.maxPrice && (
                            <p className="text-red-500 text-xs mt-1">
                                {form.formState.errors.maxPrice.message}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="nearestDate"
                            checked={form.watch("nearestDate")}
                            onCheckedChange={(checked) =>
                                form.setValue("nearestDate", !!checked)
                            }
                            className="h-4 w-4 rounded-sm border-gray-300 data-[state=checked]:bg-[#28B872] data-[state=checked]:text-white focus-visible:ring-offset-0 focus-visible:ring-[#28B872]"
                        />
                        <Label
                            htmlFor="nearestDate"
                            className="text-sm text-gray-800 cursor-pointer select-none"
                        >
                            Show only trips with nearest date
                        </Label>
                    </div>
                </form>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
