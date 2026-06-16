import { useState, useMemo } from 'react';
import { GraduationCap, CheckCircle2, XCircle, ChevronRight, RefreshCw, Award, Filter } from 'lucide-react';
import { preguntasCaces } from '../data/preguntasCaces';

export default function Caces() {
  const [selectedTopic, setSelectedTopic] = useState('Todas');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const topics = ['Todas', ...new Set(preguntasCaces.map(q => q.tema))];

  const filteredQuestions = useMemo(() => {
    let list = preguntasCaces;
    if (selectedTopic !== 'Todas') {
      list = list.filter(q => q.tema === selectedTopic);
    }
    // Shuffle list for a real simulation feel
    return [...list].sort(() => Math.random() - 0.5);
  }, [selectedTopic]);

  const currentQ = filteredQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / filteredQuestions.length) * 100;

  const handleAnswer = (index) => {
    if (isAnswered) return;
    
    setSelectedAnswer(index);
    setIsAnswered(true);
    
    if (index === currentQ.correcta) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < filteredQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setShowResults(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setShowResults(false);
  };

  const handleTopicChange = (e) => {
    setSelectedTopic(e.target.value);
    handleRestart();
  };

  return (
    <div className="animate-fade-in pb-20 md:pb-0">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight mb-2">Simulador CACES</h2>
          <p className="text-on-surface-variant text-lg">Práctica con preguntas reales por especialidad clínica.</p>
        </div>
        
        {!showResults && (
          <div className="flex items-center gap-3 bg-surface/80 backdrop-blur-md px-4 py-2 rounded-xl border border-outline/10 shadow-sm">
            <Filter className="w-5 h-5 text-primary" />
            <select 
              value={selectedTopic} 
              onChange={handleTopicChange}
              className="bg-transparent font-bold text-on-surface focus:outline-none appearance-none pr-8 cursor-pointer"
            >
              {topics.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {!showResults && currentQ ? (
        <div className="bg-surface/80 backdrop-blur-xl rounded-3xl overflow-hidden border border-outline/10 shadow-sm max-w-3xl mx-auto">
          {/* Header del Simulador */}
          <div className="p-6 border-b border-outline/10 bg-surface/50">
            <div className="flex justify-between items-center mb-4">
              <span className="bg-primary/10 text-primary text-xs font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider">
                {currentQ.tema}
              </span>
              <span className="text-sm font-bold text-outline">
                Pregunta {currentQuestion + 1} de {filteredQuestions.length}
              </span>
            </div>
            
            {/* Barra de progreso */}
            <div className="w-full bg-surface-container-high rounded-full h-2 mb-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Pregunta */}
          <div className="p-6 md:p-8">
            <h3 className="text-xl md:text-2xl font-bold text-on-surface leading-snug mb-8">
              {currentQ.pregunta}
            </h3>

            {/* Opciones */}
            <div className="space-y-4">
              {currentQ.opciones.map((opcion, idx) => {
                let btnStyle = "bg-surface-container-lowest border-outline/20 hover:bg-surface-container hover:border-primary/50 text-on-surface";
                let icon = null;

                if (isAnswered) {
                  if (idx === currentQ.correcta) {
                    btnStyle = "bg-status-success/10 border-status-success text-status-success font-bold shadow-sm";
                    icon = <CheckCircle2 className="w-6 h-6 shrink-0" />;
                  } else if (idx === selectedAnswer) {
                    btnStyle = "bg-error/10 border-error text-error font-bold";
                    icon = <XCircle className="w-6 h-6 shrink-0" />;
                  } else {
                    btnStyle = "bg-surface-container-lowest border-outline/10 text-outline opacity-50";
                  }
                } else if (selectedAnswer === idx) {
                  btnStyle = "bg-primary/10 border-primary text-primary font-bold shadow-sm";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    disabled={isAnswered}
                    className={`w-full text-left p-4 md:p-5 rounded-2xl border-2 transition-all flex items-center justify-between gap-4 ${btnStyle}`}
                  >
                    <span className="text-base md:text-lg">{opcion}</span>
                    {icon}
                  </button>
                );
              })}
            </div>

            {/* Explicación y Botón Siguiente */}
            {isAnswered && (
              <div className="mt-8 animate-fade-in space-y-6">
                <div className="bg-surface-container-low p-5 rounded-2xl border border-outline/10">
                  <h4 className="font-bold text-on-surface flex items-center gap-2 mb-2">
                    <GraduationCap className="w-5 h-5 text-primary" />
                    Explicación de la Guía
                  </h4>
                  <p className="text-on-surface-variant text-sm md:text-base leading-relaxed font-medium">
                    {currentQ.explicacion}
                  </p>
                </div>
                
                <button
                  onClick={handleNext}
                  className="w-full bg-primary text-white p-4 rounded-xl font-extrabold hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-[0_8px_20px_rgba(0,98,141,0.3)] flex items-center justify-center gap-2"
                >
                  {currentQuestion < filteredQuestions.length - 1 ? 'Siguiente Pregunta' : 'Ver Resultados Finales'}
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      ) : showResults ? (
        /* Resultados */
        <div className="bg-surface/80 backdrop-blur-xl rounded-3xl p-8 border border-outline/10 shadow-sm max-w-2xl mx-auto text-center animate-fade-in">
          <div className="w-24 h-24 bg-primary/10 mx-auto rounded-full flex items-center justify-center mb-6">
            <Award className="w-12 h-12 text-primary" />
          </div>
          <h3 className="text-3xl font-extrabold text-on-surface mb-2">¡Simulación Completada!</h3>
          <p className="text-on-surface-variant text-lg mb-8">Tu puntaje final en {selectedTopic === 'Todas' ? 'todas las áreas' : selectedTopic} es:</p>
          
          <div className="text-6xl font-extrabold text-primary mb-2">
            {score} <span className="text-3xl text-outline">/ {filteredQuestions.length}</span>
          </div>
          
          <p className="text-on-surface font-bold mb-8">
            ({Math.round((score / filteredQuestions.length) * 100)}% de aciertos)
          </p>

          <button
            onClick={handleRestart}
            className="bg-surface-container border border-outline/20 text-on-surface px-8 py-3 rounded-xl font-bold hover:bg-surface-container-high transition-colors shadow-sm flex items-center justify-center gap-2 mx-auto"
          >
            <RefreshCw className="w-5 h-5" />
            Reiniciar Simulador
          </button>
        </div>
      ) : (
         <div className="text-center py-12">
            <p className="text-on-surface-variant">No hay preguntas disponibles para esta especialidad.</p>
         </div>
      )}
    </div>
  );
}
