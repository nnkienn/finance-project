package com.finance.transaction.service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.finance.category.repository.UserCategoryRepository;
import com.finance.transaction.entity.Transaction;
import com.finance.transaction.repository.TransactionRepository;
import com.itextpdf.text.Chunk;
import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.opencsv.CSVWriter;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TransactionExportImportService {
    private final TransactionRepository transactionRepository;
    private final UserCategoryRepository userCategoryRepository;

public File exportTransactionsToCsv(Long userId) throws IOException {
    List<Transaction> transactions = transactionRepository.findByUserId(userId);

    File file = File.createTempFile("transactions_", ".csv");

    try (Writer writer = new OutputStreamWriter(new FileOutputStream(file), StandardCharsets.UTF_8);
         CSVWriter csvWriter = new CSVWriter(writer)) {

        // Thêm BOM để Excel nhận UTF-8
        writer.write('\uFEFF');

        // Header
        String[] header = {"ID", "Amount", "Type", "PaymentMethod", "Note", "Date", "Category"};
        csvWriter.writeNext(header);

        // Rows
        for (Transaction tx : transactions) {
            String[] row = {
                    String.valueOf(tx.getId()),
                    tx.getAmount() != null ? tx.getAmount().toString() : "",
                    tx.getType() != null ? tx.getType().name() : "",
                    tx.getPaymentMethod() != null ? tx.getPaymentMethod().name() : "",
                    tx.getNote() != null ? tx.getNote() : "",
                    tx.getTransactionDate() != null ? tx.getTransactionDate().toString() : "",
                    tx.getUserCategory() != null ? tx.getUserCategory().getName() : ""
            };
            csvWriter.writeNext(row);
        }
    }
    return file;
}

    
    public File exportTransactionsToPDF(Long userId) throws IOException, DocumentException {
        List<Transaction> transactions = transactionRepository.findByUserId(userId);

        File file = File.createTempFile("transactions_", ".pdf");
        Document document = new Document();
        PdfWriter.getInstance(document, new FileOutputStream(file));

        document.open();
        document.add(new Paragraph("Transactions Report"));
        document.add(new Paragraph("User ID: " + userId));
        document.add(new Paragraph("Generated at: " + LocalDateTime.now()));
        document.add(Chunk.NEWLINE);

        PdfPTable table = new PdfPTable(6); // 6 cột
        table.addCell("ID");
        table.addCell("Amount");
        table.addCell("Type");
        table.addCell("Payment Method");
        table.addCell("Note");
        table.addCell("Date");

        for (Transaction tx : transactions) {
            table.addCell(String.valueOf(tx.getId()));
            table.addCell(tx.getAmount().toString());
            table.addCell(tx.getType().name());
            table.addCell(tx.getPaymentMethod().name());
            table.addCell(tx.getNote());
            table.addCell(tx.getTransactionDate().toString());
        }
        document.add(table);
        document.close();

        return file;
    }
}
