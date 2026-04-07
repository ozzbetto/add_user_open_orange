import { IRemission } from '../models/Remission.js';
import { TDocumentDefinitions } from 'pdfmake/interfaces.js';

export const generateRemissionPDF = (remission: IRemission): TDocumentDefinitions => {
  const tableHeader = [
    { text: 'Descripción', style: 'tableHeader' },
    { text: 'Marca', style: 'tableHeader' },
    { text: 'Modelo', style: 'tableHeader' },
    { text: 'Nro. Serie', style: 'tableHeader' },
    { text: 'Cant.', style: 'tableHeader' },
    { text: 'Estado', style: 'tableHeader' },
  ];

  const tableRows = remission.items.map(item => [
    item.description,
    item.brand,
    item.model,
    item.serial,
    item.quantity.toString(),
    item.condition,
  ]);

  const definition: TDocumentDefinitions = {
    pageSize: 'A4',
    pageMargins: [40, 60, 40, 60],
    content: [
      {
        columns: [
          {
            width: '*',
            stack: [
              { text: remission.sender.name, style: 'headerTitle' },
              { text: `RUC: ${remission.sender.ruc}`, style: 'headerSub' },
              { text: remission.sender.address, style: 'headerSub' },
            ],
          },
          {
            width: 'auto',
            stack: [
              { text: 'NOTA DE REMISIÓN', style: 'docType' },
              { text: `NRO: ${remission.remissionNumber}`, style: 'docNumber' },
              { text: `Fecha: ${remission.date.toLocaleDateString()}`, style: 'headerSub' },
            ],
            alignment: 'right',
          },
        ],
      },
      { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, lineWidth: 1, lineColor: '#cccccc' }] },
      { text: '\n' },
      {
        columns: [
          {
            width: '50%',
            stack: [
              { text: 'DESTINATARIO:', style: 'sectionLabel' },
              { text: remission.recipient.name, style: 'infoTextBold' },
              { text: `CI/RUC: ${remission.recipient.idNumber}`, style: 'infoText' },
              { text: `Cargo/Área: ${remission.recipient.positionArea}`, style: 'infoText' },
              { text: `Ubicación: ${remission.recipient.location}`, style: 'infoText' },
            ],
          },
          {
            width: '50%',
            stack: [
              { text: 'MOTIVO TRASLADO:', style: 'sectionLabel' },
              { text: remission.transferReason.toUpperCase(), style: 'infoTextBold' },
              { text: '\n' },
              { text: 'OBSERVACIONES:', style: 'sectionLabel' },
              { text: remission.observations || 'Sin observaciones adicionales.', style: 'infoText' },
            ],
          },
        ],
      },
      { text: '\n' },
      {
        table: {
          headerRows: 1,
          widths: ['*', 'auto', 'auto', 'auto', 35, 50],
          body: [tableHeader, ...tableRows],
        },
        layout: 'lightHorizontalLines',
      },
      { text: '\n\n\n' },
      {
        columns: [
          {
            stack: [
              { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 150, y2: 0, lineWidth: 1 }] },
              { text: `Autorizado por: ${remission.authorizedBy}`, style: 'signature' },
            ],
            alignment: 'center',
          },
          {
            stack: [
              { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 150, y2: 0, lineWidth: 1 }] },
              { text: `Recibido por: ${remission.receivedBy}`, style: 'signature' },
            ],
            alignment: 'center',
          },
        ],
      },
    ],
    styles: {
      headerTitle: { fontSize: 14, bold: true, color: '#1a56db' },
      headerSub: { fontSize: 9, color: '#4b5563' },
      docType: { fontSize: 16, bold: true, color: '#1f2937' },
      docNumber: { fontSize: 12, bold: true, color: '#e02424' },
      sectionLabel: { fontSize: 8, bold: true, color: '#6b7280' },
      infoText: { fontSize: 10, color: '#111827' },
      infoTextBold: { fontSize: 10, bold: true, color: '#111827' },
      tableHeader: { fontSize: 9, bold: true, color: '#ffffff', fillColor: '#1a56db', margin: [5, 2, 5, 2] },
      signature: { fontSize: 9, margin: [0, 5, 0, 0] },
    },
    defaultStyle: {
      font: 'Roboto',
    },
  };

  return definition;
};
