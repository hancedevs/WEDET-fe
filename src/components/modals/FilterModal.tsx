"use client";

import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

const filterSchema = z.object({
    minPrice: z
        .string()
        .optional()
        .refine(
            (val) => !val || !isNaN(Number(val)),
            "Min Price must be a number"
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

type Props = {
    open: boolean;
    setOpen: (open: boolean) => void;
};

export default function FilterOptionsModal({ open, setOpen }: Props) {
    const form = useForm<FilterFormValues>({
        resolver: zodResolver(filterSchema),
        defaultValues: {
            minPrice: "",
            maxPrice: "",
            nearestDate: false,
        },
        mode: "onSubmit",
    });

    const onSubmit = (data: FilterFormValues) => {
        console.log("Filters Applied:", data);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent
                className="w-11/12 max-w-md p-6 rounded-2xl bg-white border-none shadow-2xl"
                style={{ fontFamily: "'Century Gothic', sans-serif" }}
            >
                <DialogHeader className="p-0 space-y-0">
                    <DialogTitle
                        className="text-xl font-bold text-[#28B872] text-left mb-6"
                        style={{
                            fontFamily: "'Century Gothic', sans-serif",
                            fontWeight: 700,
                        }}
                    >
                        Filter Options
                    </DialogTitle>
                </DialogHeader>

                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <div>
                        <Label
                            htmlFor="minPrice"
                            className="text-gray-900 text-base font-normal mb-2 block"
                        >
                            Min Price
                        </Label>
                        <Input
                            id="minPrice"
                            placeholder="No minimum"
                            type="text"
                            {...form.register("minPrice")}
                            className="w-full h-12 rounded-lg border border-gray-200 px-4 text-base shadow-sm focus-visible:ring-[#28B872] focus-visible:ring-offset-0"
                            style={{
                                fontFamily: "'Century Gothic', sans-serif",
                                fontWeight: 300,
                            }}
                        />
                        {form.formState.errors.minPrice && (
                            <p className="text-red-500 text-sm mt-1">
                                {form.formState.errors.minPrice.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label
                            htmlFor="maxPrice"
                            className="text-gray-900 text-base font-normal mb-2 block"
                        >
                            Max Price
                        </Label>
                        <Input
                            id="maxPrice"
                            placeholder="No maximum"
                            type="text"
                            {...form.register("maxPrice")}
                            className="w-full h-12 rounded-lg border border-gray-200 px-4 text-base shadow-sm focus-visible:ring-[#28B872] focus-visible:ring-offset-0"
                            style={{
                                fontFamily: "'Century Gothic', sans-serif",
                                fontWeight: 300,
                            }}
                        />
                        {form.formState.errors.maxPrice && (
                            <p className="text-red-500 text-sm mt-1">
                                {form.formState.errors.maxPrice.message}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center space-x-2 pt-2">
                        <Checkbox
                            id="nearestDate"
                            checked={form.watch("nearestDate")}
                            onCheckedChange={(checked) =>
                                form.setValue("nearestDate", !!checked)
                            }
                            className="h-5 w-5 rounded-sm border-gray-300 data-[state=checked]:bg-[#28B872] data-[state=checked]:text-white focus-visible:ring-offset-0 focus-visible:ring-[#28B872]"
                        />
                        <Label
                            htmlFor="nearestDate"
                            className="text-base font-normal text-gray-800 cursor-pointer select-none"
                            style={{
                                fontFamily: "'Century Gothic', sans-serif",
                                fontWeight: 300,
                            }}
                        >
                            Show only trips with nearest date
                        </Label>
                    </div>

                    <div className="pt-4">
                        <PrimaryButton type="submit" className="w-full">
                            Apply Filters
                        </PrimaryButton>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
