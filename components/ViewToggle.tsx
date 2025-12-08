import React from 'react';
import { ViewMode } from '../types';
import { LayoutGrid, List } from './Icons';

interface ViewToggleProps {
  selectedView: ViewMode;
  onChange: (view: ViewMode) => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ selectedView, onChange }) => {
  const activeClasses = "bg-white/80 text-[var(--color-primary)] shadow-md";
  const inactiveClasses = "text-gray-500 hover:bg-black/5";

  return (
    <div className="flex items-center p-1 bg-black/5 rounded-lg">
      <button
        onClick={() => onChange(ViewMode.Timeline)}
        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-300 text-sm font-medium ${selectedView === ViewMode.Timeline ? activeClasses : inactiveClasses}`}
      >
        <LayoutGrid size={16} />
        Timeline
      </button>
      <button
        onClick={() => onChange(ViewMode.List)}
        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-300 text-sm font-medium ${selectedView === ViewMode.List ? activeClasses : inactiveClasses}`}
      >
        <List size={16} />
        List
      </button>
    </div>
  );
};

export default ViewToggle;