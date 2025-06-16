import OpenAI from 'openai';
import { MedicalSpecialty, type LLMResponse, type HistorySection } from '@/types';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// System prompt for generating medical history templates
const SYSTEM_PROMPT = `You are a senior clinical tutor helping medical students take complete histories from patients. 

Your task is to generate comprehensive, structured history templates based on a given diagnosis. 

Guidelines:
1. Infer the most relevant clinical specialty for the diagnosis
2. Generate specialty-appropriate history sections
3. Include comprehensive, clinically relevant questions under each section
4. Return response in the exact JSON format specified
5. Ensure all questions are practical and commonly used in clinical practice
6. Include both general sections and specialty-specific sections when appropriate

Always respond with valid JSON in this exact format:
{
  "specialty": "Medical Specialty Name",
  "diagnosis_name": "Exact diagnosis provided",
  "sections": [
    {
      "title": "Section Name",
      "questions": ["Question 1?", "Question 2?"],
      "order": 1,
      "is_specialty_specific": false
    }
  ]
}`;

// Generate history template using OpenAI
export async function generateHistoryTemplate(
  diagnosis: string,
  specialtyHint?: MedicalSpecialty
): Promise<LLMResponse> {
  try {
    const userPrompt = `Generate a complete history template for a patient diagnosed with: ${diagnosis}${
      specialtyHint ? `\n\nSpecialty context: ${specialtyHint}` : ''
    }

Please provide a comprehensive list of questions organized by appropriate history sections. Ensure the template is practical for real clinical use.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 2000,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    const parsed = JSON.parse(content);
    
    // Validate and format the response
    const sections: HistorySection[] = parsed.sections.map((section: any, index: number) => ({
      id: `section_${index + 1}`,
      title: section.title,
      questions: Array.isArray(section.questions) ? section.questions : [],
      order: section.order || index + 1,
      is_specialty_specific: section.is_specialty_specific || false,
    }));

    // Determine specialty
    const specialtyName = parsed.specialty;
    
    // Map the LLM response to our enum
    const specialty = Object.values(MedicalSpecialty).find(
      (s) => s.toLowerCase() === specialtyName.toLowerCase()
    ) || MedicalSpecialty.GENERAL;

    return {
      specialty,
      sections,
      diagnosis_name: parsed.diagnosis_name || diagnosis,
      success: true,
      model_used: 'gpt-4o',
      tokens_used: completion.usage?.total_tokens,
    };
  } catch (error) {
    console.error('Error generating history template:', error);
    
    return {
      specialty: MedicalSpecialty.GENERAL,
      sections: [],
      diagnosis_name: diagnosis,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      model_used: 'gpt-4o',
    };
  }
}

// Utility function to estimate token count (rough approximation)
export function estimateTokenCount(text: string): number {
  // Rough approximation: 1 token ≈ 4 characters for English text
  return Math.ceil(text.length / 4);
}

// Function to validate diagnosis input
export function validateDiagnosisInput(diagnosis: string): {
  isValid: boolean;
  error?: string;
} {
  if (!diagnosis || diagnosis.trim().length === 0) {
    return { isValid: false, error: 'Diagnosis cannot be empty' };
  }

  if (diagnosis.trim().length < 2) {
    return { isValid: false, error: 'Diagnosis must be at least 2 characters long' };
  }

  if (diagnosis.length > 200) {
    return { isValid: false, error: 'Diagnosis must be less than 200 characters' };
  }

  // Check for potentially harmful content
  const harmfulPatterns = [
    /\b(hack|exploit|attack|virus|malware)\b/i,
    /\b(sql|script|javascript|php)\b/i,
  ];

  if (harmfulPatterns.some((pattern) => pattern.test(diagnosis))) {
    return { isValid: false, error: 'Invalid diagnosis format' };
  }

  return { isValid: true };
} 