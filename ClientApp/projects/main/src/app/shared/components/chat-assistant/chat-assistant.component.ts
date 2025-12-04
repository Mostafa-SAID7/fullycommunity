import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

@Component({
  selector: 'app-chat-assistant',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-assistant.component.html',
  styles: [`
    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes typing {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-10px); }
    }
    
    .animate-slide-in-up {
      animation: slideInUp 0.3s ease;
    }
    
    .animate-fade-in {
      animation: fadeIn 0.3s ease;
    }
    
    .typing-dot {
      animation: typing 1.4s infinite;
    }
    
    .typing-dot:nth-child(2) {
      animation-delay: 0.2s;
    }
    
    .typing-dot:nth-child(3) {
      animation-delay: 0.4s;
    }
  `]
})
export class ChatAssistantComponent {
  isOpen = signal(false);
  isMinimized = signal(false);
  messages = signal<ChatMessage[]>([
    {
      id: '1',
      text: 'Hi! I\'m your CommunityCar assistant. How can I help you today?',
      sender: 'assistant',
      timestamp: new Date()
    }
  ]);
  messageInput = signal('');
  isTyping = signal(false);

  quickActions = [
    { icon: '🚗', label: 'Find a car', action: 'find-car' },
    { icon: '🔧', label: 'Book service', action: 'book-service' },
    { icon: '💬', label: 'Ask question', action: 'ask-question' },
    { icon: '📍', label: 'Find location', action: 'find-location' }
  ];

  toggleChat() {
    if (this.isMinimized()) {
      this.isMinimized.set(false);
    } else {
      this.isOpen.update(v => !v);
    }
  }

  minimizeChat() {
    this.isMinimized.set(true);
  }

  closeChat() {
    this.isOpen.set(false);
    this.isMinimized.set(false);
  }

  sendMessage() {
    const text = this.messageInput().trim();
    if (!text) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };
    this.messages.update(msgs => [...msgs, userMessage]);
    this.messageInput.set('');

    // Simulate assistant response
    this.isTyping.set(true);
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: this.getAssistantResponse(text),
        sender: 'assistant',
        timestamp: new Date()
      };
      this.messages.update(msgs => [...msgs, assistantMessage]);
      this.isTyping.set(false);
    }, 1000);
  }

  handleQuickAction(action: string) {
    const actionMessages: Record<string, string> = {
      'find-car': 'I want to find a car',
      'book-service': 'I need to book a service',
      'ask-question': 'I have a question',
      'find-location': 'Help me find a location'
    };
    
    this.messageInput.set(actionMessages[action] || '');
    this.sendMessage();
  }

  private getAssistantResponse(userMessage: string): string {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('find') && lowerMessage.includes('car')) {
      return 'I can help you find a car! What type of vehicle are you looking for? You can browse our marketplace or I can help you with specific requirements.';
    } else if (lowerMessage.includes('service') || lowerMessage.includes('book')) {
      return 'I can help you book a service. Would you like to see available service centers near you or schedule a specific service?';
    } else if (lowerMessage.includes('location') || lowerMessage.includes('where')) {
      return 'I can help you find locations. Are you looking for service centers, car dealerships, or community meetup spots?';
    } else if (lowerMessage.includes('help') || lowerMessage.includes('question')) {
      return 'I\'m here to help! You can ask me about finding cars, booking services, community events, or navigating the platform. What would you like to know?';
    } else {
      return 'Thanks for your message! I\'m here to help with cars, services, and community features. How can I assist you today?';
    }
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }
}
