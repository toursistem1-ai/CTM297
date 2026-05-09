# Ringkasan Perubahan NexaOps

## Arsitektur Full-Stack
- **Frontend**: React 18 + Vite + Tailwind CSS 4 + Framer Motion.
- **Backend**: Express.js (Node.js) sebagai proxy API.
- **Database**: Google Sheets (via Google Apps Script).

## Fitur Utama
1. **Sistem Auth**: Registrasi dan Login yang tersimpan di Google Sheets.
2. **Channel Monitoring**: 
   - Stok Real-time
   - Penjualan
   - Perawatan Gedung
   - Alert & Notifikasi
3. **Pesan Real-time**: Mendukung pengiriman pesan manual dan input data terstruktur (Quick Input).
4. **Dashboard Statis**: Ringkasan data (stats) di panel kanan.
5. **Animasi Modern**: Menggunakan Framer Motion untuk transisi halaman dan elemen UI.

## File Reference (Sesuai Gambar)
- `GOOGLE_APPS_SCRIPT.js`: Kode untuk dipasang di Google Sheets.
- `SETUP_PANDUAN.txt`: Instruksi konfigurasi database.
- `server.ts`: Logic backend untuk menjembatani Frontend ke Google Sheets.
