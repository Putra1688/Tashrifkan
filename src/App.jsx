import React, { useState, useEffect } from "react";

// Definisi Konstanta Harakat untuk menghindari ketidakcocokan karakter Unicode
const FATHAH = "\u064e";
const KASRAH = "\u0650";
const DHOMMAH = "\u064f";
const SUKUN = "\u0652";
const FATHATAIN = "\u064b";
const KASRATAIN = "\u064d";
const DAMMATAIN = "\u064c";
const TANPA_HARAKAT = "";

// 1. Data Level Lengkap & Menantang
const GAME_LEVELS = [
  {
    id: 1,
    clue: "Bentuklah Fi'il Madhi yang berarti 'Dia telah menulis'!",
    wazan: "Wazan: فَعَلَ (Fa'ala)",
    slots: [
      { type: "root", char: "ك", correctHarakat: FATHAH },
      { type: "root", char: "ت", correctHarakat: FATHAH },
      { type: "root", char: "ب", correctHarakat: FATHAH }
    ]
  },
  {
    id: 2,
    clue: "Bentuklah Fi'il Madhi yang berarti 'Saling menulis / Berkorespondensi'!",
    wazan: "Wazan: فَاعَلَ (Faa'ala) - Butuh 1 Huruf Tambahan",
    slots: [
      { type: "root", char: "ك", correctHarakat: FATHAH },
      { type: "extra", char: "", correctChar: "ا", correctHarakat: TANPA_HARAKAT },
      { type: "root", char: "ت", correctHarakat: FATHAH },
      { type: "root", char: "ب", correctHarakat: FATHAH }
    ]
  },
  {
    id: 3,
    clue: "Bentuklah Fi'il Madhi Pasif yang berarti 'Telah ditulis'!",
    wazan: "Wazan: فُعِلَ (Fu'ila)",
    slots: [
      { type: "root", char: "ك", correctHarakat: DHOMMAH },
      { type: "root", char: "ت", correctHarakat: KASRAH },
      { type: "root", char: "ب", correctHarakat: FATHAH }
    ]
  },
  {
    id: 4,
    clue: "Bentuklah Isim Maf'ul yang berarti 'Sesuatu yang ditulis (Buku/Tulisan)'!",
    wazan: "Wazan: مَفْعُولٌ (Maf'uulun) - Butuh 2 Huruf Tambahan",
    slots: [
      { type: "extra", char: "", correctChar: "م", correctHarakat: FATHAH },
      { type: "root", char: "ك", correctHarakat: SUKUN },
      { type: "root", char: "ت", correctHarakat: DHOMMAH },
      { type: "extra", char: "", correctChar: "و", correctHarakat: TANPA_HARAKAT },
      { type: "root", char: "ب", correctHarakat: DAMMATAIN }
    ]
  },
  {
    id: 5,
    clue: "Bentuklah Fi'il Madhi yang berarti 'Mendaftarkan / Menuliskan Diri'!",
    wazan: "Wazan: اِفْتَعَلَ (Ifta'ala) - Butuh 2 Huruf Tambahan",
    slots: [
      { type: "extra", char: "", correctChar: "ا", correctHarakat: KASRAH },
      { type: "root", char: "ك", correctHarakat: SUKUN },
      { type: "extra", char: "", correctChar: "ت", correctHarakat: FATHAH },
      { type: "root", char: "ت", correctHarakat: FATHAH },
      { type: "root", char: "ب", correctHarakat: FATHAH }
    ]
  }
];

// Huruf Hijaiyah untuk Bank Huruf
const HIJAIYAH_LETTERS = [
  "ا", "ب", "ت", "ث", "ج", "ح", "خ",
  "د", "ذ", "ر", "ز", "س", "ش", "ص",
  "ض", "ط", "ظ", "ع", "غ", "ف", "ق",
  "ك", "ل", "م", "ن", "هـ", "و", "ي", "ء"
];

// Opsi Harakat beserta nama penjelasan
const HARAKAT_OPTIONS = [
  { symbol: FATHAH, name: "Fathah" },
  { symbol: KASRAH, name: "Kasrah" },
  { symbol: DHOMMAH, name: "Dhommah" },
  { symbol: SUKUN, name: "Sukun" },
  { symbol: FATHATAIN, name: "Fathatain" },
  { symbol: KASRATAIN, name: "Kasratain" },
  { symbol: DAMMATAIN, name: "Dammatain" },
  { symbol: TANPA_HARAKAT, name: "Tanpa Harakat" }
];

export default function App() {
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const currentLevel = GAME_LEVELS[currentLevelIdx];

  // State untuk huruf & harakat yang sedang disusun siswa
  const [userSlots, setUserSlots] = useState([]);
  // Indeks slot yang sedang aktif dipilih siswa di Center
  const [activeSlotIdx, setActiveSlotIdx] = useState(0);
  // Indeks harakat yang terpilih di stamp panel (kanan)
  const [stampHarakatIdx, setStampHarakatIdx] = useState(0);

  // Status Validasi: 'idle' | 'success' | 'error'
  const [validationState, setValidationState] = useState("idle");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Cek apakah orientasi layar potrait secara dinamis
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };
    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    return () => window.removeEventListener("resize", checkOrientation);
  }, []);

  // Inisialisasi slots saat level berubah
  useEffect(() => {
    const initialSlots = currentLevel.slots.map((s) => ({
      type: s.type,
      char: s.type === "root" ? s.char : "",
      harakat: ""
    }));
    setUserSlots(initialSlots);
    setActiveSlotIdx(0);
    setValidationState("idle");
    setShowSuccessModal(false);
  }, [currentLevelIdx]);

  const hasExtraLetters = currentLevel.slots.length > 3;
  const isActiveSlotExtra = userSlots[activeSlotIdx]?.type === "extra";

  const handleSelectLetter = (letter) => {
    if (!hasExtraLetters || !isActiveSlotExtra) return;
    const newSlots = [...userSlots];
    newSlots[activeSlotIdx].char = letter;
    setUserSlots(newSlots);
    if (validationState === "error") setValidationState("idle");
  };

  const nextHarakat = () => {
    setStampHarakatIdx((prev) => (prev + 1) % HARAKAT_OPTIONS.length);
  };

  const prevHarakat = () => {
    setStampHarakatIdx((prev) => (prev - 1 + HARAKAT_OPTIONS.length) % HARAKAT_OPTIONS.length);
  };

  const applyHarakat = () => {
    if (activeSlotIdx === null || activeSlotIdx === undefined) return;
    const newSlots = [...userSlots];
    newSlots[activeSlotIdx].harakat = HARAKAT_OPTIONS[stampHarakatIdx].symbol;
    setUserSlots(newSlots);
    if (validationState === "error") setValidationState("idle");
  };

  const handleValidate = () => {
    let correct = true;
    for (let i = 0; i < currentLevel.slots.length; i++) {
      const target = currentLevel.slots[i];
      const user = userSlots[i];

      if (user.harakat !== target.correctHarakat) {
        correct = false;
        break;
      }
      if (target.type === "extra" && user.char !== target.correctChar) {
        correct = false;
        break;
      }
    }

    if (correct) {
      setValidationState("success");
      setShowSuccessModal(true);
    } else {
      setValidationState("error");
      setTimeout(() => {
        setValidationState("idle");
      }, 1200);
    }
  };

  const handleNextLevel = () => {
    if (currentLevelIdx < GAME_LEVELS.length - 1) {
      setCurrentLevelIdx((prev) => prev + 1);
    }
  };

  const currentStampHarakat = HARAKAT_OPTIONS[stampHarakatIdx];

  return (
    <div className="w-screen h-[100svh] overflow-hidden flex flex-col p-2 gap-1 bg-slate-950 text-slate-100 select-none font-sans relative">
      
      {/* --- OVERLAY DETEKSI PORTRAIT --- */}
      {isPortrait && (
        <div className="fixed inset-0 bg-slate-950/98 z-50 flex flex-col items-center justify-center p-6 text-center animate-celebrate">
          <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mb-4 animate-pulse">
            <svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-emerald-400 mb-2">Putar Layar Anda</h2>
          <p className="text-slate-400 max-w-xs text-xs leading-relaxed">
            Aplikasi <strong>Tashrifkan</strong> dirancang khusus untuk berjalan optimal pada <strong>Mode Landscape (Mendatar)</strong> demi kenyamanan kontrol tata bahasa.
          </p>
          <div className="mt-6 flex items-center gap-2 text-[10px] text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            Menunggu rotasi layar...
          </div>
        </div>
      )}

      {/* --- TOP BAR (Header Sangat Ringkas) --- */}
      <header className="w-full bg-slate-900/60 backdrop-blur-md border border-slate-800/80 px-4 py-1 rounded-xl flex items-center justify-between z-10 gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <img src="/tasrif.svg" alt="Logo" className="w-5 h-5 rounded shadow-sm border border-slate-800" />
          <span className="text-xs sm:text-sm font-black tracking-wider text-emerald-400 font-sans uppercase">
            Tashrifkan
          </span>
          <span className="hidden lg:inline-block px-1 rounded bg-emerald-500/10 text-emerald-400 text-[8px] border border-emerald-500/20 font-medium">
            PWA
          </span>
        </div>

        <div className="text-center max-w-md flex flex-col items-center">
          <span className="text-[7px] md:text-[8px] font-bold tracking-widest text-amber-400 uppercase">
            Tantangan {currentLevelIdx + 1} dari {GAME_LEVELS.length}
          </span>
          <h1 className="text-[10px] sm:text-xs md:text-sm font-semibold text-slate-100 mt-0.5 line-clamp-1">
            {currentLevel.clue}
          </h1>
        </div>

        <div className="flex items-center">
          <span className="px-2 py-0.2 rounded-full bg-slate-800 text-slate-300 text-[8px] md:text-[10px] font-semibold border border-slate-700/80 shadow-inner">
            {currentLevel.wazan}
          </span>
        </div>
      </header>

      {/* --- MAIN INTERACTIVE GAMEPLAY AREA --- */}
      <main className="flex-1 grid grid-cols-[1fr_2.5fr_1fr] gap-2 items-center min-h-0 overflow-hidden w-full px-1">
        
        {/* LEFT PANEL: BANK HURUF HIJAIYAH (Sangat Kompak & max-[70svh]) */}
        <section className={`h-full max-h-[70svh] bg-slate-900/40 backdrop-blur-md rounded-xl border border-slate-800/80 p-1.5 flex flex-col justify-center transition-all duration-300 overflow-hidden shrink-0 ${
          hasExtraLetters ? "opacity-100" : "opacity-40 cursor-not-allowed pointer-events-none"
        }`}>
          <div className="mb-1">
            <h3 className="text-[9px] font-bold tracking-wider text-slate-400 uppercase text-center sm:text-left">
              Bank Huruf
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar grid grid-cols-4 gap-1 pr-0.5">
            {HIJAIYAH_LETTERS.map((letter) => {
              const isDisabled = !hasExtraLetters || !isActiveSlotExtra;
              return (
                <button
                  key={letter}
                  onClick={() => handleSelectLetter(letter)}
                  disabled={isDisabled}
                  className={`h-7 rounded text-[10px] md:text-xs font-bold font-arabic flex items-center justify-center transition-all duration-200 ${
                    isDisabled
                      ? "bg-slate-950/20 text-slate-700 border border-transparent"
                      : "bg-slate-800/50 hover:bg-emerald-500/20 text-slate-200 hover:text-emerald-300 border border-slate-700/60 hover:border-emerald-500/40 active:scale-95 cursor-pointer shadow-sm"
                  }`}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        </section>

        {/* CENTER PANEL: AREA UTAMA KATA (max-h-[70svh]) */}
        <section className={`flex-1 h-full max-h-[70svh] border rounded-xl p-2.5 flex flex-col justify-between items-center relative overflow-hidden transition-all duration-300 ${
          validationState === "error" 
            ? "animate-error-glow" 
            : "bg-slate-900/20 border-slate-800/80"
        }`}>
          
          {/* Background Decorative Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.03),transparent_60%)] pointer-events-none" />

          {/* Deretan Kartu Huruf (RTL Flow) - Tinggi diatur ke max-h-[50svh] w-auto py-2 */}
          <div className={`flex-1 w-full flex flex-row-reverse justify-center items-center gap-1.5 transition-transform duration-300 min-h-0 ${
            validationState === "error" ? "animate-shake" : ""
          }`}>
            {userSlots.map((slot, idx) => {
              const isActive = activeSlotIdx === idx;
              const isExtra = slot.type === "extra";
              const isBelow = slot.harakat === KASRAH || slot.harakat === KASRATAIN;
              
              let cardBg = "bg-slate-900/60 border-slate-800/90";
              
              if (isActive) {
                cardBg = "bg-slate-800/80 border-emerald-500/80 active-letter-glow";
              } else if (isExtra) {
                cardBg = slot.char ? "bg-slate-900/70 border-amber-500/40" : "bg-emerald-950/15 border-dashed border-emerald-500/30";
              }

              return (
                <div
                  key={idx}
                  onClick={() => {
                    setActiveSlotIdx(idx);
                    if (validationState === "error") setValidationState("idle");
                  }}
                  className={`flex flex-col items-center justify-between p-1 rounded-xl border h-full max-h-[50svh] w-12 sm:w-16 md:w-20 lg:w-24 shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer relative group ${cardBg}`}
                >
                  {/* Harakat Atas */}
                  <div className="h-4 flex items-center justify-center">
                    <span className="text-sm sm:text-base md:text-lg font-bold text-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.4)] font-arabic">
                      {!isBelow ? (slot.harakat || "◌") : " "}
                    </span>
                  </div>

                  {/* Slot Huruf */}
                  <div className="flex-1 flex items-center justify-center min-h-0 my-0.5">
                    {isExtra && !slot.char ? (
                      <span className="text-[7px] sm:text-[8px] tracking-wider text-emerald-400/80 font-bold bg-emerald-500/10 px-1 py-0.2 rounded border border-emerald-500/20">
                        ISI [+]
                      </span>
                    ) : (
                      <span className="text-xl sm:text-2xl md:text-3xl font-black text-slate-100 font-arabic">
                        {slot.char}
                      </span>
                    )}
                  </div>

                  {/* Harakat Bawah */}
                  <div className="h-4 flex items-center justify-center">
                    <span className="text-sm sm:text-base md:text-lg font-bold text-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.4)] font-arabic">
                      {isBelow ? slot.harakat : " "}
                    </span>
                  </div>

                  {/* Indicator jenis huruf */}
                  <span className={`text-[7px] sm:text-[8px] px-1 py-0.2 rounded font-medium ${
                    isExtra 
                      ? "bg-amber-500/15 text-amber-400 border border-amber-500/20" 
                      : "bg-slate-800 text-slate-400"
                  }`}>
                    {isExtra ? "Tambahan" : "Asli"}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Live Preview Area (Tinggi & Padding Dipersempit) */}
          <div className="flex flex-col items-center justify-center bg-slate-950/50 border border-slate-800 px-4 py-0.5 rounded-xl w-full max-w-[200px] sm:max-w-xs shadow-inner transition-all duration-300 hover:border-slate-700/80 shrink-0 mt-1">
            <span className="text-[7px] font-bold tracking-wider text-slate-500 uppercase">
              Pratinjau Kata
            </span>
            <span 
              dir="rtl" 
              className="text-lg sm:text-xl md:text-2xl font-black text-emerald-400 font-arabic drop-shadow-[0_0_8px_rgba(52,211,153,0.4)] tracking-wide min-h-[28px] flex items-center justify-center"
            >
              {userSlots.map(slot => (slot.char || "◌") + slot.harakat).join("")}
            </span>
          </div>

        </section>

        {/* RIGHT PANEL: KONTROL HARAKAT (Mengunci tinggi maks & max-[70svh]) */}
        <section className="h-full max-h-[70svh] bg-slate-900/40 backdrop-blur-md rounded-xl border border-slate-800/80 p-1.5 flex flex-col justify-between items-center shrink-0">
          <div className="w-full text-center">
            <h3 className="text-[9px] font-bold tracking-wider text-slate-400 uppercase">
              Harakat
            </h3>
          </div>

          {/* MAIN STAMP CONTROL COMPONENT */}
          <div className="flex flex-col items-center justify-center my-auto gap-1 sm:gap-1.5">
            <button
              onClick={prevHarakat}
              className="p-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition active:scale-90 border border-slate-700 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
              </svg>
            </button>

            {/* STAMP BUTTON BODY */}
            <button
              onClick={applyHarakat}
              className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl bg-gradient-to-b from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 flex flex-col items-center justify-center shadow-md active:scale-95 cursor-pointer border-t border-white/20 transition-all duration-200"
            >
              <span className="text-[6px] sm:text-[7px] font-black uppercase tracking-wider text-amber-950/80">
                CAP
              </span>
              <span className="text-sm sm:text-base md:text-lg font-black font-arabic">
                {currentStampHarakat.symbol || "◌"}
              </span>
              <span className="text-[6px] sm:text-[7px] font-bold text-amber-950 truncate max-w-full px-1">
                {currentStampHarakat.name}
              </span>
            </button>

            <button
              onClick={nextHarakat}
              className="p-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition active:scale-90 border border-slate-700 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
          </div>

          <div className="w-full text-center bg-slate-950/40 py-0.5 px-1 rounded border border-slate-800/60">
            <span className="text-[8px] text-amber-400 font-semibold uppercase">
              {currentStampHarakat.name}
            </span>
          </div>
        </section>

      </main>

      {/* --- BOTTOM BAR (Status & OK Ringkas) --- */}
      <footer className="w-full bg-slate-900/60 backdrop-blur-md border border-slate-800/80 px-4 h-auto py-1 flex justify-between items-center rounded-xl z-10 shrink-0 text-[11px] md:text-xs">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full border transition-all duration-300 ${
            validationState === "success" 
              ? "bg-emerald-400 border-emerald-300 animate-ping"
              : validationState === "error"
              ? "bg-red-500 border-red-400"
              : "bg-slate-700 border-slate-600"
          }`} />
          <span className="text-[10px] sm:text-xs font-semibold tracking-wide">
            {validationState === "success" ? (
              <strong className="text-emerald-400">✓ Sukses! Rumus Shorof Sesuai.</strong>
            ) : validationState === "error" ? (
              <strong className="text-red-400">✗ Harakat atau huruf tambahan salah.</strong>
            ) : (
              <span className="text-slate-400">Atur harakat & huruf tambahan, lalu klik OK.</span>
            )}
          </span>
        </div>

        <button
          onClick={handleValidate}
          className="px-6 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs tracking-wider transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-md"
        >
          OK
        </button>
      </footer>

      {/* --- POP-UP PERAYAAN / CELEBRATION MODAL ("HORE!") --- */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-sm w-full text-center shadow-2xl animate-celebrate relative overflow-hidden">
            <div className="absolute -top-10 -left-10 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="w-16 h-16 bg-emerald-500/15 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-emerald-400 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>

            <h2 className="text-2xl font-black text-slate-100 tracking-tight">Hore! 🎉</h2>
            <p className="text-emerald-400 font-bold text-xs mt-1 uppercase tracking-wider">
              Jawaban Anda Benar
            </p>
            <p className="text-slate-400 text-xs mt-2 leading-relaxed">
              Struktur wazan shorof tersusun dengan tepat dan presisi!
            </p>

            <div className="mt-5 flex flex-col gap-2">
              {currentLevelIdx < GAME_LEVELS.length - 1 ? (
                <button
                  onClick={handleNextLevel}
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm tracking-wide transition active:scale-98 cursor-pointer shadow-md shadow-emerald-500/20"
                >
                  Tantangan Berikutnya →
                </button>
              ) : (
                <div className="space-y-2">
                  <p className="text-amber-400 font-bold text-xs uppercase tracking-widest animate-pulse">
                    ✨ Semua Tantangan Selesai! ✨
                  </p>
                  <button
                    onClick={() => {
                      setCurrentLevelIdx(0);
                    }}
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-black text-sm tracking-wide transition active:scale-98 cursor-pointer border border-slate-700"
                  >
                    Ulangi dari Awal
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}