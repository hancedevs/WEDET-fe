export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  dateOfBirth: string
  gender: "male" | "female"
  avatar?: string
}

export interface OnboardingStep {
  id: number
  title: string
  description: string
  image: string
}

export interface Destination {
  id: string
  name: string
  location: string
  rating: number
  reviews: string
  price: string
  duration: string
  image: string
  agency: string
}

export interface Category {
  id: string
  name: string
  slug: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface FormErrors {
  [key: string]: string | undefined
}