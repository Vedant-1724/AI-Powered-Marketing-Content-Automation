import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-2 text-slate-400 hover:text-white transition-all text-sm font-medium group"
    >
      <div className="w-8 h-8 rounded-lg bg-navy-700/50 border border-blue-500/10 flex items-center justify-center group-hover:border-blue-500/30 group-hover:bg-navy-600/50 transition-all">
        <ArrowLeft className="w-4 h-4" />
      </div>
      <span className="group-hover:translate-x-0.5 transition-transform">Back</span>
    </button>
  );
}
