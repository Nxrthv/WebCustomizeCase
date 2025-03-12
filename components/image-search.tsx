"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/ui/button"
import { Input } from "@/ui/input"
import { Search } from "lucide-react"

interface ImageSearchProps {
  onImageSelected: (imageUrl: string) => void
}

// Sample images for demo purposes
const sampleImages = [
  "/placeholder.svg?height=300&width=300",
  "/placeholder.svg?height=300&width=300&text=Nature",
  "/placeholder.svg?height=300&width=300&text=Abstract",
  "/placeholder.svg?height=300&width=300&text=Pattern",
  "/placeholder.svg?height=300&width=300&text=Art",
  "/placeholder.svg?height=300&width=300&text=Design",
]

export default function ImageSearch({ onImageSelected }: ImageSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<string[]>(sampleImages)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    // In a real app, you would call an image search API here
    // For this demo, we'll just use the sample images
    setIsSearching(true)

    // Simulate API call delay
    setTimeout(() => {
      setSearchResults(sampleImages)
      setIsSearching(false)
    }, 500)
  }

  const handleImageSelect = (imageUrl: string) => {
    setSelectedImage(imageUrl)
    onImageSelected(imageUrl)
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          type="text"
          placeholder="Search for images..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" disabled={isSearching}>
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
      </form>

      <div className="grid grid-cols-3 gap-2">
        {searchResults.map((imageUrl, index) => (
          <div
            key={index}
            className={`aspect-square cursor-pointer rounded-md overflow-hidden border-2 transition-all ${
              selectedImage === imageUrl ? "border-primary" : "border-transparent hover:border-gray-300"
            }`}
            onClick={() => handleImageSelect(imageUrl)}
          >
            <img
              src={imageUrl || "/placeholder.svg"}
              alt={`Search result ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {selectedImage && (
        <div className="mt-4">
          <p className="text-sm font-medium mb-2">Selected Image:</p>
          <div className="relative aspect-square w-full max-w-[200px] mx-auto overflow-hidden rounded-md border">
            <img src={selectedImage || "/placeholder.svg"} alt="Selected" className="object-contain w-full h-full" />
          </div>
        </div>
      )}
    </div>
  )
}