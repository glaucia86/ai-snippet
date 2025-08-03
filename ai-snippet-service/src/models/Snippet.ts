import mongoose, { Document, Schema } from 'mongoose';

export interface ISnippet extends Document {
  text: string;
  summary: string;
  createdAt: Date;
  updatedAt: Date;
}

const SnippetSchema = new Schema({
  text: {
    type: String,
    required: [true, 'Text is required'],
    trim: true,
    minlength: [1, 'Text cannot be empty'],
    maxlength: [10000, 'Text cannot exceed 10000 characters']
  },
  summary: {
    type: String,
    required: [true, 'Summary is required'],
    trim: true,
    minlength: [1, 'Summary cannot be empty'],
    maxlength: [500, 'Summary cannot exceed 500 characters']
  }
}, {
  timestamps: true,
});

SnippetSchema.index({ createdAt: -1 });

export const Snippet = mongoose.model<ISnippet>('Snippet', SnippetSchema);