import dashboard from "@/data/dashboard.json";
import glJournals from "@/data/glJournals.json";
import glRecurring from "@/data/glRecurring.json";
import glDual from "@/data/glDual.json";
import glClose from "@/data/glClose.json";
import arInvoices from "@/data/arInvoices.json";
import arReceipts from "@/data/arReceipts.json";
import arDeposits from "@/data/arDeposits.json";
import arPackages from "@/data/arPackages.json";
import apBills from "@/data/apBills.json";
import apPayments from "@/data/apPayments.json";
import bankAccounts from "@/data/bankAccounts.json";
import bankReco from "@/data/bankReco.json";
import bankClearing from "@/data/bankClearing.json";
import cashClosing from "@/data/cashClosing.json";
import pettyBoxes from "@/data/pettyBoxes.json";
import pettyVouchers from "@/data/pettyVouchers.json";
import pettyTopup from "@/data/pettyTopup.json";
import inventoryCogs from "@/data/inventoryCogs.json";
import inventoryGrni from "@/data/inventoryGrni.json";
import inventoryLots from "@/data/inventoryLots.json";
import taxCodes from "@/data/taxCodes.json";
import docNumbering from "@/data/docNumbering.json";
import coa from "@/data/coa.json";
import parties from "@/data/parties.json";
import banksChannels from "@/data/banksChannels.json";
import pettyMaster from "@/data/pettyMaster.json";
import approvals from "@/data/approvals.json";
import dimensions from "@/data/dimensions.json";
import trialBalance from "@/data/reports/trialBalance.json";
import profitLoss from "@/data/reports/profitLoss.json";
import retainedEarnings from "@/data/reports/retainedEarnings.json";
import balanceSheet from "@/data/reports/balanceSheet.json";
import cashflowDirect from "@/data/reports/cashflowDirect.json";
import cashflowIndirect from "@/data/reports/cashflowIndirect.json";

import type { ModuleConfig } from "@/components/modules/ModuleScreen";

const moduleConfigs: Record<string, ModuleConfig<Record<string, unknown>>> = {
  "gl/journals": {
    title: "General Ledger • Journals",
    description:
      "Daftar jurnal umum dengan status draft/posted/void dan validasi debit kredit.",
    data: glJournals,
    columns: [
      { key: "id", header: "No. Jurnal" },
      { key: "date", header: "Tanggal" },
      { key: "description", header: "Deskripsi" },
      { key: "debit", header: "Debit", align: "right", renderType: "currency" },
      {
        key: "credit",
        header: "Kredit",
        align: "right",
        renderType: "currency",
      },
      { key: "status", header: "Status", renderType: "status" },
    ],
    detailFields: [
      { name: "id", label: "No. Jurnal" },
      { name: "date", label: "Tanggal" },
      { name: "description", label: "Deskripsi" },
      { name: "debitAccount", label: "Akun Debit" },
      { name: "creditAccount", label: "Akun Kredit" },
      { name: "debit", label: "Debit", formatType: "currency" },
      { name: "credit", label: "Kredit", formatType: "currency" },
      { name: "status", label: "Status" },
    ],
    rowActions: [
      { label: "View", intent: "view" },
      { label: "Edit", intent: "edit" },
      { label: "Post", intent: "mock", message: "Jurnal diposting (mock)." },
      { label: "Void", intent: "mock", message: "Jurnal di-void (mock)." },
      { label: "Print", intent: "mock", message: "Cetak jurnal (mock)." },
      { label: "Export", intent: "mock", message: "Ekspor jurnal (mock)." },
    ],
    form: {
      title: "Jurnal",
      fields: [
        { name: "id", label: "No. Jurnal" },
        { name: "date", label: "Tanggal", type: "date" },
        { name: "description", label: "Deskripsi" },
        { name: "debitAccount", label: "Akun Debit" },
        { name: "creditAccount", label: "Akun Kredit" },
        { name: "debit", label: "Nilai Debit", type: "number" },
        { name: "credit", label: "Nilai Kredit", type: "number" },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: ["draft", "posted", "void"],
        },
      ],
      validateType: "balanceDebitCredit",
    },
  },

  "gl/dual": {
    title: "General Ledger • Dual Journal",
    description: "Monitoring STAT/ALT overlay dan audit/resync.",
    data: glDual,
    columns: [
      { key: "id", header: "ID" },
      { key: "date", header: "Tanggal" },
      { key: "statAccount", header: "STAT" },
      { key: "altAccount", header: "ALT" },
      { key: "overlay", header: "Overlay" },
      { key: "status", header: "Status", renderType: "status" },
    ],
    detailFields: [
      { name: "id", label: "ID" },
      { name: "date", label: "Tanggal" },
      { name: "statAccount", label: "Akun STAT" },
      { name: "altAccount", label: "Akun ALT" },
      { name: "overlay", label: "Overlay" },
      { name: "auditor", label: "Auditor" },
      { name: "status", label: "Status" },
    ],
    rowActions: [
      { label: "View", intent: "view" },
      { label: "Edit", intent: "edit" },
      {
        label: "Resync",
        intent: "mock",
        message: "Dual journal disinkronkan ulang (mock).",
      },
      {
        label: "Audit Trail",
        intent: "mock",
        message: "Audit trail ditampilkan (mock).",
      },
    ],
    form: {
      title: "Dual Journal",
      fields: [
        { name: "id", label: "ID" },
        { name: "date", label: "Tanggal", type: "date" },
        { name: "statAccount", label: "Akun STAT" },
        { name: "altAccount", label: "Akun ALT" },
        {
          name: "overlay",
          label: "Overlay",
          type: "select",
          options: ["on", "off"],
        },
        { name: "auditor", label: "Auditor" },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: ["synced", "needs-review", "resync"],
        },
      ],
    },
  },

  "gl/recurring": {
    title: "General Ledger • Recurring & Reversing",
    description: "Template jurnal berulang/pembalik beserta scheduler.",
    data: glRecurring,
    columns: [
      { key: "template", header: "Template" },
      { key: "type", header: "Tipe" },
      { key: "frequency", header: "Frekuensi" },
      { key: "nextRun", header: "Eksekusi Berikutnya" },
      {
        key: "amount",
        header: "Nominal",
        align: "right",
        renderType: "currency",
      },
      { key: "status", header: "Status" },
    ],
    detailFields: [
      { name: "template", label: "Nama Template" },
      { name: "type", label: "Tipe" },
      { name: "frequency", label: "Frekuensi" },
      { name: "nextRun", label: "Berikutnya" },
      { name: "amount", label: "Nominal", formatType: "currency" },
      { name: "debitAccount", label: "Akun Debit" },
      { name: "creditAccount", label: "Akun Kredit" },
      { name: "status", label: "Status" },
    ],
    rowActions: [
      { label: "View", intent: "view" },
      { label: "Edit", intent: "edit" },
      { label: "Preview", intent: "mock", message: "Preview jurnal (mock)." },
      {
        label: "Schedule",
        intent: "mock",
        message: "Scheduler diperbarui (mock).",
      },
    ],
    form: {
      title: "Template Jurnal",
      fields: [
        { name: "template", label: "Nama Template" },
        {
          name: "type",
          label: "Tipe",
          type: "select",
          options: ["recurring", "reversing"],
        },
        {
          name: "frequency",
          label: "Frekuensi",
          type: "select",
          options: ["Harian", "Mingguan", "Bulanan", "Triwulanan", "Tahunan"],
        },
        { name: "nextRun", label: "Eksekusi Berikutnya", type: "date" },
        { name: "debitAccount", label: "Akun Debit" },
        { name: "creditAccount", label: "Akun Kredit" },
        { name: "amount", label: "Nominal", type: "number" },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: ["active", "scheduled"],
        },
      ],
    },
  },

  "gl/close": {
    title: "General Ledger • Period Close",
    description: "Kunci periode, checklist closing, dan status approval.",
    data: glClose,
    columns: [
      { key: "period", header: "Periode" },
      { key: "status", header: "Status", renderType: "status" },
      { key: "openDate", header: "Tanggal Buka" },
      { key: "closeDate", header: "Tanggal Tutup" },
      { key: "owner", header: "PIC" },
    ],
    detailFields: [
      { name: "period", label: "Periode" },
      { name: "status", label: "Status" },
      { name: "openDate", label: "Tanggal Buka" },
      { name: "closeDate", label: "Tanggal Tutup" },
      { name: "owner", label: "PIC" },
      { name: "checklist", label: "Checklist", formatType: "array" },
      { name: "notes", label: "Catatan" },
    ],
    rowActions: [
      { label: "View", intent: "view" },
      {
        label: "Checklist",
        intent: "mock",
        message: "Checklist diperbarui (mock).",
      },
      { label: "Lock", intent: "mock", message: "Periode dikunci (mock)." },
      {
        label: "Reopen",
        intent: "mock",
        message: "Periode dibuka kembali (mock).",
      },
    ],
    form: {
      title: "Closing Periode",
      fields: [
        { name: "period", label: "Periode" },
        { name: "openDate", label: "Tanggal Buka", type: "date" },
        { name: "closeDate", label: "Tanggal Tutup", type: "date" },
        { name: "owner", label: "PIC" },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: ["in-progress", "closed", "archived"],
        },
        { name: "notes", label: "Catatan", type: "textarea" },
      ],
    },
  },

  "ar/invoices": {
    title: "Sales (AR) • Invoices & Credit Notes",
    description:
      "Tagihan penjualan jasa/produk klinik beserta status pembayaran.",
    data: arInvoices,
    columns: [
      { key: "number", header: "No. Invoice" },
      { key: "date", header: "Tanggal" },
      { key: "customer", header: "Pelanggan" },
      { key: "treatment", header: "Paket/Treatment" },
      { key: "total", header: "Total", align: "right", renderType: "currency" },
      { key: "status", header: "Status", renderType: "status" },
    ],
    detailFields: [
      { name: "number", label: "No. Invoice" },
      { name: "date", label: "Tanggal" },
      { name: "customer", label: "Pelanggan" },
      { name: "treatment", label: "Treatment" },
      { name: "term", label: "Termin" },
      { name: "dueDate", label: "Jatuh Tempo" },
      { name: "subtotal", label: "Subtotal", formatType: "currency" },
      { name: "discount", label: "Diskon", formatType: "currency" },
      { name: "tax", label: "Pajak", formatType: "currency" },
      { name: "total", label: "Total", formatType: "currency" },
      { name: "status", label: "Status" },
    ],
    rowActions: [
      { label: "View", intent: "view" },
      { label: "Edit", intent: "edit" },
      {
        label: "Receive Payment",
        intent: "mock",
        message: "Penerimaan pembayaran dibuat (mock).",
      },
      {
        label: "Issue CN",
        intent: "mock",
        message: "Credit note dibuat (mock).",
      },
      { label: "Print", intent: "mock", message: "Invoice dicetak (mock)." },
      { label: "Export", intent: "mock", message: "Invoice diekspor (mock)." },
    ],
    form: {
      title: "Invoice",
      fields: [
        { name: "number", label: "No. Invoice" },
        { name: "date", label: "Tanggal", type: "date" },
        { name: "customer", label: "Pelanggan" },
        { name: "treatment", label: "Treatment" },
        {
          name: "term",
          label: "Termin",
          type: "select",
          options: ["COD", "15 Hari", "30 Hari", "45 Hari"],
        },
        { name: "dueDate", label: "Jatuh Tempo", type: "date" },
        { name: "subtotal", label: "Subtotal", type: "number" },
        { name: "discount", label: "Diskon", type: "number" },
        { name: "tax", label: "Pajak", type: "number" },
        { name: "total", label: "Total", type: "number" },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: ["open", "paid", "overdue"],
        },
      ],
    },
  },

  "ar/receipts": {
    title: "Sales (AR) • Receipts",
    description: "Penerimaan pembayaran cash/transfer/EDC/e-wallet/deposit.",
    data: arReceipts,
    columns: [
      { key: "receipt", header: "No. Penerimaan" },
      { key: "date", header: "Tanggal" },
      { key: "customer", header: "Pelanggan" },
      { key: "method", header: "Metode" },
      {
        key: "amount",
        header: "Jumlah",
        align: "right",
        renderType: "currency",
      },
      { key: "status", header: "Status", renderType: "status" },
    ],
    detailFields: [
      { name: "receipt", label: "No. Penerimaan" },
      { name: "date", label: "Tanggal" },
      { name: "customer", label: "Pelanggan" },
      { name: "method", label: "Metode" },
      { name: "reference", label: "Referensi" },
      { name: "invoice", label: "Invoice" },
      { name: "amount", label: "Jumlah", formatType: "currency" },
      { name: "fee", label: "Biaya Channel", formatType: "currency" },
      { name: "status", label: "Status" },
    ],
    rowActions: [
      { label: "View", intent: "view" },
      { label: "Edit", intent: "edit" },
      {
        label: "Split",
        intent: "mock",
        message: "Split payment dibuat (mock).",
      },
      {
        label: "Clear",
        intent: "mock",
        message: "Penerimaan diclosed (mock).",
      },
    ],
    form: {
      title: "Penerimaan",
      fields: [
        { name: "receipt", label: "No. Penerimaan" },
        { name: "date", label: "Tanggal", type: "date" },
        { name: "customer", label: "Pelanggan" },
        {
          name: "method",
          label: "Metode",
          type: "select",
          options: ["Cash", "Transfer", "EDC", "e-Wallet", "Deposit", "Points"],
        },
        { name: "reference", label: "Referensi" },
        { name: "invoice", label: "Invoice" },
        { name: "amount", label: "Jumlah", type: "number" },
        { name: "fee", label: "Biaya Channel", type: "number" },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: ["posted", "partial", "void"],
        },
      ],
    },
  },

  "ar/deposits": {
    title: "Sales (AR) • Deposits & Gift Cards",
    description: "Pengelolaan deposit dan gift card pasien dengan saldo.",
    data: arDeposits,
    columns: [
      { key: "code", header: "No." },
      { key: "date", header: "Tanggal" },
      { key: "customer", header: "Pelanggan" },
      { key: "type", header: "Tipe" },
      {
        key: "amount",
        header: "Nilai",
        align: "right",
        renderType: "currency",
      },
      {
        key: "balance",
        header: "Saldo",
        align: "right",
        renderType: "currency",
      },
      { key: "status", header: "Status", renderType: "status" },
    ],
    detailFields: [
      { name: "code", label: "Nomor" },
      { name: "date", label: "Tanggal" },
      { name: "customer", label: "Pelanggan" },
      { name: "type", label: "Tipe" },
      { name: "amount", label: "Nilai", formatType: "currency" },
      { name: "balance", label: "Saldo", formatType: "currency" },
      { name: "expiry", label: "Kadaluarsa" },
      { name: "status", label: "Status" },
    ],
    rowActions: [
      { label: "View", intent: "view" },
      { label: "Apply", intent: "mock", message: "Deposit diterapkan (mock)." },
      { label: "Refund", intent: "mock", message: "Deposit direfund (mock)." },
    ],
    form: {
      title: "Deposit/Gift Card",
      fields: [
        { name: "code", label: "Nomor" },
        { name: "date", label: "Tanggal", type: "date" },
        { name: "customer", label: "Pelanggan" },
        {
          name: "type",
          label: "Tipe",
          type: "select",
          options: ["Deposit", "Gift Card", "Voucher"],
        },
        { name: "amount", label: "Nilai", type: "number" },
        { name: "balance", label: "Saldo", type: "number" },
        { name: "expiry", label: "Kadaluarsa", type: "date" },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: ["active", "unused", "hangus"],
        },
      ],
    },
  },

  "ar/packages": {
    title: "Sales (AR) • Packages & Memberships",
    description:
      "Pengelolaan paket, membership, deferred revenue, dan channel penjualan.",
    data: arPackages,
    columns: [
      { key: "code", header: "Kode" },
      { key: "name", header: "Nama Paket" },
      { key: "type", header: "Jenis" },
      { key: "price", header: "Harga", align: "right", renderType: "currency" },
      { key: "sessions", header: "Sesi" },
      { key: "status", header: "Status", renderType: "status" },
    ],
    detailFields: [
      { name: "code", label: "Kode" },
      { name: "name", label: "Nama Paket" },
      { name: "type", label: "Jenis" },
      { name: "sessions", label: "Jumlah Sesi" },
      { name: "durationMonths", label: "Durasi (bulan)" },
      { name: "price", label: "Harga", formatType: "currency" },
      { name: "channel", label: "Channel" },
      { name: "deferred", label: "Deferred?" },
      { name: "status", label: "Status" },
    ],
    rowActions: [
      { label: "View", intent: "view" },
      { label: "Edit", intent: "edit" },
      {
        label: "Activate",
        intent: "mock",
        message: "Paket diaktifkan (mock).",
      },
      {
        label: "Schedule",
        intent: "mock",
        message: "Jadwal redemption diatur (mock).",
      },
    ],
    form: {
      title: "Paket/Membership",
      fields: [
        { name: "code", label: "Kode" },
        { name: "name", label: "Nama" },
        {
          name: "type",
          label: "Jenis",
          type: "select",
          options: ["Treatment", "Produk", "Membership", "Bundle"],
        },
        { name: "sessions", label: "Jumlah Sesi", type: "number" },
        { name: "durationMonths", label: "Durasi (bulan)", type: "number" },
        { name: "price", label: "Harga", type: "number" },
        {
          name: "deferred",
          label: "Deferred",
          type: "select",
          options: ["true", "false"],
        },
        { name: "channel", label: "Channel" },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: ["active", "inactive"],
        },
      ],
    },
  },

  "ap/bills": {
    title: "Purchases (AP) • Bills & Debit Notes",
    description: "Tagihan vendor, status pembayaran, dan aging AP.",
    data: apBills,
    columns: [
      { key: "number", header: "No. Bill" },
      { key: "date", header: "Tanggal" },
      { key: "vendor", header: "Vendor" },
      { key: "category", header: "Kategori" },
      { key: "total", header: "Total", align: "right", renderType: "currency" },
      { key: "status", header: "Status", renderType: "status" },
    ],
    detailFields: [
      { name: "number", label: "No. Bill" },
      { name: "date", label: "Tanggal" },
      { name: "vendor", label: "Vendor" },
      { name: "category", label: "Kategori" },
      { name: "term", label: "Termin" },
      { name: "dueDate", label: "Jatuh Tempo" },
      { name: "subtotal", label: "Subtotal", formatType: "currency" },
      { name: "tax", label: "Pajak", formatType: "currency" },
      { name: "total", label: "Total", formatType: "currency" },
      { name: "status", label: "Status" },
    ],
    rowActions: [
      { label: "View", intent: "view" },
      { label: "Edit", intent: "edit" },
      {
        label: "Schedule Payment",
        intent: "mock",
        message: "Pembayaran dijadwalkan (mock).",
      },
      {
        label: "Attach",
        intent: "mock",
        message: "Lampiran ditambahkan (mock).",
      },
    ],
    form: {
      title: "Bill Vendor",
      fields: [
        { name: "number", label: "No. Bill" },
        { name: "date", label: "Tanggal", type: "date" },
        { name: "vendor", label: "Vendor" },
        { name: "category", label: "Kategori" },
        {
          name: "term",
          label: "Termin",
          type: "select",
          options: ["COD", "30 Hari", "45 Hari"],
        },
        { name: "dueDate", label: "Jatuh Tempo", type: "date" },
        { name: "subtotal", label: "Subtotal", type: "number" },
        { name: "tax", label: "Pajak", type: "number" },
        { name: "total", label: "Total", type: "number" },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: ["open", "paid", "scheduled", "draft", "overdue"],
        },
      ],
    },
  },

  "ap/payments": {
    title: "Purchases (AP) • Payments",
    description: "Payment voucher, approval, dan jadwal pembayaran vendor.",
    data: apPayments,
    columns: [
      { key: "payment", header: "No. Pembayaran" },
      { key: "date", header: "Tanggal" },
      { key: "vendor", header: "Vendor" },
      { key: "method", header: "Metode" },
      {
        key: "amount",
        header: "Jumlah",
        align: "right",
        renderType: "currency",
      },
      { key: "status", header: "Status", renderType: "status" },
    ],
    detailFields: [
      { name: "payment", label: "No. Pembayaran" },
      { name: "date", label: "Tanggal" },
      { name: "vendor", label: "Vendor" },
      { name: "method", label: "Metode" },
      { name: "reference", label: "Referensi" },
      { name: "bills", label: "Bill terkait", formatType: "array" },
      { name: "amount", label: "Jumlah", formatType: "currency" },
      { name: "status", label: "Status" },
    ],
    rowActions: [
      { label: "View", intent: "view" },
      { label: "Edit", intent: "edit" },
      {
        label: "Approve",
        intent: "mock",
        message: "Pembayaran disetujui (mock).",
      },
      {
        label: "Reject",
        intent: "mock",
        message: "Pembayaran ditolak (mock).",
      },
    ],
    form: {
      title: "Payment Voucher",
      fields: [
        { name: "payment", label: "No. Pembayaran" },
        { name: "date", label: "Tanggal", type: "date" },
        { name: "vendor", label: "Vendor" },
        {
          name: "method",
          label: "Metode",
          type: "select",
          options: ["Cash", "Transfer", "Giro", "Virtual Account"],
        },
        { name: "reference", label: "Referensi" },
        { name: "amount", label: "Jumlah", type: "number" },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: ["pending", "approved", "processed", "scheduled", "partial"],
        },
      ],
    },
  },

  "bank/accounts": {
    title: "Banking & Cash • Bank Accounts & Transfer",
    description: "Daftar rekening, saldo kas, dan referensi multi-currency.",
    data: bankAccounts,
    columns: [
      { key: "bank", header: "Bank" },
      { key: "accountName", header: "Nama Akun" },
      { key: "number", header: "No. Rekening" },
      { key: "currency", header: "Mata Uang" },
      {
        key: "balance",
        header: "Saldo",
        align: "right",
        renderType: "currency",
      },
      { key: "status", header: "Status", renderType: "status" },
    ],
    detailFields: [
      { name: "bank", label: "Bank" },
      { name: "accountName", label: "Nama Akun" },
      { name: "number", label: "No. Rekening" },
      { name: "currency", label: "Mata Uang" },
      { name: "balance", label: "Saldo", formatType: "currency" },
      { name: "branch", label: "Cabang" },
      { name: "status", label: "Status" },
    ],
    rowActions: [
      { label: "View", intent: "view" },
      { label: "Edit", intent: "edit" },
      {
        label: "Transfer",
        intent: "mock",
        message: "Transfer antar akun dibuat (mock).",
      },
    ],
    form: {
      title: "Rekening Bank",
      fields: [
        { name: "bank", label: "Bank" },
        { name: "accountName", label: "Nama Akun" },
        { name: "number", label: "No. Rekening" },
        {
          name: "currency",
          label: "Mata Uang",
          type: "select",
          options: ["IDR", "USD", "SGD"],
        },
        { name: "branch", label: "Cabang" },
        { name: "balance", label: "Saldo", type: "number" },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: ["active", "inactive"],
        },
      ],
    },
  },

  "bank/reconciliation": {
    title: "Banking & Cash • Bank Reconciliation",
    description: "Import mutasi, matching bukti vs buku, penanganan fee.",
    data: bankReco,
    columns: [
      { key: "date", header: "Tanggal" },
      { key: "description", header: "Deskripsi" },
      {
        key: "bankAmount",
        header: "Mutasi Bank",
        align: "right",
        renderType: "currency",
      },
      {
        key: "bookAmount",
        header: "Catatan Buku",
        align: "right",
        renderType: "currency",
      },
      {
        key: "difference",
        header: "Selisih",
        align: "right",
        renderType: "currency",
      },
      { key: "status", header: "Status", renderType: "status" },
    ],
    detailFields: [
      { name: "date", label: "Tanggal" },
      { name: "description", label: "Deskripsi" },
      { name: "bankAmount", label: "Mutasi Bank", formatType: "currency" },
      { name: "bookAmount", label: "Nilai Buku", formatType: "currency" },
      { name: "difference", label: "Selisih", formatType: "currency" },
      { name: "status", label: "Status" },
    ],
    rowActions: [
      { label: "View", intent: "view" },
      { label: "Match", intent: "mock", message: "Mutasi dimatching (mock)." },
      { label: "Unmatch", intent: "mock", message: "Mutasi dilepas (mock)." },
      {
        label: "Post Fee",
        intent: "mock",
        message: "Fee bank diposting (mock).",
      },
    ],
    form: {
      title: "Aturan Matching",
      fields: [
        { name: "description", label: "Kata Kunci" },
        { name: "bankAmount", label: "Mutasi Bank", type: "number" },
        { name: "bookAmount", label: "Nilai Buku", type: "number" },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: ["matched", "unmatched"],
        },
      ],
    },
  },

  "bank/clearing": {
    title: "Banking & Cash • EDC/e-Wallet Clearing",
    description: "Rekonsiliasi batch channel pembayaran, settlement, dan fee.",
    data: bankClearing,
    columns: [
      { key: "channel", header: "Channel" },
      { key: "batchDate", header: "Batch" },
      { key: "transactions", header: "Txn" },
      { key: "gross", header: "Gross", align: "right", renderType: "currency" },
      { key: "fee", header: "%/Fee", align: "right", renderType: "currency" },
      { key: "net", header: "Net", align: "right", renderType: "currency" },
      { key: "status", header: "Status", renderType: "status" },
    ],
    detailFields: [
      { name: "channel", label: "Channel" },
      { name: "provider", label: "Provider" },
      { name: "batchDate", label: "Batch" },
      { name: "transactions", label: "Transaksi" },
      { name: "gross", label: "Gross", formatType: "currency" },
      { name: "fee", label: "Fee", formatType: "currency" },
      { name: "net", label: "Net", formatType: "currency" },
      { name: "settlementDay", label: "Settlement" },
      { name: "status", label: "Status" },
    ],
    rowActions: [
      { label: "View", intent: "view" },
      { label: "Clear", intent: "mock", message: "Batch diclosed (mock)." },
      { label: "Post Fee", intent: "mock", message: "Fee diposting (mock)." },
    ],
    form: {
      title: "Channel Settlement",
      fields: [
        { name: "channel", label: "Channel" },
        { name: "provider", label: "Provider" },
        { name: "settlementDay", label: "Settlement (H+)", type: "number" },
        { name: "fee", label: "Fee", type: "number" },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: ["cleared", "pending-fee", "pending-clearing"],
        },
      ],
    },
  },

  "cash/closing": {
    title: "Banking & Cash • Cash Closing Outlet",
    description:
      "Kasir harian per outlet, selisih, dan tindak lanjut setor bank.",
    data: cashClosing,
    columns: [
      { key: "date", header: "Tanggal" },
      { key: "outlet", header: "Outlet" },
      {
        key: "opening",
        header: "Kas Awal",
        align: "right",
        renderType: "currency",
      },
      {
        key: "cashCount",
        header: "Kas Fisik",
        align: "right",
        renderType: "currency",
      },
      {
        key: "difference",
        header: "Selisih",
        align: "right",
        renderType: "currency",
      },
      { key: "status", header: "Status", renderType: "status" },
    ],
    detailFields: [
      { name: "date", label: "Tanggal" },
      { name: "outlet", label: "Outlet" },
      { name: "opening", label: "Kas Awal", formatType: "currency" },
      { name: "sales", label: "Penjualan Shift", formatType: "currency" },
      { name: "cashCount", label: "Kas Fisik", formatType: "currency" },
      { name: "difference", label: "Selisih", formatType: "currency" },
      { name: "petugas", label: "Petugas" },
      { name: "status", label: "Status" },
      { name: "notes", label: "Catatan" },
    ],
    rowActions: [
      { label: "View", intent: "view" },
      {
        label: "Investigation",
        intent: "mock",
        message: "Selisih ditindaklanjuti (mock).",
      },
      {
        label: "Post",
        intent: "mock",
        message: "Cash closing diposting (mock).",
      },
    ],
    form: {
      title: "Cash Count",
      fields: [
        { name: "date", label: "Tanggal", type: "date" },
        { name: "outlet", label: "Outlet" },
        { name: "opening", label: "Kas Awal", type: "number" },
        { name: "sales", label: "Pendapatan Shift", type: "number" },
        { name: "cashCount", label: "Kas Fisik", type: "number" },
        { name: "notes", label: "Catatan", type: "textarea" },
      ],
    },
  },

  "petty/boxes": {
    title: "Petty Cash • Imprest Boxes",
    description: "Setup box kas kecil dan custodian per cabang.",
    data: pettyBoxes,
    columns: [
      { key: "code", header: "Kode Box" },
      { key: "custodian", header: "Custodian" },
      { key: "branch", header: "Cabang" },
      { key: "limit", header: "Limit", align: "right", renderType: "currency" },
      {
        key: "balance",
        header: "Saldo",
        align: "right",
        renderType: "currency",
      },
      { key: "status", header: "Status", renderType: "status" },
    ],
    detailFields: [
      { name: "code", label: "Kode" },
      { name: "custodian", label: "Custodian" },
      { name: "branch", label: "Cabang" },
      { name: "limit", label: "Limit", formatType: "currency" },
      { name: "balance", label: "Saldo", formatType: "currency" },
      { name: "status", label: "Status" },
    ],
    rowActions: [
      { label: "View", intent: "view" },
      { label: "Edit", intent: "edit" },
      {
        label: "Deactivate",
        intent: "mock",
        message: "Box dinonaktifkan (mock).",
      },
    ],
    form: {
      title: "Imprest Box",
      fields: [
        { name: "code", label: "Kode" },
        { name: "custodian", label: "Custodian" },
        { name: "branch", label: "Cabang" },
        { name: "limit", label: "Limit", type: "number" },
        { name: "balance", label: "Saldo", type: "number" },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: ["active", "inactive"],
        },
      ],
    },
  },

  "petty/vouchers": {
    title: "Petty Cash • Vouchers",
    description: "Pengeluaran petty cash beserta lampiran dan approval.",
    data: pettyVouchers,
    columns: [
      { key: "number", header: "No. Voucher" },
      { key: "date", header: "Tanggal" },
      { key: "box", header: "Box" },
      { key: "category", header: "Kategori" },
      {
        key: "amount",
        header: "Jumlah",
        align: "right",
        renderType: "currency",
      },
      { key: "status", header: "Status", renderType: "status" },
    ],
    detailFields: [
      { name: "number", label: "No. Voucher" },
      { name: "date", label: "Tanggal" },
      { name: "box", label: "Box" },
      { name: "category", label: "Kategori" },
      { name: "description", label: "Deskripsi" },
      { name: "amount", label: "Jumlah", formatType: "currency" },
      { name: "attachments", label: "Lampiran" },
      { name: "approval", label: "Approval" },
      { name: "status", label: "Status" },
    ],
    rowActions: [
      { label: "View", intent: "view" },
      { label: "Edit", intent: "edit" },
      {
        label: "Approve",
        intent: "mock",
        message: "Voucher disetujui (mock).",
      },
      { label: "Reject", intent: "mock", message: "Voucher ditolak (mock)." },
    ],
    form: {
      title: "Voucher Petty",
      fields: [
        { name: "number", label: "No. Voucher" },
        { name: "date", label: "Tanggal", type: "date" },
        { name: "box", label: "Box" },
        {
          name: "category",
          label: "Kategori",
          type: "select",
          options: [
            "Transport",
            "Consumables",
            "Pantry",
            "Maintenance",
            "Others",
          ],
        },
        { name: "description", label: "Deskripsi" },
        { name: "amount", label: "Jumlah", type: "number" },
        { name: "attachments", label: "Lampiran", type: "number" },
        {
          name: "approval",
          label: "Approval",
          type: "select",
          options: ["waiting", "approved", "rejected"],
        },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: ["draft", "posted"],
        },
      ],
    },
  },

  "petty/topup": {
    title: "Petty Cash • Top-up & Reconciliation",
    description: "Isi ulang kas kecil, rekonsiliasi, dan investigasi selisih.",
    data: pettyTopup,
    columns: [
      { key: "date", header: "Tanggal" },
      { key: "box", header: "Box" },
      {
        key: "topup",
        header: "Top-up Bank",
        align: "right",
        renderType: "currency",
      },
      {
        key: "spend",
        header: "Pengeluaran",
        align: "right",
        renderType: "currency",
      },
      {
        key: "cash",
        header: "Kas Fisik",
        align: "right",
        renderType: "currency",
      },
      {
        key: "difference",
        header: "Selisih",
        align: "right",
        renderType: "currency",
      },
      { key: "status", header: "Status", renderType: "status" },
    ],
    detailFields: [
      { name: "date", label: "Tanggal" },
      { name: "box", label: "Box" },
      { name: "topup", label: "Top-up", formatType: "currency" },
      { name: "spend", label: "Pengeluaran", formatType: "currency" },
      { name: "cash", label: "Kas Fisik", formatType: "currency" },
      { name: "difference", label: "Selisih", formatType: "currency" },
      { name: "status", label: "Status" },
      { name: "pic", label: "PIC" },
    ],
    rowActions: [
      { label: "View", intent: "view" },
      {
        label: "Investigate",
        intent: "mock",
        message: "Investigasi selisih dilakukan (mock).",
      },
      {
        label: "Close",
        intent: "mock",
        message: "Periode kas kecil ditutup (mock).",
      },
    ],
    form: {
      title: "Top-up/Rekon",
      fields: [
        { name: "date", label: "Tanggal", type: "date" },
        { name: "box", label: "Box" },
        { name: "topup", label: "Top-up Bank", type: "number" },
        { name: "spend", label: "Pengeluaran", type: "number" },
        { name: "cash", label: "Kas Fisik", type: "number" },
        { name: "difference", label: "Selisih", type: "number" },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: ["closed", "investigate"],
        },
        { name: "pic", label: "PIC" },
      ],
    },
  },

  "inventory/cogs": {
    title: "Inventory Hooks • COGS Engine",
    description:
      "Konfigurasi metode COGS (FIFO/Average) untuk skincare/treatment.",
    data: inventoryCogs,
    columns: [
      { key: "sku", header: "SKU" },
      { key: "name", header: "Nama Produk" },
      { key: "method", header: "Metode" },
      {
        key: "lastCost",
        header: "Biaya Terakhir",
        align: "right",
        renderType: "currency",
      },
      {
        key: "averageCost",
        header: "Biaya Rata",
        align: "right",
        renderType: "currency",
      },
      { key: "backflush", header: "Backflush" },
      { key: "status", header: "Status" },
    ],
    detailFields: [
      { name: "sku", label: "SKU" },
      { name: "name", label: "Nama Produk" },
      { name: "method", label: "Metode" },
      { name: "lastCost", label: "Biaya Terakhir", formatType: "currency" },
      { name: "averageCost", label: "Biaya Rata", formatType: "currency" },
      { name: "backflush", label: "Backflush" },
      { name: "status", label: "Status" },
    ],
    rowActions: [
      { label: "View", intent: "view" },
      { label: "Edit", intent: "edit" },
      {
        label: "Simulate",
        intent: "mock",
        message: "Simulasi COGS dihitung (mock).",
      },
    ],
    form: {
      title: "COGS Engine",
      fields: [
        { name: "sku", label: "SKU" },
        { name: "name", label: "Nama" },
        {
          name: "method",
          label: "Metode",
          type: "select",
          options: ["FIFO", "Average"],
        },
        { name: "lastCost", label: "Biaya Terakhir", type: "number" },
        { name: "averageCost", label: "Biaya Rata", type: "number" },
        {
          name: "backflush",
          label: "Backflush",
          type: "select",
          options: ["true", "false"],
        },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: ["active", "inactive"],
        },
      ],
    },
  },

  "inventory/grni": {
    title: "Inventory Hooks • GRNI & Adjustments",
    description: "Good receipt, adjustment stok, dan status posting.",
    data: inventoryGrni,
    columns: [
      { key: "grn", header: "GRN" },
      { key: "date", header: "Tanggal" },
      { key: "vendor", header: "Vendor" },
      { key: "warehouse", header: "Gudang" },
      { key: "value", header: "Nilai", align: "right", renderType: "currency" },
      { key: "status", header: "Status", renderType: "status" },
    ],
    detailFields: [
      { name: "grn", label: "GRN" },
      { name: "date", label: "Tanggal" },
      { name: "vendor", label: "Vendor" },
      { name: "warehouse", label: "Gudang" },
      { name: "items", label: "Jumlah Item" },
      { name: "value", label: "Nilai", formatType: "currency" },
      { name: "status", label: "Status" },
    ],
    rowActions: [
      { label: "View", intent: "view" },
      { label: "Post", intent: "mock", message: "GRNI diposting (mock)." },
      { label: "Adjust", intent: "mock", message: "Adjustment dibuat (mock)." },
    ],
    form: {
      title: "GRNI",
      fields: [
        { name: "grn", label: "No. GRN" },
        { name: "date", label: "Tanggal", type: "date" },
        { name: "vendor", label: "Vendor" },
        { name: "warehouse", label: "Gudang" },
        { name: "items", label: "Jumlah Item", type: "number" },
        { name: "value", label: "Nilai", type: "number" },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: ["open", "posted", "pending-adjust"],
        },
      ],
    },
  },

  "inventory/lots": {
    title: "Inventory Hooks • Lot & Expiry Tracking",
    description: "Monitoring lot dan expiry produk skincare & treatment kit.",
    data: inventoryLots,
    columns: [
      { key: "sku", header: "SKU" },
      { key: "lot", header: "Lot" },
      { key: "expiry", header: "Kadaluarsa" },
      { key: "quantity", header: "Qty" },
      { key: "status", header: "Status", renderType: "status" },
    ],
    detailFields: [
      { name: "sku", label: "SKU" },
      { name: "lot", label: "Lot" },
      { name: "expiry", label: "Kadaluarsa" },
      { name: "quantity", label: "Qty" },
      { name: "location", label: "Lokasi" },
      { name: "status", label: "Status" },
    ],
    rowActions: [
      { label: "View", intent: "view" },
      { label: "Hold", intent: "mock", message: "Lot di-hold (mock)." },
      {
        label: "Write-off",
        intent: "mock",
        message: "Lot di-write off (mock).",
      },
    ],
    form: {
      title: "Lot/Expiry",
      fields: [
        { name: "sku", label: "SKU" },
        { name: "lot", label: "Lot" },
        { name: "expiry", label: "Kadaluarsa", type: "date" },
        { name: "quantity", label: "Qty", type: "number" },
        { name: "location", label: "Lokasi" },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: ["safe", "warning", "urgent"],
        },
      ],
    },
  },

  "tax/codes": {
    title: "Tax & Compliance • Tax Codes",
    description: "Konfigurasi kode pajak output/input beserta akun default.",
    data: taxCodes,
    columns: [
      { key: "code", header: "Kode" },
      { key: "name", header: "Nama" },
      { key: "type", header: "Tipe" },
      {
        key: "rate",
        header: "Tarif",
        align: "right",
        renderType: "percentage",
      },
      { key: "inclusive", header: "Inclusive" },
      { key: "status", header: "Status" },
    ],
    detailFields: [
      { name: "code", label: "Kode" },
      { name: "name", label: "Nama" },
      { name: "type", label: "Tipe" },
      { name: "rate", label: "Tarif", formatType: "percentage" },
      { name: "inclusive", label: "Inclusive" },
      { name: "defaultAccount", label: "Akun Default" },
      { name: "status", label: "Status" },
    ],
    rowActions: [
      { label: "View", intent: "view" },
      { label: "Edit", intent: "edit" },
      {
        label: "Deactivate",
        intent: "mock",
        message: "Kode pajak dinonaktifkan (mock).",
      },
    ],
    form: {
      title: "Tax Code",
      fields: [
        { name: "code", label: "Kode" },
        { name: "name", label: "Nama" },
        {
          name: "type",
          label: "Tipe",
          type: "select",
          options: ["output", "input", "withholding"],
        },
        { name: "rate", label: "Tarif", type: "number" },
        {
          name: "inclusive",
          label: "Inclusive",
          type: "select",
          options: ["true", "false"],
        },
        { name: "defaultAccount", label: "Akun Default" },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: ["active", "inactive"],
        },
      ],
    },
  },

  "setup/doc-numbering": {
    title: "Tax & Compliance • Document Numbering",
    description: "Penomoran dokumen per entitas dan reset periodik.",
    data: docNumbering,
    columns: [
      { key: "entity", header: "Entitas" },
      { key: "document", header: "Dokumen" },
      { key: "prefix", header: "Prefix" },
      { key: "digits", header: "Digit" },
      { key: "reset", header: "Reset" },
      { key: "status", header: "Status" },
    ],
    detailFields: [
      { name: "entity", label: "Entitas" },
      { name: "document", label: "Dokumen" },
      { name: "prefix", label: "Prefix" },
      { name: "digits", label: "Digit" },
      { name: "reset", label: "Reset" },
      { name: "current", label: "Nomor Berjalan" },
      { name: "status", label: "Status" },
    ],
    rowActions: [
      { label: "View", intent: "view" },
      { label: "Edit", intent: "edit" },
      { label: "Lock", intent: "mock", message: "Penomoran dikunci (mock)." },
    ],
    form: {
      title: "Penomoran Dokumen",
      fields: [
        { name: "entity", label: "Entitas" },
        {
          name: "document",
          label: "Dokumen",
          type: "select",
          options: ["Invoice", "Receipt", "Bill", "Voucher"],
        },
        { name: "prefix", label: "Prefix" },
        { name: "digits", label: "Digit", type: "number" },
        {
          name: "reset",
          label: "Reset",
          type: "select",
          options: ["monthly", "annual", "none"],
        },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: ["locked", "active"],
        },
      ],
    },
  },

  "masters/coa": {
    title: "Masters • Chart of Accounts",
    description: "Master akun lengkap dari laporan keuangan.",
    data: coa,
    columns: [
      { key: "code", header: "Kode" },
      { key: "name", header: "Nama Akun" },
      { key: "dk", header: "D/K" },
      { key: "group", header: "Kelompok" },
    ],
    detailFields: [
      { name: "code", label: "Kode" },
      { name: "name", label: "Nama" },
      { name: "dk", label: "Debit/Kredit" },
      { name: "group", label: "Kelompok" },
    ],
    rowActions: [
      { label: "View", intent: "view" },
      { label: "Edit", intent: "edit" },
      {
        label: "Deactivate",
        intent: "mock",
        message: "Akun dinonaktifkan (mock).",
      },
    ],
    form: {
      title: "Akun",
      fields: [
        { name: "code", label: "Kode" },
        { name: "name", label: "Nama" },
        { name: "dk", label: "D/K", type: "select", options: ["D", "K"] },
        { name: "group", label: "Kelompok" },
      ],
    },
  },

  "masters/parties": {
    title: "Masters • Customers & Vendors",
    description: "Data master pelanggan dan vendor dengan term dan NPWP.",
    data: parties,
    columns: [
      { key: "name", header: "Nama" },
      { key: "type", header: "Tipe" },
      { key: "contact", header: "Kontak" },
      { key: "term", header: "Termin" },
      { key: "status", header: "Status", renderType: "status" },
    ],
    detailFields: [
      { name: "name", label: "Nama" },
      { name: "type", label: "Tipe" },
      { name: "contact", label: "Kontak" },
      { name: "email", label: "Email" },
      { name: "npwp", label: "NPWP" },
      { name: "term", label: "Termin" },
      { name: "status", label: "Status" },
    ],
    rowActions: [
      { label: "View", intent: "view" },
      { label: "Edit", intent: "edit" },
      {
        label: "Blacklist",
        intent: "mock",
        message: "Pihak diblacklist (mock).",
      },
    ],
    form: {
      title: "Pihak",
      fields: [
        { name: "name", label: "Nama" },
        {
          name: "type",
          label: "Tipe",
          type: "select",
          options: ["customer", "vendor"],
        },
        { name: "contact", label: "Kontak" },
        { name: "email", label: "Email" },
        { name: "npwp", label: "NPWP" },
        {
          name: "term",
          label: "Termin",
          type: "select",
          options: ["COD", "15 Hari", "30 Hari", "45 Hari"],
        },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: ["active", "inactive"],
        },
      ],
    },
  },

  "masters/banks-channels": {
    title: "Masters • Banks & Payment Channels",
    description:
      "Master bank, EDC, e-wallet, beserta mapping fee dan clearing.",
    data: banksChannels,
    columns: [
      { key: "name", header: "Nama" },
      { key: "type", header: "Jenis" },
      { key: "identifier", header: "No/Channel" },
      { key: "currency", header: "Mata Uang" },
      { key: "status", header: "Status", renderType: "status" },
    ],
    detailFields: [
      { name: "name", label: "Nama" },
      { name: "type", label: "Jenis" },
      { name: "identifier", label: "No/Channel" },
      { name: "currency", label: "Mata Uang" },
      { name: "branch", label: "Cabang" },
      { name: "settlement", label: "Settlement" },
      { name: "fee", label: "Fee", formatType: "percentage" },
      { name: "status", label: "Status" },
    ],
    rowActions: [
      { label: "View", intent: "view" },
      { label: "Edit", intent: "edit" },
      {
        label: "Deactivate",
        intent: "mock",
        message: "Channel dinonaktifkan (mock).",
      },
    ],
    form: {
      title: "Bank/Channel",
      fields: [
        { name: "name", label: "Nama" },
        {
          name: "type",
          label: "Jenis",
          type: "select",
          options: ["bank", "edc", "e-wallet", "qris", "payment link"],
        },
        { name: "identifier", label: "No/Channel" },
        {
          name: "currency",
          label: "Mata Uang",
          type: "select",
          options: ["IDR", "USD"],
        },
        { name: "branch", label: "Cabang" },
        {
          name: "settlement",
          label: "Settlement",
          type: "select",
          options: ["H+0", "H+1"],
        },
        { name: "fee", label: "Fee (%)", type: "number" },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: ["active", "inactive"],
        },
      ],
    },
  },

  "masters/petty-master": {
    title: "Masters • Petty Cash Boxes & Categories",
    description: "Master box dan kategori biaya kas kecil.",
    data: pettyMaster,
    columns: [
      { key: "type", header: "Tipe" },
      { key: "name", header: "Nama" },
      { key: "linkedAccount", header: "Linked Account" },
      { key: "limit", header: "Limit", align: "right", renderType: "currency" },
      { key: "status", header: "Status", renderType: "status" },
    ],
    detailFields: [
      { name: "type", label: "Tipe" },
      { name: "name", label: "Nama" },
      { name: "linkedAccount", label: "Linked Account" },
      { name: "limit", label: "Limit", formatType: "currency" },
      { name: "status", label: "Status" },
      { name: "notes", label: "Catatan" },
    ],
    rowActions: [
      { label: "View", intent: "view" },
      { label: "Edit", intent: "edit" },
      {
        label: "Deactivate",
        intent: "mock",
        message: "Setup dinonaktifkan (mock).",
      },
    ],
    form: {
      title: "Setup Petty",
      fields: [
        {
          name: "type",
          label: "Tipe",
          type: "select",
          options: ["box", "category"],
        },
        { name: "name", label: "Nama" },
        { name: "linkedAccount", label: "Linked Account" },
        { name: "limit", label: "Limit", type: "number" },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: ["active", "inactive"],
        },
        { name: "notes", label: "Catatan", type: "textarea" },
      ],
    },
  },

  "settings/approvals": {
    title: "Settings • Approvals & Roles",
    description: "Hierarki role, threshold approval, dan workflow keuangan.",
    data: approvals,
    columns: [
      { key: "role", header: "Peran" },
      { key: "description", header: "Deskripsi" },
      {
        key: "threshold",
        header: "Threshold",
        align: "right",
        renderType: "currency",
      },
      { key: "branch", header: "Cabang" },
      { key: "status", header: "Status", renderType: "status" },
    ],
    detailFields: [
      { name: "role", label: "Peran" },
      { name: "description", label: "Deskripsi" },
      { name: "threshold", label: "Threshold", formatType: "currency" },
      { name: "branch", label: "Cabang" },
      { name: "status", label: "Status" },
    ],
    rowActions: [
      { label: "View", intent: "view" },
      { label: "Edit", intent: "edit" },
      { label: "Deactivate", intent: "mock", message: "Role nonaktif (mock)." },
    ],
    form: {
      title: "Approval Role",
      fields: [
        { name: "role", label: "Peran" },
        { name: "description", label: "Deskripsi", type: "textarea" },
        { name: "threshold", label: "Threshold", type: "number" },
        {
          name: "branch",
          label: "Cabang",
          type: "select",
          options: ["Semua", "Klinik A", "Klinik B", "Klinik C"],
        },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: ["active", "inactive"],
        },
      ],
    },
  },

  "analytics/dimensions": {
    title: "Analytics • Dimensions Setup",
    description:
      "Konfigurasi dimensi cabang, gudang, dokter, dsb untuk laporan bersegmen.",
    data: dimensions,
    columns: [
      { key: "dimension", header: "Dimensi" },
      { key: "type", header: "Tipe" },
      { key: "options", header: "Opsi", renderType: "array" },
      { key: "status", header: "Status", renderType: "status" },
    ],
    detailFields: [
      { name: "dimension", label: "Dimensi" },
      { name: "type", label: "Tipe" },
      { name: "options", label: "Opsi", formatType: "array" },
      { name: "status", label: "Status" },
    ],
    rowActions: [
      { label: "View", intent: "view" },
      { label: "Edit", intent: "edit" },
      {
        label: "Deactivate",
        intent: "mock",
        message: "Dimensi dinonaktifkan (mock).",
      },
    ],
    form: {
      title: "Dimensi",
      fields: [
        { name: "dimension", label: "Nama Dimensi" },
        {
          name: "type",
          label: "Tipe",
          type: "select",
          options: ["single", "multi"],
        },
        { name: "options", label: "Opsi (pisahkan koma)", type: "textarea" },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: ["active", "inactive"],
        },
      ],
    },
  },

  "reports/trial-balance": {
    title: "Reports • Trial Balance",
    description: "Neraca lajur dengan saldo awal, laba rugi, dan neraca.",
    data: trialBalance,
    columns: [
      { key: "code", header: "Kode" },
      { key: "name", header: "Nama Akun" },
      {
        key: "saldoAwalD",
        header: "Saldo Awal D",
        align: "right",
        renderType: "currency",
      },
      {
        key: "saldoAwalK",
        header: "Saldo Awal K",
        align: "right",
        renderType: "currency",
      },
      {
        key: "lrDebet",
        header: "L/R Debet",
        align: "right",
        renderType: "currency",
      },
      {
        key: "lrKredit",
        header: "L/R Kredit",
        align: "right",
        renderType: "currency",
      },
      {
        key: "neracaDebet",
        header: "Neraca D",
        align: "right",
        renderType: "currency",
      },
      {
        key: "neracaKredit",
        header: "Neraca K",
        align: "right",
        renderType: "currency",
      },
    ],
    detailFields: [
      { name: "code", label: "Kode" },
      { name: "name", label: "Nama" },
      { name: "saldoAwalD", label: "Saldo Awal D", formatType: "currency" },
      { name: "saldoAwalK", label: "Saldo Awal K", formatType: "currency" },
      { name: "lrDebet", label: "L/R Debet", formatType: "currency" },
      { name: "lrKredit", label: "L/R Kredit", formatType: "currency" },
      { name: "neracaDebet", label: "Neraca Debet", formatType: "currency" },
      { name: "neracaKredit", label: "Neraca Kredit", formatType: "currency" },
    ],
    rowActions: [
      { label: "View", intent: "view" },
      {
        label: "Export",
        intent: "mock",
        message: "Neraca lajur diekspor (mock).",
      },
      {
        label: "Print",
        intent: "mock",
        message: "Neraca lajur dicetak (mock).",
      },
    ],
    form: {
      title: "Penyesuaian akun",
      fields: [
        { name: "code", label: "Kode" },
        { name: "name", label: "Nama" },
        { name: "saldoAwalD", label: "Saldo Awal D", type: "number" },
        { name: "saldoAwalK", label: "Saldo Awal K", type: "number" },
      ],
    },
  },

  "reports/profit-loss": {
    title: "Reports • Profit & Loss",
    description: "Laporan laba rugi per kelompok akun 4-000/5-000/6-000/7-000.",
    data: profitLoss,
    columns: [
      { key: "group", header: "Kelompok" },
      { key: "account", header: "Akun" },
      {
        key: "amount",
        header: "Nilai",
        align: "right",
        renderType: "currency",
      },
      { key: "type", header: "Tipe" },
    ],
    detailFields: [
      { name: "group", label: "Kelompok" },
      { name: "account", label: "Akun" },
      { name: "amount", label: "Nilai", formatType: "currency" },
      { name: "type", label: "Tipe" },
    ],
    rowActions: [
      { label: "View", intent: "view" },
      {
        label: "Export",
        intent: "mock",
        message: "Laporan P&L diekspor (mock).",
      },
    ],
    form: {
      title: "Penyesuaian P&L",
      fields: [
        { name: "group", label: "Kelompok" },
        { name: "account", label: "Akun" },
        { name: "amount", label: "Nilai", type: "number" },
        {
          name: "type",
          label: "Tipe",
          type: "select",
          options: ["revenue", "expense", "other-revenue", "other-expense"],
        },
      ],
    },
  },

  "reports/retained-earnings": {
    title: "Reports • Retained Earnings",
    description: "Mutasi laba ditahan dan penyesuaian audit.",
    data: buildRetainedEarningsRows(),
    columns: [
      { key: "period", header: "Periode" },
      {
        key: "openingBalance",
        header: "Saldo Awal",
        align: "right",
        renderType: "currency",
      },
      {
        key: "currentProfit",
        header: "Laba Periode",
        align: "right",
        renderType: "currency",
      },
      {
        key: "dividend",
        header: "Dividen",
        align: "right",
        renderType: "currency",
      },
      {
        key: "closingBalance",
        header: "Saldo Akhir",
        align: "right",
        renderType: "currency",
      },
    ],
    detailFields: [
      { name: "period", label: "Periode" },
      { name: "openingBalance", label: "Saldo Awal", formatType: "currency" },
      { name: "currentProfit", label: "Laba Periode", formatType: "currency" },
      { name: "dividend", label: "Dividen", formatType: "currency" },
      { name: "adjustments", label: "Penyesuaian", formatType: "array" },
      { name: "closingBalance", label: "Saldo Akhir", formatType: "currency" },
    ],
    rowActions: [
      { label: "View", intent: "view" },
      {
        label: "Export",
        intent: "mock",
        message: "Laporan laba ditahan diekspor (mock).",
      },
    ],
    form: {
      title: "Penyesuaian Laba Ditahan",
      fields: [
        { name: "period", label: "Periode" },
        { name: "currentProfit", label: "Laba Periode", type: "number" },
        { name: "dividend", label: "Dividen", type: "number" },
      ],
    },
  },

  "reports/balance-sheet": {
    title: "Reports • Balance Sheet",
    description: "Neraca keuangan berdasarkan struktur aktiva dan kewajiban.",
    data: balanceSheet.assets
      .map((asset) => ({ ...asset, section: "Assets" }))
      .concat(
        balanceSheet.liabilities.map((liab) => ({
          ...liab,
          section: "Liabilities",
        })),
        balanceSheet.equity.map((eq) => ({ ...eq, section: "Equity" }))
      ),
    columns: [
      { key: "section", header: "Bagian" },
      { key: "account", header: "Akun" },
      {
        key: "amount",
        header: "Nilai",
        align: "right",
        renderType: "currency",
      },
    ],
    detailFields: [
      { name: "section", label: "Bagian" },
      { name: "group", label: "Kelompok" },
      { name: "account", label: "Akun" },
      { name: "amount", label: "Nilai", formatType: "currency" },
    ],
    rowActions: [
      { label: "View", intent: "view" },
      { label: "Export", intent: "mock", message: "Neraca diekspor (mock)." },
    ],
    form: {
      title: "Penyesuaian Neraca",
      fields: [
        {
          name: "section",
          label: "Bagian",
          type: "select",
          options: ["Assets", "Liabilities", "Equity"],
        },
        { name: "account", label: "Akun" },
        { name: "amount", label: "Nilai", type: "number" },
      ],
    },
  },

  "reports/cashflow-direct": {
    title: "Reports • Cashflow Direct",
    description:
      "Arus kas metode langsung dari aktivitas operasi, investasi, dan pendanaan.",
    data: cashflowDirect.flatMap((section) =>
      section.items.map((item) => ({
        section: section.section,
        label: item.label,
        amount: item.amount,
      }))
    ),
    columns: [
      { key: "section", header: "Bagian" },
      { key: "label", header: "Kegiatan" },
      {
        key: "amount",
        header: "Nilai",
        align: "right",
        renderType: "currency",
      },
    ],
    detailFields: [
      { name: "section", label: "Bagian" },
      { name: "label", label: "Kegiatan" },
      { name: "amount", label: "Nilai", formatType: "currency" },
    ],
    rowActions: [
      { label: "View", intent: "view" },
      {
        label: "Export",
        intent: "mock",
        message: "Arus kas direct diekspor (mock).",
      },
    ],
    form: {
      title: "Penyesuaian Cashflow",
      fields: [
        {
          name: "section",
          label: "Bagian",
          type: "select",
          options: cashflowDirect.map((section) => section.section),
        },
        { name: "label", label: "Kegiatan" },
        { name: "amount", label: "Nilai", type: "number" },
      ],
    },
  },

  "reports/cashflow-indirect": {
    title: "Reports • Cashflow Indirect",
    description:
      "Arus kas metode tidak langsung berdasarkan laba bersih dan penyesuaian.",
    data: cashflowIndirect.flatMap((section) =>
      section.items.map((item) => ({
        section: section.section,
        label: item.label,
        amount: item.amount,
      }))
    ),
    columns: [
      { key: "section", header: "Bagian" },
      { key: "label", header: "Penyesuaian" },
      {
        key: "amount",
        header: "Nilai",
        align: "right",
        renderType: "currency",
      },
    ],
    detailFields: [
      { name: "section", label: "Bagian" },
      { name: "label", label: "Penyesuaian" },
      { name: "amount", label: "Nilai", formatType: "currency" },
    ],
    rowActions: [
      { label: "View", intent: "view" },
      {
        label: "Export",
        intent: "mock",
        message: "Arus kas indirect diekspor (mock).",
      },
    ],
    form: {
      title: "Penyesuaian Cashflow Indirect",
      fields: [
        {
          name: "section",
          label: "Bagian",
          type: "select",
          options: cashflowIndirect.map((section) => section.section),
        },
        { name: "label", label: "Penyesuaian" },
        { name: "amount", label: "Nilai", type: "number" },
      ],
    },
  },
};

export type DashboardData = typeof dashboard;

export function getModuleConfig(path: string) {
  return moduleConfigs[path];
}

export function getDashboardData() {
  return dashboard;
}

function buildRetainedEarningsRows() {
  const base = retainedEarnings;
  const periods = [
    { period: "2024", profit: base.currentProfit * 0.9, adj: -250000 },
    { period: "2025", profit: base.currentProfit, adj: 300000 },
    { period: "2026", profit: base.currentProfit * 1.1, adj: -150000 },
    { period: "2027", profit: base.currentProfit * 1.2, adj: 200000 },
    { period: "2028", profit: base.currentProfit * 0.95, adj: 0 },
  ];

  return periods.map((item, index) => {
    const opening = base.openingBalance + index * 1_500_000;
    const dividend = base.dividend;
    const adjustments = (base.adjustments ?? []).map((adj) => ({ ...adj }));
    adjustments.push({
      description: `Penyesuaian tambahan ${item.period}`,
      amount: item.adj,
    });

    const closing =
      opening +
      item.profit -
      dividend +
      adjustments.reduce((sum, adj) => sum + Number(adj.amount ?? 0), 0);

    return {
      period: item.period,
      openingBalance: opening,
      currentProfit: Math.round(item.profit),
      dividend,
      adjustments,
      closingBalance: Math.round(closing),
    };
  });
}
