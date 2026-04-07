import { Request, Response } from 'express';
import { Remission } from '../models/Remission.js';
import { generateRemissionPDF } from '../services/pdf.service.js';

export const getRemissions = async (_req: Request, res: Response) => {
  try {
    const remissions = await Remission.find().sort({ createdAt: -1 });
    res.json(remissions);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getRemissionById = async (req: Request, res: Response) => {
  try {
    const remission = await Remission.findById(req.params.id);
    if (!remission) return res.status(404).json({ message: 'Remisión no encontrada' });
    res.json(remission);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createRemission = async (req: Request, res: Response) => {
  try {
    const newRemission = new Remission(req.body);
    const savedRemission = await newRemission.save();
    res.status(201).json(savedRemission);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateRemission = async (req: Request, res: Response) => {
  try {
    const existingRemission = await Remission.findById(req.params.id);
    if (!existingRemission) return res.status(404).json({ message: 'Remisión no encontrada' });
    if (existingRemission.pdfGenerated) {
      return res.status(403).json({ message: 'No se puede modificar una remisión que ya tiene el PDF generado' });
    }

    const updatedRemission = await Remission.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedRemission);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteRemission = async (req: Request, res: Response) => {
  try {
    const existingRemission = await Remission.findById(req.params.id);
    if (!existingRemission) return res.status(404).json({ message: 'Remisión no encontrada' });
    if (existingRemission.pdfGenerated) {
      return res.status(403).json({ message: 'No se puede eliminar una remisión que ya tiene el PDF generado' });
    }

    await Remission.findByIdAndDelete(req.params.id);
    res.json({ message: 'Remisión eliminada con éxito' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const downloadRemissionPDF = async (req: Request, res: Response) => {
  try {
    const remission = await Remission.findById(req.params.id);
    if (!remission) return res.status(404).json({ message: 'Remisión no encontrada' });

    const docDefinition = generateRemissionPDF(remission);
    
    // Configuración para pdfmake (usando fuentes estándar para simplicidad)
    const PdfPrinter = (await import('pdfmake')).default;
    const fonts = {
      Roboto: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique'
      }
    };
    const printer = new PdfPrinter(fonts);
    const pdfDoc = printer.createPdfKitDocument(docDefinition);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Remision-${remission.remissionNumber}.pdf`);

    pdfDoc.pipe(res);
    pdfDoc.end();

    // Marcar como PDF generado
    if (!remission.pdfGenerated) {
      remission.pdfGenerated = true;
      await remission.save();
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
