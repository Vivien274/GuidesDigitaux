export interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate?: string;
  customerName: string;
  customerEmail: string;
  customerAddress?: string;
  customerSiret?: string;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  subtotal: number;
  taxRate?: number;
  taxAmount?: number;
  totalAmount: number;
  paymentMethod: string;
  isPaid: boolean;
  notes?: string;
}

export function generateInvoiceHtml(data: InvoiceData): string {
  const isTvaExempt = !data.taxRate || data.taxRate === 0;
  
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Facture ${data.invoiceNumber} - Guides Digitaux</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      background-color: #faf8f5;
      color: #332420;
      line-height: 1.5;
      padding: 40px 20px;
    }
    .invoice-card {
      max-width: 800px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 24px;
      border: 1px solid #e8ded0;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
      padding: 48px;
    }
    .header-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #f4ede0;
      padding-bottom: 24px;
      margin-bottom: 32px;
    }
    .brand-title {
      font-size: 24px;
      font-weight: 800;
      color: #18757d;
      letter-spacing: -0.5px;
      margin-bottom: 4px;
    }
    .company-sub {
      font-size: 12px;
      font-weight: 700;
      color: #e05a47;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 12px;
    }
    .company-details {
      font-size: 13px;
      color: #5e4d46;
      line-height: 1.6;
    }
    .invoice-badge {
      text-align: right;
    }
    .invoice-title {
      font-size: 28px;
      font-weight: 900;
      color: #332420;
      text-transform: uppercase;
      letter-spacing: 0.02em;
    }
    .invoice-num {
      font-size: 14px;
      font-weight: 700;
      color: #18757d;
      margin-top: 4px;
    }
    .status-badge {
      display: inline-block;
      margin-top: 12px;
      padding: 6px 16px;
      border-radius: 50px;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      background-color: #d1fae5;
      color: #065f46;
      border: 1px solid #a7f3d0;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 32px;
      margin-bottom: 36px;
    }
    .meta-box {
      background-color: #faf8f5;
      border-radius: 16px;
      padding: 20px;
      border: 1px solid #eee7da;
    }
    .meta-label {
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #18757d;
      margin-bottom: 8px;
    }
    .meta-content {
      font-size: 13px;
      color: #332420;
      font-weight: 600;
      line-height: 1.6;
    }
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 32px;
    }
    .items-table th {
      background-color: #f4ede0;
      color: #332420;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 14px 16px;
      text-align: left;
    }
    .items-table th:first-child {
      border-top-left-radius: 12px;
      border-bottom-left-radius: 12px;
    }
    .items-table th:last-child {
      border-top-right-radius: 12px;
      border-bottom-right-radius: 12px;
      text-align: right;
    }
    .items-table td {
      padding: 16px;
      font-size: 13px;
      color: #332420;
      border-bottom: 1px solid #eee7da;
    }
    .items-table td:last-child {
      text-align: right;
      font-weight: 700;
    }
    .totals-area {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 32px;
    }
    .totals-box {
      width: 280px;
      background-color: #faf8f5;
      border-radius: 16px;
      padding: 20px;
      border: 1px solid #eee7da;
    }
    .totals-row {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      color: #5e4d46;
      margin-bottom: 8px;
    }
    .totals-row.final {
      font-size: 18px;
      font-weight: 800;
      color: #18757d;
      border-top: 2px dashed #e8ded0;
      padding-top: 12px;
      margin-top: 12px;
      margin-bottom: 0;
    }
    .legal-footer {
      border-top: 1px solid #eee7da;
      padding-top: 20px;
      text-align: center;
      font-size: 11px;
      color: #78645b;
      line-height: 1.6;
    }
    .print-actions {
      max-width: 800px;
      margin: 0 auto 20px auto;
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }
    .btn-print {
      background-color: #18757d;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 800;
      cursor: pointer;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      box-shadow: 0 4px 12px rgba(24, 117, 125, 0.2);
    }
    .btn-print:hover {
      background-color: #12595f;
    }

    @media print {
      body {
        background-color: #ffffff;
        padding: 0;
      }
      .invoice-card {
        border: none;
        box-shadow: none;
        padding: 0;
      }
      .print-actions {
        display: none;
      }
    }
  </style>
</head>
<body>
  <div class="print-actions">
    <button onclick="window.print()" class="btn-print">🖨️ Imprimer / Sauvegarder en PDF</button>
    <a href="mailto:${data.customerEmail}?subject=Votre%20facture%20Guides%20Digitaux%20${data.invoiceNumber}&body=Bonjour%20${encodeURIComponent(data.customerName)},%0A%0AVeuillez%20trouver%20votre%20facture%20d%27acquittement%20N%C2%B0%20${data.invoiceNumber}%20d%27un%20montant%20de%20${data.totalAmount}%20%E2%82%AC%20TTC.%0A%0ABien%20cordialement,%0ASt%C3%A9phanie%20ROCQ%20-%20Guides%20Digitaux" class="btn-print" style="background-color: #e05a47; text-decoration: none;">✉️ Renvoyer par e-mail à l'acheteur</a>
  </div>

  <div class="invoice-card">
    <!-- HEADER -->
    <div class="header-row">
      <div>
        <div class="brand-title">Guides Digitaux</div>
        <div class="company-sub">Stéphanie ROCQ • Formations & E-books</div>
        <div class="company-details">
          40 rue du Hoccart, 59560 Comines<br />
          SIRET / RCS Lille : 821 194 987 00038<br />
          Déclaration d'activité : 32591460859<br />
          Email : contact@guides-digitaux.com • Tél : 07 82 40 40 62
        </div>
      </div>
      <div class="invoice-badge">
        <div class="invoice-title">FACTURE</div>
        <div class="invoice-num">N° ${data.invoiceNumber}</div>
        <div class="status-badge">✓ ACQUITTÉE</div>
      </div>
    </div>

    <!-- META DETAILS -->
    <div class="meta-grid">
      <div class="meta-box">
        <div class="meta-label">Facturé à :</div>
        <div class="meta-content">
          <strong>${data.customerName}</strong><br />
          ${data.customerEmail}<br />
          ${data.customerAddress ? `${data.customerAddress}<br />` : ''}
          ${data.customerSiret ? `SIRET : ${data.customerSiret}` : ''}
        </div>
      </div>

      <div class="meta-box">
        <div class="meta-label">Détails du règlement :</div>
        <div class="meta-content">
          <strong>Date d'émission :</strong> ${data.invoiceDate}<br />
          <strong>Mode de paiement :</strong> ${data.paymentMethod}<br />
          <strong>Statut :</strong> Payé intégralement
        </div>
      </div>
    </div>

    <!-- ITEMS TABLE -->
    <table class="items-table">
      <thead>
        <tr>
          <th>Désignation de la prestation / produit</th>
          <th style="text-align: center;">Qté</th>
          <th style="text-align: right;">Prix Unitaire TTC</th>
          <th style="text-align: right;">Montant Total TTC</th>
        </tr>
      </thead>
      <tbody>
        ${data.items.map(item => `
          <tr>
            <td>
              <strong>${item.description}</strong>
            </td>
            <td style="text-align: center;">${item.quantity}</td>
            <td style="text-align: right;">${item.unitPrice.toFixed(2).replace('.', ',')} €</td>
            <td style="text-align: right;">${item.total.toFixed(2).replace('.', ',')} €</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <!-- TOTALS -->
    <div class="totals-area">
      <div class="totals-box">
        <div class="totals-row">
          <span>Sous-total HT :</span>
          <span>${data.subtotal.toFixed(2).replace('.', ',')} €</span>
        </div>
        ${!isTvaExempt ? `
        <div class="totals-row">
          <span>TVA (${data.taxRate}%) :</span>
          <span>${(data.taxAmount || 0).toFixed(2).replace('.', ',')} €</span>
        </div>
        ` : ''}
        <div class="totals-row final">
          <span>Total TTC :</span>
          <span>${data.totalAmount.toFixed(2).replace('.', ',')} €</span>
        </div>
      </div>
    </div>

    <!-- LEGAL FOOTER -->
    <div class="legal-footer">
      ${data.notes ? `<p style="font-weight: 700; color: #18757d; margin-bottom: 6px;">${data.notes}</p>` : ''}
      ${isTvaExempt ? '<p>TVA non applicable, art. 293 B du CGI</p>' : ''}
      <p style="margin-top: 4px;">Entreprise Individuelle Stéphanie ROCQ — 40 rue du Hoccart, 59560 Comines — RCS Lille 821 194 987 00038</p>
      <p>Facture générée automatiquement et acquittée par carte bancaire via le système de paiement sécurisé Stripe.</p>
    </div>
  </div>
</body>
</html>`;
}
