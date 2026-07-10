import React, { useState, useEffect } from "react";

// 1. Data Level Awal (MVP)
const GAME_LEVELS = [
  {
    id: 1,
    clue: "Bentuklah Fi'il Madhi yang berarti 'Dia telah menulis'!",
    rootLetters: ["ك", "ت", "ب"],
    correctPattern: ["َ", "َ", "َ"], // Fathah - Fathah - Fathah (كَتَبَ)
  },
  {
    id: 2,
    clue: "Bentuklah Isim Fa'il yang berarti 'Orang yang menulis' (Penulis)!",
    rootLetters: ["ك", "ا", "ت", "ب"], 
    correctPattern: ["َ", "", "ِ", "ٌ"], // (كَاتِبٌ) -> Alif tidak diberi harakat
  }
];

// 2. Daftar Harakat Pilihan untuk Slider (Kosong/Sukun/Harakat standar)
const HARAKAT_OPTIONS = ["", "َ", "ِ", "ُ", "ْ", "ٌ", "ٍ", "ً"];

export default function App() {
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const currentLevel = GAME_LEVELS[currentLevelIdx];
  
  // State untuk menyimpan harakat yang dipilih user pada setiap huruf
  const [userVowels, setUserVowels] = useState([]);
  const [isCorrect, setIsCorrect] = useState(false);

  // Reset slider setiap kali level berubah
  useEffect(() => {
    setUserVowels(new Array(currentLevel.rootLetters.length).fill(""));
    setIsCorrect(false);
  }, [currentLevelIdx]);

  // Handler ketika slider digeser
  const handleVowelChange = (letterIdx, optionIdx) => {
    const updatedVowels = [...userVowels];
    updatedVowels[letterIdx] = HARAKAT_OPTIONS[optionIdx];
    setUserVowels(updatedVowels);

    // Validasi jawaban secara real-time di sisi client
    const checkAnswer = updatedVowels.every(
      (vowel, i) => vowel === currentLevel.correctPattern[i]
    );
    setIsCorrect(checkAnswer);
  };

  return (
    <div className="w-screen h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-6 select-none overflow-hidden font-sans">
      
      {/* --- AREA 1: TOP BAR (Instruksi Soal) --- */}
      <div className="text-center bg-slate-900/40 backdrop-blur-md border border-slate-800 py-3 px-6 rounded-2xl max-w-3xl mx-auto w-full shadow-lg">
        <span className="text-xs font-bold tracking-widest text-emerald-400 uppercase">
          Tantangan {currentLevelIdx + 1} dari {GAME_LEVELS.length}
        </span>
        <h2 className="text-xl md:text-2xl font-semibold mt-1 text-slate-200">
          {currentLevel.clue}
        </h2>
      </div>

      {/* --- AREA 2: MAIN PLAYGROUND (Mesin Cetak Kata - RTL Flow) --- */}
      <div className="flex flex-row-reverse justify-center items-center gap-8 md:gap-12 my-auto">
        {currentLevel.rootLetters.map((letter, idx) => (
          <div 
            key={idx} 
            className="flex flex-col items-center bg-slate-900/60 backdrop-blur-lg p-5 rounded-2xl border border-slate-800/80 w-28 md:w-32 shadow-xl transition-all duration-300 hover:border-slate-700"
          >
            {/* Slot Harakat Terpilih (Muncul di atas huruf) */}
            <div className="h-10 flex items-center justify-center mb-2">
              <span className="text-3xl font-bold text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]">
                {userVowels[idx] || "◌"}
              </span>
            </div>

            {/* Kontrol Slider Vertikal */}
            <div className="h-32 flex items-center justify-center my-4 relative w-full">
              <input
                type="range"
                min="0"
                max={HARAKAT_OPTIONS.length - 1}
                value={HARAKAT_OPTIONS.indexOf(userVowels[idx] || "")}
                onChange={(e) => handleVowelChange(idx, parseInt(e.target.value))}
                className="accent-emerald-400 cursor-pointer w-28 h-2 h-full rounded-lg appearance-none bg-slate-800 transform -rotate-90 origin-center"
                style={{ WebkitAppearance: 'slider-vertical', writingMode: 'bt-lr' }}
              />
            </div>

            {/* Huruf Konsonan Arab (Besar & Tegas) */}
            <span className="text-5xl font-extrabold text-slate-100 font-serif mt-2 select-none">
              {letter}
            </span>
          </div>
        ))}
      </div>

      {/* --- AREA 3: BOTTOM BAR (Status & Gatekeeper) --- */}
      <div className="flex justify-between items-center bg-slate-900/30 backdrop-blur-md border-t border-slate-800/60 pt-4 px-4">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${isCorrect ? "bg-emerald-400 animate-ping" : "bg-slate-600"}`} />
          <span className="text-sm tracking-wide text-slate-400">
            {isCorrect ? (
              <strong className="text-emerald-400 font-medium">✓ Rumus Shorof Sesuai! Silakan lanjut.</strong>
            ) : (
              "Sesuaikan harakat pada tiang huruf..."
            )}
          </span>
        </div>
        
        <button
          onClick={() => currentLevelIdx < GAME_LEVELS.length - 1 && setCurrentLevelIdx(currentLevelIdx + 1)}
          disabled={!isCorrect}
          className={`px-6 py-3 rounded-xl font-bold tracking-wide transition-all duration-300 shadow-md ${
            isCorrect 
              ? "bg-emerald-500 hover:bg-emerald-400 text-slate-950 scale-100 hover:scale-105 active:scale-95 cursor-pointer shadow-emerald-500/20" 
              : "bg-slate-800 text-slate-600 cursor-not-allowed scale-95"
          }`}
        >
          {currentLevelIdx === GAME_LEVELS.length - 1 ? "Selesai ✨" : "Kata Berikutnya →"}
        </button>
      </div>

    </div>
  );
}