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
