import { Mode } from '../hooks/useChat';

interface ModeSelectorProps {
  onSelect: (mode: Mode) => void;
}

export default function ModeSelector({ onSelect }: ModeSelectorProps) {
  const modes = [
    { id: 'baseline', name: 'Базовый набор', color: 'blue', icon: '/icons/baseline.svg' },
    { id: 'strategist', name: 'Холодный стратег', color: 'slate', icon: '/icons/strategist.svg' },
    { id: 'antihero', name: 'Антигерой', color: 'red', icon: '/icons/antihero.svg' },
    { id: 'manipulator', name: 'Социальный манипулятор', color: 'violet', icon: '/icons/manipulator.svg' }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-gray-50 to-gray-100">
      <h1 className="text-4xl font-bold mb-4 text-gray-800">Alter Ego Architect</h1>
      <p className="text-gray-600 mb-10">Выбери свою тень</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        {modes.map(mode => (
          <button
            key={mode.id}
            onClick={() => onSelect(mode.id as Mode)}
            className={`flex items-center gap-4 p-6 rounded-2xl border-2 transition-all hover:scale-[1.02] shadow-md ${
              mode.color === 'blue' ? 'border-blue-500 hover:bg-blue-50' :
              mode.color === 'slate' ? 'border-slate-700 hover:bg-slate-50' :
              mode.color === 'red' ? 'border-red-500 hover:bg-red-50' :
              'border-violet-500 hover:bg-violet-50'
            }`}
          >
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              mode.color === 'blue' ? 'bg-blue-100 text-blue-600' :
              mode.color === 'slate' ? 'bg-slate-100 text-slate-700' :
              mode.color === 'red' ? 'bg-red-100 text-red-600' :
              'bg-violet-100 text-violet-600'
            }`}>
              <img src={mode.icon} alt={mode.name} className="w-6 h-6" />
            </div>
            <span className="text-lg font-semibold text-gray-800">{mode.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}