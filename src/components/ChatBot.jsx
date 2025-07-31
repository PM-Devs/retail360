import { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, Sparkles, AlertCircle } from 'lucide-react';

const TypewriterText = ({ text, speed = 5, onComplete }) => {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (!text) return;
    
    setDisplayText('');
    setIsTyping(true);
    let i = 0;
    
    const typeTimer = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.substring(0, i + 1));
        i++;
      } else {
        setIsTyping(false);
        clearInterval(typeTimer);
        if (onComplete) onComplete();
      }
    }, speed);

    return () => clearInterval(typeTimer);
  }, [text, speed, onComplete]);

  return (
    <div className="relative">
      {displayText}
      {isTyping && <span className="animate-pulse ml-1 text-gray-400">▋</span>}
    </div>
  );
};

// Axios service for AFIA AI API
// Updated Axios service for AFIA AI API
const afiaApiService = {
  async sendMessage(question) {
    try {
      // Retrieve user data from localStorage
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const token = localStorage.getItem('authToken');

      const response = await fetch('https://retail360-backend.vercel.app/api/afia/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userQuestion: question,  // Changed from 'question' to 'userQuestion'
          userId: userData.id || null,
          shopId: userData.currentShop || null
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('AFIA API Error:', error);
      throw error;
    }
  }
};
const ChatBot = ({ dashboardData, isVisible, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initialMessages = [
    {
      type: 'bot',
      content: "Hi there! I'm AFIA AI, your Cognitive User Interface developed by Godfred kubra👋"
    },
    {
      type: 'bot',
      content: `I've analyzed your store data and noticed you've made ${dashboardData?.todayStats?.transactions || 0} transactions today with revenue of GHS ${dashboardData?.todayStats?.revenue?.toFixed(2) || '0.00'}!`
    },
    {
      type: 'bot',
      content: "I can help you with inventory management, sales analysis, customer insights, transaction processing, and business recommendations. What would you like to know?"
    }
  ];

  const quickActions = [
    "Show today's sales summary",
    "Check low stock items",
    "Analyze customer trends",
    "Generate sales report",
    "Process a new transaction",
    "Check inventory levels"
  ];

  useEffect(() => {
    if (isVisible && !hasInitialized) {
      setHasInitialized(true);
      setMessages([]);
      setError(null);
      
      // Add messages sequentially with delays
      initialMessages.forEach((msg, index) => {
        setTimeout(() => {
          setMessages(prev => [...prev, msg]);
          if (index === initialMessages.length - 1) {
            setTimeout(() => setShowQuickActions(true), 200);
          }
        }, (index + 1) * 500);
      });
    }
  }, [isVisible, hasInitialized]);

  // Reset when chat becomes invisible
  useEffect(() => {
    if (!isVisible) {
      setHasInitialized(false);
      setMessages([]);
      setShowQuickActions(false);
      setIsTyping(false);
      setError(null);
    }
  }, [isVisible]);

  const handleSendMessage = async (message = inputMessage) => {
    if (!message.trim()) return;

    // Hide quick actions once user starts chatting
    setShowQuickActions(false);
    setError(null);

    const userMessage = { type: 'user', content: message };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Call AFIA AI API
      const result = await afiaApiService.sendMessage(message);
      
      if (result.success) {
        const botResponse = {
          type: 'bot',
          content: result.response || result.data?.response || "I've processed your request successfully!",
          functionCalls: result.data?.functionCalls || result.functionCalls || []
        };

        setMessages(prev => [...prev, botResponse]);
        setIsConnected(true);
      } else {
        throw new Error(result.error?.message || 'Failed to get response from AFIA AI');
      }
    } catch (error) {
      console.error('Chat error:', error);
      setError(error.message);
      setIsConnected(false);
      
      // Add error message to chat
      const errorMessage = {
        type: 'bot',
        content: `I apologize, but I'm having trouble connecting to my services right now. ${error.message.includes('fetch') ? 'Please check your internet connection and try again.' : 'Please try again in a moment.'}`,
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };



  const handleQuickAction = (action) => {
    handleSendMessage(action);
  };

  const retryConnection = () => {
    setError(null);
    setIsConnected(true);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300" 
        onClick={onClose}
      />
      
      {/* Chat Container */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[95vh] w-[600px] max-w-[95vw] bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 flex flex-col animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 z-50 overflow-hidden">
        
        {/* Header */}
        <div className="relative p-6 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white rounded-t-3xl">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20 rounded-t-3xl" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-gray-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Bot size={24} className="text-white" />
                </div>
                <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                  isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'
                }`} />
              </div>
              <div>
                <h3 className="font-bold text-xl bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  AFIA AI
                </h3>
                <p className="text-sm text-blue-200 flex items-center gap-1">
                  <Sparkles size={12} />
                  {isConnected ? 'Cognitive User Interface' : 'Connection Error'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-all duration-200 hover:scale-110"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Connection Error Banner */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 m-4 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
              <div className="flex-1">
                <p className="text-sm text-red-700">Connection Issue: {error}</p>
              </div>
              <button
                onClick={retryConnection}
                className="text-sm text-red-600 hover:text-red-800 font-medium"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-8 space-y-4 bg-gradient-to-b from-slate-50/50 to-white/50">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start gap-4 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center shadow-md ${
                message.type === 'user' 
                  ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white' 
                  : message.isError 
                    ? 'bg-gradient-to-br from-red-100 to-red-200 border border-red-300'
                    : 'bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-300'
              }`}>
                {message.type === 'user' ? (
                  <span className="text-sm font-semibold">You</span>
                ) : message.isError ? (
                  <AlertCircle size={18} className="text-red-600" />
                ) : (
                  <Bot size={18} className="text-slate-700" />
                )}
              </div>
              
              {/* Message Bubble */}
              <div className={`max-w-[75%] px-5 py-4 rounded-2xl shadow-sm ${
                message.type === 'user'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-tr-md'
                  : message.isError
                    ? 'bg-red-50 border border-red-200 text-red-800 rounded-tl-md'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-tl-md'
              }`}>
                {message.type === 'bot' && index === messages.length - 1 && !isTyping ? (
                  <TypewriterText text={message.content} speed={25} />
                ) : (
                  <div>
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    {message.functionCalls && message.functionCalls.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-200">
                        <p className="text-xs text-slate-500 mb-2">Functions executed:</p>
                        <div className="flex flex-wrap gap-1">
                          {message.functionCalls.map((call, idx) => (
                            <span key={idx} className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                              {call.functionName || 'Function'}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-300 flex items-center justify-center shadow-md">
                <Bot size={18} className="text-slate-700" />
              </div>
              <div className="bg-white border border-slate-200 px-5 py-4 rounded-2xl rounded-tl-md shadow-sm">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}
          
          {/* Quick Actions */}
          {showQuickActions && !isTyping && (
            <div className="space-y-3 pt-6">
              <div className="text-center">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-4">
                  Suggested Actions
                </p>
              </div>
              <div className="grid gap-3">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickAction(action)}
                    className="group text-left p-4 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-blue-700 rounded-xl transition-all duration-200 border border-blue-200/50 hover:border-blue-300 hover:shadow-md transform hover:-translate-y-0.5"
                  >
                    <span className="text-sm font-medium">{action}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-8 bg-white/80 backdrop-blur-sm border-t border-slate-200/50">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isTyping && handleSendMessage()}
                placeholder="Ask me anything about your store..."
                disabled={isTyping}
                className="w-full px-5 py-4 pr-12 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 text-sm placeholder-slate-400 transition-all duration-200 disabled:opacity-50"
              />
            </div>
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim() || isTyping}
              className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
            >
              <Send size={20} />
            </button>
          </div>
          <div className="mt-2 text-center">
            <p className="text-xs text-slate-400">
              {isConnected ? 'Connected to AFIA AI' : 'Offline mode - limited functionality'}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatBot;

