'use client';

import React, { useState } from 'react';
import { CheckCircle2, XCircle, Sparkles, Award } from 'lucide-react';

const QUESTIONS = [
  "Sais-tu clairement ce que tu veux obtenir grâce au digital ?",
  "As-tu déjà une base de clients fidèles à qui communiquer ?",
  "Es-tu prêt(e) à consacrer quelques heures par semaine à ta communication ?",
  "As-tu déjà testé un outil numérique (site, page pro, réseaux) ?",
  "Te sens-tu curieux(se) d’apprendre à utiliser de nouveaux outils ?",
  "As-tu une offre claire (produits, services, tarifs) ?",
  "As-tu quelques visuels ou photos de ton travail ?",
  "Es-tu à l’aise avec l’idée de parler de ton entreprise en ligne ?",
  "As-tu un minimum d’organisation dans ton activité actuelle ?",
  "Es-tu motivé(e) à faire évoluer ton entreprise ?"
];

export default function DigitalizationQuiz() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});

  const handleOptionChange = (questionIndex: number, isYes: boolean) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: isYes
    }));
  };

  const answeredCount = Object.keys(answers).length;
  const yesCount = Object.values(answers).filter(Boolean).length;
  const isComplete = answeredCount === QUESTIONS.length;

  return (
    <div className="my-10 p-6 sm:p-8 bg-gradient-to-br from-[#f4ede0]/80 via-[#faf8f5] to-[#f4ede0]/40 border-2 border-[#ebdcc8] rounded-3xl shadow-sm space-y-6">
      
      {/* Quiz Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#18757d] text-white text-xs font-black rounded-full uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Test Pratique Interactif</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-black text-[#332420] m-0">
          5. Le test express : ton entreprise est-elle prête ?
        </h3>
        <p className="text-base text-[#5e4d46] m-0 leading-relaxed">
          Coche <strong>Oui</strong> ou <strong>Non</strong> pour chacune des 10 questions ci-dessous. Ton score et ton bilan personnalisé se mettent à jour automatiquement à la fin !
        </p>
      </div>

      {/* Questions Table */}
      <div className="overflow-hidden rounded-2xl border-2 border-[#ebdcc8] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[550px]">
            <thead>
              <tr className="bg-[#18757d] text-white text-xs sm:text-sm uppercase tracking-wider font-extrabold">
                <th className="py-4 px-4 w-12 text-center text-white font-bold">#</th>
                <th className="py-4 px-4 text-white font-bold">Question</th>
                <th className="py-4 px-4 text-center w-28 text-white font-bold">Oui (1 pt)</th>
                <th className="py-4 px-4 text-center w-28 text-white font-bold">Non (0 pt)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f4ede0] text-sm text-[#332420]">
              {QUESTIONS.map((question, idx) => {
                const num = idx + 1;
                const currentVal = answers[idx];

                return (
                  <tr key={idx} className="hover:bg-[#faf8f5] transition-colors">
                    <td className="py-3.5 px-4 font-black text-[#18757d] text-center">{num}</td>
                    <td className="py-3.5 px-4 font-semibold text-[#332420]">{question}</td>
                    
                    {/* Option OUI */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleOptionChange(idx, true)}
                        className={`w-full py-2 px-3 rounded-xl border-2 font-black text-xs uppercase transition-all flex items-center justify-center gap-1.5 ${
                          currentVal === true
                            ? 'bg-[#18757d] text-white border-[#18757d] shadow-sm scale-105'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-[#18757d]/50'
                        }`}
                      >
                        <CheckCircle2 className={`w-4 h-4 ${currentVal === true ? 'text-white' : 'text-slate-400'}`} />
                        <span>Oui</span>
                      </button>
                    </td>

                    {/* Option NON */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleOptionChange(idx, false)}
                        className={`w-full py-2 px-3 rounded-xl border-2 font-black text-xs uppercase transition-all flex items-center justify-center gap-1.5 ${
                          currentVal === false
                            ? 'bg-rose-600 text-white border-rose-600 shadow-sm scale-105'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-rose-300'
                        }`}
                      >
                        <XCircle className={`w-4 h-4 ${currentVal === false ? 'text-white' : 'text-slate-400'}`} />
                        <span>Non</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Result Summary Box */}
      <div
        className={`p-6 rounded-2xl border-2 transition-all space-y-3 text-center shadow-md ${
          !isComplete
            ? 'bg-white border-[#18757d]'
            : yesCount >= 6
            ? 'bg-emerald-50/90 border-emerald-500 text-emerald-950'
            : 'bg-amber-50/90 border-amber-500 text-amber-950'
        }`}
      >
        <div className="flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider text-[#18757d]">
          <Award className="w-4 h-4" />
          <span>Votre Bilan en Temps Réel</span>
        </div>

        <div className="text-3xl sm:text-4xl font-black">
          Score : <span className="text-[#18757d]">{yesCount}</span> / 10
        </div>

        <div className="text-base font-bold leading-relaxed max-w-2xl mx-auto">
          {!isComplete ? (
            <p className="m-0 text-slate-600">
              ⏳ Vous avez répondu à <strong>{answeredCount} / 10</strong> questions. Remplissez tout le questionnaire pour débloquer votre bilan final.
            </p>
          ) : yesCount >= 6 ? (
            <div className="space-y-1">
              <p className="m-0 text-emerald-800 text-lg font-black">
                🎉 Félicitations ! Avec {yesCount}/10 "Oui", ton entreprise est 100% prête à se digitaliser !
              </p>
              <p className="m-0 text-sm text-emerald-700 font-medium">
                Tu possèdes le bon état d'esprit et les fondations nécessaires. Tu peux passer à la vitesse supérieure dès aujourd'hui !
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="m-0 text-amber-900 text-lg font-black">
                💪 Pas de panique avec {yesCount}/10 "Oui" !
              </p>
              <p className="m-0 text-sm text-amber-800 font-medium">
                Tu as encore quelques étapes préparatoires à consolider. Prends le temps de lire nos conseils étape par étape ci-dessous.
              </p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
