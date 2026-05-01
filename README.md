# [ B ] BIRO SYSTEM COMMAND

Biro2 adalah CLI screensaver interaktif dan modern yang dibangun menggunakan **OpenTUI** dan **React**. Aplikasi ini dirancang untuk memberikan monitoring sistem secara real-time dengan estetika profesional **GitHub Dark**.

## 🚀 Fitur Utama

- **Monitoring Real-time**: CPU (Load & Per-core), RAM (Usage/Total), dan Disk Storage.
- **Grafik Suhu (Thermal Chart)**: Visualisasi tren suhu CPU menggunakan grafik sparkline dinamis.
- **Informasi Sistem (Neofetch Style)**: Menampilkan OS, Host, Kernel, Uptime, Shell, dan tipe CPU.
- **Keamanan Jaringan**: Menampilkan IP Public dan IP Private dengan fitur sensor otomatis untuk privasi (`192.168.xxx.xx`).
- **Daftar Proses**: Menampilkan top proses yang paling banyak menggunakan sumber daya.
- **Responsif (Mobile Friendly)**: Optimal untuk layar kecil seperti **Termux** dengan layout adaptif.
- **Integrasi Terminal**: Menggunakan background asli terminal Anda (Transparent UI).
- **Daftar Proyek (Recent Projects)**: Melacak dan menampilkan daftar folder atau repositori git yang baru dibuka secara cerdas.
- **Footer Animasi Dinamis**: 
    - **Randomized Styles**: Memilih secara acak antara gaya *Aero Bullet (Shinkansen)*, *Cyber Scan (Satellite)*, *Debug Mode (Droid)*, dan *Retro Cruise (Pacman)* setiap kali dijalankan.
    - **Sarcastic AI Bot**: Integrasi robot AI (OpenAI, Gemini, Claude, dsb) yang memberikan komentar sarkasme tajam tentang kebiasaan developer.
- **Konfigurasi AI Luas**: Mendukung 6 provider AI utama (OpenAI, Google Gemini, Anthropic, DeepSeek, OpenRouter, Groq).

## 🛠️ Konfigurasi AI

Untuk mengaktifkan fitur **Sarcastic AI Bot**, Anda perlu menyiapkan API Key:

1. Salin file contoh konfigurasi:
   ```bash
   cp .env.example .env
   ```
2. Buka `.env` dan masukkan API Key provider Anda.
3. Atur `PROVIDER=X` (misal: 2 untuk Google Gemini).

## 🛠️ Instalasi

Pastikan Anda telah menginstal [Bun](https://bun.sh).

1. Clone repositori:
   ```bash
   git clone git@github.com:razaeldotexe/birotwo.git
   cd birotwo
   ```

2. Instal dependensi:
   ```bash
   bun install
   ```

3. Jalankan skrip instalasi untuk membuat perintah global:
   ```bash
   chmod +x install.sh
   ./install.sh
   ```

## 💻 Penggunaan

Setelah instalasi selesai, Anda dapat menjalankan screensaver dari mana saja dengan cukup mengetik:

```bash
biro2
```

Atau tanpa instalasi global:
```bash
bun src/index.tsx
```

## 🎨 Estetika
Aplikasi ini menggunakan skema warna **GitHub Dark** yang bersih dan profesional, memberikan kesan "Command Center" pada terminal Anda.

---
Dibuat dengan ❤️ menggunakan [OpenTUI](https://github.com/opentui/core) dan Bun.
