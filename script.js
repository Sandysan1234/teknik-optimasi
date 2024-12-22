document.addEventListener("DOMContentLoaded", () => {
    const table = document.querySelector("table");

    // Fungsi untuk menghitung "Perbedaan Baris"
    function calculateRowDifference(row) {
        const cells = Array.from(row.querySelectorAll("td")).slice(0, 3); // Ambil nilai dari kolom Gudang A, B, dan C
        const values = cells.map(cell => parseInt(cell.textContent.trim()) || 0); // Ambil nilai dalam sel, ubah ke angka

        // Urutkan nilai untuk mencari dua angka terkecil
        values.sort((a, b) => a - b);

        // Hitung perbedaan dua angka terkecil
        const difference = values.length > 1 ? values[1] - values[0] : 0;

        // Tulis hasil di kolom terakhir (Perbedaan Baris)
        const lastCell = row.querySelector("td:last-child");
        lastCell.textContent = difference;
    }

    // Fungsi untuk menghitung "Perbedaan Kolom"
    function calculateColumnDifference(columnIndex) {
        const rows = Array.from(table.querySelectorAll("tr:nth-child(n+2):not(:last-child)")); // Ambil semua baris kecuali header dan terakhir
        const values = rows.map(row => {
            const cell = row.querySelectorAll("td")[columnIndex];
            return parseInt(cell.textContent.trim()) || 0; // Ambil nilai dalam sel
        });

        // Urutkan nilai untuk mencari dua angka terkecil
        values.sort((a, b) => a - b);

        // Hitung perbedaan dua angka terkecil
        const difference = values.length > 1 ? values[1] - values[0] : 0;

        // Tulis hasil di baris terakhir pada kolom terkait
        const lastRow = table.querySelector("tr:last-child");
        const targetCell = lastRow.querySelectorAll("td")[columnIndex];
        targetCell.textContent = difference;
    }

    // Fungsi untuk memproses semua baris dan kolom
    function processTable() {
        const rows = table.querySelectorAll("tr:nth-child(n+2):not(:last-child)"); // Baris data
        rows.forEach(row => calculateRowDifference(row)); // Hitung "Perbedaan Baris" untuk setiap baris

        const columnCount = table.querySelector("tr").children.length - 2; // Hitung jumlah kolom Gudang
        for (let i = 0; i < columnCount; i++) {
            calculateColumnDifference(i); // Hitung "Perbedaan Kolom" untuk setiap kolom
        }
    }

    // Tambahkan event listener ke semua <td> untuk deteksi perubahan nilai
    table.addEventListener("input", () => {
        processTable(); // Hitung ulang setiap kali ada perubahan input
    });

    // Buat semua <td> dapat diinput
    const tableCells = document.querySelectorAll("td:not(:last-child)");
    tableCells.forEach(cell => {
        cell.contentEditable = "true"; // Jadikan editable

        // Event listener untuk validasi input
        cell.addEventListener("blur", () => {
            if (isNaN(cell.textContent.trim()) || cell.textContent.trim() === "") {
                cell.textContent = "0"; // Reset ke 0 jika input bukan angka
            }
            processTable(); // Hitung ulang setelah input selesai
        });
    });

    // Proses perhitungan awal (jika ada nilai default di tabel)
    processTable();
});
