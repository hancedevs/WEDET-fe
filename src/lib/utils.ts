import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const ONBOARDING_STEPS = [
  {
    id: 1,
    title: "Welcome to Wedet",
    description: "Your personal productivity companion to help you stay organized and efficient",
    image: "/Picture1.png",
  },
  {
    id: 2,
    title: "Task Management",
    description: "Easily create, organize and track all your tasks in one place",
    image: "/Picture2.png",
  },
  {
    id: 3,
    title: "Collaboration",
    description: "Work seamlessly with your team on shared projects and tasks",
    image: "/Picture3.png",
  },
  {
    id: 4,
    title: "Analytics",
    description: "Get insights into your productivity with detailed analytics",
    image: "/Picture4.png",
  },
]