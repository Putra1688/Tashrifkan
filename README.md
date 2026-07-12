## Deskripsi Proyek
Website ini adalah sebuah Media Ajar Digital Interaktif berbasis web (Progressive Web App / PWA) bernama "Tashrifkan".

## Tujuan Akhir
Mempermudah pelajar/siswa dalam mempelajari tata bahasa Arab, khususnya memahami dan memetakan konsep Shorof (morfologi) serta karakteristik Mabni (kekakuan pola vokal) secara visual dan intuitif, menggantikan metode hafalan konvensional.

## Sistem dan Cara Kerja Utama
- **Penguncian Tampilan (Landscape Mode):** Aplikasi dipaksa berjalan dalam mode landscape untuk memberikan ruang horizontal yang ideal bagi teks Arab (RTL) dan kenyamanan kontrol di sisi kiri dan kanan layar.
- **Pemisahan Komponen Kata (Multi-Dimensi):** Sistem memisahkan secara tegas antara Konsonan Akar (Root Letters) yang statis dan elemen dinamis (Harakat & Huruf Tambahan).
- **Linear Progression (Sistem Berurutan):** Permainan berjalan secara berurutan per kata. Level baru hanya akan terbuka jika kata saat ini sudah diselesaikan dengan benar.

## Arsitektur & Mekanik Gameplay (Landscape Layout)

1. **Top Center (Area Soal & Informasi):**
   - Menampilkan instruksi tantangan. Contoh: "Bentuklah Fi'il Madhi yang berarti 'Dia telah menulis'!"
   - Di bawah soal, terdapat informasi/tag bubble mengenai Wazan yang harus dibentuk sebagai panduan siswa.

2. **Center (Area Utama Kata - Flow RTL):**
   - Menampilkan deretan kartu/tiang huruf dasar hijaiyah (Misal: ك - ت - ب).
   - Terdapat indikator visual untuk menunjukkan "Huruf yang Sedang Aktif" (dipilih oleh siswa untuk diubah harakatnya).
   - **Mekanik Kotak Kosong (Huruf Tambahan):** Jika soal membutuhkan Wazan dengan 4-5 huruf (seperti pola Faa'ala), sistem akan memunculkan kotak kosong di sebelum, sesudah, atau di antara huruf dasar. Kotak kosong ini berfungsi sebagai tempat untuk menjatuhkan/memasukkan huruf tambahan. Jika soal hanya membutuhkan 3 huruf (Wazan Fa'ala standar), fitur ini tidak aktif.

3. **Left Side (Panel Bank Huruf Hijaiyah):**
   - Berisi daftar semua huruf hijaiyah. 
   - Panel ini hanya aktif jika kata yang diminta membutuhkan lebih dari 3 huruf. Siswa memilih huruf dari panel ini untuk dimasukkan ke dalam kotak kosong yang tersedia di area Center.

4. **Right Side (Panel Kontrol Harakat):**
   - Berisi satu tombol kontrol utama yang memiliki ikon Next/Previous di bagian atas dan bawah, serta tampilan harakat aktif di bagian tengahnya.
   - **Cara Kerja:** Ketika siswa memilih salah satu huruf di area Center, siswa bisa menekan tombol di panel kanan ini. Jika harakat yang terpilih di panel kanan adalah Fathah, maka huruf di area Center yang sedang aktif tersebut otomatis akan berubah menjadi berharakat Fathah. Mekanik ini berlaku sama untuk harakat lainnya (Kasrah, Dhommah, Sukun, dll).

5. **Bottom Center (Tombol Validasi & Efek Sukses):**
   - Terdapat tombol **"OK"** di bagian tengah bawah layar untuk mengecek jawaban saat ini.
   - Jika siswa menekan tombol OK namun masih ada harakat atau huruf tambahan yang salah/tidak sesuai rumus Shorof, game akan memunculkan indikator visual "Salah" (misal kartu bergetar atau berwarna merah).
   - Jika semua wazan dan kotak kosong sudah terisi dengan benar, game akan memunculkan pop-up perayaan **"Hore!"** dan tombol untuk lanjut ke urutan/kata berikutnya akan aktif.