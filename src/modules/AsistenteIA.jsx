import { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Sparkles, AlertTriangle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function AsistenteIA() {
  const { user } = useAppContext();
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'ai',
      content: `¡Hola ${user?.name || 'Doctor'}! Soy tu Asistente Médico Inteligente (Versión Demo). Por ahora mi cerebro no está conectado a la red neuronal real, pero esta es la interfaz donde pronto podrás hacerme preguntas clínicas, pedirme ayuda con diagnósticos diferenciales o consultar interacciones de medicamentos.`
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = { id: Date.now(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulated AI response delay
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        role: 'ai',
        content: `Esta es una respuesta simulada a tu consulta: "${userMsg.content}". Cuando conectemos la API (ej. OpenAI o Claude), aquí recibirás la respuesta clínica real procesando tu caso clínico.`
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="animate-fade-in pb-20 md:pb-0 h-[85vh] flex flex-col">
      <div className="mb-4 shrink-0">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight flex items-center gap-3 mb-2">
          <Bot className="w-8 h-8 text-primary" /> Asistente IA
        </h2>
        <p className="text-on-surface-variant text-lg">Tu copiloto clínico potenciado por Inteligencia Artificial.</p>
      </div>

      <div className="bg-surface-container-low border border-warning/50 rounded-xl p-4 mb-4 flex items-start gap-3 shrink-0">
        <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
        <div className="text-sm text-on-surface-variant">
          <p className="font-bold text-on-surface">Modo Demostración Activo</p>
          <p>La interfaz gráfica del chat está 100% operativa. Próximamente se integrará una API Key para que el asistente pueda razonar y responder casos clínicos reales.</p>
        </div>
      </div>

      <div className="flex-1 bg-surface/80 backdrop-blur-xl rounded-t-3xl border border-outline/10 shadow-sm flex flex-col overflow-hidden relative">
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar space-y-6">
          {messages.map(msg => (
            <div key={msg.id} className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
              <div className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center border-2 border-surface shadow-sm ${msg.role === 'user' ? 'bg-primary-container overflow-hidden' : 'bg-primary text-white'}`}>
                {msg.role === 'user' ? (
                  <img src={user?.photo || "/dra-elizabeth.jpg"} alt="User" className="w-full h-full object-cover" />
                ) : (
                  <Sparkles className="w-5 h-5" />
                )}
              </div>
              <div className={`p-4 rounded-2xl ${msg.role === 'user' ? 'bg-primary text-white rounded-tr-sm shadow-md' : 'bg-surface-container-low border border-outline/10 rounded-tl-sm shadow-sm'}`}>
                <p className="text-sm md:text-base whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-4 max-w-[85%]">
              <div className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center border-2 border-surface shadow-sm bg-primary text-white">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="p-4 rounded-2xl bg-surface-container-low border border-outline/10 rounded-tl-sm shadow-sm flex items-center gap-1.5">
                <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-surface border-t border-outline/10 shrink-0">
          <form onSubmit={handleSubmit} className="relative flex items-center max-w-4xl mx-auto">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe un caso clínico o pregunta médica..." 
              className="w-full bg-surface-container-low border border-outline/20 rounded-full py-4 pl-6 pr-16 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-on-surface"
              disabled={isTyping}
            />
            <button 
              type="submit" 
              disabled={!input.trim() || isTyping}
              className="absolute right-2 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary-container hover:text-on-primary-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="text-center mt-3">
            <span className="text-[10px] text-outline uppercase tracking-wider font-bold">La IA puede cometer errores. Verifique siempre con literatura médica vigente.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
