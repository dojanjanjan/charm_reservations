import React from 'react';
import { X } from './Icons';
import { useLanguage } from '../hooks/useLanguage';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-white flex-shrink-0">
          <h3 className="text-xl font-bold text-[var(--color-primary)]">{t.helpTitle}</h3>
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-800 transition-colors">
            <X size={24} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto space-y-8">
          <section className="space-y-4">
            <div className="space-y-6">
              <div>
                <h5 className="font-bold text-gray-800 text-lg mb-2">{t.help.creating}</h5>
                <ul className="list-disc list-inside text-gray-600 text-sm space-y-1.5 ml-2">
                  <li>{t.help.creatingStep1}</li>
                  <li>{t.help.creatingStep2}</li>
                  <li>{t.help.creatingStep3}</li>
                  <li>{t.help.creatingStep4}</li>
                  <li>{t.help.creatingStep5}</li>
                </ul>
              </div>

              <div>
                <h5 className="font-bold text-gray-800 text-lg mb-2">{t.help.editing}</h5>
                <ul className="list-disc list-inside text-gray-600 text-sm space-y-1.5 ml-2">
                  <li>{t.help.editingStep1}</li>
                  <li>{t.help.editingStep2}</li>
                  <li>{t.help.editingStep3}</li>
                </ul>
              </div>

              <div>
                <h5 className="font-bold text-gray-800 text-lg mb-2">{t.help.canceling}</h5>
                <ul className="list-disc list-inside text-gray-600 text-sm space-y-1.5 ml-2">
                  <li>{t.help.cancelingStep1}</li>
                  <li>{t.help.cancelingStep2}</li>
                  <li>{t.help.cancelingStep3}</li>
                </ul>
              </div>

              <div>
                <h5 className="font-bold text-gray-800 text-lg mb-2">{t.help.viewOptions}</h5>
                <ul className="list-disc list-inside text-gray-600 text-sm space-y-1.5 ml-2">
                  <li>{t.help.viewOption1}</li>
                  <li>{t.help.viewOption2}</li>
                  <li>{t.help.viewOption3}</li>
                </ul>
              </div>

              <div>
                <h5 className="font-bold text-gray-800 text-lg mb-2">{t.help.indicators}</h5>
                <ul className="list-disc list-inside text-gray-600 text-sm space-y-1.5 ml-2">
                  <li>{t.help.indicator1}</li>
                  <li>{t.help.indicator2}</li>
                  <li>{t.help.indicator3}</li>
                  <li>{t.help.indicator4}</li>
                  <li>{t.help.indicator5}</li>
                </ul>
              </div>

              <div>
                <h5 className="font-bold text-gray-800 text-lg mb-2">{t.help.tableInfo}</h5>
                <ul className="list-disc list-inside text-gray-600 text-sm space-y-1.5 ml-2">
                  <li>{t.help.tableInfo1}</li>
                  <li>{t.help.tableInfo2}</li>
                  <li>{t.help.tableInfo3}</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
        <div className="p-4 border-t border-gray-100 flex justify-end bg-gray-50">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold rounded-lg transition-colors shadow-sm"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;

