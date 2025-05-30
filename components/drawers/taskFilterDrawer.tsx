"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {taskPriorityOptions, taskStatusOptions} from "@/types/task";

// Define the schema using Zod
const filterSchema = z.object({
    sort: z.enum([
        "startHighToLow",
        "startLowToHigh",
        "dueHighToLow",
        "dueLowToHigh",
        "createdHighToLow",
        "createdLowToHigh",
    ]),
    priority: z.array(z.string()).optional(),
    status: z.array(z.string()).optional(),
    project: z.array(z.string()).optional(),
})

type FilterFormValues = z.infer<typeof filterSchema>

interface DocOptionsDrawerProps {
    drawerOpenState: boolean
    setOpenState: (state: boolean) => void
}

export function TaskFilterDrawer({ drawerOpenState, setOpenState }: DocOptionsDrawerProps) {
    const [activeTab, setActiveTab] = React.useState("sort")

    const {
        control,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
        register,
    } = useForm<FilterFormValues>({
        resolver: zodResolver(filterSchema),
        defaultValues: {
            sort: "startHighToLow",
            priority: [],
            status: [],
            project: [],
        },
    })

    const filterCategories = [
        { id: "sort", label: "Sort" },
        { id: "priority", label: "Priority" },
        { id: "status", label: "Status" },
        { id: "project", label: "Project" },
    ]

    const sortOptions = [
        { id: "startHighToLow", label: "Start: High to Low" },
        { id: "startLowToHigh", label: "Start: Low to High" },
        { id: "dueHighToLow", label: "Due: High to Low" },
        { id: "dueLowToHigh", label: "Due: Low to High" },
        { id: "createdHighToLow", label: "Create: High to Low" },
        { id: "createdLowToHigh", label: "Create: Low to High" },
    ]


    const projectOptions = [
        { id: "proj1", label: "Project 1" },
        { id: "proj2", label: "Project 2" },
        { id: "proj3", label: "Project 3" },

    ]

    const onSubmit = (data: FilterFormValues) => {
        console.log("Filter applied:", data)
        setOpenState(false)
    }

    const closeDrawer = () => {
        setOpenState(false)

    }

    const renderTabContent = () => {
        if (activeTab === "sort") {
            return (
                <RadioGroup
                    value={watch("sort")}
                    onValueChange={(value) => control._formValues.sort = value}
                    className="space-y-4"
                >
                    {sortOptions.map((option) => (
                        <div key={option.id} className="flex items-center space-x-3">
                            <RadioGroupItem
                                value={option.id}
                                id={option.id}
                                className="border-gray-600"
                            />
                            <Label className='font-normal' htmlFor={option.id}>{option.label}</Label>
                        </div>
                    ))}
                </RadioGroup>
            )
        }

        const optionsMap = {
            priority: taskPriorityOptions,
            status: taskStatusOptions,
            project: projectOptions,
        }

        const currentOptions = optionsMap[activeTab as keyof typeof optionsMap] || []
        const fieldName = activeTab as "priority" | "status" | "project";

        return (
            <div className="space-y-4 ">
                {currentOptions.map((option) => (
                    <div key={option.id} className="flex items-center space-x-3">
                        <Checkbox
                            id={`${activeTab}-${option.id}`}
                            checked={watch(fieldName)?.includes(option.id)}
                            onCheckedChange={(checked) => {
                                const currentValues = watch(fieldName) || [];
                                const newValues = checked
                                    ? [...currentValues, option.id]
                                    : currentValues.filter((val) => val !== option.id);
                                setValue(fieldName, newValues);
                            }}
                            {...register(`${activeTab}` as keyof FilterFormValues)}
                            value={option.id}
                            className="h-5 w-5 border-gray-600"
                        />
                        <Label className='font-normal' htmlFor={`${activeTab}-${option.id}`}>{option.label}</Label>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <Drawer onOpenChange={closeDrawer} open={drawerOpenState}>
            <DrawerContent>
                <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                    <DrawerHeader className="text-left">
                        <DrawerTitle>Sort and filter</DrawerTitle>
                        <DrawerDescription></DrawerDescription>
                    </DrawerHeader>
                    <div className="h-full">
                        <div className="grid grid-cols-9 border-t border-b h-[40vh]">
                            {/* Vertical Tabs */}
                            <div className="border-r col-span-3">
                                {filterCategories.map((category) => (
                                    <div
                                        key={category.id}
                                        className={`p-4 border-b flex justify-between items-center cursor-pointer ${
                                            activeTab === category.id ? "bg-secondary" : ""
                                        }`}
                                        onClick={() => setActiveTab(category.id)}
                                    >
                                        <span>{category.label}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Tab Content */}
                            <div className="p-6 col-span-6 overflow-y-auto h-full">
                                {renderTabContent()}
                                {errors[activeTab as keyof FilterFormValues] && (
                                    <p className="text-red-500 text-sm mt-2">
                                        {errors[activeTab as keyof FilterFormValues]?.message}
                                    </p>
                                )}
                            </div>
                        </div>
                        <DrawerFooter>
                            <Button type="submit">Apply</Button>
                        </DrawerFooter>
                    </div>
                </form>
            </DrawerContent>
        </Drawer>
    )
}