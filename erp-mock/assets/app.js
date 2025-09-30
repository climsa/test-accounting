// Simple SPA with hash routing and dummy accounting data (Indonesian UI)

// ---------- Dummy Data ----------
const accounts = [
  { code: '1001', name: 'Kas', type: 'Aset', balance: 150_000_000 },
  { code: '1101', name: 'Piutang Usaha', type: 'Aset', balance: 85_000_000 },
  { code: '1201', name: 'Persediaan', type: 'Aset', balance: 40_000_000 },
  { code: '2001', name: 'Hutang Usaha', type: 'Kewajiban', balance: 55_000_000 },
  { code: '3001', name: 'Modal', type: 'Ekuitas', balance: 100_000_000 },
  { code: '4001', name: 'Pendapatan Penjualan', type: 'Pendapatan', balance: 320_000_000 },
  { code: '5001', name: 'Beban Gaji', type: 'Beban', balance: 60_000_000 },
  { code: '5002', name: 'Beban Sewa', type: 'Beban', balance: 25_000_000 },
];

const journalEntries = [
  { date: '2025-09-01', ref: 'JV-001', account: 'Kas', desc: 'Penjualan tunai', debit: 20_000_000, credit: 0 },
  { date: '2025-09-02', ref: 'JV-002', account: 'Pendapatan Penjualan', desc: 'Penjualan tunai', debit: 0, credit: 20_000_000 },
  { date: '2025-09-03', ref: 'JV-003', account: 'Piutang Usaha', desc: 'Penjualan kredit', debit: 15_000_000, credit: 0 },
  { date: '2025-09-03', ref: 'JV-004', account: 'Pendapatan Penjualan', desc: 'Penjualan kredit', debit: 0, credit: 15_000_000 },
  { date: '2025-09-04', ref: 'JV-005', account: 'Beban Gaji', desc: 'Gaji karyawan', debit: 8_000_000, credit: 0 },
  { date: '2025-09-04', ref: 'JV-006', account: 'Kas', desc: 'Gaji karyawan', debit: 0, credit: 8_000_000 },
  { date: '2025-09-05', ref: 'JV-007', account: 'Persediaan', desc: 'Pembelian persediaan', debit: 10_000_000, credit: 0 },
  { date: '2025-09-05', ref: 'JV-008', account: 'Hutang Usaha', desc: 'Pembelian persediaan', debit: 0, credit: 10_000_000 },
];

const customers = [
  { name: 'PT Nusantara Jaya', balance: 35_000_000 },
  { name: 'CV Maju Makmur', balance: 15_000_000 },
  { name: 'UD Sentosa', balance: 4_500_000 },
];

const invoices = [
  { no: 'INV-1001', date: '2025-09-03', customer: 'PT Nusantara Jaya', due: '2025-10-03', total: 15_000_000, status: 'Terbuka' },
  { no: 'INV-1002', date: '2025-09-10', customer: 'CV Maju Makmur', due: '2025-10-10', total: 9_000_000, status: 'Terbuka' },
  { no: 'INV-1003', date: '2025-09-12', customer: 'UD Sentosa', due: '2025-10-12', total: 4_500_000, status: 'Jatuh Tempo' },
];

const vendors = [
  { name: 'PT Sumber Abadi', balance: 22_000_000 },
  { name: 'CV Karya Sejahtera', balance: 10_000_000 },
];

const bills = [
  { no: 'BILL-2001', date: '2025-09-05', vendor: 'PT Sumber Abadi', due: '2025-10-05', total: 10_000_000, status: 'Terbuka' },
  { no: 'BILL-2002', date: '2025-09-18', vendor: 'CV Karya Sejahtera', due: '2025-10-02', total: 12_000_000, status: 'Jatuh Tempo' },
];

const salesOrders = [
  { no: 'SO-001', date: '2025-09-01', customer: 'PT Nusantara Jaya', total: 20_000_000, status: 'Selesai' },
  { no: 'SO-002', date: '2025-09-10', customer: 'CV Maju Makmur', total: 9_000_000, status: 'Proses' },
];

const purchaseOrders = [
  { no: 'PO-001', date: '2025-09-05', vendor: 'PT Sumber Abadi', total: 10_000_000, status: 'Selesai' },
  { no: 'PO-002', date: '2025-09-20', vendor: 'CV Karya Sejahtera', total: 8_000_000, status: 'Proses' },
];

// ---------- Utils ----------
const fmtIDR = n => `Rp ${n.toLocaleString('id-ID')}`;
function $(sel, root=document){ return root.querySelector(sel); }
function $all(sel, root=document){ return Array.from(root.querySelectorAll(sel)); }

function setActive(route){
  $all('#nav .item').forEach(a=>{
    a.classList.toggle('active', a.dataset.route===route);
  });
  $('#breadcrumbs').textContent = titleFor(route);
}

function titleFor(route){
  const map = {
    'dashboard':'Dasbor','coa':'Bagan Akun','jurnal':'Jurnal','buku-besar':'Buku Besar',
    'piutang':'Piutang (AR)','hutang':'Hutang (AP)','penjualan':'Penjualan',
    'pembelian':'Pembelian','laporan':'Laporan Keuangan','pengaturan':'Pengaturan'
  };
  return map[route] || 'Dasbor';
}

// ---------- Rendering ----------
function render(route){
  const tpl = document.getElementById(`tpl-${route}`) || document.getElementById('tpl-dashboard');
  const view = document.getElementById('view');
  view.innerHTML = '';
  view.appendChild(tpl.content.cloneNode(true));
  setActive(route);

  switch(route){
    case 'dashboard': return renderDashboard();
    case 'coa': return renderCoA();
    case 'jurnal': return renderJournals();
    case 'buku-besar': return renderLedger();
    case 'piutang': return renderAR();
    case 'hutang': return renderAP();
    case 'penjualan': return renderSales();
    case 'pembelian': return renderPurchases();
    case 'laporan': return renderReports();
  }
}

function renderDashboard(){
  // KPIs (very rough from dummy data)
  const revenue = journalEntries.filter(j=>j.account==='Pendapatan Penjualan').reduce((a,b)=>a+b.credit,0);
  const expense = journalEntries.filter(j=>j.account.startsWith('Beban')).reduce((a,b)=>a+b.debit,0);
  const cash = accounts.find(a=>a.name==='Kas')?.balance ?? 0;
  $('#kpi-revenue').textContent = fmtIDR(revenue);
  $('#kpi-expense').textContent = fmtIDR(expense);
  $('#kpi-profit').textContent = fmtIDR(revenue-expense);
  $('#kpi-cash').textContent = fmtIDR(cash);

  const tbody = $('#recent-transactions');
  journalEntries.slice(-6).reverse().forEach(j=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${j.date}</td><td>${j.desc}</td><td>${j.debit?fmtIDR(j.debit):''}</td><td>${j.credit?fmtIDR(j.credit):''}</td>`;
    tbody.appendChild(tr);
  });

  $('#sum-ar').textContent = fmtIDR(invoices.filter(i=>i.status!=='Lunas').reduce((a,b)=>a+b.total,0));
  $('#sum-ap').textContent = fmtIDR(bills.filter(b=>b.status!=='Lunas').reduce((a,b)=>a+b.total,0));
  $('#due-invoices').textContent = invoices.filter(i=>i.status==='Jatuh Tempo').length;
  $('#due-bills').textContent = bills.filter(b=>b.status==='Jatuh Tempo').length;
}

function renderCoA(){
  const tbody = $('#tbl-accounts');
  accounts.forEach(a=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${a.code}</td><td>${a.name}</td><td>${a.type}</td><td>${fmtIDR(a.balance)}</td>`;
    tbody.appendChild(tr);
  });
}

function renderJournals(){
  const tbody = $('#tbl-journals');
  journalEntries.forEach(j=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${j.date}</td><td>${j.ref}</td><td>${j.account}</td><td>${j.desc}</td><td>${j.debit?fmtIDR(j.debit):''}</td><td>${j.credit?fmtIDR(j.credit):''}</td>`;
    tbody.appendChild(tr);
  });
}

function renderLedger(){
  const select = $('#gl-account-filter');
  accounts.forEach(a=>{
    const opt = document.createElement('option');
    opt.value = a.name; opt.textContent = `${a.code} - ${a.name}`; select.appendChild(opt);
  });
  const accountName = select.value || accounts[0].name;
  const rows = journalEntries.filter(j=>j.account===accountName);
  const tbody = $('#tbl-ledger');
  let running = 0;
  rows.forEach(j=>{
    running += j.debit - j.credit;
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${j.date}</td><td>${j.ref}</td><td>${j.desc}</td><td>${j.debit?fmtIDR(j.debit):''}</td><td>${j.credit?fmtIDR(j.credit):''}</td><td>${fmtIDR(running)}</td>`;
    tbody.appendChild(tr);
  });
  select.addEventListener('change', ()=>render('buku-besar'));
}

function renderAR(){
  const cBody = $('#tbl-customers');
  customers.forEach(c=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${c.name}</td><td>${fmtIDR(c.balance)}</td>`;
    cBody.appendChild(tr);
  });
  const iBody = $('#tbl-invoices');
  invoices.forEach(i=>{
    const tr = document.createElement('tr');
    const cls = i.status==='Jatuh Tempo' ? 'badge danger' : (i.status==='Terbuka' ? 'badge warn' : 'badge ok');
    tr.innerHTML = `<td>${i.no}</td><td>${i.date}</td><td>${i.customer}</td><td>${i.due}</td><td>${fmtIDR(i.total)}</td><td><span class="${cls}">${i.status}</span></td>`;
    iBody.appendChild(tr);
  });
}

function renderAP(){
  const vBody = $('#tbl-vendors');
  vendors.forEach(v=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${v.name}</td><td>${fmtIDR(v.balance)}</td>`;
    vBody.appendChild(tr);
  });
  const bBody = $('#tbl-bills');
  bills.forEach(b=>{
    const tr = document.createElement('tr');
    const cls = b.status==='Jatuh Tempo' ? 'badge danger' : (b.status==='Terbuka' ? 'badge warn' : 'badge ok');
    tr.innerHTML = `<td>${b.no}</td><td>${b.date}</td><td>${b.vendor}</td><td>${b.due}</td><td>${fmtIDR(b.total)}</td><td><span class="${cls}">${b.status}</span></td>`;
    bBody.appendChild(tr);
  });
}

function renderSales(){
  const body = $('#tbl-sales-orders');
  salesOrders.forEach(s=>{
    const cls = s.status==='Selesai' ? 'badge ok' : 'badge warn';
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${s.no}</td><td>${s.date}</td><td>${s.customer}</td><td>${fmtIDR(s.total)}</td><td><span class="${cls}">${s.status}</span></td>`;
    body.appendChild(tr);
  });
}

function renderPurchases(){
  const body = $('#tbl-purchase-orders');
  purchaseOrders.forEach(p=>{
    const cls = p.status==='Selesai' ? 'badge ok' : 'badge warn';
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${p.no}</td><td>${p.date}</td><td>${p.vendor}</td><td>${fmtIDR(p.total)}</td><td><span class="${cls}">${p.status}</span></td>`;
    body.appendChild(tr);
  });
}

function renderReports(){
  // Simple sums
  const totalDeb = journalEntries.reduce((a,b)=>a+b.debit,0);
  const totalCred = journalEntries.reduce((a,b)=>a+b.credit,0);
  const tb = Math.abs(totalDeb-totalCred);
  const revenue = journalEntries.filter(j=>j.account==='Pendapatan Penjualan').reduce((a,b)=>a+b.credit,0);
  const expense = journalEntries.filter(j=>j.account.startsWith('Beban')).reduce((a,b)=>a+b.debit,0);
  const cashflow = accounts.find(a=>a.name==='Kas')?.balance ?? 0;
  $('#trial-balance-total').textContent = fmtIDR(tb);
  $('#pnl-ytd').textContent = fmtIDR(revenue-expense);
  $('#cashflow-ytd').textContent = fmtIDR(cashflow);

  const body = $('#tbl-report-accounts');
  accounts.forEach(a=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${a.code} - ${a.name}</td><td>${fmtIDR(a.balance)}</td>`;
    body.appendChild(tr);
  });
}

// ---------- Router ----------
function getRoute(){
  const h = location.hash.replace(/^#\//,'');
  return h || 'dashboard';
}

window.addEventListener('hashchange', ()=>render(getRoute()));
window.addEventListener('DOMContentLoaded', ()=>render(getRoute()));

