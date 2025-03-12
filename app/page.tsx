import type { Metadata } from "next"
import PhoneCaseCustomizer from "@/phone-case-customizer"

export const metadata: Metadata = {
  title: "Personaliza la funda de tu teléfono",
  description: "Personaliza la funda de tu teléfono con tus propias imágenes",
}

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-center mb-8">Personalizalo Ahora</h1>
      <PhoneCaseCustomizer />
    </main>
  )
}