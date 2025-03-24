"use client"

import { useState, useRef, useEffect } from "react"
import { useChat } from "ai/react"
import { Bot, X, Send, Maximize, Minimize, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "welcome-message",
        role: "assistant",
        content: "Hello! I'm your ScanPOS assistant. How can I help you today?",
      },
    ],
    onError: (err) => {
      console.error("Chat error:", err)
    },
  })

  const toggleChat = () => {
    if (isMinimized) {
      setIsMinimized(false)
    } else {
      setIsOpen(!isOpen)
    }
  }

  const minimizeChat = () => {
    setIsMinimized(true)
  }

  const maximizeChat = () => {
    setIsMinimized(false)
  }

  const closeChat = () => {
    setIsOpen(false)
    setIsMinimized(false)
  }

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current && isOpen && !isMinimized) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isOpen, isMinimized])

  if (!isOpen) {
    return (
      <Button onClick={toggleChat} className="fixed bottom-4 right-4 rounded-full h-12 w-12 p-0 shadow-lg">
        <MessageSquare className="h-6 w-6" />
      </Button>
    )
  }

  return (
    <Card
      className={cn(
        "fixed right-4 transition-all duration-300 shadow-lg",
        isMinimized ? "bottom-4 h-14 w-64" : "bottom-4 w-80 md:w-96 h-[500px] max-h-[80vh]",
      )}
    >
      {isMinimized ? (
        <div className="flex items-center justify-between p-4 h-full">
          <div className="flex items-center">
            <Bot className="h-5 w-5 mr-2" />
            <span className="font-medium">AI Assistant</span>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={maximizeChat} className="h-8 w-8">
              <Maximize className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={closeChat} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <>
          <CardHeader className="p-3 flex flex-row items-center justify-between border-b">
            <div className="flex items-center">
              <Bot className="h-5 w-5 mr-2" />
              <span className="font-medium">AI Assistant</span>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={minimizeChat} className="h-8 w-8">
                <Minimize className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={closeChat} className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-y-auto" style={{ height: "calc(100% - 120px)" }}>
            <div className="flex flex-col p-3 gap-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "max-w-[80%] rounded-lg p-3",
                    message.role === "user" ? "bg-primary text-primary-foreground ml-auto" : "bg-muted",
                  )}
                >
                  {message.content}
                </div>
              ))}
              {error && (
                <div className="bg-red-100 text-red-800 max-w-[80%] rounded-lg p-3">
                  Error: {error.message || "Failed to load response. Please check your API key."}
                </div>
              )}
              {isLoading && (
                <div className="bg-muted max-w-[80%] rounded-lg p-3">
                  <div className="flex gap-1">
                    <div className="h-2 w-2 rounded-full bg-current animate-bounce" />
                    <div className="h-2 w-2 rounded-full bg-current animate-bounce delay-75" />
                    <div className="h-2 w-2 rounded-full bg-current animate-bounce delay-150" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
          <CardFooter className="p-3 border-t">
            <form onSubmit={handleSubmit} className="flex w-full gap-2">
              <Input placeholder="Type your message..." value={input} onChange={handleInputChange} className="flex-1" />
              <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </>
      )}
    </Card>
  )
}

