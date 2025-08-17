import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AutoResizeInput } from '@/components/ui/auto-resize-input';
import { Card } from '@/components/ui/card';
import { Send, MessageCircle, X } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export const ChatBox = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI assistant. I can help you with vehicle scanning, valuations, and bid requests. What would you like to know?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    setIsExpanded(true);

    // Focus back to input after sending
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "I understand you're asking about " + inputText + ". Let me help you with that. This is a demo response - in a real implementation, this would connect to an AI service.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-20 left-4 right-4 md:bottom-6 md:left-auto md:right-6 md:w-96 z-40">
      {/* Expanded chat */}
      {isExpanded && (
        <Card className="mb-2 shadow-xl border-0 bg-background/95 backdrop-blur">
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold">AI Assistant</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(false)}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>

          {/* Messages */}
          <div className="h-48 overflow-y-auto p-3 space-y-3">
            {messages.slice(1).map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-2 rounded-lg text-xs ${
                    message.isUser
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted text-muted-foreground p-2 rounded-lg text-xs">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </Card>
      )}

      {/* Always visible input */}
      <Card className="shadow-lg border-0 bg-background/95 backdrop-blur">
        <div className="p-3">
          <div className="flex space-x-2">
            <AutoResizeInput
              ref={inputRef}
              value={inputText}
              onChange={(e) => {
                e.stopPropagation();
                setInputText(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSendMessage();
                }
              }}
              onFocus={() => messages.length > 1 && setIsExpanded(true)}
              placeholder="Ask me anything..."
              className="flex-1 text-sm"
              disabled={isLoading}
              minRows={1}
              maxRows={4}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isLoading}
              size="sm"
              className="px-3"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};