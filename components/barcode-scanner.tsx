"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface BarcodeScannerProps {
  onDetected: (barcode: string) => void
}

export function BarcodeScanner({ onDetected }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // In a real implementation, we would use a barcode scanning library
  // For this demo, we'll simulate barcode detection

  useEffect(() => {
    let stream: MediaStream | null = null

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        })

        if (videoRef.current) {
          videoRef.current.srcObject = stream
          setIsScanning(true)
          setError(null)
        }
      } catch (err) {
        console.error("Error accessing camera:", err)
        setError("Could not access camera. Please check permissions.")
        setIsScanning(false)
      }
    }

    if (isScanning) {
      startCamera()
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [isScanning])

  // Simulate barcode detection
  useEffect(() => {
    if (!isScanning) return

    const simulateDetection = () => {
      // Generate a random barcode from our product list
      const barcodes = ["8901234567890", "8901234567891", "8901234567892", "8901234567893", "8901234567894"]

      const randomBarcode = barcodes[Math.floor(Math.random() * barcodes.length)]
      onDetected(randomBarcode)
      setIsScanning(false)
    }

    // Simulate detection after 3 seconds
    const timer = setTimeout(simulateDetection, 3000)

    return () => clearTimeout(timer)
  }, [isScanning, onDetected])

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col items-center space-y-4">
          {error && <p className="text-red-500">{error}</p>}

          <div className="relative w-full max-w-sm aspect-video bg-black rounded-md overflow-hidden">
            {isScanning ? (
              <>
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                <div className="absolute inset-0 border-2 border-red-500 opacity-50 pointer-events-none"></div>
                <p className="absolute bottom-2 left-0 right-0 text-center text-white bg-black bg-opacity-50 py-1">
                  Scanning...
                </p>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <p className="text-muted-foreground">Camera inactive</p>
              </div>
            )}
            <canvas ref={canvasRef} className="hidden" />
          </div>

          <Button onClick={() => setIsScanning(!isScanning)} variant={isScanning ? "destructive" : "default"}>
            {isScanning ? "Stop Scanning" : "Start Scanning"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

