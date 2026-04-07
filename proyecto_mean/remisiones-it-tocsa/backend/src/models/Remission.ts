import mongoose, { Schema, Document } from 'mongoose';
import { Counter } from './Counter.js';

export interface IItem {
  description: string;
  brand: string;
  model: string;
  serial: string;
  quantity: number;
  condition: 'nuevo' | 'usado' | 'reparado' | 'dañado';
  observation?: string;
}

export interface IRemission extends Document {
  remissionNumber: string;
  date: Date;
  sender: {
    name: string;
    ruc: string;
    address: string;
  };
  recipient: {
    name: string;
    idNumber: string; // CI o RUC
    positionArea: string;
    location: string;
  };
  items: IItem[];
  transferReason: 'traslado interno' | 'reparación' | 'transformación' | 'exhibición' | 'otros';
  observations?: string;
  authorizedBy: string;
  receivedBy: string;
  pdfGenerated: boolean;
}

const ItemSchema = new Schema<IItem>({
  description: { type: String, required: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  serial: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  condition: { 
    type: String, 
    enum: ['nuevo', 'usado', 'reparado', 'dañado'], 
    default: 'usado',
    required: true 
  },
  observation: { type: String },
});

const RemissionSchema = new Schema<IRemission>({
  remissionNumber: { type: String, unique: true },
  date: { type: Date, default: Date.now, required: true },
  sender: {
    name: { type: String, default: 'TOCSA S.A. - Depto. Informática' },
    ruc: { type: String, default: '80019114-5' },
    address: { type: String, default: 'Av. Guido Boggiani 6990 esq. Mayor Eduardo Vera, Asunción' },
  },
  recipient: {
    name: { type: String, required: true },
    idNumber: { type: String, required: true },
    positionArea: { type: String, required: true },
    location: { type: String, required: true },
  },
  items: [ItemSchema],
  transferReason: { 
    type: String, 
    enum: ['traslado interno', 'reparación', 'transformación', 'exhibición', 'otros'], 
    required: true 
  },
  observations: { type: String },
  authorizedBy: { type: String, required: true },
  receivedBy: { type: String, required: true },
  pdfGenerated: { type: Boolean, default: false },
}, { timestamps: true });

// Pre-save hook to generate automatic remission number: 001-001-0000001
RemissionSchema.pre('save', async function(next) {
  if (!this.isNew) return next();

  try {
    const counter = await Counter.findOneAndUpdate(
      { id: 'remissionNumber' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const sequenceNumber = counter.seq.toString().padStart(7, '0');
    this.remissionNumber = `001-001-${sequenceNumber}`;
    next();
  } catch (error: any) {
    next(error);
  }
});

export const Remission = mongoose.model<IRemission>('Remission', RemissionSchema);
