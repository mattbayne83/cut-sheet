import { GoogleGenAI } from '@google/genai'
import type { ExtractionResult } from '../types/plyplan'

export async function extractDimensionsFromPhoto(
  base64Data: string,
  mimeType: string,
  apiKey: string
): Promise<ExtractionResult> {
  const ai = new GoogleGenAI({ apiKey })

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: [
      {
        inlineData: { mimeType, data: base64Data },
      },
      {
        text: `You are analyzing a hand-drawn woodworking sketch with dimensions written on it.
Extract every piece/part with its dimensions and quantity.

Return ONLY valid JSON in this exact format (no markdown, no code fences):
{
  "pieces": [
    { "label": "Side Panel", "width": 24, "height": 36, "quantity": 2 }
  ],
  "confidence": "high",
  "notes": ""
}

Rules:
- All dimensions must be in inches. Convert from feet if needed (e.g., 4' = 48").
- If a dimension is written as a fraction like 3-1/2, convert to decimal (3.5).
- Width = the horizontal measurement, Height = the vertical measurement. If orientation is ambiguous, put the larger dimension as width.
- If quantity is not specified, assume 1.
- Label each piece descriptively based on any text in the sketch (e.g., "Shelf Side", "Back Panel").
- If a dimension is unclear, use your best estimate and set confidence to "medium" or "low".
- The "notes" field should mention any unclear dimensions or assumptions you made.`,
      },
    ],
  })

  const text = response.text ?? ''
  // Strip potential markdown code fences
  const jsonStr = text.replace(/```(?:json)?\n?/g, '').replace(/```/g, '').trim()
  return JSON.parse(jsonStr) as ExtractionResult
}
