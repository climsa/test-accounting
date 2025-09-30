// Auto-posting service untuk posting otomatis ke GL
// Ini adalah mock service layer yang akan handle posting dari berbagai modul ke GL

export interface GLPostingEntry {
  account: string;
  debit: number;
  credit: number;
  description: string;
  reference?: string;
  branch?: string;
  costCenter?: string;
  project?: string;
}

export interface GLPostingRequest {
  sourceDocument: string;
  sourceNumber: string;
  sourceDate: string;
  entries: GLPostingEntry[];
  description: string;
  branch?: string;
  costCenter?: string;
  project?: string;
}

export interface GLPostingResponse {
  success: boolean;
  journalNumber?: string;
  journalId?: string;
  message: string;
  errors?: string[];
}

// Mock GL Posting Service
export class GLPostingService {
  private static instance: GLPostingService;
  private journalCounter = 1000;

  static getInstance(): GLPostingService {
    if (!GLPostingService.instance) {
      GLPostingService.instance = new GLPostingService();
    }
    return GLPostingService.instance;
  }

  async postToGL(request: GLPostingRequest): Promise<GLPostingResponse> {
    try {
      // Validasi balance (debit = credit)
      const totalDebit = request.entries.reduce(
        (sum, entry) => sum + entry.debit,
        0
      );
      const totalCredit = request.entries.reduce(
        (sum, entry) => sum + entry.credit,
        0
      );

      if (Math.abs(totalDebit - totalCredit) > 0.01) {
        return {
          success: false,
          message: "GL posting gagal: Debit dan Credit tidak seimbang",
          errors: [`Total Debit: ${totalDebit}, Total Credit: ${totalCredit}`],
        };
      }

      // Generate journal number
      const journalNumber = `JV-${new Date().getFullYear()}-${String(
        this.journalCounter++
      ).padStart(3, "0")}`;

      // Mock posting ke GL
      const journalEntry = {
        id: `journal-${Date.now()}`,
        number: journalNumber,
        date: request.sourceDate,
        description: request.description,
        sourceDocument: request.sourceDocument,
        sourceNumber: request.sourceNumber,
        entries: request.entries.map((entry) => ({
          ...entry,
          journalNumber,
          postedAt: new Date().toISOString(),
          postedBy: "system",
        })),
        status: "posted",
        branch: request.branch,
        costCenter: request.costCenter,
        project: request.project,
        createdAt: new Date().toISOString(),
        createdBy: "system",
      };

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 100));

      return {
        success: true,
        journalNumber,
        journalId: journalEntry.id,
        message: `GL posting berhasil. Journal: ${journalNumber}`,
      };
    } catch (error) {
      return {
        success: false,
        message: "GL posting gagal: " + (error as Error).message,
        errors: [(error as Error).message],
      };
    }
  }

  // Helper methods untuk berbagai jenis posting
  async postInvoice(invoiceData: {
    number: string;
    date: string;
    customerName: string;
    subtotal: number;
    tax: number;
    total: number;
    branch: string;
  }): Promise<GLPostingResponse> {
    const entries: GLPostingEntry[] = [
      {
        account: "1-100", // Accounts Receivable
        debit: invoiceData.total,
        credit: 0,
        description: `Invoice ${invoiceData.number} - ${invoiceData.customerName}`,
        reference: invoiceData.number,
        branch: invoiceData.branch,
      },
      {
        account: "4-100", // Service Revenue
        debit: 0,
        credit: invoiceData.subtotal,
        description: `Revenue from ${invoiceData.customerName}`,
        reference: invoiceData.number,
        branch: invoiceData.branch,
      },
    ];

    if (invoiceData.tax > 0) {
      entries.push({
        account: "2-100", // Tax Payable
        debit: 0,
        credit: invoiceData.tax,
        description: `Tax from invoice ${invoiceData.number}`,
        reference: invoiceData.number,
        branch: invoiceData.branch,
      });
    }

    return this.postToGL({
      sourceDocument: "invoice",
      sourceNumber: invoiceData.number,
      sourceDate: invoiceData.date,
      entries,
      description: `Invoice posting: ${invoiceData.number}`,
      branch: invoiceData.branch,
    });
  }

  async postReceipt(receiptData: {
    number: string;
    date: string;
    customerName: string;
    amount: number;
    branch: string;
  }): Promise<GLPostingResponse> {
    const entries: GLPostingEntry[] = [
      {
        account: "1-000", // Cash/Bank Account
        debit: receiptData.amount,
        credit: 0,
        description: `Receipt ${receiptData.number} - ${receiptData.customerName}`,
        reference: receiptData.number,
        branch: receiptData.branch,
      },
      {
        account: "1-100", // Accounts Receivable
        debit: 0,
        credit: receiptData.amount,
        description: `Payment from ${receiptData.customerName}`,
        reference: receiptData.number,
        branch: receiptData.branch,
      },
    ];

    return this.postToGL({
      sourceDocument: "receipt",
      sourceNumber: receiptData.number,
      sourceDate: receiptData.date,
      entries,
      description: `Receipt posting: ${receiptData.number}`,
      branch: receiptData.branch,
    });
  }

  async postBill(billData: {
    number: string;
    date: string;
    vendorName: string;
    subtotal: number;
    tax: number;
    total: number;
    branch: string;
  }): Promise<GLPostingResponse> {
    const entries: GLPostingEntry[] = [
      {
        account: "6-100", // Expense Account
        debit: billData.subtotal,
        credit: 0,
        description: `Bill ${billData.number} - ${billData.vendorName}`,
        reference: billData.number,
        branch: billData.branch,
      },
      {
        account: "2-200", // Accounts Payable
        debit: 0,
        credit: billData.total,
        description: `Payable to ${billData.vendorName}`,
        reference: billData.number,
        branch: billData.branch,
      },
    ];

    if (billData.tax > 0) {
      entries.push({
        account: "1-300", // Tax Receivable
        debit: billData.tax,
        credit: 0,
        description: `Tax from bill ${billData.number}`,
        reference: billData.number,
        branch: billData.branch,
      });
    }

    return this.postToGL({
      sourceDocument: "bill",
      sourceNumber: billData.number,
      sourceDate: billData.date,
      entries,
      description: `Bill posting: ${billData.number}`,
      branch: billData.branch,
    });
  }

  async postPayment(paymentData: {
    number: string;
    date: string;
    vendorName: string;
    amount: number;
    branch: string;
  }): Promise<GLPostingResponse> {
    const entries: GLPostingEntry[] = [
      {
        account: "2-200", // Accounts Payable
        debit: paymentData.amount,
        credit: 0,
        description: `Payment ${paymentData.number} - ${paymentData.vendorName}`,
        reference: paymentData.number,
        branch: paymentData.branch,
      },
      {
        account: "1-000", // Cash/Bank Account
        debit: 0,
        credit: paymentData.amount,
        description: `Payment to ${paymentData.vendorName}`,
        reference: paymentData.number,
        branch: paymentData.branch,
      },
    ];

    return this.postToGL({
      sourceDocument: "payment",
      sourceNumber: paymentData.number,
      sourceDate: paymentData.date,
      entries,
      description: `Payment posting: ${paymentData.number}`,
      branch: paymentData.branch,
    });
  }

  async postDepreciation(depreciationData: {
    period: string;
    assetCode: string;
    assetName: string;
    monthlyDepreciation: number;
    branch: string;
  }): Promise<GLPostingResponse> {
    const entries: GLPostingEntry[] = [
      {
        account: "6-100", // Depreciation Expense
        debit: depreciationData.monthlyDepreciation,
        credit: 0,
        description: `Depreciation ${depreciationData.assetCode} - ${depreciationData.assetName}`,
        reference: depreciationData.assetCode,
        branch: depreciationData.branch,
      },
      {
        account: "1-201", // Accumulated Depreciation
        debit: 0,
        credit: depreciationData.monthlyDepreciation,
        description: `Accumulated Depreciation ${depreciationData.assetCode}`,
        reference: depreciationData.assetCode,
        branch: depreciationData.branch,
      },
    ];

    return this.postToGL({
      sourceDocument: "depreciation",
      sourceNumber: depreciationData.assetCode,
      sourceDate: depreciationData.period,
      entries,
      description: `Depreciation posting: ${depreciationData.assetCode}`,
      branch: depreciationData.branch,
    });
  }

  async postJournal(journalData: {
    number: string;
    date: string;
    entries: Array<{
      account: string;
      debit: number;
      credit: number;
      description: string;
    }>;
    branch?: string;
    costCenter?: string;
    project?: string;
  }): Promise<GLPostingResponse> {
    const entries: GLPostingEntry[] = journalData.entries.map((entry) => ({
      account: entry.account,
      debit: entry.debit,
      credit: entry.credit,
      description: entry.description,
      reference: journalData.number,
      branch: journalData.branch,
      costCenter: journalData.costCenter,
      project: journalData.project,
    }));

    return this.postToGL({
      sourceDocument: "journal",
      sourceNumber: journalData.number,
      sourceDate: journalData.date,
      entries,
      description: `Manual journal: ${journalData.number}`,
      branch: journalData.branch,
      costCenter: journalData.costCenter,
      project: journalData.project,
    });
  }
}

// Export singleton instance
export const glPostingService = GLPostingService.getInstance();

// Utility functions untuk validasi
export function validateGLPosting(entries: GLPostingEntry[]): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check balance
  const totalDebit = entries.reduce((sum, entry) => sum + entry.debit, 0);
  const totalCredit = entries.reduce((sum, entry) => sum + entry.credit, 0);

  if (Math.abs(totalDebit - totalCredit) > 0.01) {
    errors.push(
      `Debit dan Credit tidak seimbang. Debit: ${totalDebit}, Credit: ${totalCredit}`
    );
  }

  // Check minimum entries
  if (entries.length < 2) {
    errors.push("Minimal 2 entri diperlukan untuk GL posting");
  }

  // Check account format
  entries.forEach((entry, index) => {
    if (!entry.account || entry.account.length < 3) {
      errors.push(`Entry ${index + 1}: Account code tidak valid`);
    }

    if (entry.debit < 0 || entry.credit < 0) {
      errors.push(`Entry ${index + 1}: Debit dan Credit tidak boleh negatif`);
    }

    if (entry.debit > 0 && entry.credit > 0) {
      errors.push(
        `Entry ${index + 1}: Debit dan Credit tidak boleh keduanya positif`
      );
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Mock data untuk testing
export const mockGLPostingData = {
  invoice: {
    number: "INV-1001",
    date: "2025-09-01",
    customerName: "Ayu Lestari",
    subtotal: 1500000,
    tax: 150000,
    total: 1650000,
    branch: "Klinik A",
  },

  receipt: {
    number: "RC-2001",
    date: "2025-09-02",
    customerName: "Ayu Lestari",
    amount: 1650000,
    branch: "Klinik A",
  },

  bill: {
    number: "BILL-3001",
    date: "2025-09-01",
    vendorName: "PT Sumber Abadi",
    subtotal: 9200000,
    tax: 920000,
    total: 10120000,
    branch: "Klinik A",
  },

  payment: {
    number: "PAY-2025-001",
    date: "2025-09-15",
    vendorName: "PT Sumber Abadi",
    amount: 10120000,
    branch: "Klinik A",
  },

  depreciation: {
    period: "2025-09",
    assetCode: "FA-001",
    assetName: "Laser Hair Removal Machine",
    monthlyDepreciation: 1875000,
    branch: "Klinik A",
  },
};
