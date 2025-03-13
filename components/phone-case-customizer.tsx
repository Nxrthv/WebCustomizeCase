"use client"

import { useState, useRef, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs"
import { Button } from "@/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select"
import { Slider } from "@/ui/slider"
import { Download, RotateCw, ZoomIn } from "lucide-react"
import ImageUploader from "./image-uploader"
// import ImageSearch from "./image-search"
import { phoneCaseModels } from "lib/phone-case-models"

export default function PhoneCaseCustomizer() {
  const [selectedModel, setSelectedModel] = useState(phoneCaseModels[0].id)
  const [customImage, setCustomImage] = useState<string | null>(null)
  const [imageScale, setImageScale] = useState(1)
  const [imageRotation, setImageRotation] = useState(0)
  const [imageOffsetX, setImageOffsetX] = useState(0)
  const [imageOffsetY, setImageOffsetY] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleImageSelected = (imageUrl: string) => {
    setCustomImage(imageUrl)
  }

  const handleModelChange = (value: string) => {
    setSelectedModel(value)
  }

  const handleExport = () => {
    if (!canvasRef.current) return;
  
    // Crear un nuevo canvas temporal
    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");
  
    if (!tempCtx) return;
  
    tempCanvas.width = canvasRef.current.width;
    tempCanvas.height = canvasRef.current.height;
  
    const radius = 30;
    tempCtx.beginPath();
    tempCtx.moveTo(radius, 0);
    tempCtx.lineTo(tempCanvas.width - radius, 0);
    tempCtx.quadraticCurveTo(tempCanvas.width, 0, tempCanvas.width, radius);
    tempCtx.lineTo(tempCanvas.width, tempCanvas.height - radius);
    tempCtx.quadraticCurveTo(tempCanvas.width, tempCanvas.height, tempCanvas.width - radius, tempCanvas.height);
    tempCtx.lineTo(radius, tempCanvas.height);
    tempCtx.quadraticCurveTo(0, tempCanvas.height, 0, tempCanvas.height - radius);
    tempCtx.lineTo(0, radius);
    tempCtx.quadraticCurveTo(0, 0, radius, 0);
    tempCtx.closePath();
    tempCtx.clip(); // Aplica el recorte redondeado
  
    // Dibujar la imagen del canvas original en el nuevo canvas
    tempCtx.drawImage(canvasRef.current, 0, 0);
  
    // Descargar la imagen con esquinas redondeadas y fondo transparente
    const link = document.createElement("a");
    link.download = `custom-phone-case-${selectedModel}.png`;
    link.href = tempCanvas.toDataURL("image/png");
    link.click();
  };  
  
  const drawImageProperly = (ctx: CanvasRenderingContext2D, img: HTMLImageElement, canvas: HTMLCanvasElement) => {
    const canvasRatio = canvas.width / canvas.height
    const imageRatio = img.width / img.height
  
    let drawWidth = canvas.width
    let drawHeight = canvas.height
  
    if (imageRatio > canvasRatio) {
      drawWidth = (canvas.height / img.height) * img.width
    } else {
      drawHeight = (canvas.width / img.width) * img.height
    }
  
    const offsetX = (canvas.width - drawWidth) / 2 + imageOffsetX
    const offsetY = (canvas.height - drawHeight) / 2 + imageOffsetY
  
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight)
  }
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  function renderPreview() {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
  
    if (!canvas || !ctx) return
  
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  
    if (customImage) {
      const userImage = new Image()
      userImage.crossOrigin = "anonymous"
      userImage.src = customImage
  
      userImage.onload = () => {
        ctx.save()
        ctx.translate(canvas.width / 2, canvas.height / 2)
        ctx.rotate((imageRotation * Math.PI) / 180)
        ctx.scale(imageScale, imageScale)
        ctx.translate(-canvas.width / 2, -canvas.height / 2)
        ctx.shadowColor = "rgba(0, 0, 0, 0.25)"
        ctx.shadowBlur = 20
        ctx.shadowOffsetX = 5
        ctx.shadowOffsetY = 5
        ctx.globalAlpha = 0.15
        drawPhoneCase(ctx, canvas)
        ctx.globalAlpha = 1
        ctx.fillStyle = "#ffffff"; // Fondo blanco o cualquier color deseado
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        drawImageProperly(ctx, userImage, canvas)
      
        ctx.restore()
        drawPhoneCase(ctx, canvas)
      }      
    } else {
      // Si no hay imagen personalizada, solo dibujar la funda
      drawPhoneCase(ctx, canvas)
    }
  }  
  
  const drawPhoneCase = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const selectedCase = phoneCaseModels.find((model) => model.id === selectedModel)
    if (selectedCase) {
      const caseImage = new Image()
      caseImage.crossOrigin = "anonymous"
      caseImage.src = selectedCase.imageUrl
  
      caseImage.onload = () => {
        ctx.drawImage(caseImage, 0, 0, canvas.width, canvas.height)
      }
    }
  }
  
  // Resize canvas to match container size
  useEffect(() => {
    const resizeCanvas = () => {
      if (containerRef.current && canvasRef.current) {
        const { width } = containerRef.current.getBoundingClientRect()
        // Maintain aspect ratio (assuming phone cases are roughly 2:1)
        canvasRef.current.width = width
        canvasRef.current.height = width * 2
      }
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  // Re-render preview when dependencies change
  useEffect(() => {
    renderPreview()
  }, [selectedModel, customImage, imageScale, imageRotation, renderPreview])

  return (
    <div className="grid md:grid-cols-2 gap-8 md:ml-16">
      <div className="flex flex-col gap-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">1. Seleccione el modelo de funda del teléfono</h2>
          <Select value={selectedModel} onValueChange={handleModelChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select a phone model" />
            </SelectTrigger>
            <SelectContent>
              {phoneCaseModels.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  {model.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">2. Agrega una Imagen</h2>
          <Tabs defaultValue="upload">
            <TabsList className="grid">
              <TabsTrigger value="upload">Subir Imagen</TabsTrigger>
              {/* <TabsTrigger value="search">Search Online</TabsTrigger> */}
            </TabsList>
            <TabsContent value="upload">
              <ImageUploader onImageSelected={handleImageSelected} />
            </TabsContent>
            {/* <TabsContent value="search">
              <ImageSearch onImageSelected={handleImageSelected} />
            </TabsContent> */}
          </Tabs>
        </div>

        {customImage && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">3. Ajustar Imagen</h2>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium flex items-center">
                  <ZoomIn className="w-4 h-4 mr-2" />
                  Escala
                </label>
                <span className="text-sm">{imageScale.toFixed(1)}x</span>
              </div>
              <Slider
                value={[imageScale]}
                min={0.5}
                max={2}
                step={0.1}
                onValueChange={(values) => setImageScale(values[0])}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium flex items-center">
                  <RotateCw className="w-4 h-4 mr-2" />
                  Rotación
                </label>
                <span className="text-sm">{imageRotation}°</span>
              </div>
              <Slider
                value={[imageRotation]}
                min={0}
                max={360}
                step={5}
                onValueChange={(values) => setImageRotation(values[0])}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium flex items-center">
                  ↔ Desplazar Horizontalmente
                </label>
                <span className="text-sm">{imageOffsetX}px</span>
              </div>
              <Slider
                value={[imageOffsetX]}
                min={-100}
                max={100}
                step={1}
                onValueChange={(values) => setImageOffsetX(values[0])}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium flex items-center">
                  ↕ Desplazar Verticalmente
                </label>
                <span className="text-sm">{imageOffsetY}px</span>
              </div>
              <Slider
                value={[imageOffsetY]}
                min={-100}
                max={100}
                step={1}
                onValueChange={(values) => setImageOffsetY(values[0])}
              />
            </div>
          </div>
        )}

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">4. Exporta tu Diseño</h2>
          <Button onClick={handleExport} disabled={!customImage} className="w-full">
            <Download className="w-4 h-4 mr-2" />
            Descargar funda de teléfono personalizada
          </Button>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <h2 className="text-xl font-semibold mb-4">¡Mira el Resultado 🙀!</h2>
        <div ref={containerRef} className="w-full z-index-100 p-6 max-w-[300px] mx-auto border overflow-hidden bg-white" style={{ borderRadius: "30px" }}>
          <canvas ref={canvasRef} className="w-full" />
        </div>
        <p className="text-sm text-muted-foreground mt-2 text-center">
          Así es como se verá la funda de su teléfono personalizada
        </p>
      </div>
    </div>
  )
}