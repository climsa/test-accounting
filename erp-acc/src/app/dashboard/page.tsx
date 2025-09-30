import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getDashboardData } from "@/config/modules"

export default function DashboardPage() {
  const data = getDashboardData()

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight">Dasbor ERP Akuntansi</h1>
        <p className="text-sm text-muted-foreground">
          Ringkasan kas, pendapatan, piutang, hutang, dan notifikasi closing/approval periode {data.selectedPeriod}.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Saldo Kas" value={data.kpi.cash} accent="Kas" />
        <KpiCard title="Pendapatan" value={data.kpi.revenue} accent="Pendapatan" />
        <KpiCard title="Piutang" value={data.kpi.receivable} accent="Piutang" />
        <KpiCard title="Hutang" value={data.kpi.payable} accent="Hutang" negative />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tren KPI (dalam juta)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {data.trends.map((trend) => (
              <div key={trend.label}>
                <div className="flex items-center justify-between">
                  <span className="font-medium">{trend.label}</span>
                  <span className="text-muted-foreground">{data.selectedPeriod}</span>
                </div>
                <div className="mt-2 flex gap-2 text-xs text-muted-foreground">
                  {trend.values.map((value, index) => (
                    <Badge key={index} variant="secondary" className="font-normal">
                      {value}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifikasi Closing & Approval</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {data.closingAlerts.map((alert) => (
              <div key={alert.title} className="rounded-md border p-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{alert.title}</span>
                  <Badge variant={alert.status === "warning" ? "destructive" : "secondary"}>{alert.status}</Badge>
                </div>
                <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Due: {alert.dueDate}</span>
                  <span>{alert.owner}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Approval Queue</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {data.approvalQueue.map((item) => (
              <div key={item.reference} className="flex items-center justify-between rounded-md border p-3">
                <div>
                  <p className="font-medium">{item.module}</p>
                  <p className="text-xs text-muted-foreground">{item.reference} • {item.owner}</p>
                </div>
                <Badge variant="secondary">{formatCurrency(item.amount)}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifikasi Operasional</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            {data.notifications.map((note, idx) => (
              <div key={idx} className="flex gap-2">
                <span className="mt-1 text-xs text-primary">•</span>
                <span>{note}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

function KpiCard({ title, value, accent, negative }: { title: string; value: number; accent: string; negative?: boolean }) {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
        <span className="text-2xl font-semibold">{formatCurrency(value)}</span>
      </CardHeader>
      <CardContent className="text-xs text-muted-foreground">
        <span>{negative ? "Perlu diperhatikan" : "Performa sehat"} • {accent}</span>
      </CardContent>
    </Card>
  )
}

function formatCurrency(value: number) {
  return `Rp ${value.toLocaleString("id-ID")}`
}
