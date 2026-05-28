```markdown
# 🧾 Fitur Generate Struk Otomatis (WhatsApp Bot)

Fitur ini memungkinkan bot WhatsApp untuk membuat dan mengirimkan gambar struk (receipt) transaksi secara otomatis dengan nomor ID Transaksi (TRX ID) berurut yang di-generate setiap hari. 

Kode ini menggunakan API eksternal untuk mengubah data transaksi menjadi gambar PNG yang rapi dan siap dikirim ke pelanggan.

---

## ✨ Fitur Utama
* **Auto Generate TRX ID**: Membuat ID transaksi otomatis berdasarkan tanggal dan urutan harian (contoh: `28526a`, `28526b`).
* **Kustomisasi Status**: Mendukung status pembayaran dinamis seperti *Succes*, *Deposit*, *Waktu Otomatis*, atau teks kustom.
* **Smart Argument Parsing**: Mendukung penggunaan tanda kutip (`" "`) untuk argumen yang mengandung spasi (seperti status "pembayaran berhasil").
* **Image Delivery**: Mengunduh gambar struk dari API dan langsung mengirimkannya sebagai lampiran WhatsApp beserta caption detail transaksi.

---

## 🛠️ Persyaratan (Prerequisites)

Pastikan module dan variabel berikut sudah terpasang/dideklarasikan di file bot Anda:
* **Module Node.js**: `axios`, `fs`, `path`
* **Global Variables**: 
  * `global.prefix` (Contoh: `.`, `!`, `/`)
  * `global.apikeyStruk` (API Key untuk mengakses layanan ndxhs.my.id. *Dapatkan API Key dengan menghubungi: 085141067887*).

---

## 📖 Cara Penggunaan

Gunakan perintah `struk` atau `done` diikuti dengan 5 argumen utama. Gunakan spasi sebagai pemisah antar argumen.

**Format Dasar:**
```text
<prefix>struk [status] [@user] [layanan] [produk] [total]

```

### Penjelasan Argumen:

1. **`[status]`**: Status transaksi. Gunakan tanda kutip jika mengandung spasi.
* `succes` / `"pembayaran berhasil"` ➔ Menjadi: **✅ PEMBAYARAN BERHASIL**
* `"deposit <angka>"` ➔ Menjadi: **💳 DEPOSIT **
* `"waktu otomatis"` ➔ Menjadi: **⏰ WAKTU OTOMATIS**
* Teks lain ➔ Akan diubah menjadi huruf kapital (UPPERCASE).


2. **`[@user]`**: Username atau tag pembeli (karakter `@` akan ditambahkan otomatis jika tidak ada).
3. **`[layanan]`**: Nama layanan atau kategori produk (contoh: VPS, Panel, RDP).
4. **`[produk]`**: Detail produk yang dibeli (contoh: 8GB, 2Core, VIP).
5. **`[total]`**: Total harga atau nominal tanpa tanda titik/koma (contoh: 50000).

### 💡 Contoh Perintah:

**1. Transaksi Sukses Biasa:**

```text
.struk succes @budi VPS "VPS 8GB RAM" 50000

```

**2. Status Mengandung Spasi:**

```text
.struk "pembayaran berhasil" joko PPOB "Pulsa Telkomsel 50k" 51000

```

**3. Deposit Saldo:**

```text
.struk "deposit 100000" @andi TopUp Saldo 100000

```

---

## ⚙️ Konfigurasi Toko (Hardcoded)

Jika Anda ingin mengubah identitas toko yang tertera di struk, ubah variabel berikut di dalam kode blok pembuat URL API:

* `storeName` = Nama toko Anda (Default: *hanssoft*)
* `receiptTitle` = Slogan/Tagline (Default: *all ur hosting needed*)
* `cashierName` = Nama kasir (Default: *@jayhankuuh*)
* `testimonial` = Pesan footer (Default: *terimakasih sudah berbelanja <3*)

---

## 📂 Struktur Penyimpanan Data

Sistem akan otomatis membuat folder `data` dan file `struk_counter.json` di direktori yang sama dengan file bot Anda berjalan untuk menyimpan hitungan ID transaksi harian.

```text
📦 Direktori Bot
 ┣ 📂 data
 ┃ ┗ 📜 struk_counter.json  <-- Dibuat otomatis
 ┣ 📜 index.js / bot.js
 ┗ 📜 ...

```

```

```
