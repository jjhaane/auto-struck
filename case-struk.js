case "struk": case "done": {
    if (!q) {
        return zeppreply(
            `📝 *Cara penggunaan:*\n` +
            `${global.prefix}struk [status] [@user] [layanan] [produk] [total]\n\n` +
            `*Status:* succes / deposit <angka> / waktu otomatis\n` +
            `*Contoh:*\n` +
            `${global.prefix}struk \"pembayaran berhasil\" @joko VPS 8GB 50000\n\n` +
            `*Catatan:*\n` +
            `• Gunakan spasi sebagai pemisah, bukan koma.\n` +
            `• Jika status mengandung spasi, gunakan tanda kutip.`
        );
    }

    await zepp.sendMessage(from, { react: { text: "⏳", key: msg.key } });
    const rawArgs = [];
    let current = "";
    let inQuote = false;
    for (let i = 0; i < q.length; i++) {
        const ch = q[i];
        if (ch === '"') {
            inQuote = !inQuote;
        } else if (ch === ' ' && !inQuote) {
            if (current) rawArgs.push(current);
            current = "";
        } else {
            current += ch;
        }
    }
    if (current) rawArgs.push(current);
    const args = rawArgs.map(arg => arg.replace(/,/g, ''));

    if (args.length < 5) {
        return zeppreply(`❌ Format salah. Minimal 5 argumen: status username layanan produk total`);
    }

    let statusRaw = args[0];
    let username = args[1];
    let layanan = args[2];
    let produk = args[3];
    let total = args[4];

    let statusFormatted = "";
    if (statusRaw.toLowerCase() === "succes" || statusRaw.toLowerCase() === "pembayaran berhasil") {
        statusFormatted = "✅ PEMBAYARAN BERHASIL";
    } else if (statusRaw.toLowerCase().startsWith("deposit")) {
        const depositNominal = statusRaw.toLowerCase().replace("deposit", "").trim() || "0";
        statusFormatted = `💳 DEPOSIT ${depositNominal}`;
    } else if (statusRaw.toLowerCase() === "waktu otomatis") {
        statusFormatted = "⏰ WAKTU OTOMATIS";
    } else {
        statusFormatted = statusRaw.toUpperCase();
    }

    // Pastikan username diawali @ (tambahkan jika belum)
    if (!username.startsWith("@")) username = "@" + username;

    // ---------- GENERATE ID TRANSAKSI OTOMATIS ----------
    const now = new Date();
    const tgl = `${now.getDate()}${now.getMonth()+1}${now.getFullYear().toString().slice(-2)}`; // DDMMYY
    const counterFile = path.join(__dirname, "data", "struk_counter.json");
    let counter = 1;
    let todayStr = now.toISOString().slice(0,10);
    if (fs.existsSync(counterFile)) {
        try {
            const data = JSON.parse(fs.readFileSync(counterFile, "utf8"));
            if (data.today === todayStr) counter = data.counter + 1;
        } catch(e) {}
    }
    // Pastikan folder data ada
    if (!fs.existsSync(path.dirname(counterFile))) fs.mkdirSync(path.dirname(counterFile), { recursive: true });
    fs.writeFileSync(counterFile, JSON.stringify({ today: todayStr, counter }));
    // konversi counter ke huruf (1=a, 2=b, ..., 26=z, 27=aa, ...)
    let suffix = "";
    let n = counter;
    while (n > 0) {
        n--;
        suffix = String.fromCharCode(97 + (n % 26)) + suffix;
        n = Math.floor(n / 26);
    }
    const trxId = tgl + suffix;

    // ---------- BANGUN URL API ----------
    const apiKey = global.apikeyStruk || //beli apikey di 085141067887;
    const storeName = encodeURIComponent("hanssoft");
    const receiptTitle = encodeURIComponent("all ur hosting needed");
    const datetime = encodeURIComponent(now.toLocaleDateString("id-ID")); // 27/5/2026
    const cashierName = encodeURIComponent("@jayhankuuh");
    const testimonial = encodeURIComponent("terimakasih sudah berbelanja <3");

    const apiUrl = `https://ndxhs.my.id/receipt/struk-rapi?apikey=${apiKey}&store_name=${storeName}&receipt_title=${receiptTitle}&trx_id=${trxId}&status=${encodeURIComponent(statusFormatted)}&datetime=${datetime}&customer_name=${encodeURIComponent(username)}&cashier_name=${cashierName}&service=${encodeURIComponent(layanan)}&product=${encodeURIComponent(produk)}&amount=${encodeURIComponent(total)}&testimonial=${testimonial}`;

    try {
        const response = await axios.get(apiUrl, {
            responseType: "arraybuffer",
            timeout: 30000
        });

        if (response.status === 200 && response.headers["content-type"] === "image/png") {
            await zepp.sendMessage(from, {
                image: Buffer.from(response.data, "binary"),
                caption: `✅ Struk berhasil\nID: ${trxId}\nStatus: ${statusFormatted}\nTotal: Rp${parseInt(total).toLocaleString("id-ID")}`
            }, { quoted: msg });
        } else {
            zeppreply("❌ Gagal mengambil gambar struk. Server error.");
        }
    } catch (error) {
        console.error(error);
        zeppreply(`❌ Error: ${error.message}`);
    }
}
break;
