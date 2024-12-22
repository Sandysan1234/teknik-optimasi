document.addEventListener("DOMContentLoaded", () => {
    const table = document.querySelector("table");

    // Fungsi untuk menghitung "Perbedaan Baris"
    function calculateRowDifference(row) {
        if (row.classList.contains('kebutuhan-gudang')) return;

        const cells = Array.from(row.querySelectorAll("td")).slice(0, 3); // Ambil nilai kolom Gudang A, B, dan C
        const values = cells.map(cell => parseInt(cell.textContent.trim()) || 0);

        values.sort((a, b) => a - b); // Urutkan nilai
        const difference = values.length > 1 ? values[1] - values[0] : 0;

        row.querySelector("td:last-child").textContent = difference; // Tulis hasil di kolom terakhir
    }

    // Fungsi untuk menghitung "Perbedaan Kolom"
    function calculateColumnDifference(columnIndex) {
        const rows = Array.from(table.querySelectorAll("tr:nth-child(n+2):not(:last-child)"));

        const values = rows.map(row => {
            if (row.classList.contains('kebutuhan-gudang') || columnIndex === 3 || columnIndex === 4) return null;

            const cell = row.querySelectorAll("td")[columnIndex];
            return parseInt(cell.textContent.trim()) || 0;
        }).filter(value => value !== null);

        if (values.length > 1) {
            values.sort((a, b) => a - b);
            const difference = values[1] - values[0];

            table.querySelector("tr:last-child").querySelectorAll("td")[columnIndex].textContent = difference;
        }
    }

    // Proses semua baris dan kolom
    function processTable() {
        table.querySelectorAll("tr:nth-child(n+2):not(:last-child)").forEach(calculateRowDifference);
        const columnCount = table.querySelector("tr").children.length - 2;
        for (let i = 0; i < columnCount; i++) calculateColumnDifference(i);
    }

    // Fungsi untuk menjadikan elemen editable
    function makeEditable(selector) {
        table.querySelectorAll(selector).forEach(cell => {
            cell.contentEditable = "true";
            cell.addEventListener("blur", () => {
                // Hanya validasi untuk <td>, <th> biarkan inputan bebas
                if (cell.tagName === "TD") {
                    if (isNaN(cell.textContent.trim()) || cell.textContent.trim() === "") {
                        cell.textContent = "0"; // Set default ke 0 untuk <td>
                    }
                    processTable(); // Hitung ulang hanya untuk <td>
                }
            });
        });
    }

    // Jadikan <td> dan <th> bisa diedit
    makeEditable("td:not(:last-child)");
    makeEditable("th");

    // Hitung ulang pada awal
    processTable();
});
