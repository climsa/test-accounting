import React from 'react'

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

export const groups: GroupCfg[] = [
  {
    key: 'gl', title: 'General Ledger', items: [
      {
        key: 'journals', title: 'Journals', icon: '🧾', breadcrumb: 'General Ledger / Journals',
        actions: ['+ Jurnal Baru','Impor'],
        table: { title: 'Daftar Jurnal', headers:['Tanggal','No. Ref','Akun','Deskripsi','Debit','Kredit','Status'], rows:[
          ['2025-09-01','JV-001','Kas','Penjualan layanan perawatan','20.000.000','- ', badge('Posted','ok')],
          ['2025-09-03','JV-005','Beban Gaji','Gaji terapis September','8.000.000','- ', badge('Draft','warn')],
        ]},
        form: { title: 'Jurnal', schema:[
          {label:'Tanggal', type:'date'}, {label:'No. Ref'}, {label:'Akun'}, {label:'Deskripsi'}, {label:'Debit', type:'number'}, {label:'Kredit', type:'number'}
        ]},
        notes: 'Pencatatan transaksi akuntansi; validasi debit=kredit. Status: draft/posted/void.'
      },
      {
        key: 'dual-journal', title: 'Dual-Journal', icon: '📚', breadcrumb:'General Ledger / Dual-Journal',
        actions: ['+ Entry'],
        table: { title:'Double Book', headers:['Tanggal','STAT','ALT','Overlay','Audit'], rows:[
          ['2025-09-02', badge('resmi','ok'), badge('editable','warn'), 'ON', '✅'],
          ['2025-09-10', badge('resmi','ok'), badge('read-only','note'), 'OFF', '✅'],
        ]},
        form: { title:'Dual Entry', schema:[
          {label:'Tanggal', type:'date'}, {label:'Buku', type:'select', options:['STAT','ALT']}, {label:'Akun'}, {label:'Deskripsi'}, {label:'Debit', type:'number'}, {label:'Kredit', type:'number'}
        ]},
        notes: 'Dari 1 transaksi lahir 2 jurnal: STAT dan ALT, dengan toggle report STAT/ALT/OVERLAY.'
      },
      {
        key: 'recurring', title: 'Recurring & Reversing', icon: '🔁', breadcrumb:'General Ledger / Recurring & Reversing',
        actions:['+ Template'],
        table:{ title:'Template Jurnal', headers:['Nama','Tipe','Frekuensi','Mulai','Berikutnya','Aktif'], rows:[
          ['Gaji Terapis','Recurring','Bulanan','2025-01-01','2025-10-01','Ya'],
          ['Akrual Bahan Treatment','Reversing','Bulanan','2025-01-01','2025-10-01','Ya'],
        ]},
        form:{ title:'Template', schema:[
          {label:'Nama'}, {label:'Tipe', type:'select', options:['Recurring','Reversing']}, {label:'Frekuensi', type:'select', options:['Harian','Mingguan','Bulanan','Tahunan']}, {label:'Mulai', type:'date'}, {label:'Akun'}, {label:'Nominal', type:'number'}
        ]},
        notes:'Otomasi periodik dan pembalik periode berikutnya. Scheduler (queue).'
      },
      {
        key: 'period-close', title: 'Period Close', icon: '🔒', breadcrumb:'General Ledger / Period Close',
        actions:['Checklist Close'],
        table:{ title:'Periode', headers:['Periode','Status','Catatan'], rows:[
          ['2025-08', badge('Closed','ok'), 'Selesai'],
          ['2025-09', badge('Open','warn'), 'Sedang proses'],
        ]},
        form:{ title:'Kunci Periode', schema:[
          {label:'Periode'}, {label:'Izinkan penyesuaian tertentu', type:'select', options:['Ya','Tidak']}, {label:'Catatan', type:'textarea'}
        ]},
        notes:'Kunci periode; hanya adjustment tertentu yang diizinkan. Checklist close.'
      },
    ]
  },
  {
    key: 'ar', title:'Sales (AR)', items:[
      {
        key: 'clinic-services', title:'Clinic Services', icon:'🩺', breadcrumb:'Sales / Clinic Services',
        actions:['+ Visit','+ Konsultasi'],
        table:{ title:'Layanan Klinik', headers:['Tanggal','No Visit','Pasien','Dokter','Treatment','Ruang','Total','Status'], rows:[
          ['2025-09-03','VS-1001','Ayu Lestari','dr. Citra','Chemical Peel','Room A','1.500.000', badge('Selesai','ok')],
          ['2025-09-05','VS-1002','Rina Putri','dr. Reza','Laser Acne','Room B','3.200.000', badge('Menunggu Pembayaran','warn')],
        ]},
        form:{ title:'Kunjungan', schema:[
          {label:'Tanggal', type:'date'}, {label:'Pasien'}, {label:'Dokter'}, {label:'Therapist'}, {label:'Treatment', type:'select', options:['Chemical Peel','Laser Acne','Microneedling','Hair Removal']}, {label:'Ruang', type:'select', options:['Room A','Room B','Room C']}, {label:'Durasi (menit)', type:'number'}, {label:'Total', type:'number'}
        ]},
        notes:'Integrasi dengan Clinic App; dukung paket/sesi & before/after photos (mock).'
      },
      {
        key: 'invoices', title:'Invoices & Credit Notes', icon:'🧾', breadcrumb:'Sales / Invoices & Credit Notes',
        actions:['+ Invoice','+ Credit Note'],
        table:{ title:'Invoice', headers:['No','Tanggal','Pelanggan','Jatuh Tempo','Total','Status'], rows:[
          ['INV-1001','2025-09-03','Ayu Lestari','2025-10-03','1.500.000', badge('Terbuka','warn')],
          ['INV-1003','2025-09-12','Rina Putri','2025-10-12','3.200.000', badge('Jatuh Tempo','danger')],
        ]},
        form:{ title:'Invoice', schema:[
          {label:'Tanggal', type:'date'}, {label:'Pelanggan'}, {label:'Termin', type:'select', options:['COD','30 hari','45 hari']}, {label:'Subtotal', type:'number'}, {label:'Pajak', type:'number'}, {label:'Total', type:'number'}
        ]},
        notes:'Penjualan jasa perawatan & produk skincare; integrasi Clinic Services. Support ongkir.'
      },
      {
        key: 'receipts', title:'Receipts', icon:'💳', breadcrumb:'Sales / Receipts',
        actions:['+ Penerimaan'],
        table:{ title:'Penerimaan Pembayaran', headers:['Tanggal','No','Pelanggan','Metode','Jumlah'], rows:[
          ['2025-09-15','RC-0001','Ayu Lestari','Transfer','1.500.000'],
          ['2025-09-18','RC-0002','Rina Putri','EDC','3.200.000'],
        ]},
        form:{ title:'Penerimaan', schema:[
          {label:'Tanggal', type:'date'}, {label:'Pelanggan'}, {label:'Metode', type:'select', options:['Kas','Transfer','EDC','e-Wallet']}, {label:'Jumlah', type:'number'}
        ]},
        notes:'Cash/Transfer/EDC/e-wallet/Deposit/Points. Split payment & clearing.'
      },
      {
        key: 'deposits', title:'Deposits & Gift Cards', icon:'🎁', breadcrumb:'Sales / Deposits & Gift Cards',
        table:{ title:'Deposit & Gift', headers:['Tanggal','Tipe','Pelanggan','Nominal','Liability'], rows:[
          ['2025-09-01','Deposit','Rina Putri','500.000','500.000'],
        ]},
        form:{ title:'Deposit/Gift', schema:[
          {label:'Tanggal', type:'date'}, {label:'Pelanggan'}, {label:'Tipe', type:'select', options:['Deposit','Gift Card','Voucher']}, {label:'Nominal', type:'number'}
        ]},
        notes:'Kelola liability deposit/gift card + apply/refund. Aging liability.'
      },
      {
        key: 'packages', title:'Packages/Memberships', icon:'📦', breadcrumb:'Sales / Packages/Memberships',
        table:{ title:'Paket', headers:['Nama','Harga','Durasi','Jumlah Sesi','Deferred?'], rows:[
          ['Paket Acne Silver','2.500.000','3 bulan','3','Ya'],
          ['Membership Glow','4.000.000','6 bulan','6','Ya'],
        ]},
        form:{ title:'Paket', schema:[
          {label:'Nama'}, {label:'Harga', type:'number'}, {label:'Durasi (bulan)', type:'number'}, {label:'Jumlah Sesi', type:'number'}, {label:'Deferred revenue', type:'select', options:['Ya','Tidak']}
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
        table:{ title:'Bills', headers:['No','Tanggal','Vendor','Jatuh Tempo','Total','Status'], rows:[
          ['BILL-2001','2025-09-05','PT Sumber Abadi','2025-10-05','10.000.000', badge('Terbuka','warn')],
          ['BILL-2002','2025-09-18','CV Karya Sejahtera','2025-10-02','12.000.000', badge('Jatuh Tempo','danger')],
        ]},
        form:{ title:'Bill', schema:[
          {label:'Tanggal', type:'date'}, {label:'Vendor'}, {label:'Termin', type:'select', options:['COD','30 hari']}, {label:'Subtotal', type:'number'}, {label:'Pajak', type:'number'}, {label:'Total', type:'number'}
        ]},
        notes:'Catat hutang & retur pajak & withholding. Aging AP.'
      },
      {
        key: 'payments', title:'Payments', icon:'🏦', breadcrumb:'Purchases / Payments',
        actions:['+ Pembayaran'],
        table:{ title:'Pembayaran Vendor', headers:['Tanggal','No','Vendor','Metode','Jumlah','Status'], rows:[
          ['2025-09-20','PV-0001','PT Sumber Abadi','Transfer','10.000.000', badge('Partial','warn')],
        ]},
        form:{ title:'Pembayaran', schema:[
          {label:'Tanggal', type:'date'}, {label:'Vendor'}, {label:'Metode', type:'select', options:['Kas','Transfer','Giro']}, {label:'Jumlah', type:'number'}
        ]},
        notes:'Payment voucher, partial/full; approval & jadwal. Bridge ke Finance.'
      },
    ]
  },
  {
    key: 'banking', title:'Banking & Cash', items:[
      {
        key: 'accounts-transfer', title:'Bank Accounts & Transfer', icon:'🏦', breadcrumb:'Banking & Cash / Bank Accounts & Transfer',
        actions:['+ Rekening','Transfer'],
        table:{ title:'Rekening Bank', headers:['Bank','No. Rekening','Mata Uang','Saldo'], rows:[
          ['BCA','1234567890','IDR','75.000.000'],
          ['Mandiri','9988776655','IDR','40.000.000'],
        ]},
        form:{ title:'Transfer', schema:[
          {label:'Dari Rekening'}, {label:'Ke Rekening'}, {label:'Tanggal', type:'date'}, {label:'Jumlah', type:'number'}
        ]},
        notes:'Transfer antar akun nomor referensi bank. Multi-currency optional.'
      },
      {
        key: 'reconciliation', title:'Bank Reconciliation', icon:'🧮', breadcrumb:'Banking & Cash / Bank Reconciliation',
        actions:['Impor Mutasi'],
        table:{ title:'Pencocokan', headers:['Tanggal','Deskripsi','Mutasi','Buku','Cocok?'], rows:[
          ['2025-09-10','Transfer masuk','1.500.000','1.500.000', badge('Match','ok')],
          ['2025-09-12','Biaya admin','-25.000','0', badge('Review','warn')],
        ]},
        form:{ title:'Aturan Pencocokan', schema:[
          {label:'Kata Kunci'}, {label:'Akun'}, {label:'Toleransi (Rp)', type:'number'}
        ]},
        notes:'Cocokkan mutasi bank vs buku; rules & fee. Import CSV/Excel.'
      },
      {
        key: 'edc-clearing', title:'EDC/e-Wallet Clearing', icon:'📲', breadcrumb:'Banking & Cash / EDC & e-Wallet Clearing',
        table:{ title:'Settlement Channel', headers:['Channel','H+','Fee','Status'], rows:[
          ['EDC A','1','0.7%','Aktif'],
          ['e-Wallet B','0','1.2%','Aktif'],
        ]},
        form:{ title:'Channel', schema:[
          {label:'Nama Channel'}, {label:'H+ Settlement', type:'number'}, {label:'Fee (%)', type:'number'}
        ]},
        notes:'Rekonsiliasi batch EDC/e-wallet ke bank. Fee otomatis.'
      },
      {
        key: 'cash-closing', title:'Cash Closing Outlet', icon:'🧮', breadcrumb:'Banking & Cash / Cash Closing Outlet',
        table:{ title:'Hitung Kas Harian', headers:['Outlet','Tanggal','Kas Awal','Kas Fisik','Selisih','Status'], rows:[
          ['Cabang Klinik A','2025-09-21','5.000.000','5.010.000','10.000', badge('Over','warn')],
        ]},
        form:{ title:'Cash Count', schema:[
          {label:'Outlet'}, {label:'Tanggal', type:'date'}, {label:'Kas Awal', type:'number'}, {label:'Kas Fisik', type:'number'}
        ]},
        notes:'Cash count, over/short, setor bank. Per cabang/outlet.'
      },
    ]
  },
  {
    key: 'petty', title:'Petty Cash', items:[
      {
        key: 'imprest', title:'Imprest Boxes', icon:'📦', breadcrumb:'Petty Cash / Imprest Boxes',
        table:{ title:'Setup & Custodian', headers:['Box','Custodian','Cabang','Status'], rows:[
          ['PC-A','Budi','Klinik A','Aktif'],
        ]},
        form:{ title:'Box', schema:[
          {label:'Kode Box'}, {label:'Custodian'}, {label:'Cabang'}, {label:'Status', type:'select', options:['Aktif','Nonaktif']}
        ]},
        notes:'Multi-box, float amount, aktif/non-aktif. Per klinik/cabang.'
      },
      {
        key: 'vouchers', title:'Vouchers', icon:'🧾', breadcrumb:'Petty Cash / Vouchers',
        table:{ title:'Biaya Kecil', headers:['Tanggal','No','Kategori','Deskripsi','Jumlah','Lampiran','Status'], rows:[
          ['2025-09-11','PV-100','Transport','Grab klinik','85.000','1 file', badge('Draft','warn')],
        ]},
        form:{ title:'Voucher', schema:[
          {label:'Tanggal', type:'date'}, {label:'Kategori'}, {label:'Deskripsi'}, {label:'Jumlah', type:'number'}, {label:'Lampiran'}, {label:'Approval', type:'select', options:['Menunggu','Disetujui','Ditolak']}
        ]},
        notes:'Kategori, foto struk, approval & posting. Policy limit.'
      },
      {
        key: 'topup', title:'Top-up & Reconciliation', icon:'🔄', breadcrumb:'Petty Cash / Top-up & Reconciliation',
        table:{ title:'Isi Ulang & Rekon', headers:['Box','Tanggal','Top-up','Count','Over/Short','Status'], rows:[
          ['PC-A','2025-09-30','1.000.000','OK','0','Closed'],
        ]},
        form:{ title:'Top-up/Rekon', schema:[
          {label:'Box'}, {label:'Tanggal', type:'date'}, {label:'Nominal', type:'number'}, {label:'Catatan', type:'textarea'}
        ]},
        notes:'Top-up dari bank, cash count, over/short, close period. Ledger per box.'
      },
    ]
  },
  {
    key: 'inventory', title:'Inventory Hooks', items:[
      { key:'cogs', title:'COGS Engine', icon:'⚙️', breadcrumb:'Inventory Hooks / COGS Engine', table:{ title:'Config', headers:['Metode','Status'], rows:[['FIFO', 'Aktif']]}, form:{ title:'COGS', schema:[{label:'Metode', type:'select', options:['FIFO','Average']}]}, notes:'Jurnal COGS dari isu bahan perawatan dan skincare; backflush treatment kit.' },
      { key:'grni', title:'GRNI & Adjustments', icon:'📦', breadcrumb:'Inventory Hooks / GRNI & Adjustments', table:{ title:'GRNI', headers:['Tanggal','No','Vendor','Jumlah','Status'], rows:[['2025-09-08','GRN-01','PT Sumber Abadi','8.000.000','Open']]}, form:{ title:'GRNI', schema:[{label:'Tanggal', type:'date'},{label:'Vendor'},{label:'Jumlah', type:'number'}]}, notes:'GRNI saat terima barang; write-off/transfer; opname.' },
      { key:'lot-expiry', title:'Lot/Expiry', icon:'🧪', breadcrumb:'Inventory Hooks / Lot/Expiry', table:{ title:'Tracking', headers:['Produk','Lot','Expiry','Qty'], rows:[['Serum Retinol 1%','SR-001','2026-01-01','50']]}, form:{ title:'Lot', schema:[{label:'Produk'},{label:'Lot'},{label:'Expiry', type:'date'},{label:'Qty', type:'number'}]}, notes:'Dimensi lot & expiry untuk mitigasi risiko kulit; optional serial/lot.' },
    ]
  },
  {
    key: 'tax', title:'Tax & Compliance', items:[
      { key:'tax-codes', title:'Tax Codes', icon:'🧮', breadcrumb:'Tax & Compliance / Tax Codes', table:{ title:'PPN', headers:['Nama','Jenis','Rate','Default?'], rows:[['PPN 11%','Output','11%','Ya'],['PPN 11%','Input','11%','Tidak']]}, form:{ title:'Kode Pajak', schema:[{label:'Nama'},{label:'Jenis', type:'select', options:['Output','Input']},{label:'Rate (%)', type:'number'},{label:'Default', type:'select', options:['Ya','Tidak']}]}, notes:'Inclusive/exclusive & default akun. Configurable rates.' },
      { key:'doc-numbering', title:'Document Numbering', icon:'🔢', breadcrumb:'Tax & Compliance / Document Numbering', table:{ title:'Prefix/Sequence', headers:['Entitas','Tipe Dok','Prefix','Digit','Reset'], rows:[['Klinik A','Invoice','INV','4','Bulanan'],['Klinik A','Bill','BILL','4','Bulanan']]}, form:{ title:'Penomoran', schema:[{label:'Entitas'},{label:'Tipe Dok'},{label:'Prefix'},{label:'Digit', type:'number'},{label:'Reset', type:'select', options:['Tidak','Bulanan','Tahunan']}]}, notes:'Non-editable setelah posting.' },
    ]
  },
  {
    key: 'dimensions', title:'Dimensions & Analytics', items:[
      { key:'dimensions-setup', title:'Dimensions Setup', icon:'🏷️', breadcrumb:'Dimensions & Analytics / Dimensions Setup', table:{ title:'Dimensi', headers:['Nama','Opsi'], rows:[['Cabang','Klinik A,Klinik B'],['Ruang','Room A, Room B'],['Dokter','dr. Citra, dr. Reza']]}, form:{ title:'Dimensi', schema:[{label:'Nama'}, {label:'Opsi (comma separated)'}]}, notes:'Tag di journal lines (cabang, ruang, dokter) untuk laporan bersegmen.' },
      { key:'stat-alt', title:'STAT/ALT Overlays', icon:'🪟', breadcrumb:'Dimensions & Analytics / STAT/ALT Overlays', table:{ title:'View & Bridge', headers:['Akun','STAT','ALT','Bridge?'], rows:[['Kas','1001','A1001','Ya'],['Pendapatan Perawatan','4001','A4001','Ya']]}, form:{ title:'Overlay', schema:[{label:'Akun STAT'},{label:'Akun ALT'},{label:'Bridge', type:'select', options:['Ya','Tidak']}]}, notes:'Transparansi perbedaan; bridge per akun/dimensi.' },
    ]
  },
  {
    key: 'masters', title:'Masters & Settings', items:[
      { key:'coa', title:'Chart of Accounts', icon:'📚', breadcrumb:'Masters & Settings / Chart of Accounts', table:{ title:'Master Akun', headers:['Kode','Nama','Tipe','Status'], rows:[['1001','Kas','Aset','Aktif'],['4001','Pendapatan Perawatan Kulit','Pendapatan','Aktif']]}, form:{ title:'Akun', schema:[{label:'Kode'}, {label:'Nama'}, {label:'Tipe', type:'select', options:['Aset','Kewajiban','Ekuitas','Pendapatan','Beban']}, {label:'Status', type:'select', options:['Aktif','Nonaktif']}]}, notes:'Hirarki & kode; aktif/non-aktif. Template awal.' },
      { key:'parties', title:'Customers & Vendors', icon:'👥', breadcrumb:'Masters & Settings / Customers & Vendors', table:{ title:'Master Pihak', headers:['Nama','Tipe','NPWP','Term'], rows:[['Ayu Lestari','Customer','01.234.567.8-999.000','COD'],['PT Sumber Abadi','Vendor','02.345.678.9-000.111','30 hari']]}, form:{ title:'Pihak', schema:[{label:'Nama'}, {label:'Tipe', type:'select', options:['Customer','Vendor']}, {label:'NPWP'}, {label:'Term', type:'select', options:['COD','30 hari','45 hari']}]}, notes:'Data kontak, terms, NPWP, dsb. AR/AP.' },
      { key:'providers', title:'Doctors & Therapists', icon:'🧑‍⚕️', breadcrumb:'Masters & Settings / Doctors & Therapists', table:{ title:'Tenaga Medis', headers:['Nama','Peran','SIP/License','Spesialisasi','Status'], rows:[['dr. Citra','Dokter','SIP-001','Dermatologi','Aktif'],['Nina','Terapis','-','Facial','Aktif']]}, form:{ title:'Tenaga Medis', schema:[{label:'Nama'}, {label:'Peran', type:'select', options:['Dokter','Terapis']}, {label:'SIP/License'}, {label:'Spesialisasi'}, {label:'Status', type:'select', options:['Aktif','Nonaktif']}]}, notes:'Master dokter & terapis untuk penjadwalan & penjualan layanan.' },
      { key:'treatments', title:'Treatments & Pricing', icon:'💆', breadcrumb:'Masters & Settings / Treatments & Pricing', table:{ title:'Perawatan', headers:['Kode','Nama','Durasi (mnt)','Kategori','Tarif'], rows:[['TR-PEEL','Chemical Peel','60','Acne','1.500.000'],['TR-LASER','Laser Acne','90','Acne','3.200.000']]}, form:{ title:'Perawatan', schema:[{label:'Kode'}, {label:'Nama'}, {label:'Durasi (menit)', type:'number'}, {label:'Kategori'}, {label:'Tarif', type:'number'}]}, notes:'Daftar layanan klinik untuk Clinic Services & paket.' },
      { key:'rooms-devices', title:'Rooms & Devices', icon:'🏥', breadcrumb:'Masters & Settings / Rooms & Devices', table:{ title:'Ruangan & Alat', headers:['Ruang','Perangkat','Status'], rows:[['Room A','Laser Acne X100','Aktif'],['Room B','RF Microneedling','Maintenance']]}, form:{ title:'Ruang/Alat', schema:[{label:'Ruang'}, {label:'Perangkat'}, {label:'Status', type:'select', options:['Aktif','Maintenance','Nonaktif']}]}, notes:'Master ruang treatment & perangkat medis untuk penjadwalan dan biaya.' },
      { key:'products', title:'Skincare Products', icon:'🧴', breadcrumb:'Masters & Settings / Skincare Products', table:{ title:'Produk', headers:['SKU','Nama','Brand','Lot Tracking?','Expiry?'], rows:[['SC-RET-01','Serum Retinol 1%','DermaCo','Ya','Ya'],['SC-SPF-50','Sunscreen SPF50','DermaCo','Tidak','Ya']]}, form:{ title:'Produk', schema:[{label:'SKU'}, {label:'Nama'}, {label:'Brand'}, {label:'Lot Tracking', type:'select', options:['Ya','Tidak']}, {label:'Expiry Tracking', type:'select', options:['Ya','Tidak']}]}, notes:'Produk skincare retail dan bahan treatment; terhubung ke Inventory Hooks.' },
      { key:'banks', title:'Banks & Payment Channels', icon:'🏦', breadcrumb:'Masters & Settings / Banks & Payment Channels', table:{ title:'Bank & Channel', headers:['Nama','Jenis','No/Channel','Mata Uang'], rows:[['BCA','Bank','1234567890','IDR'],['OVO','e-Wallet','ovo-merchant-01','IDR']]}, form:{ title:'Bank/Channel', schema:[{label:'Nama'}, {label:'Jenis', type:'select', options:['Bank','EDC','e-Wallet']}, {label:'No/Channel'}, {label:'Mata Uang'}]}, notes:'Akun bank, EDC provider, e-wallet. Clearing & fee mapping.' },
      { key:'petty-master', title:'Petty Cash Boxes & Categories', icon:'🧰', breadcrumb:'Masters & Settings / Petty Cash Boxes & Categories', table:{ title:'Setup', headers:['Tipe','Nama','Linked Account'], rows:[['Box','PC-A','Kas Kecil'],['Kategori','Transport','Biaya Transport']]}, form:{ title:'Setup', schema:[{label:'Tipe', type:'select', options:['Box','Kategori']},{label:'Nama'},{label:'Linked Account'}]}, notes:'Box, kategori biaya → akun. Imprest policy.' },
      { key:'approvals', title:'Approvals & Roles', icon:'✅', breadcrumb:'Masters & Settings / Approvals & Roles', table:{ title:'RBAC & Workflow', headers:['Peran','Deskripsi','Threshold'], rows:[['Approver','Menyetujui transaksi','≤ 10.000.000'],['Senior Approver','Menyetujui transaksi besar','≤ 100.000.000']]}, form:{ title:'Role/Workflow', schema:[{label:'Peran'}, {label:'Threshold (Rp)', type:'number'}, {label:'Rule', type:'textarea'}]}, notes:'Role Owner/Accountant/Approver/Viewer; aturan approval. Threshold by amount.' },
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

