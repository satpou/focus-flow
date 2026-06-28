# FocusFlow - Pomodoro Timer Web App

Modern Pomodoro Timer web application untuk meningkatkan produktivitas. Fokus, istirahat, dan capai target kamu dengan lebih efisien.

## 🎯 Fitur Utama

- ⏱️ **Timer Pomodoro** - Focus (25m), Break (5m), Long Break (15m)
- 📊 **Progress Ring** - Visual progress indicator dengan SVG
- 💾 **LocalStorage** - Simpan settings & data di browser
- 🔔 **Browser Notifications** - Alert saat timer selesai
- 🌙 **Dark Mode** - UI yang nyaman untuk mata
- ⚡ **Responsive Design** - Akses dari device apapun
- 📈 **Streak Tracking** - Track konsistensi harian

## 🛠️ Tech Stack

- **Frontend**: React 18 + Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Storage**: Browser LocalStorage
- **Deployment**: Vercel

## 📦 Installation

### Prerequisites
- Node.js 18+
- npm atau yarn

### Setup Lokal

```bash
# Clone repository
git clone https://github.com/satpou/focus-flow.git
cd focus-flow

# Install dependencies
npm install --cache /tmp/npm-cache

# Run development server
npm run dev --cache /tmp/npm-cache
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## 🚀 Deployment ke Vercel

### Opsi 1: Import dari GitHub

1. Login ke [Vercel Dashboard](https://vercel.com/dashboard)
2. Klik "Add New" → "Project"
3. Pilih repository `focus-flow`
4. Vercel auto-detect Next.js
5. Klik "Deploy"
6. Selesai! App live dalam 2-3 menit

### Opsi 2: Vercel CLI

```bash
npm i -g vercel
vercel
```

Ikuti instruksi yang muncul di terminal.

## 💻 Cara Pakai

### Start Timer
1. Tekan tombol **"Start"** untuk mulai session Pomodoro
2. Timer akan menghitung mundur 25 menit (default)
3. Saat timer habis, akan muncul notifikasi

### Settings
- Klik tombol **"Settings"** untuk custom waktu
- Ubah Focus, Break, atau Long Break time
- Settings otomatis tersimpan di browser

### Stats
- Klik **"Stats"** untuk lihat progress mingguan
- Lihat total pomodoro, waktu fokus, dan statistik lainnya

### To-Do List
- Tambah task di input box
- Centang task saat sudah selesai
- Delete task dengan tombol "×"

## 📁 Struktur Project

```
focus-flow/
├── src/
│   └── app/
│       ├── page.tsx          # Main timer page
│       ├── layout.tsx        # Root layout
│       └── globals.css       # Global styles
├── public/                   # Static assets
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
├── tailwind.config.js       # Tailwind config
├── next.config.js           # Next.js config
└── README.md
```

## 🔧 Development

### Build untuk Production

```bash
npm run build
npm start
```

### Lint Code

```bash
npm run lint
```

## 🐛 Troubleshooting

### npm install error (permission denied)
```bash
npm install --cache /tmp/npm-cache
```

### Port 3000 sudah terpakai
```bash
npm run dev -- -p 3001
```

## 📝 Features untuk Future

- [ ] Settings panel yang lebih lengkap
- [ ] Statistics chart dengan visualisasi
- [ ] Task management yang lebih advanced
- [ ] Dark/Light mode toggle
- [ ] Sound notifications
- [ ] PWA support (offline mode)
- [ ] Cloud sync (Firebase)

## 🤝 Contributing

Kontribusi welcome! Silakan:

1. Fork repository
2. Buat branch feature (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

MIT License - bebas digunakan untuk personal atau commercial.

## 👤 Author

**Satria Rahmaddhani**
- GitHub: [@satpou](https://github.com/satpou)

## 🙏 Acknowledgments

- Inspired by Pomodoro Technique
- Built with Next.js & Tailwind CSS
- Deployed on Vercel

---

**Live Demo**: [https://focus-flow-k8t9.vercel.app/](https://focus-flow-k8t9.vercel.app/)

Semoga FocusFlow membantu meningkatkan produktivitas kamu! 🚀
