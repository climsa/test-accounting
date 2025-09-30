import type { JSX } from 'react'

type ModuleCfg = {
  key: string
  title: string
  icon?: string
  breadcrumb: string
  actions?: string[]
  table: { title: string; headers: string[]; rows: (string|number|JSX.Element)[][] }
  form: { title: string; schema: { label: string; type?: 'text'|'number'|'date'|'select'|'textarea'; options?: string[] }[] }
  notes?: string
}

type GroupCfg = { key: string; title: string; items: ModuleCfg[] }

const badge = (txt: string, kind: 'ok'|'warn'|'danger'|'note' = 'note') => (
  <span className={`badge ${kind==='ok'?'ok':kind==='warn'?'warn':kind==='danger'?'danger':'note'}`}>{txt}</span>
)

const actionCell = (subject: string) => (
  <div className="table-actions" data-entity={subject}>
    <button className="action-btn view" disabled>Lihat</button>
    <button className="action-btn edit" disabled>Edit</button>
    <button className="action-btn delete" disabled>Hapus</button>
  </div>
)

export const groups: GroupCfg[] = [
  {
    key: 'gl', title: 'General Ledger', items: [
      {
        key: 'journals', title: 'Journals', icon: '🧾', breadcrumb: 'General Ledger / Journals',
        actions: ['+ Jurnal Baru','Impor CSV'],
        table: { title: 'Daftar Jurnal', headers:['Tanggal','No. Ref','Akun Debit','Akun Kredit','Deskripsi','Nilai (Rp)','Status','Aksi'], rows:[
          ['2025-09-01','JV-001','Kas','Pendapatan Perawatan Kulit','Penjualan layanan Chemical Peel','20.000.000', badge('Posted','ok'), actionCell('journal')],
          ['2025-09-03','JV-005','Beban Gaji','Kas','Pembayaran gaji terapis September','8.000.000', badge('Draft','warn'), actionCell('journal')],
        ]},
        form: { title: 'Jurnal Umum', schema:[
          {label:'Tanggal', type:'date'},
          {label:'No. Referensi'},
          {label:'Akun Debit'},
          {label:'Akun Kredit'},
          {label:'Deskripsi'},
          {label:'Nilai (Rp)', type:'number'},
          {label:'Lampiran Bukti', type:'text'},
          {label:'Status', type:'select', options:['Draft','Posted','Void']}
        ]},
        notes: 'Pencatatan transaksi akuntansi; validasi debit=kredit. Status: draft/posted/void.'
      },
      {
        key: 'dual-journal', title: 'Dual-Journal', icon: '📚', breadcrumb:'General Ledger / Dual-Journal',
        actions: ['+ Dual Entry'],
        table: { title:'Double Book', headers:['Tanggal','No. Ref','STAT Akun','ALT Akun','Overlay','Auditor','Status','Aksi'], rows:[
          ['2025-09-02','DJ-002','Kas','ALT-Kas','Aktif','C. Auditor', badge('Sinkron','ok'), actionCell('dual-journal')],
          ['2025-09-10','DJ-009','Pendapatan','ALT-Pendapatan','Nonaktif','C. Auditor', badge('Butuh Review','warn'), actionCell('dual-journal')],
        ]},
        form: { title:'Dual Entry', schema:[
          {label:'Tanggal', type:'date'},
          {label:'No. Referensi'},
          {label:'Akun STAT'},
          {label:'Akun ALT'},
          {label:'Nilai (Rp)', type:'number'},
          {label:'Overlay', type:'select', options:['Aktif','Nonaktif']},
          {label:'Catatan Audit', type:'textarea'}
        ]},
        notes: 'Dari 1 transaksi lahir 2 jurnal: STAT dan ALT, dengan toggle report STAT/ALT/OVERLAY.'
      },
      {
        key: 'recurring', title: 'Recurring & Reversing', icon: '🔁', breadcrumb:'General Ledger / Recurring & Reversing',
        actions:['+ Template'],
        table:{ title:'Template Jurnal', headers:['Nama Template','Tipe','Frekuensi','Mulai','Berikutnya','Akun','Jumlah','Aktif','Aksi'], rows:[
          ['Gaji Terapis','Recurring','Bulanan','2025-01-01','2025-10-01','Beban Gaji','45.000.000', 'Ya', actionCell('recurring')],
          ['Akrual Bahan Treatment','Reversing','Bulanan','2025-01-01','2025-10-01','Persediaan Bahan','15.000.000','Ya', actionCell('recurring')],
        ]},
        form:{ title:'Template Jurnal', schema:[
          {label:'Nama Template'},
          {label:'Tipe', type:'select', options:['Recurring','Reversing']},
          {label:'Frekuensi', type:'select', options:['Harian','Mingguan','Bulanan','Triwulan','Tahunan']},
          {label:'Tanggal Mulai', type:'date'},
          {label:'Akun Debit'},
          {label:'Akun Kredit'},
          {label:'Jumlah (Rp)', type:'number'},
          {label:'Berakhir Pada', type:'date'},
          {label:'Aktif', type:'select', options:['Ya','Tidak']}
        ]},
        notes:'Otomasi periodik dan pembalik periode berikutnya. Scheduler (queue).'
      },
      {
        key: 'period-close', title: 'Period Close', icon: '🔒', breadcrumb:'General Ledger / Period Close',
        actions:['Checklist Close'],
        table:{ title:'Periode', headers:['Periode','Status','Tgl Buka','Tgl Tutup','PIC','Catatan','Aksi'], rows:[
          ['2025-08', badge('Closed','ok'),'2025-09-01','2025-09-05','A. Finance','Semua laporan disetujui', actionCell('period-close')],
          ['2025-09', badge('Open','warn'),'2025-10-01','-', 'A. Finance','Menunggu rekonsiliasi bank', actionCell('period-close')],
        ]},
        form:{ title:'Kunci Periode', schema:[
          {label:'Periode'},
          {label:'Tanggal Buka', type:'date'},
          {label:'Tanggal Tutup', type:'date'},
          {label:'PIC'},
          {label:'Izinkan Penyesuaian', type:'select', options:['Ya','Tidak']},
          {label:'Checklist Dilalui', type:'textarea'},
          {label:'Catatan Tambahan', type:'textarea'}
        ]},
        notes:'Kunci periode; hanya adjustment tertentu yang diizinkan. Checklist close.'
      },
    ]
  },
  {
    key: 'ar', title:'Sales (AR)', items:[
      {
        key: 'clinic-services', title:'Clinic Services', icon:'🩺', breadcrumb:'Sales / Clinic Services',
        actions:['+ Kunjungan','+ Konsultasi'],
        table:{ title:'Kunjungan Klinik', headers:['Tanggal','No Visit','No RM','Pasien','Keluhan Kulit','Jenis Kulit','Dokter','Terapis','Treatment','Durasi (menit)','Ruang','Status','Total (Rp)','Aksi'], rows:[
          ['2025-09-03','VS-1001','RM-00045','Ayu Lestari','Jerawat meradang','Kombinasi','dr. Citra','Nina','Chemical Peel','60','Room A', badge('Selesai','ok'),'1.500.000', actionCell('clinic-service')],
          ['2025-09-05','VS-1002','RM-00083','Rina Putri','Jerawat hormonal','Berminyak','dr. Reza','Sari','Laser Acne','90','Room B', badge('Menunggu Pembayaran','warn'),'3.200.000', actionCell('clinic-service')],
        ]},
        form:{ title:'Kunjungan Klinik', schema:[
          {label:'Tanggal', type:'date'},
          {label:'Nomor Visit'},
          {label:'Nomor Rekam Medis'},
          {label:'Nama Pasien'},
          {label:'Keluhan Kulit Utama'},
          {label:'Jenis Kulit', type:'select', options:['Normal','Kering','Berminyak','Kombinasi','Sensitif']},
          {label:'Dokter Penanggung Jawab'},
          {label:'Terapis'},
          {label:'Treatment', type:'select', options:['Chemical Peel','Laser Acne','Microneedling','Hair Removal','Infus Whitening']},
          {label:'Durasi (menit)', type:'number'},
          {label:'Ruang Treatment', type:'select', options:['Room A','Room B','Room C','Home Service']},
          {label:'Produk Pendukung', type:'text'},
          {label:'Catatan Dokter', type:'textarea'},
          {label:'Total Invoice (Rp)', type:'number'}
        ]},
        notes:'Integrasi dengan Clinic App; dukung paket/sesi, before-after photos, dan kebutuhan skincare lanjutan.'
      },
      {
        key: 'invoices', title:'Invoices & Credit Notes', icon:'🧾', breadcrumb:'Sales / Invoices & Credit Notes',
        actions:['+ Invoice','+ Credit Note'],
        table:{ title:'Invoice Pasien', headers:['No Invoice','Tanggal','Pelanggan','Paket/Treatment','Termin','Jatuh Tempo','Subtotal','Diskon','Pajak','Total','Status','Aksi'], rows:[
          ['INV-1001','2025-09-03','Ayu Lestari','Chemical Peel Single','COD','2025-10-03','1.500.000','0','165.000','1.665.000', badge('Terbuka','warn'), actionCell('invoice')],
          ['INV-1003','2025-09-12','Rina Putri','Laser Acne Paket 3x','30 hari','2025-10-12','3.200.000','200.000','330.000','3.330.000', badge('Jatuh Tempo','danger'), actionCell('invoice')],
        ]},
        form:{ title:'Invoice', schema:[
          {label:'Tanggal', type:'date'},
          {label:'Nomor Invoice'},
          {label:'Pelanggan/Pasien'},
          {label:'Alamat Penagihan'},
          {label:'Termin Pembayaran', type:'select', options:['COD','15 hari','30 hari','45 hari']},
          {label:'Tanggal Jatuh Tempo', type:'date'},
          {label:'Paket/Treatment'},
          {label:'Subtotal (Rp)', type:'number'},
          {label:'Diskon (Rp)', type:'number'},
          {label:'Pajak (Rp)', type:'number'},
          {label:'Total (Rp)', type:'number'},
          {label:'Status', type:'select', options:['Draft','Terbuka','Jatuh Tempo','Lunas']},
          {label:'Catatan', type:'textarea'}
        ]},
        notes:'Penjualan jasa perawatan & produk skincare; integrasi Clinic Services. Mendukung credit note dan ongkir.'
      },
      {
        key: 'receipts', title:'Receipts', icon:'💳', breadcrumb:'Sales / Receipts',
        actions:['+ Penerimaan'],
        table:{ title:'Penerimaan Pembayaran', headers:['Tanggal','No Penerimaan','Pelanggan','Metode','Referensi Bank','Invoice Terkait','Jumlah (Rp)','Status','Aksi'], rows:[
          ['2025-09-15','RC-0001','Ayu Lestari','Transfer','TRF-8891','INV-1001','1.665.000', badge('Diposting','ok'), actionCell('receipt')],
          ['2025-09-18','RC-0002','Rina Putri','EDC','EDC-5521','INV-1003','1.665.000', badge('Partial','warn'), actionCell('receipt')],
        ]},
        form:{ title:'Penerimaan Pembayaran', schema:[
          {label:'Tanggal', type:'date'},
          {label:'Nomor Penerimaan'},
          {label:'Pelanggan/Pasien'},
          {label:'Metode Pembayaran', type:'select', options:['Kas','Transfer','EDC','e-Wallet','Deposit']},
          {label:'Referensi Bank / Approval Code'},
          {label:'Nomor Invoice'},
          {label:'Jumlah Pembayaran (Rp)', type:'number'},
          {label:'Biaya Channel (Rp)', type:'number'},
          {label:'Status', type:'select', options:['Draft','Diposting','Partial','Void']}
        ]},
        notes:'Cash/Transfer/EDC/e-wallet/Deposit/Points. Split payment & clearing.'
      },
      {
        key: 'deposits', title:'Deposits & Gift Cards', icon:'🎁', breadcrumb:'Sales / Deposits & Gift Cards',
        table:{ title:'Deposit & Gift Card', headers:['Tanggal','No','Pelanggan','Tipe','Nilai (Rp)','Saldo Tersisa','Jatuh Tempo','Status','Aksi'], rows:[
          ['2025-09-01','DEP-001','Rina Putri','Deposit Paket Acne','500.000','350.000','2026-09-01', badge('Aktif','ok'), actionCell('deposit')],
          ['2025-09-04','GIF-012','Maya Dewi','Gift Card','1.000.000','1.000.000','2025-12-31', badge('Belum Dipakai','warn'), actionCell('deposit')],
        ]},
        form:{ title:'Deposit/Gift Card', schema:[
          {label:'Tanggal', type:'date'},
          {label:'Nomor Dokumen'},
          {label:'Pelanggan/Penerima'},
          {label:'Tipe', type:'select', options:['Deposit','Gift Card','Voucher']},
          {label:'Nilai (Rp)', type:'number'},
          {label:'Saldo Awal (Rp)', type:'number'},
          {label:'Tanggal Kadaluarsa', type:'date'},
          {label:'Status', type:'select', options:['Aktif','Terpakai','Hangus']},
          {label:'Catatan', type:'textarea'}
        ]},
        notes:'Kelola liability deposit/gift card + apply/refund. Aging liability.'
      },
      {
        key: 'packages', title:'Packages/Memberships', icon:'📦', breadcrumb:'Sales / Packages/Memberships',
        table:{ title:'Paket & Membership', headers:['Kode','Nama Paket','Jenis','Harga (Rp)','Jumlah Sesi','Durasi (bulan)','Deferred Revenue','Channel Penjualan','Status','Aksi'], rows:[
          ['PK-ACNE-S','Paket Acne Silver','Treatment','2.500.000','3','3', badge('Ya','warn'),'Front Desk', badge('Aktif','ok'), actionCell('package')],
          ['MB-GLOW','Membership Glow','Membership','4.000.000','6','6', badge('Ya','warn'),'Online', badge('Aktif','ok'), actionCell('package')],
        ]},
        form:{ title:'Paket/Membership', schema:[
          {label:'Kode Paket'},
          {label:'Nama Paket'},
          {label:'Jenis', type:'select', options:['Treatment','Produk','Membership','Bundle']},
          {label:'Harga (Rp)', type:'number'},
          {label:'Jumlah Sesi', type:'number'},
          {label:'Durasi (bulan)', type:'number'},
          {label:'Masa Aktif Setelah Redeem (hari)', type:'number'},
          {label:'Deferred Revenue', type:'select', options:['Ya','Tidak']},
          {label:'Channel Penjualan', type:'select', options:['Front Desk','Marketplace','Website']},
          {label:'Status', type:'select', options:['Aktif','Nonaktif']},
          {label:'Catatan Paket', type:'textarea'}
        ]},
        notes:'Tunda pengakuan sampai redemption per sesi. Schedule redemption.'
      },
    ]
  },
  {
    key: 'ap', title:'Purchases (AP)', items:[
      {
        key: 'bills', title:'Bills & Debit Notes', icon:'📄', breadcrumb:'Purchases / Bills & Debit Notes',
        actions:['+ Bill','+ Debit Note'],
        table:{ title:'Tagihan Vendor', headers:['No Bill','Tanggal','Vendor','Kategori','Termin','Jatuh Tempo','Subtotal','Pajak','Total','Status','Aksi'], rows:[
          ['BILL-2001','2025-09-05','PT Sumber Abadi','Bahan Treatment','30 hari','2025-10-05','9.500.000','500.000','10.000.000', badge('Terbuka','warn'), actionCell('bill')],
          ['BILL-2002','2025-09-18','CV Karya Sejahtera','Skincare Retail','30 hari','2025-10-02','11.500.000','500.000','12.000.000', badge('Jatuh Tempo','danger'), actionCell('bill')],
        ]},
        form:{ title:'Bill Vendor', schema:[
          {label:'Tanggal', type:'date'},
          {label:'Nomor Bill'},
          {label:'Vendor'},
          {label:'Kategori Pengeluaran', type:'select', options:['Bahan Treatment','Skincare Retail','Sewa Ruangan','Utilities']},
          {label:'Termin Pembayaran', type:'select', options:['COD','30 hari','45 hari']},
          {label:'Tanggal Jatuh Tempo', type:'date'},
          {label:'Subtotal (Rp)', type:'number'},
          {label:'Pajak (Rp)', type:'number'},
          {label:'Total (Rp)', type:'number'},
          {label:'Status', type:'select', options:['Draft','Terbuka','Jatuh Tempo','Lunas','Void']},
          {label:'Catatan', type:'textarea'}
        ]},
        notes:'Catat hutang & retur pajak & withholding. Aging AP.'
      },
      {
        key: 'payments', title:'Payments', icon:'🏦', breadcrumb:'Purchases / Payments',
        actions:['+ Pembayaran'],
        table:{ title:'Pembayaran Vendor', headers:['Tanggal','No Pembayaran','Vendor','Metode','Nomor Referensi','Bill Terkait','Jumlah (Rp)','Status','Aksi'], rows:[
          ['2025-09-20','PV-0001','PT Sumber Abadi','Transfer','TRF-7788','BILL-2001','10.000.000', badge('Partial','warn'), actionCell('payment')],
          ['2025-09-25','PV-0002','CV Karya Sejahtera','Giro','GIRO-2233','BILL-2002','6.000.000', badge('Dijadwalkan','warn'), actionCell('payment')],
        ]},
        form:{ title:'Pembayaran Vendor', schema:[
          {label:'Tanggal', type:'date'},
          {label:'Nomor Pembayaran'},
          {label:'Vendor'},
          {label:'Metode Pembayaran', type:'select', options:['Kas','Transfer','Giro','Virtual Account']},
          {label:'Nomor Referensi Bank/Giro'},
          {label:'Bill Terkait'},
          {label:'Jumlah Dibayar (Rp)', type:'number'},
          {label:'Biaya Bank (Rp)', type:'number'},
          {label:'Status', type:'select', options:['Draft','Dijadwalkan','Partial','Selesai']},
          {label:'Catatan', type:'textarea'}
        ]},
        notes:'Payment voucher, partial/full; approval & jadwal. Bridge ke Finance.'
      },
    ]
  },
  {
    key: 'banking', title:'Banking & Cash', items:[
      {
        key: 'accounts-transfer', title:'Bank Accounts & Transfer', icon:'🏦', breadcrumb:'Banking & Cash / Bank Accounts & Transfer',
        actions:['+ Rekening','Transfer Bank'],
        table:{ title:'Rekening Bank', headers:['Bank','Nama Akun','No. Rekening','Mata Uang','Saldo Saat Ini','Cabang','Status','Aksi'], rows:[
          ['BCA','PT Derma Glow','1234567890','IDR','75.000.000','Klinik A', badge('Aktif','ok'), actionCell('bank-account')],
          ['Mandiri','PT Derma Glow','9988776655','IDR','40.000.000','Klinik B', badge('Aktif','ok'), actionCell('bank-account')],
        ]},
        form:{ title:'Rekening Bank', schema:[
          {label:'Nama Bank'},
          {label:'Nama Akun'},
          {label:'Nomor Rekening'},
          {label:'Mata Uang', type:'select', options:['IDR','USD','SGD']},
          {label:'Cabang Klinik', type:'select', options:['Klinik A','Klinik B','Klinik C']},
          {label:'Saldo Awal (Rp)', type:'number'},
          {label:'Status', type:'select', options:['Aktif','Nonaktif']}
        ]},
        notes:'Transfer antar akun nomor referensi bank. Multi-currency optional.'
      },
      {
        key: 'reconciliation', title:'Bank Reconciliation', icon:'🧮', breadcrumb:'Banking & Cash / Bank Reconciliation',
        actions:['Impor Mutasi','Aturan Baru'],
        table:{ title:'Pencocokan Mutasi', headers:['Tanggal','Deskripsi','Mutasi Bank','Catatan Buku','Selisih','Status','Aksi'], rows:[
          ['2025-09-10','Transfer masuk pasien Ayu','1.665.000','1.665.000','0', badge('Match','ok'), actionCell('reconciliation')],
          ['2025-09-12','Biaya admin bank','-25.000','0','-25.000', badge('Butuh Review','warn'), actionCell('reconciliation')],
        ]},
        form:{ title:'Aturan Pencocokan', schema:[
          {label:'Nama Aturan'},
          {label:'Kata Kunci Deskripsi'},
          {label:'Akun Buku'},
          {label:'Toleransi Selisih (Rp)', type:'number'},
          {label:'Auto Match', type:'select', options:['Ya','Tidak']},
          {label:'Catatan', type:'textarea'}
        ]},
        notes:'Cocokkan mutasi bank vs buku; rules & fee. Import CSV/Excel.'
      },
      {
        key: 'edc-clearing', title:'EDC/e-Wallet Clearing', icon:'📲', breadcrumb:'Banking & Cash / EDC & e-Wallet Clearing',
        table:{ title:'Settlement Channel', headers:['Channel','Provider','H+ Settlement','Fee (%)','Akun Penampung','Status','Aksi'], rows:[
          ['EDC A','BCA','1','0.7','Bank BCA','Aktif', actionCell('edc')],
          ['e-Wallet B','OVO','0','1.2','Bank Mandiri','Aktif', actionCell('edc')],
        ]},
        form:{ title:'Channel Pembayaran', schema:[
          {label:'Nama Channel'},
          {label:'Provider'},
          {label:'H+ Settlement', type:'number'},
          {label:'Fee (%)', type:'number'},
          {label:'Akun Penampung'},
          {label:'Status', type:'select', options:['Aktif','Nonaktif']}
        ]},
        notes:'Rekonsiliasi batch EDC/e-wallet ke bank. Fee otomatis.'
      },
      {
        key: 'cash-closing', title:'Cash Closing Outlet', icon:'🧮', breadcrumb:'Banking & Cash / Cash Closing Outlet',
        table:{ title:'Hitung Kas Harian', headers:['Tanggal','Outlet','Kas Awal','Kas Fisik','Selisih','Petugas','Status','Catatan','Aksi'], rows:[
          ['2025-09-21','Klinik A','5.000.000','5.010.000','10.000','Dewi', badge('Over','warn'),'Selisih karena tip pelanggan', actionCell('cash-closing')],
          ['2025-09-21','Klinik B','3.500.000','3.500.000','0','Rudi', badge('Seimbang','ok'),'Setor ke bank besok', actionCell('cash-closing')],
        ]},
        form:{ title:'Cash Count', schema:[
          {label:'Tanggal', type:'date'},
          {label:'Outlet'},
          {label:'Kas Awal (Rp)', type:'number'},
          {label:'Pendapatan Shift (Rp)', type:'number'},
          {label:'Kas Fisik (Rp)', type:'number'},
          {label:'Selisih (Rp)', type:'number'},
          {label:'Petugas'},
          {label:'Catatan', type:'textarea'}
        ]},
        notes:'Cash count, over/short, setor bank. Per cabang/outlet.'
      },
    ]
  },
  {
    key: 'petty', title:'Petty Cash', items:[
      {
        key: 'imprest', title:'Imprest Boxes', icon:'📦', breadcrumb:'Petty Cash / Imprest Boxes',
        table:{ title:'Box Kas Kecil', headers:['Kode Box','Custodian','Cabang','Limit (Rp)','Saldo Saat Ini','Status','Aksi'], rows:[
          ['PC-A','Budi','Klinik A','2.500.000','1.250.000', badge('Aktif','ok'), actionCell('imprest')],
          ['PC-B','Rina','Klinik B','2.000.000','1.800.000', badge('Aktif','ok'), actionCell('imprest')],
        ]},
        form:{ title:'Box Kas Kecil', schema:[
          {label:'Kode Box'},
          {label:'Custodian'},
          {label:'Cabang', type:'select', options:['Klinik A','Klinik B','Klinik C']},
          {label:'Limit Kas (Rp)', type:'number'},
          {label:'Saldo Awal (Rp)', type:'number'},
          {label:'Status', type:'select', options:['Aktif','Nonaktif']},
          {label:'Catatan Kebijakan', type:'textarea'}
        ]},
        notes:'Multi-box, float amount, aktif/non-aktif. Per klinik/cabang.'
      },
      {
        key: 'vouchers', title:'Vouchers', icon:'🧾', breadcrumb:'Petty Cash / Vouchers',
        table:{ title:'Voucher Kas Kecil', headers:['Tanggal','No Voucher','Box','Kategori','Deskripsi','Jumlah (Rp)','Lampiran','Approval','Status','Aksi'], rows:[
          ['2025-09-11','PV-100','PC-A','Transport','Grab antar dokter','85.000','1 foto', badge('Menunggu','warn'), badge('Draft','warn'), actionCell('petty-voucher')],
          ['2025-09-12','PV-101','PC-B','Consumables','Kopi tamu VIP','50.000','0 lampiran', badge('Disetujui','ok'), badge('Posted','ok'), actionCell('petty-voucher')],
        ]},
        form:{ title:'Voucher Kas Kecil', schema:[
          {label:'Tanggal', type:'date'},
          {label:'Nomor Voucher'},
          {label:'Box Kas'},
          {label:'Kategori Pengeluaran', type:'select', options:['Transport','Consumables','Perawatan Alat','Lainnya']},
          {label:'Deskripsi'},
          {label:'Jumlah (Rp)', type:'number'},
          {label:'Lampiran Bukti'},
          {label:'Approval', type:'select', options:['Menunggu','Disetujui','Ditolak']},
          {label:'Status', type:'select', options:['Draft','Posted','Void']}
        ]},
        notes:'Kategori, foto struk, approval & posting. Policy limit.'
      },
      {
        key: 'topup', title:'Top-up & Reconciliation', icon:'🔄', breadcrumb:'Petty Cash / Top-up & Reconciliation',
        table:{ title:'Top-up & Rekonsiliasi', headers:['Tanggal','Box','Top-up Bank','Pengeluaran Kas','Kas Fisik','Selisih','PIC','Status','Aksi'], rows:[
          ['2025-09-30','PC-A','1.000.000','750.000','1.250.000','0','Budi', badge('Closed','ok'), actionCell('petty-topup')],
          ['2025-09-30','PC-B','500.000','400.000','1.900.000','-50.000','Rina', badge('Investigasi','warn'), actionCell('petty-topup')],
        ]},
        form:{ title:'Top-up/Rekon Kas', schema:[
          {label:'Tanggal', type:'date'},
          {label:'Box'},
          {label:'Top-up dari Bank (Rp)', type:'number'},
          {label:'Pengeluaran Kas (Rp)', type:'number'},
          {label:'Kas Fisik (Rp)', type:'number'},
          {label:'Selisih (Rp)', type:'number'},
          {label:'PIC'},
          {label:'Catatan Rekonsiliasi', type:'textarea'}
        ]},
        notes:'Top-up dari bank, cash count, over/short, close period. Ledger per box.'
      },
    ]
  },
  {
    key: 'inventory', title:'Inventory Hooks', items:[
      { key:'cogs', title:'COGS Engine', icon:'⚙️', breadcrumb:'Inventory Hooks / COGS Engine', table:{ title:'Konfigurasi COGS', headers:['Metode','Akun Persediaan','Akun COGS','Backflush Treatment','Status','Aksi'], rows:[[ 'FIFO','Persediaan Bahan Treatment','Harga Pokok Penjualan','Ya', badge('Aktif','ok'), actionCell('cogs')]]}, form:{ title:'Konfigurasi COGS', schema:[{label:'Metode Perhitungan', type:'select', options:['FIFO','Average']},{label:'Akun Persediaan'},{label:'Akun COGS'},{label:'Backflush Treatment Kit', type:'select', options:['Ya','Tidak']},{label:'Catatan', type:'textarea'}]}, notes:'Jurnal COGS dari isu bahan perawatan dan skincare; backflush treatment kit.' },
      { key:'grni', title:'GRNI & Adjustments', icon:'📦', breadcrumb:'Inventory Hooks / GRNI & Adjustments', table:{ title:'GRNI', headers:['Tanggal','No GRN','Vendor','Gudang','Nilai (Rp)','Status','Aksi'], rows:[[ '2025-09-08','GRN-01','PT Sumber Abadi','Gudang Pusat','8.000.000','Open', actionCell('grni')]]}, form:{ title:'Good Receipt', schema:[{label:'Tanggal', type:'date'},{label:'Nomor GRN'},{label:'Vendor'},{label:'Gudang', type:'select', options:['Gudang Pusat','Klinik A','Klinik B']},{label:'Nilai Barang (Rp)', type:'number'},{label:'Status', type:'select', options:['Open','Posted','Write-off']},{label:'Catatan', type:'textarea'}]}, notes:'GRNI saat terima barang; write-off/transfer; opname.' },
      { key:'lot-expiry', title:'Lot/Expiry', icon:'🧪', breadcrumb:'Inventory Hooks / Lot/Expiry', table:{ title:'Tracking Lot & Expiry', headers:['Produk','SKU','Lot','Expiry','Qty','Lokasi','Status','Aksi'], rows:[[ 'Serum Retinol 1%','SC-RET-01','SR-001','2026-01-01','50','Gudang Pusat', badge('Aman','ok'), actionCell('lot')] ]}, form:{ title:'Registrasi Lot', schema:[{label:'Produk'},{label:'SKU'},{label:'Lot Number'},{label:'Tanggal Expiry', type:'date'},{label:'Jumlah', type:'number'},{label:'Lokasi Penyimpanan'},{label:'Kondisi', type:'select', options:['Aman','Perlu Cek','Kedaluwarsa']}]}, notes:'Dimensi lot & expiry untuk mitigasi risiko kulit; optional serial/lot.' },
    ]
  },
  {
    key: 'tax', title:'Tax & Compliance', items:[
      { key:'tax-codes', title:'Tax Codes', icon:'🧮', breadcrumb:'Tax & Compliance / Tax Codes', table:{ title:'Kode Pajak', headers:['Nama','Jenis','Tarif (%)','Inclusive','Default Akun','Status','Aksi'], rows:[[ 'PPN 11% Output','Output','11','Ya','Pendapatan','Aktif', actionCell('tax-code')],[ 'PPN 11% Input','Input','11','Tidak','Hutang Pajak Masukan','Aktif', actionCell('tax-code')]]}, form:{ title:'Kode Pajak', schema:[{label:'Nama Kode Pajak'},{label:'Jenis', type:'select', options:['Output','Input']},{label:'Tarif (%)', type:'number'},{label:'Inclusive', type:'select', options:['Ya','Tidak']},{label:'Akun Default'},{label:'Status', type:'select', options:['Aktif','Nonaktif']}]}, notes:'Inclusive/exclusive & default akun. Configurable rates.' },
      { key:'doc-numbering', title:'Document Numbering', icon:'🔢', breadcrumb:'Tax & Compliance / Document Numbering', table:{ title:'Penomoran Dokumen', headers:['Entitas','Dokumen','Prefix','Digit','Reset','Status','Aksi'], rows:[[ 'Klinik A','Invoice','INV','4','Bulanan','Terkunci', actionCell('doc-numbering')],[ 'Klinik A','Bill','BILL','4','Bulanan','Terkunci', actionCell('doc-numbering')]]}, form:{ title:'Aturan Penomoran', schema:[{label:'Entitas'},{label:'Jenis Dokumen', type:'select', options:['Invoice','Bill','Receipt','Voucher']},{label:'Prefix'},{label:'Digit', type:'number'},{label:'Reset Otomatis', type:'select', options:['Tidak','Bulanan','Tahunan']},{label:'Status', type:'select', options:['Aktif','Terkunci']}]}, notes:'Non-editable setelah posting.' },
    ]
  },
  {
    key: 'dimensions', title:'Dimensions & Analytics', items:[
      { key:'dimensions-setup', title:'Dimensions Setup', icon:'🏷️', breadcrumb:'Dimensions & Analytics / Dimensions Setup', table:{ title:'Dimensi Pelaporan', headers:['Dimensi','Tipe','Opsi','Status','Aksi'], rows:[[ 'Cabang','Single','Klinik A,Klinik B','Aktif', actionCell('dimension')],[ 'Ruang','Single','Room A,Room B,Room C','Aktif', actionCell('dimension')],[ 'Dokter','Multi','dr. Citra,dr. Reza','Aktif', actionCell('dimension')]]}, form:{ title:'Dimensi', schema:[{label:'Nama Dimensi'},{label:'Tipe', type:'select', options:['Single','Multi']},{label:'Daftar Opsi (pisahkan dengan koma)', type:'textarea'},{label:'Status', type:'select', options:['Aktif','Nonaktif']}]}, notes:'Tag di journal lines (cabang, ruang, dokter) untuk laporan bersegmen.' },
      { key:'stat-alt', title:'STAT/ALT Overlays', icon:'🪟', breadcrumb:'Dimensions & Analytics / STAT/ALT Overlays', table:{ title:'Overlay Akun', headers:['Akun STAT','Nama','Akun ALT','Bridge','Status','Aksi'], rows:[[ '1001','Kas','A1001','Ya','Aktif', actionCell('overlay')],[ '4001','Pendapatan Perawatan Kulit','A4001','Ya','Aktif', actionCell('overlay')]]}, form:{ title:'Mapping STAT/ALT', schema:[{label:'Akun STAT'},{label:'Nama Akun STAT'},{label:'Akun ALT'},{label:'Bridge', type:'select', options:['Ya','Tidak']},{label:'Status', type:'select', options:['Aktif','Nonaktif']}]}, notes:'Transparansi perbedaan; bridge per akun/dimensi.' },
    ]
  },
  {
    key: 'masters', title:'Masters & Settings', items:[
      { key:'coa', title:'Chart of Accounts', icon:'📚', breadcrumb:'Masters & Settings / Chart of Accounts', table:{ title:'Master Akun', headers:['Kode','Nama Akun','Tipe','Sub Kategori','Status','Aksi'], rows:[[ '1001','Kas','Aset','Kas & Bank', badge('Aktif','ok'), actionCell('coa')],[ '4001','Pendapatan Perawatan Kulit','Pendapatan','Layanan Klinik', badge('Aktif','ok'), actionCell('coa')]]}, form:{ title:'Akun', schema:[{label:'Kode Akun'},{label:'Nama Akun'},{label:'Tipe', type:'select', options:['Aset','Kewajiban','Ekuitas','Pendapatan','Beban']},{label:'Sub Kategori'}, {label:'Status', type:'select', options:['Aktif','Nonaktif']},{label:'Catatan', type:'textarea'}]}, notes:'Hirarki & kode; aktif/non-aktif. Template awal.' },
      { key:'parties', title:'Customers & Vendors', icon:'👥', breadcrumb:'Masters & Settings / Customers & Vendors', table:{ title:'Master Pihak', headers:['Nama','Tipe','Kontak','NPWP','Term','Status','Aksi'], rows:[[ 'Ayu Lestari','Customer','0812-3456-7890','01.234.567.8-999.000','COD', badge('Aktif','ok'), actionCell('party')],[ 'PT Sumber Abadi','Vendor','021-7788-9900','02.345.678.9-000.111','30 hari', badge('Aktif','ok'), actionCell('party')]]}, form:{ title:'Pihak', schema:[{label:'Nama'},{label:'Tipe', type:'select', options:['Customer','Vendor']},{label:'Nomor Kontak'},{label:'Email'}, {label:'NPWP'}, {label:'Term Pembayaran', type:'select', options:['COD','15 hari','30 hari','45 hari']},{label:'Alamat'},{label:'Status', type:'select', options:['Aktif','Nonaktif']}]}, notes:'Data kontak, terms, NPWP, dsb. AR/AP.' },
      { key:'providers', title:'Doctors & Therapists', icon:'🧑‍⚕️', breadcrumb:'Masters & Settings / Doctors & Therapists', table:{ title:'Tenaga Medis', headers:['Nama','Peran','SIP/License','Spesialisasi','Cabang','Status','Aksi'], rows:[[ 'dr. Citra','Dokter','SIP-001','Dermatologi','Klinik A', badge('Aktif','ok'), actionCell('provider')],[ 'Nina','Terapis','-','Facial Specialist','Klinik A', badge('Aktif','ok'), actionCell('provider')]]}, form:{ title:'Tenaga Medis', schema:[{label:'Nama'},{label:'Peran', type:'select', options:['Dokter','Terapis','Perawat']},{label:'Nomor SIP/License'},{label:'Spesialisasi'},{label:'Cabang', type:'select', options:['Klinik A','Klinik B','Klinik C']},{label:'Jadwal Default', type:'textarea'},{label:'Status', type:'select', options:['Aktif','Nonaktif']}]}, notes:'Master dokter & terapis untuk penjadwalan & penjualan layanan.' },
      { key:'treatments', title:'Treatments & Pricing', icon:'💆', breadcrumb:'Masters & Settings / Treatments & Pricing', table:{ title:'Daftar Treatment', headers:['Kode','Nama Treatment','Kategori','Durasi (menit)','Harga Normal','Harga Member','Status','Aksi'], rows:[[ 'TR-PEEL','Chemical Peel','Acne','60','1.500.000','1.350.000', badge('Aktif','ok'), actionCell('treatment')],[ 'TR-LASER','Laser Acne','Acne','90','3.200.000','2.900.000', badge('Aktif','ok'), actionCell('treatment')]]}, form:{ title:'Treatment', schema:[{label:'Kode Treatment'},{label:'Nama Treatment'},{label:'Kategori', type:'select', options:['Acne','Skin Rejuvenation','Body','Hair Removal','Others']},{label:'Durasi (menit)', type:'number'},{label:'Harga Normal (Rp)', type:'number'},{label:'Harga Member (Rp)', type:'number'},{label:'Instruksi Khusus', type:'textarea'},{label:'Status', type:'select', options:['Aktif','Nonaktif']}]}, notes:'Daftar layanan klinik untuk Clinic Services & paket.' },
      { key:'rooms-devices', title:'Rooms & Devices', icon:'🏥', breadcrumb:'Masters & Settings / Rooms & Devices', table:{ title:'Ruangan & Perangkat', headers:['Ruang','Perangkat','Jenis','Maintenance Terakhir','Status','Catatan','Aksi'], rows:[[ 'Room A','Laser Acne X100','Laser','2025-09-01', badge('Aktif','ok'),'Kalibrasi bulanan', actionCell('room')],[ 'Room B','RF Microneedling','RF','2025-08-20', badge('Maintenance','warn'),'Menunggu teknisi', actionCell('room')]]}, form:{ title:'Ruangan/Perangkat', schema:[{label:'Nama Ruang'},{label:'Nama Perangkat'},{label:'Jenis Perangkat', type:'select', options:['Laser','RF','Infus','Lainnya']},{label:'Tanggal Maintenance Terakhir', type:'date'},{label:'Penyedia Service'},{label:'Status', type:'select', options:['Aktif','Maintenance','Nonaktif']},{label:'Catatan', type:'textarea'}]}, notes:'Master ruang treatment & perangkat medis untuk penjadwalan dan biaya.' },
      { key:'products', title:'Skincare Products', icon:'🧴', breadcrumb:'Masters & Settings / Skincare Products', table:{ title:'Produk Skincare', headers:['SKU','Nama Produk','Brand','Kategori','Lot Tracking','Expiry Tracking','Status','Aksi'], rows:[[ 'SC-RET-01','Serum Retinol 1%','DermaCo','Active Serum', badge('Ya','ok'), badge('Ya','ok'), badge('Aktif','ok'), actionCell('product')],[ 'SC-SPF-50','Sunscreen SPF50','DermaCo','Sun Care', badge('Tidak','note'), badge('Ya','ok'), badge('Aktif','ok'), actionCell('product')]]}, form:{ title:'Produk Skincare', schema:[{label:'SKU'},{label:'Nama Produk'},{label:'Brand'},{label:'Kategori', type:'select', options:['Active Serum','Moisturizer','Sun Care','Cleanser','Treatment Kit']},{label:'Lot Tracking', type:'select', options:['Ya','Tidak']},{label:'Expiry Tracking', type:'select', options:['Ya','Tidak']},{label:'Harga Jual (Rp)', type:'number'},{label:'Catatan', type:'textarea'},{label:'Status', type:'select', options:['Aktif','Nonaktif']}]}, notes:'Produk skincare retail dan bahan treatment; terhubung ke Inventory Hooks.' },
      { key:'banks', title:'Banks & Payment Channels', icon:'🏦', breadcrumb:'Masters & Settings / Banks & Payment Channels', table:{ title:'Bank & Channel', headers:['Nama','Jenis','No/Channel','Mata Uang','Cabang','Status','Aksi'], rows:[[ 'BCA','Bank','1234567890','IDR','Klinik A', badge('Aktif','ok'), actionCell('bank-channel')],[ 'OVO','e-Wallet','ovo-merchant-01','IDR','Klinik A', badge('Aktif','ok'), actionCell('bank-channel')]]}, form:{ title:'Bank/Channel', schema:[{label:'Nama'},{label:'Jenis', type:'select', options:['Bank','EDC','e-Wallet','Payment Link']},{label:'Nomor/Channel ID'},{label:'Mata Uang', type:'select', options:['IDR','USD']},{label:'Cabang Terkait', type:'select', options:['Klinik A','Klinik B','Klinik C']},{label:'Status', type:'select', options:['Aktif','Nonaktif']},{label:'Catatan', type:'textarea'}]}, notes:'Akun bank, EDC provider, e-wallet. Clearing & fee mapping.' },
      { key:'petty-master', title:'Petty Cash Boxes & Categories', icon:'🧰', breadcrumb:'Masters & Settings / Petty Cash Boxes & Categories', table:{ title:'Setup Petty Cash', headers:['Tipe','Nama','Linked Account','Limit (Rp)','Status','Aksi'], rows:[[ 'Box','PC-A','Kas Kecil','2.500.000', badge('Aktif','ok'), actionCell('petty-master')],[ 'Kategori','Transport','Biaya Transport','- ', badge('Aktif','ok'), actionCell('petty-master')]]}, form:{ title:'Pengaturan Petty Cash', schema:[{label:'Tipe', type:'select', options:['Box','Kategori']},{label:'Nama'},{label:'Linked Account'},{label:'Limit (Rp)', type:'number'},{label:'Status', type:'select', options:['Aktif','Nonaktif']},{label:'Catatan', type:'textarea'}]}, notes:'Box, kategori biaya → akun. Imprest policy.' },
      { key:'approvals', title:'Approvals & Roles', icon:'✅', breadcrumb:'Masters & Settings / Approvals & Roles', table:{ title:'RBAC & Workflow', headers:['Peran','Deskripsi','Threshold (Rp)','Cabang','Status','Aksi'], rows:[[ 'Approver','Menyetujui transaksi rutin','10.000.000','Semua', badge('Aktif','ok'), actionCell('approval')],[ 'Senior Approver','Menyetujui transaksi besar','100.000.000','Semua', badge('Aktif','ok'), actionCell('approval')]]}, form:{ title:'Role/Workflow', schema:[{label:'Nama Peran'},{label:'Deskripsi'},{label:'Threshold (Rp)', type:'number'},{label:'Cabang Berlaku', type:'select', options:['Semua','Klinik A','Klinik B','Klinik C']},{label:'Aturan Approval', type:'textarea'},{label:'Status', type:'select', options:['Aktif','Nonaktif']}]}, notes:'Role Owner/Accountant/Approver/Viewer; aturan approval. Threshold by amount.' },
    ]
  },
]

export function getModuleBySlug(slug: string[]): ModuleCfg | null {
  if (slug.length < 2) return null
  const [groupKey, itemKey] = slug
  const g = groups.find(g=>g.key===groupKey)
  const i = g?.items.find(i=>i.key===itemKey)
  return i || null
}
