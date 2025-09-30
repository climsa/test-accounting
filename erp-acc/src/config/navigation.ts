import type { ComponentType } from "react";

import {
  ActivitySquare,
  BookOpenCheck,
  BriefcaseBusiness,
  Building2,
  CalendarClock,
  ChartLine,
  ClipboardList,
  CreditCard,
  FileBarChart,
  FileText,
  Layers,
  LayoutDashboard,
  LineChart,
  ListChecks,
  PiggyBank,
  Receipt,
  ShieldCheck,
  Wallet2,
  Wrench,
  Clock,
  CheckCircle,
} from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  description?: string;
};

export type NavGroup = {
  title: string;
  items: NavItem[];
};

export const navGroups: NavGroup[] = [
  {
    title: "Dashboard",
    items: [{ title: "Overview", href: "/dashboard", icon: LayoutDashboard }],
  },
  {
    title: "General Ledger",
    items: [
      { title: "Journals", href: "/gl/journals", icon: FileText },
      { title: "Dual (STAT/ALT)", href: "/gl/dual", icon: Layers },
      { title: "Recurring", href: "/gl/recurring", icon: CalendarClock },
      { title: "Period Close", href: "/gl/close", icon: ClipboardList },
    ],
  },
  {
    title: "Sales (AR)",
    items: [
      { title: "Invoices", href: "/ar/invoices", icon: Receipt },
      { title: "Receipts", href: "/ar/receipts", icon: Wallet2 },
      { title: "Deposits", href: "/ar/deposits", icon: PiggyBank },
      { title: "Packages", href: "/ar/packages", icon: BriefcaseBusiness },
    ],
  },
  {
    title: "Purchases (AP)",
    items: [
      { title: "Bills", href: "/ap/bills", icon: FileText },
      { title: "Payments", href: "/ap/payments", icon: CreditCard },
    ],
  },
  {
    title: "Banking & Cash",
    items: [
      { title: "Accounts", href: "/bank/accounts", icon: Wallet2 },
      {
        title: "Reconciliation",
        href: "/bank/reconciliation",
        icon: FileBarChart,
      },
      { title: "Clearing", href: "/bank/clearing", icon: ActivitySquare },
      { title: "Cash Closing", href: "/cash/closing", icon: ListChecks },
    ],
  },
  {
    title: "Petty Cash",
    items: [
      { title: "Imprest Boxes", href: "/petty/boxes", icon: Building2 },
      { title: "Vouchers", href: "/petty/vouchers", icon: Receipt },
      { title: "Top-up", href: "/petty/topup", icon: PiggyBank },
    ],
  },
  {
    title: "Fixed Assets",
    items: [
      { title: "Asset Register", href: "/fixed-assets/register", icon: Wrench },
      {
        title: "Depreciation",
        href: "/fixed-assets/depreciation",
        icon: Clock,
      },
    ],
  },
  {
    title: "Inventory Hooks",
    items: [
      { title: "COGS Engine", href: "/inventory/cogs", icon: ChartLine },
      { title: "GRNI & Adjust", href: "/inventory/grni", icon: ClipboardList },
      { title: "Lot & Expiry", href: "/inventory/lots", icon: ListChecks },
    ],
  },
  {
    title: "Tax & Compliance",
    items: [
      { title: "Tax Codes", href: "/tax/codes", icon: ShieldCheck },
      {
        title: "Document Numbering",
        href: "/setup/doc-numbering",
        icon: FileText,
      },
    ],
  },
  {
    title: "Masters & Settings",
    items: [
      { title: "Chart of Accounts", href: "/masters/coa", icon: BookOpenCheck },
      { title: "Parties", href: "/masters/parties", icon: Building2 },
      {
        title: "Banks & Channels",
        href: "/masters/banks-channels",
        icon: Wallet2,
      },
      {
        title: "Petty Policies",
        href: "/masters/petty-master",
        icon: PiggyBank,
      },
      {
        title: "Approvals & Roles",
        href: "/settings/approvals",
        icon: ShieldCheck,
      },
      { title: "Dimensions", href: "/analytics/dimensions", icon: Layers },
    ],
  },
  {
    title: "Workflow & Approvals",
    items: [
      {
        title: "Approval Queue",
        href: "/workflow/approvals",
        icon: CheckCircle,
      },
    ],
  },
  {
    title: "Reports",
    items: [
      {
        title: "Trial Balance",
        href: "/reports/trial-balance",
        icon: FileBarChart,
      },
      { title: "Profit & Loss", href: "/reports/profit-loss", icon: LineChart },
      {
        title: "Retained Earnings",
        href: "/reports/retained-earnings",
        icon: BriefcaseBusiness,
      },
      {
        title: "Balance Sheet",
        href: "/reports/balance-sheet",
        icon: BookOpenCheck,
      },
      {
        title: "Cashflow Direct",
        href: "/reports/cashflow-direct",
        icon: ActivitySquare,
      },
      {
        title: "Cashflow Indirect",
        href: "/reports/cashflow-indirect",
        icon: ActivitySquare,
      },
      { title: "AR Aging", href: "/reports/ar-aging", icon: Clock },
      { title: "AP Aging", href: "/reports/ap-aging", icon: Clock },
    ],
  },
];
