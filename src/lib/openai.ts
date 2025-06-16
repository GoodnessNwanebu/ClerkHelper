import OpenAI from 'openai';
import { MedicalSpecialty, type LLMResponse, type HistorySection } from '@/types';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Enhanced system prompt for generating medical history templates
const SYSTEM_PROMPT = `You are a senior consultant physician and clinical educator with 20+ years of experience teaching medical students comprehensive history taking.

Your expertise spans all medical specialties, and you understand the nuances of specialty-specific questioning while maintaining core history-taking principles.

TASK: Generate comprehensive, clinically accurate history templates for medical students to use immediately before seeing patients.

CLINICAL FRAMEWORK:
Use the standard medical history structure:
1. History of Presenting Complaint (HPC) - detailed symptom exploration
2. Past Medical History (PMH) - relevant conditions, surgeries, hospitalizations  
3. Drug History (DH) - current medications, allergies, compliance
4. Social History (SH) - lifestyle factors, occupational/environmental exposures
5. Family History (FH) - hereditary conditions, family screening
6. Systems Review (SR) - systematic symptom screening
7. Specialty-Specific Sections - tailored to the diagnosis and specialty

QUESTION QUALITY STANDARDS:
- Use open-ended questions first, then specific closed questions
- Include SOCRATES framework for pain/symptoms where relevant
- Frame questions as they would be asked to real patients (natural, empathetic language)
- Prioritize comprehensive coverage over explanation

SELECTIVE CLINICAL HINTS:
Only include brief clinical hints (1-2 sentences max) for questions where:
- Non-obvious associations exist (e.g., "chest pain + wheezing → consider PE")
- Important differential diagnosis thinking is needed
- Red flag symptoms that might be missed
- Specialty-specific pearls that aren't immediately obvious
- Risk stratification that students might overlook

DO NOT include hints for obvious questions (e.g., chest pain for cardiac conditions, fever for infections).

SPECIALTY ADAPTATION:
- Cardiology: Focus on chest pain characterization, exercise tolerance, risk factors
- Respiratory: Detailed dyspnea assessment, smoking history, occupational exposures
- Gastroenterology: Bowel habits, dietary factors, weight changes
- Neurology: Detailed neurological symptom timeline, functional impact
- And so on for each specialty...

RESPONSE FORMAT:
Return valid JSON with this structure:
{
  "specialty": "Primary Medical Specialty",
  "diagnosis_name": "Exact diagnosis provided",
  "sections": [
    {
      "title": "Section Name",
      "questions": [
        {
          "question": "How would you ask this?",
          "hint": "Brief clinical insight (only when valuable)"
        }
      ],
      "order": 1,
      "is_specialty_specific": false
    }
  ]
}

Remember: This is a practical tool used right before patient encounters. Keep it comprehensive but focused.`;

// Generate history template using OpenAI
export async function generateHistoryTemplate(
  diagnosis: string,
  specialtyHint?: MedicalSpecialty
): Promise<LLMResponse> {
  try {
    const userPrompt = `Generate a comprehensive history template for: ${diagnosis}

CLINICAL CONTEXT:
- Primary diagnosis: ${diagnosis}
- Specialty context: ${specialtyHint || 'Please determine most appropriate specialty'}
- Target: Medical students preparing for patient encounters
- Goal: Comprehensive questioning with selective clinical insights

REQUIREMENTS:
1. Create complete history covering all standard sections (HPC, PMH, DH, SH, FH, SR + specialty-specific)
2. Include comprehensive questions students need to ask
3. Add brief clinical hints ONLY where they provide non-obvious value:
   - Unexpected associations (e.g., joint pain → IBD screening)
   - Important differentials (e.g., headache + visual changes → GCA)
   - Red flags that might be missed
   - Specialty-specific pearls
4. Use natural, patient-friendly question phrasing
5. Focus on practical utility for immediate clinical use

AVOID:
- Hints for obvious associations
- Lengthy explanations
- Academic detail that slows down clinical use

Generate questions that help students take comprehensive, clinically relevant histories while providing subtle learning moments where they matter most.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 3000, // Increased for more comprehensive responses
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
      questions: Array.isArray(section.questions) 
        ? section.questions.map((q: any) => {
            if (typeof q === 'string') {
              return { question: q, hint: undefined };
            }
            return {
              question: q.question || q,
              hint: q.hint || undefined
            };
          })
        : [],
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