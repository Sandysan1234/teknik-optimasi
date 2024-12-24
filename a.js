document.addEventListener("DOMContentLoaded", () => {
    const table = document.querySelector("table");

    // Fungsi untuk menghitung "Perbedaan Baris"
    function calculateRowDifference(row) {
        if (row.classList.contains("kebutuhan-gudang")) return;

        const cells = Array.from(row.querySelectorAll("td")).slice(0, 3);
        const values = cells.map(cell => parseInt(cell.textContent.trim()) || 0);

        values.sort((a, b) => a - b);
        const difference = values.length > 1 ? values[1] - values[0] : 0;

        row.querySelector("td:last-child").textContent = difference;
    }

    // Fungsi untuk menghitung "Perbedaan Kolom"
    function calculateColumnDifference(columnIndex) {
        const rows = Array.from(
            table.querySelectorAll("tr:nth-child(n+2):not(:last-child)")
        );

        const values = rows
            .map(row => {
                if (
                    row.classList.contains("kebutuhan-gudang") ||
                    columnIndex === 3 ||
                    columnIndex === 4
                )
                    return null;

                const cell = row.querySelectorAll("td")[columnIndex];
                return parseInt(cell.textContent.trim()) || 0;
            })
            .filter(value => value !== null);

        if (values.length > 1) {
            values.sort((a, b) => a - b);
            const difference = values[1] - values[0];
            table
                .querySelector("tr:last-child")
                .querySelectorAll("td")[columnIndex].textContent = difference;
        }
    }

    // Proses semua baris dan kolom
    function processTable() {
        table
            .querySelectorAll("tr:nth-child(n+2):not(:last-child)")
            .forEach(calculateRowDifference);

        const columnCount = table.querySelector("tr").children.length - 2;
        for (let i = 0; i < columnCount; i++) calculateColumnDifference(i);
    }

    // Fungsi untuk menyorot baris/kolom dengan perbedaan terbesar
    function highlightMaxDifference() {
        let maxRowDifference = 0;
        let targetRow = null;

        // Cari baris dengan perbedaan terbesar
        table.querySelectorAll("tr:nth-child(n+2):not(:last-child)").forEach(row => {
            const difference = parseInt(row.querySelector("td:last-child").textContent.trim()) || 0;
            if (difference > maxRowDifference) {
                maxRowDifference = difference;
                targetRow = row;
            }
        });

        // Sorot baris dengan warna kuning dan nilai terkecil dengan warna merah
        if (targetRow) {
            targetRow.style.backgroundColor = "yellow"; // Highlight seluruh baris
            const cells = Array.from(targetRow.querySelectorAll("td")).slice(0, 3);
            const values = cells.map(cell => parseInt(cell.textContent.trim()) || 0);
            const minValue = Math.min(...values);

            // Ubah warna nilai terkecil jadi merah
            cells.forEach(cell => {
                if (parseInt(cell.textContent.trim()) === minValue) {
                    cell.style.color = "red";
                }
            });
        }
    }

    // Deteksi perubahan input dan hitung ulang
    table.addEventListener("input", processTable);

    // Jadikan semua <td> dan <th> bisa di-edit
    table.querySelectorAll("td:not(:last-child), th").forEach(cell => {
        cell.contentEditable = "true"; // Jadikan sel bisa diedit
        cell.addEventListener("blur", () => {
            if (isNaN(cell.textContent.trim()) || cell.textContent.trim() === "") {
                if (!cell.matches("th")) cell.textContent = "0"; // Set default ke 0 untuk <td>, abaikan <th>
            }
            processTable();
        });
    });

    // Tambahkan event listener untuk tombol highlight
    const button = document.querySelector("#highlightButton");
    button.addEventListener("click", highlightMaxDifference);

    processTable(); // Proses perhitungan awal
});
