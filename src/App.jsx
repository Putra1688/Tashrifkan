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
      // Jika root, tampilkan huruf aslinya. Jika extra, biarkan kosong.
      char: s.type === "root" ? s.char : "",
      harakat: ""
    }));
    setUserSlots(initialSlots);
    setActiveSlotIdx(0);
    setValidationState("idle");
    setShowSuccessModal(false);
  }, [currentLevelIdx]);

  // Cek apakah level ini memiliki huruf tambahan (lebih dari 3 slots)
  const hasExtraLetters = currentLevel.slots.length > 3;
  // Cek apakah slot yang sedang aktif adalah slot huruf tambahan (extra)
  const isActiveSlotExtra = userSlots[activeSlotIdx]?.type === "extra";

  // Klik huruf di panel kiri (Bank Huruf)
  const handleSelectLetter = (letter) => {
    if (!hasExtraLetters || !isActiveSlotExtra) return;

    const newSlots = [...userSlots];
    newSlots[activeSlotIdx].char = letter;
    setUserSlots(newSlots);
    if (validationState === "error") setValidationState("idle");
  };

  // Navigasi harakat stamp di panel kanan
  const nextHarakat = () => {
    setStampHarakatIdx((prev) => (prev + 1) % HARAKAT_OPTIONS.length);
  };

  const prevHarakat = () => {
    setStampHarakatIdx((prev) => (prev - 1 + HARAKAT_OPTIONS.length) % HARAKAT_OPTIONS.length);
  };

  // Terapkan harakat aktif ke slot huruf yang sedang dipilih di Center
  const applyHarakat = () => {
    if (activeSlotIdx === null || activeSlotIdx === undefined) return;
    const newSlots = [...userSlots];
    newSlots[activeSlotIdx].harakat = HARAKAT_OPTIONS[stampHarakatIdx].symbol;
    setUserSlots(newSlots);
    if (validationState === "error") setValidationState("idle");
  };

  // Validasi jawaban
  const handleValidate = () => {
    let correct = true;
    for (let i = 0; i < currentLevel.slots.length; i++) {
      const target = currentLevel.slots[i];
      const user = userSlots[i];

      // Periksa harakat
      if (user.harakat !== target.correctHarakat) {
        correct = false;
        break;
      }
      // Periksa huruf jika tipe extra
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
      // Reset error setelah beberapa detik agar bisa mencoba lagi
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
    <div className="min-h-screen w-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex flex-col justify-between overflow-hidden select-none font-sans relative">
      
      {/* --- OVERLAY DETEKSI PORTRAIT --- */}
      {(isPortrait) && (
        <div className="fixed inset-0 bg-slate-950/98 z-50 flex flex-col items-center justify-center p-6 text-center animate-celebrate">
          <div className="w-24 h-24 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mb-6 animate-pulse">
            <svg className="w-12 h-12 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-emerald-400 mb-2">Putar Layar Anda</h2>
          <p className="text-slate-400 max-w-sm text-sm leading-relaxed">
            Aplikasi <strong>Tashrifkan</strong> dirancang khusus untuk berjalan optimal pada <strong>Mode Landscape (Mendatar)</strong> demi kenyamanan memetakan kata Arab.
          </p>
          <div className="mt-8 flex items-center gap-2 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            Menunggu rotasi layar...
          </div>
        </div>
      )}

      {/* --- TOP BAR (Instruksi & Wazan info) --- */}
      <header className="w-full bg-slate-900/60 backdrop-blur-md border-b border-slate-800/80 px-8 py-3 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <img src="/tasrif.svg" alt="Tashrifkan Logo" className="w-8 h-8 rounded-lg shadow-sm border border-slate-800" />
          <span className="text-lg font-black tracking-wider text-emerald-400 font-sans uppercase">
            Tashrifkan
          </span>
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-xs border border-emerald-500/20 font-medium">
            PWA Ajar Shorof
          </span>
        </div>

        <div className="text-center max-w-xl flex flex-col items-center">
          <span className="text-xs font-bold tracking-widest text-amber-400 uppercase">
            Tantangan {currentLevelIdx + 1} dari {GAME_LEVELS.length}
          </span>
          <h1 className="text-base md:text-lg font-semibold text-slate-100 mt-0.5 line-clamp-1">
            {currentLevel.clue}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700/80 shadow-inner">
            {currentLevel.wazan}
          </span>
        </div>
      </header>

      {/* --- MAIN INTERACTIVE GAMEPLAY AREA --- */}
      <main className="flex-1 w-full flex flex-row items-stretch p-4 gap-4 overflow-hidden">
        
        {/* LEFT PANEL: BANK HURUF HIJAIYAH (Hanya aktif untuk wazan > 3 huruf) */}
        <section className={`w-64 bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-800/80 p-4 flex flex-col transition-all duration-300 ${
          hasExtraLetters ? "opacity-100" : "opacity-40 cursor-not-allowed pointer-events-none"
        }`}>
          <div className="mb-2">
            <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase">
              Bank Huruf Hijaiyah
            </h3>
            <p className="text-[10px] text-slate-500 mt-0.5">
              {hasExtraLetters 
                ? (isActiveSlotExtra ? "Pilih huruf untuk mengisi kotak kosong" : "Pilih kotak kosong [ ] di tengah untuk mengisi")
                : "Hanya aktif untuk kata dengan Huruf Tambahan"
              }
            </p>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar grid grid-cols-4 gap-2 pr-1">
            {HIJAIYAH_LETTERS.map((letter) => {
              const isDisabled = !hasExtraLetters || !isActiveSlotExtra;
              return (
                <button
                  key={letter}
                  onClick={() => handleSelectLetter(letter)}
                  disabled={isDisabled}
                  className={`h-11 rounded-lg text-xl font-bold font-arabic flex items-center justify-center transition-all duration-200 ${
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

        {/* CENTER PANEL: AREA UTAMA KATA (RTL Flow) */}
        <section className={`flex-1 border rounded-2xl p-6 flex flex-col justify-center items-center relative overflow-hidden transition-all duration-300 ${
          validationState === "error" 
            ? "animate-error-glow" 
            : "bg-slate-900/20 border-slate-800/80"
        }`}>
          
          {/* Background Decorative Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.03),transparent_60%)] pointer-events-none" />

          {/* Deretan Kartu Huruf (RTL Flow) - Diatur agak ke atas dengan margin-bottom */}
          <div className={`flex flex-row-reverse justify-center items-center gap-6 md:gap-8 transition-transform duration-300 mb-6 ${
            validationState === "error" ? "animate-shake" : ""
          }`}>
            {userSlots.map((slot, idx) => {
              const isActive = activeSlotIdx === idx;
              const isExtra = slot.type === "extra";
              const isBelow = slot.harakat === KASRAH || slot.harakat === KASRATAIN;
              
              let cardBg = "bg-slate-900/60 border-slate-800/90";
              let textStyle = "text-slate-100";
              
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
                  className={`flex flex-col items-center p-3 rounded-2xl border w-24 md:w-28 shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer relative group ${cardBg}`}
                >
                  {/* Harakat Atas (Fathah, Dhommah, Sukun, dll / Dotted Circle default) */}
                  <div className="h-8 flex items-center justify-center mb-1">
                    <span className="text-3xl font-bold text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.4)] font-arabic">
                      {!isBelow ? (slot.harakat || "◌") : " "}
                    </span>
                  </div>

                  {/* Slot Huruf */}
                  <div className="h-16 flex items-center justify-center">
                    {isExtra && !slot.char ? (
                      <span className="text-xs tracking-wider text-emerald-400/80 font-bold bg-emerald-500/10 px-2.5 py-1.5 rounded-lg border border-emerald-500/20">
                        ISI [+]
                      </span>
                    ) : (
                      <span className="text-5xl font-black text-slate-100 font-arabic">
                        {slot.char}
                      </span>
                    )}
                  </div>

                  {/* Harakat Bawah (Kasrah & Kasratain) */}
                  <div className="h-8 flex items-center justify-center mt-1">
                    <span className="text-3xl font-bold text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.4)] font-arabic">
                      {isBelow ? slot.harakat : " "}
                    </span>
                  </div>

                  {/* Indicator jenis huruf */}
                  <span className={`text-[10px] mt-2 px-1.5 py-0.5 rounded font-medium ${
                    isExtra 
                      ? "bg-amber-500/15 text-amber-400 border border-amber-500/20" 
                      : "bg-slate-800 text-slate-400"
                  }`}>
                    {isExtra ? "Tambahan" : "Asli"}
                  </span>

                  {/* Border Glow Indicator on Hover */}
                  <div className="absolute inset-0 rounded-2xl border border-white/5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300" />
                </div>
              );
            })}
          </div>

          {/* Live Preview Area (Pratinjau Hasil Gabungan Huruf secara Real-time) */}
          <div className="flex flex-col items-center justify-center bg-slate-950/50 border border-slate-800 px-8 py-3 rounded-2xl w-full max-w-sm shadow-inner transition-all duration-300 hover:border-slate-700/80 mt-2">
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-1">
              Pratinjau Hasil Kata
            </span>
            <span 
              dir="rtl" 
              className="text-5xl font-black text-emerald-400 font-arabic drop-shadow-[0_0_12px_rgba(52,211,153,0.4)] tracking-wide select-text selection:bg-emerald-500/30 min-h-[70px] flex items-center justify-center"
            >
              {userSlots.map(slot => (slot.char || "◌") + slot.harakat).join("")}
            </span>
          </div>

          <div className="mt-4 text-center">
            <p className="text-[10px] text-slate-500">
              Tip: Klik pada kartu huruf di atas, lalu gunakan panel kanan untuk mengubah harakat.
            </p>
          </div>

        </section>

        {/* RIGHT PANEL: KONTROL HARAKAT (STAMP BUTTON MECHANIC) */}
        <section className="w-56 bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-800/80 p-4 flex flex-col items-center justify-between">
          <div className="w-full text-center">
            <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase">
              Kontrol Harakat
            </h3>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Gunakan panah untuk memilih harakat, tekan Cap untuk menerapkan.
            </p>
          </div>

          {/* MAIN STAMP CONTROL COMPONENT */}
          <div className="flex flex-col items-center justify-center my-auto gap-3">
            {/* Tombol Next/Previous Atas */}
            <button
              onClick={prevHarakat}
              className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition active:scale-90 border border-slate-700 cursor-pointer"
              title="Sebelumnya"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
              </svg>
            </button>

            {/* STAMP BUTTON BODY */}
            <button
              onClick={applyHarakat}
              className="w-28 h-28 rounded-2xl bg-gradient-to-b from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 flex flex-col items-center justify-center shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer border-t-2 border-white/20 transition-all duration-200"
            >
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-950/80 mb-1">
                CAP HARAKAT
              </span>
              <span className="text-4xl font-black font-arabic drop-shadow-md">
                {currentStampHarakat.symbol || "◌"}
              </span>
              <span className="text-[10px] font-bold text-amber-950 mt-1 truncate max-w-full px-2">
                {currentStampHarakat.name}
              </span>
            </button>

            {/* Tombol Next/Previous Bawah */}
            <button
              onClick={nextHarakat}
              className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition active:scale-90 border border-slate-700 cursor-pointer"
              title="Berikutnya"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
          </div>

          <div className="w-full text-center bg-slate-950/40 py-1.5 px-2 rounded-lg border border-slate-800/60">
            <span className="text-[10px] text-amber-400 font-semibold uppercase">
              Aktif: {currentStampHarakat.name}
            </span>
          </div>
        </section>

      </main>

      {/* --- BOTTOM BAR (Status & OK Validation trigger) --- */}
      <footer className="w-full bg-slate-900/60 backdrop-blur-md border-t border-slate-800/80 px-8 py-3.5 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className={`w-3.5 h-3.5 rounded-full border transition-all duration-300 ${
            validationState === "success" 
              ? "bg-emerald-400 border-emerald-300 animate-ping"
              : validationState === "error"
              ? "bg-red-500 border-red-400"
              : "bg-slate-700 border-slate-600"
          }`} />
          <span className="text-xs font-semibold tracking-wide">
            {validationState === "success" ? (
              <strong className="text-emerald-400">✓ Rumus Shorof Sesuai! Sempurna.</strong>
            ) : validationState === "error" ? (
              <strong className="text-red-400">✗ Harakat atau Huruf Tambahan tidak cocok. Coba lagi!</strong>
            ) : (
              <span className="text-slate-400">Aturlah harakat & huruf tambahan, lalu klik "OK" untuk validasi.</span>
            )}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleValidate}
            className="px-8 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold tracking-wider transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-md shadow-emerald-500/10"
          >
            OK
          </button>
        </div>
      </footer>

      {/* --- POP-UP PERAYAAN / CELEBRATION MODAL ("HORE!") --- */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl max-w-md w-full text-center shadow-2xl animate-celebrate relative overflow-hidden">
            
            {/* Sparkles Decorative Design */}
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="w-20 h-20 bg-emerald-500/15 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg className="w-10 h-10 text-emerald-400 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>

            <h2 className="text-3xl font-black text-slate-100 tracking-tight">Hore! 🎉</h2>
            <p className="text-emerald-400 font-bold text-sm mt-1 uppercase tracking-wider">
              Jawaban Anda Benar
            </p>
            
            <p className="text-slate-400 text-sm mt-3 leading-relaxed">
              Anda berhasil menyusun kata dengan struktur wazan shorof yang tepat dan presisi!
            </p>

            <div className="mt-6 flex flex-col gap-2">
              {currentLevelIdx < GAME_LEVELS.length - 1 ? (
                <button
                  onClick={handleNextLevel}
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black tracking-wide transition active:scale-98 cursor-pointer shadow-lg shadow-emerald-500/20"
                >
                  Tantangan Berikutnya →
                </button>
              ) : (
                <div className="space-y-3">
                  <p className="text-amber-400 font-bold text-xs uppercase tracking-widest animate-pulse">
                    ✨ Semua Tantangan Selesai! ✨
                  </p>
                  <button
                    onClick={() => {
                      setCurrentLevelIdx(0);
                    }}
                    className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-black tracking-wide transition active:scale-98 cursor-pointer border border-slate-700"
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