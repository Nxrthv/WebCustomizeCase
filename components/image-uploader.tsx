"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload } from "lucide-react"

interface ImageUploaderProps {
  onImageSelected: (imageUrl: string) => void
}

export default function ImageUploader({ onImageSelected }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files?.length) {
      const file = e.dataTransfer.files[0]
      processFile(file)
    }
  }

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Por favor, cargue una imagen")
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string
      setPreview(imageUrl)
      onImageSelected(imageUrl)
    }
    reader.readAsDataURL(file)
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragging ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
        <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
        <p className="text-sm font-medium">Arrastre y suelte una imagen, o haga clic para explorar</p>
        <p className="text-xs text-muted-foreground mt-1">Soporta JPG, PNG, WEBP</p>
      </div>

      {preview && (
        <div className="mt-4">
          <p className="text-sm font-medium mb-2">Selected Image:</p>
          <div className="relative aspect-square w-full max-w-[200px] mx-auto overflow-hidden rounded-md border">
            <img src={preview || "/placeholder.svg"} alt="Preview" className="object-contain w-full h-full" />
          </div>
        </div>
      )}
    </div>
  )
}