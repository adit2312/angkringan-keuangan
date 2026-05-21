import { useState, useEffect, useRef } from "react";

const KATEGORI_PEMASUKAN = ["Makanan", "Minuman", "Rokok", "Lainnya"];
const KATEGORI_PENGELUARAN = ["Bahan Baku", "Gas / Listrik", "Sewa Tempat", "Gaji Karyawan", "Peralatan", "Lainnya"];

const formatRp = (n) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

const hariIni = () => new Date().toISOString().split("T")[0];
const formAwal = { type: "pemasukan", kategori: "Makanan", deskripsi: "", jumlah: "", tanggal: hariIni() };

const DEMO_DATA = [
  { id: 1, type: "pemasukan", kategori: "Makanan", deskripsi: "Nasi kucing 30 bungkus", jumlah: 90000, tanggal: hariIni() },
  { id: 2, type: "pemasukan", kategori: "Minuman", deskripsi: "Teh & kopi pagi", jumlah: 45000, tanggal: hariIni() },
  { id: 3, type: "pengeluaran", kategori: "Bahan Baku", deskripsi: "Beras & lauk pauk", jumlah: 120000, tanggal: hariIni() },
  { id: 4, type: "pemasukan", kategori: "Rokok", deskripsi: "Penjualan rokok eceran", jumlah: 35000, tanggal: hariIni() },
  { id: 5, type: "pengeluaran", kategori: "Gas / Listrik", deskripsi: "Isi gas 3kg", jumlah: 28000, tanggal: hariIni() },
];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Mulish:wght@400;500;600;700&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .ang-root {
    font-family: 'Mulish', sans-serif;
    min-height: 100vh;
    background: #1a0e07;
    color: #f5ede0;
    position: relative;
    overflow-x: hidden;
  }

  .ang-root::before {
    content: '';
    position: fixed;
    inset: 0;
    background:
      radial-gradient(ellipse 80% 50% at 20% 0%, #3d1a0a44 0%, transparent 60%),
      radial-gradient(ellipse 60% 40% at 80% 100%, #5c2a0044 0%, transparent 60%);
    pointer-events: none;
    z-index: 0;
  }

  .ang-pattern {
    position: fixed;
    inset: 0;
    opacity: 0.03;
    background-image: repeating-linear-gradient(
      45deg,
      #f5ede0 0px, #f5ede0 1px,
      transparent 1px, transparent 20px
    ),
    repeating-linear-gradient(
      -45deg,
      #f5ede0 0px, #f5ede0 1px,
      transparent 1px, transparent 20px
    );
    pointer-events: none;
    z-index: 0;
  }

  .ang-header {
    position: relative;
    z-index: 10;
    background: linear-gradient(160deg, #5c1a00 0%, #8b3a00 50%, #5c1a00 100%);
    padding: 20px 20px 0;
    border-bottom: 1px solid #a0501844;
  }

  .ang-header-inner {
    max-width: 600px;
    margin: 0 auto;
  }

  .ang-logo {
    font-family: 'Playfair Display', serif;
    font-size: 26px;
    font-weight: 900;
    color: #f5c87a;
    letter-spacing: -0.5px;
    line-height: 1;
  }

  .ang-logo span { color: #f5ede0; }
  .ang-subtitle { font-size: 11px; color: #c4925a; letter-spacing: 2px; text-transform: uppercase; margin-top: 3px; }

  .ang-tabs {
    display: flex;
    gap: 0;
    margin-top: 18px;
  }

  .ang-tab {
    flex: 1;
    padding: 11px 4px 13px;
    border: none;
    background: transparent;
    color: #a07050;
    font-family: 'Mulish', sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.5px;
    cursor: pointer;
    border-bottom: 3px solid transparent;
    transition: all 0.2s;
    text-transform: uppercase;
  }

  .ang-tab.active {
    color: #f5c87a;
    border-bottom-color: #f5c87a;
  }

  .ang-body {
    position: relative;
    z-index: 1;
    max-width: 600px;
    margin: 0 auto;
    padding: 20px 16px 32px;
  }

  /* CARDS */
  .ang-card {
    background: #281206;
    border: 1px solid #5c2a0a44;
    border-radius: 16px;
    padding: 18px;
    margin-bottom: 14px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.4);
  }

  .ang-card-hero {
    background: linear-gradient(145deg, #8b3a00, #c05a00);
    border: 1px solid #e07a2044;
    border-radius: 20px;
    padding: 24px;
    margin-bottom: 14px;
    text-align: center;
    position: relative;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(140,60,0,0.4);
  }

  .ang-card-hero::after {
    content: '🍢';
    position: absolute;
    right: 16px;
    bottom: -8px;
    font-size: 64px;
    opacity: 0.15;
  }

  .ang-hero-label { font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #f5c87a99; }
  .ang-hero-amount { font-family: 'Playfair Display', serif; font-size: 36px; font-weight: 900; color: #f5ede0; margin: 6px 0; }
  .ang-hero-note { font-size: 12px; color: #f5c87a; }

  .ang-hero-loss { background: linear-gradient(145deg, #5c0a0a, #8b1a1a); border-color: #c0404044; box-shadow: 0 8px 32px rgba(140,0,0,0.4); }

  .ang-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 14px; }

  .ang-mini-card {
    background: #281206;
    border-radius: 14px;
    padding: 16px;
    border-left: 3px solid;
    box-shadow: 0 4px 16px rgba(0,0,0,0.3);
  }

  .ang-mini-label { font-size: 11px; color: #a07050; letter-spacing: 0.5px; margin-bottom: 4px; }
  .ang-mini-val { font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 700; }

  .ang-stat-row { display: flex; justify-content: space-around; text-align: center; }
  .ang-stat-num { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 900; }
  .ang-stat-lbl { font-size: 11px; color: #a07050; margin-top: 2px; letter-spacing: 0.5px; }

  /* FORM */
  .ang-toggle { display: flex; background: #1a0a04; border-radius: 12px; padding: 4px; margin-bottom: 18px; }

  .ang-toggle-btn {
    flex: 1; padding: 11px; border: none; border-radius: 9px; cursor: pointer;
    font-family: 'Mulish', sans-serif; font-weight: 700; font-size: 13px;
    transition: all 0.25s; background: transparent; color: #a07050;
  }

  .ang-toggle-btn.active-in { background: #2d6e2d; color: #a8f0a8; }
  .ang-toggle-btn.active-out { background: #6e2020; color: #f0a8a8; }

  .ang-label { font-size: 12px; color: #a07050; letter-spacing: 1px; text-transform: uppercase; display: block; margin-bottom: 6px; }

  .ang-input, .ang-select {
    width: 100%; padding: 12px 14px; border-radius: 10px;
    background: #1a0a04; border: 1px solid #5c2a0a66;
    color: #f5ede0; font-family: 'Mulish', sans-serif; font-size: 14px;
    outline: none; transition: border-color 0.2s; margin-bottom: 14px;
  }

  .ang-input:focus, .ang-select:focus { border-color: #c07030; }
  .ang-select option { background: #1a0a04; }
  .ang-input::placeholder { color: #5c3a20; }

  .ang-preview {
    background: #3d1a0a;
    border: 1px dashed #c0703044;
    border-radius: 10px;
    padding: 12px 14px;
    font-size: 13px;
    color: #c4925a;
    margin-bottom: 16px;
    line-height: 1.6;
  }

  .ang-btn-primary {
    width: 100%; padding: 15px; border: none; border-radius: 12px; cursor: pointer;
    background: linear-gradient(135deg, #8b3a00, #c07030);
    color: #f5ede0; font-family: 'Mulish', sans-serif; font-weight: 700; font-size: 15px;
    letter-spacing: 1px; text-transform: uppercase;
    box-shadow: 0 4px 16px rgba(140,60,0,0.4);
    transition: all 0.2s;
  }

  .ang-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(140,60,0,0.5); }

  /* RIWAYAT */
  .ang-txn {
    background: #281206; border-radius: 12px; padding: 14px; margin-bottom: 10px;
    display: flex; justify-content: space-between; align-items: center;
    border-left: 3px solid; box-shadow: 0 2px 12px rgba(0,0,0,0.3);
    transition: transform 0.15s;
  }

  .ang-txn:hover { transform: translateX(2px); }
  .ang-txn-name { font-weight: 600; font-size: 14px; color: #f5ede0; }
  .ang-txn-meta { font-size: 11px; color: #a07050; margin-top: 3px; letter-spacing: 0.5px; }
  .ang-txn-amount { font-family: 'Playfair Display', serif; font-weight: 700; font-size: 16px; }
  .ang-delete-btn { border: none; background: none; cursor: pointer; font-size: 15px; opacity: 0.4; transition: opacity 0.2s; display: block; margin-top: 4px; }
  .ang-delete-btn:hover { opacity: 1; }

  /* FILTER */
  .ang-filter { display: flex; gap: 8px; align-items: center; margin-bottom: 14px; }
  .ang-filter-input {
    flex: 1; padding: 10px 12px; border-radius: 10px;
    background: #281206; border: 1px solid #5c2a0a44; color: #f5ede0;
    font-family: 'Mulish', sans-serif; font-size: 13px; outline: none;
  }

  .ang-filter-reset {
    padding: 10px 14px; border-radius: 10px; border: 1px solid #5c2a0a44;
    background: #3d1a0a; color: #c4925a; cursor: pointer;
    font-family: 'Mulish', sans-serif; font-size: 13px;
  }

  /* CHAT */
  .ang-chat-area { flex: 1; overflow-y: auto; margin-bottom: 12px; padding-right: 4px; }

  .ang-bubble-wrap { display: flex; margin-bottom: 12px; }
  .ang-bubble-wrap.user { justify-content: flex-end; }

  .ang-bubble {
    max-width: 82%; padding: 12px 16px; font-size: 13.5px; line-height: 1.65;
    white-space: pre-wrap;
  }

  .ang-bubble.assistant {
    background: #281206; border: 1px solid #5c2a0a44;
    border-radius: 18px 18px 18px 4px; color: #f5ede0;
    box-shadow: 0 2px 12px rgba(0,0,0,0.3);
  }

  .ang-bubble.user {
    background: linear-gradient(135deg, #7a2e00, #b05020);
    border-radius: 18px 18px 4px 18px; color: #f5ede0;
    box-shadow: 0 2px 12px rgba(120,50,0,0.3);
  }

  .ang-chat-chips { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 10px; }

  .ang-chip {
    padding: 6px 12px; border-radius: 20px; font-size: 11px; font-family: 'Mulish', sans-serif;
    border: 1px solid #c07030; background: #281206; color: #c4925a; cursor: pointer;
    transition: all 0.15s; white-space: nowrap;
  }

  .ang-chip:hover { background: #3d1a0a; color: #f5c87a; }

  .ang-chat-input-row { display: flex; gap: 8px; }

  .ang-chat-input {
    flex: 1; padding: 13px 16px; border-radius: 12px;
    background: #281206; border: 1px solid #5c2a0a66; color: #f5ede0;
    font-family: 'Mulish', sans-serif; font-size: 14px; outline: none;
  }

  .ang-chat-input::placeholder { color: #5c3a20; }
  .ang-chat-input:focus { border-color: #c07030; }

  .ang-send-btn {
    padding: 13px 18px; border-radius: 12px; border: none; cursor: pointer;
    background: linear-gradient(135deg, #8b3a00, #c07030);
    color: #f5ede0; font-size: 18px;
    transition: all 0.2s;
  }

  .ang-send-btn:disabled { background: #281206; color: #5c3a20; cursor: not-allowed; }

  /* NOTIF */
  .ang-notif {
    position: fixed; top: 16px; right: 16px; z-index: 999;
    padding: 12px 18px; border-radius: 12px; font-size: 13px; font-weight: 600;
    box-shadow: 0 4px 20px rgba(0,0,0,0.5); color: #f5ede0; max-width: 280px;
    animation: slideIn 0.3s ease;
  }

  @keyframes slideIn {
    from { transform: translateX(100px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }

  .ang-empty { text-align: center; padding: 48px 20px; color: #5c3a20; }
  .ang-empty-icon { font-size: 48px; margin-bottom: 12px; }
  .ang-section-title { font-family: 'Playfair Display', serif; font-size: 15px; font-weight: 700; color: #c4925a; margin-bottom: 14px; letter-spacing: 0.5px; }

  .ang-divider { height: 1px; background: #5c2a0a33; margin: 16px 0; }

  /* BAR CHART */
  .ang-bar-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
  .ang-bar-label { font-size: 12px; color: #a07050; width: 90px; flex-shrink: 0; }
  .ang-bar-track { flex: 1; height: 8px; background: #1a0a04; border-radius: 4px; overflow: hidden; }
  .ang-bar-fill { height: 100%; border-radius: 4px; transition: width 0.6s ease; }
  .ang-bar-val { font-size: 12px; color: #c4925a; width: 80px; text-align: right; flex-shrink: 0; font-weight: 700; }
`;

export default function AngkringanKeuangan() {
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [form, setForm] = useState(formAwal);
  const [chatMessages, setChatMessages] = useState([
    { role: "assistant", text: "Halo! Saya asisten keuangan angkringan Anda 🍢\n\nTanya apa saja — pemasukan, pengeluaran, tips hemat, atau analisis usaha kamu!" },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [filterDate, setFilterDate] = useState("");
  const [notif, setNotif] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("angkringan-v2");
      if (saved) setTransactions(JSON.parse(saved));
      else setTransactions(DEMO_DATA);
    } catch (_) { setTransactions(DEMO_DATA); }
  }, []);

  useEffect(() => {
    try { localStorage.setItem("angkringan-v2", JSON.stringify(transactions)); } catch (_) {}
  }, [transactions]);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatMessages]);

  const totalPemasukan = transactions.filter(t => t.type === "pemasukan").reduce((s, t) => s + t.jumlah, 0);
  const totalPengeluaran = transactions.filter(t => t.type === "pengeluaran").reduce((s, t) => s + t.jumlah, 0);
  const labaRugi = totalPemasukan - totalPengeluaran;
  const today = hariIni();
  const pemasukanHariIni = transactions.filter(t => t.type === "pemasukan" && t.tanggal === today).reduce((s, t) => s + t.jumlah, 0);
  const pengeluaranHariIni = transactions.filter(t => t.type === "pengeluaran" && t.tanggal === today).reduce((s, t) => s + t.jumlah, 0);
  const margin = totalPemasukan > 0 ? Math.round((labaRugi / totalPemasukan) * 100) : 0;

  // Kategori breakdown
  const katBreakdown = (type) => {
    const cats = type === "pemasukan" ? KATEGORI_PEMASUKAN : KATEGORI_PENGELUARAN;
    const total = transactions.filter(t => t.type === type).reduce((s, t) => s + t.jumlah, 0);
    return cats.map(k => {
      const val = transactions.filter(t => t.type === type && t.kategori === k).reduce((s, t) => s + t.jumlah, 0);
      return { k, val, pct: total > 0 ? Math.round((val / total) * 100) : 0 };
    }).filter(x => x.val > 0).sort((a, b) => b.val - a.val);
  };

  const tambahTransaksi = () => {
    if (!form.deskripsi.trim() || !form.jumlah) {
      showNotif("⚠️ Deskripsi dan jumlah harus diisi!", "error"); return;
    }
    setTransactions(prev => [{ id: Date.now(), ...form, jumlah: parseInt(form.jumlah) }, ...prev]);
    setForm(formAwal);
    showNotif("✅ Transaksi berhasil disimpan!", "success");
    setActiveTab("riwayat");
  };

  const hapusTransaksi = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    showNotif("🗑️ Transaksi dihapus", "info");
  };

  const showNotif = (msg, type) => {
    setNotif({ msg, type });
    setTimeout(() => setNotif(null), 2500);
  };

  const riwayatFiltered = filterDate
    ? transactions.filter(t => t.tanggal === filterDate)
    : transactions;

  const kirimChat = async () => {
    if (!chatInput.trim() || loading) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    setChatMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);

    const ringkasan = `Data keuangan angkringan:
- Total Pemasukan: ${formatRp(totalPemasukan)}
- Total Pengeluaran: ${formatRp(totalPengeluaran)}
- Laba/Rugi: ${formatRp(labaRugi)}
- Margin: ${margin}%
- Pemasukan hari ini: ${formatRp(pemasukanHariIni)}
- Pengeluaran hari ini: ${formatRp(pengeluaranHariIni)}
- Jumlah transaksi: ${transactions.length}
- 5 transaksi terakhir: ${JSON.stringify(transactions.slice(0, 5))}`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `Kamu adalah asisten keuangan untuk usaha angkringan Indonesia yang ramah dan pintar.
Bantu pemilik usaha dengan analisis keuangan, tips bisnis, dan saran praktis.
Jawab dalam Bahasa Indonesia yang santai tapi informatif. Gunakan emoji secukupnya.
Selalu berikan saran yang actionable dan relevan untuk usaha angkringan kecil.
${ringkasan}`,
          messages: [{ role: "user", content: userMsg }],
        }),
      });
      const data = await res.json();
      const reply = data.content?.map(c => c.text || "").join("") || "Maaf, tidak bisa menjawab saat ini.";
      setChatMessages(prev => [...prev, { role: "assistant", text: reply }]);
    } catch (_) {
      setChatMessages(prev => [...prev, { role: "assistant", text: "⚠️ Gagal terhubung ke AI. Coba lagi ya!" }]);
    }
    setLoading(false);
  };

  const tabList = [
    { id: "dashboard", label: "📊 Dasbor" },
    { id: "transaksi", label: "➕ Catat" },
    { id: "riwayat", label: "📋 Riwayat" },
    { id: "chat", label: "🤖 AI" },
  ];

  return (
    <>
      <style>{css}</style>
      <div className="ang-root">
        <div className="ang-pattern" />

        {/* HEADER */}
        <div className="ang-header">
          <div className="ang-header-inner">
            <div className="ang-logo">🍢 Angkringan <span>Keuangan</span></div>
            <div className="ang-subtitle">Powered by Claude AI</div>
            <div className="ang-tabs">
              {tabList.map(t => (
                <button key={t.id} className={`ang-tab${activeTab === t.id ? " active" : ""}`}
                  onClick={() => setActiveTab(t.id)}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* NOTIF */}
        {notif && (
          <div className="ang-notif" style={{
            background: notif.type === "success" ? "#1a4a1a" : notif.type === "error" ? "#4a1a1a" : "#1a3a4a",
            border: `1px solid ${notif.type === "success" ? "#2d6e2d" : notif.type === "error" ? "#6e2020" : "#20406e"}`
          }}>
            {notif.msg}
          </div>
        )}

        <div className="ang-body">

          {/* ══ DASHBOARD ══ */}
          {activeTab === "dashboard" && (
            <div>
              <div className={`ang-card-hero${labaRugi < 0 ? " ang-hero-loss" : ""}`}>
                <div className="ang-hero-label">Total Laba / Rugi</div>
                <div className="ang-hero-amount">{formatRp(labaRugi)}</div>
                <div className="ang-hero-note">{labaRugi >= 0 ? "🎉 Usaha kamu untung!" : "⚠️ Perlu efisiensi pengeluaran"}</div>
              </div>

              <div className="ang-grid2">
                <div className="ang-mini-card" style={{ borderColor: "#2d6e2d" }}>
                  <div className="ang-mini-label">💰 Total Pemasukan</div>
                  <div className="ang-mini-val" style={{ color: "#6ec06e" }}>{formatRp(totalPemasukan)}</div>
                </div>
                <div className="ang-mini-card" style={{ borderColor: "#6e2020" }}>
                  <div className="ang-mini-label">💸 Total Pengeluaran</div>
                  <div className="ang-mini-val" style={{ color: "#c06e6e" }}>{formatRp(totalPengeluaran)}</div>
                </div>
              </div>

              <div className="ang-card" style={{ marginBottom: 14 }}>
                <div className="ang-section-title">📅 Hari Ini</div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: 11, color: "#a07050" }}>Pemasukan</div>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: "#6ec06e", fontSize: 17 }}>{formatRp(pemasukanHariIni)}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 11, color: "#a07050" }}>Pengeluaran</div>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: "#c06e6e", fontSize: 17 }}>{formatRp(pengeluaranHariIni)}</div>
                  </div>
                </div>
              </div>

              <div className="ang-card" style={{ marginBottom: 14 }}>
                <div className="ang-section-title">📈 Statistik</div>
                <div className="ang-stat-row">
                  <div>
                    <div className="ang-stat-num" style={{ color: "#c4925a" }}>{transactions.length}</div>
                    <div className="ang-stat-lbl">Transaksi</div>
                  </div>
                  <div>
                    <div className="ang-stat-num" style={{ color: "#f5c87a" }}>
                      {transactions.filter(t => t.tanggal === today).length}
                    </div>
                    <div className="ang-stat-lbl">Hari Ini</div>
                  </div>
                  <div>
                    <div className="ang-stat-num" style={{ color: margin >= 0 ? "#6ec06e" : "#c06e6e" }}>{margin}%</div>
                    <div className="ang-stat-lbl">Margin</div>
                  </div>
                </div>
              </div>

              {/* Pemasukan per kategori */}
              {katBreakdown("pemasukan").length > 0 && (
                <div className="ang-card" style={{ marginBottom: 14 }}>
                  <div className="ang-section-title">💰 Pemasukan per Kategori</div>
                  {katBreakdown("pemasukan").map(({ k, val, pct }) => (
                    <div key={k} className="ang-bar-row">
                      <div className="ang-bar-label">{k}</div>
                      <div className="ang-bar-track">
                        <div className="ang-bar-fill" style={{ width: `${pct}%`, background: "linear-gradient(90deg, #2d6e2d, #5ec05e)" }} />
                      </div>
                      <div className="ang-bar-val" style={{ color: "#6ec06e" }}>{formatRp(val)}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pengeluaran per kategori */}
              {katBreakdown("pengeluaran").length > 0 && (
                <div className="ang-card">
                  <div className="ang-section-title">💸 Pengeluaran per Kategori</div>
                  {katBreakdown("pengeluaran").map(({ k, val, pct }) => (
                    <div key={k} className="ang-bar-row">
                      <div className="ang-bar-label">{k}</div>
                      <div className="ang-bar-track">
                        <div className="ang-bar-fill" style={{ width: `${pct}%`, background: "linear-gradient(90deg, #6e2020, #c05050)" }} />
                      </div>
                      <div className="ang-bar-val" style={{ color: "#c06e6e" }}>{formatRp(val)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══ FORM TRANSAKSI ══ */}
          {activeTab === "transaksi" && (
            <div className="ang-card">
              <div className="ang-section-title">➕ Tambah Transaksi</div>

              <div className="ang-toggle">
                {["pemasukan", "pengeluaran"].map(type => (
                  <button key={type}
                    className={`ang-toggle-btn${form.type === type ? (type === "pemasukan" ? " active-in" : " active-out") : ""}`}
                    onClick={() => setForm(f => ({ ...f, type, kategori: type === "pemasukan" ? "Makanan" : "Bahan Baku" }))}>
                    {type === "pemasukan" ? "💰 Pemasukan" : "💸 Pengeluaran"}
                  </button>
                ))}
              </div>

              <label className="ang-label">Kategori</label>
              <select className="ang-select" value={form.kategori}
                onChange={e => setForm(f => ({ ...f, kategori: e.target.value }))}>
                {(form.type === "pemasukan" ? KATEGORI_PEMASUKAN : KATEGORI_PENGELUARAN).map(k => (
                  <option key={k}>{k}</option>
                ))}
              </select>

              <label className="ang-label">Deskripsi</label>
              <input className="ang-input" value={form.deskripsi}
                onChange={e => setForm(f => ({ ...f, deskripsi: e.target.value }))}
                placeholder="Contoh: Jual nasi kucing 20 bungkus" />

              <label className="ang-label">Jumlah (Rp)</label>
              <input className="ang-input" type="number" value={form.jumlah}
                onChange={e => setForm(f => ({ ...f, jumlah: e.target.value }))}
                placeholder="Contoh: 50000" />

              <label className="ang-label">Tanggal</label>
              <input className="ang-input" type="date" value={form.tanggal}
                onChange={e => setForm(f => ({ ...f, tanggal: e.target.value }))} />

              {form.jumlah && (
                <div className="ang-preview">
                  <strong>Preview:</strong>{" "}
                  {form.type === "pemasukan" ? "💰" : "💸"} {form.kategori} — {form.deskripsi || "..."} sebesar{" "}
                  <strong>{formatRp(parseInt(form.jumlah) || 0)}</strong>
                </div>
              )}

              <button className="ang-btn-primary" onClick={tambahTransaksi}>
                Simpan Transaksi
              </button>
            </div>
          )}

          {/* ══ RIWAYAT ══ */}
          {activeTab === "riwayat" && (
            <div>
              <div className="ang-filter">
                <input className="ang-filter-input" type="date" value={filterDate}
                  onChange={e => setFilterDate(e.target.value)} />
                {filterDate && (
                  <button className="ang-filter-reset" onClick={() => setFilterDate("")}>Reset</button>
                )}
              </div>

              {riwayatFiltered.length === 0 ? (
                <div className="ang-empty">
                  <div className="ang-empty-icon">📭</div>
                  <div>Belum ada transaksi</div>
                </div>
              ) : (
                riwayatFiltered.map(t => (
                  <div key={t.id} className="ang-txn"
                    style={{ borderColor: t.type === "pemasukan" ? "#2d6e2d" : "#6e2020" }}>
                    <div style={{ flex: 1 }}>
                      <div className="ang-txn-name">{t.deskripsi}</div>
                      <div className="ang-txn-meta">{t.kategori} · {t.tanggal}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div className="ang-txn-amount"
                        style={{ color: t.type === "pemasukan" ? "#6ec06e" : "#c06e6e" }}>
                        {t.type === "pemasukan" ? "+" : "-"}{formatRp(t.jumlah)}
                      </div>
                      <button className="ang-delete-btn" onClick={() => hapusTransaksi(t.id)}>🗑️</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ══ AI CHAT ══ */}
          {activeTab === "chat" && (
            <div style={{ display: "flex", flexDirection: "column", height: "70vh" }}>
              <div className="ang-chat-area">
                {chatMessages.map((m, i) => (
                  <div key={i} className={`ang-bubble-wrap${m.role === "user" ? " user" : ""}`}>
                    <div className={`ang-bubble ${m.role}`}>{m.text}</div>
                  </div>
                ))}
                {loading && (
                  <div className="ang-bubble-wrap">
                    <div className="ang-bubble assistant" style={{ fontSize: 20 }}>⏳</div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <div className="ang-chat-chips">
                {["Analisis keuangan saya", "Tips hemat bahan baku", "Cara nambah pelanggan", "Berapa margin ideal?"].map(q => (
                  <button key={q} className="ang-chip" onClick={() => setChatInput(q)}>{q}</button>
                ))}
              </div>

              <div className="ang-chat-input-row">
                <input className="ang-chat-input" value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && kirimChat()}
                  placeholder="Tanya tentang keuangan angkringan…" />
                <button className="ang-send-btn" onClick={kirimChat} disabled={loading}>➤</button>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
