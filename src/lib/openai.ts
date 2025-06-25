import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Generate HPC-focused content using GPT-4o mini
export async function generateHPCContent(
  diagnosis: string,
  specialtyHint?: string,
  patientAge?: string
): Promise<{
  success: boolean;
  data?: {
    diagnosis: string;
    specialty: string;
    presenting_complaints: Array<{
      complaint: string;
      description: string;
      questions: Array<{
        question: string;
        rationale: string;
      }>;
    }>;
  };
  error?: string;
}> {
  try {
    // Map specialty for context
    let specialtyContext = 'general medicine';
    let contextualGuidance = '';
    
    if (specialtyHint === 'obstetrics_gynecology') {
      specialtyContext = 'obstetrics and gynecology';
      contextualGuidance = 'Consider Nigerian healthcare context including common conditions like malaria in pregnancy, limited ultrasound access, traditional birth practices, and family planning challenges. Use sensitive, culturally appropriate language for reproductive health discussions.';
    } else if (specialtyHint === 'pediatrics') {
      specialtyContext = 'pediatrics';
      contextualGuidance = `Consider Nigerian pediatric context including malnutrition, malaria, vaccination schedules, traditional medicine use, and family dynamics in child care.

PEDIATRIC COMMUNICATION (Patient Age: ${patientAge || 'not specified'}):
${patientAge === '0-5' ? '- Direct questions to caregiver - child too young for direct questioning' :
  patientAge === '5-10' ? '- Simple questions to child with caregiver confirmation - use age-appropriate language' :
  patientAge === '11-14' ? '- Mix of direct child questions and caregiver input - respect developing autonomy' :
  patientAge === '14+' ? '- Primarily teen-focused questions with caregiver involvement - treat as young adult' :
  '- Generate age-appropriate mix covering different developmental stages'}

Adapt your questioning style to match this age group appropriately.`;
    } else {
      contextualGuidance = 'Consider Nigerian healthcare context including common tropical diseases, limited diagnostic resources, and traditional medicine practices.';
    }

    const systemPrompt = `You are a senior consultant physician specializing in ${specialtyContext} with extensive experience teaching medical students clinical history taking.

Your task: Generate conversational, patient-friendly questions for the most common presenting complaints, with clinically useful insights that teach pattern recognition.

QUESTION QUALITY STANDARDS:
- Use natural, conversational language with varied phrasing
- Progress from open-ended to specific questions naturally
- Sound like real doctor-patient conversations
- Avoid repetitive question templates - use diverse approaches
- Adapt language appropriately for specialty context

CLINICAL INSIGHTS (CRITICAL):
Instead of obvious statements, provide specific clinical teaching:
- Specific clinical patterns and red flags to watch for
- Differential diagnosis clues and pathophysiology insights
- Practical examination findings to look for
- Clinical pearls and specialty-specific considerations
- What findings would change your management

EXAMPLES OF EXCELLENT VS POOR INSIGHTS:
❌ Poor: "Understanding pain characteristics helps assess severity"
✅ Good: "Bilateral pain is classic for PID as infection spreads. Red flags: tenderness on movement, deep vs superficial pain"

❌ Poor: "Fever indicates systemic involvement" 
✅ Good: "Fever >38.3°C with pelvic pain raises concern for tubo-ovarian abscess. Ask if they've taken medications for fever"

❌ Poor: "Assessing discharge helps determine infection"
✅ Good: "Offensive odor suggests anaerobic infections. Fishy smell may indicate bacterial vaginosis vs typical STI presentation"

${contextualGuidance}

Generate practical, educationally valuable content that teaches students clinical reasoning and pattern recognition.

You must respond in valid JSON format only.`;

    const userPrompt = `For "${diagnosis}", generate the most common presenting complaints with conversational questions and clinically useful insights.

Focus on practical history-taking skills that medical students need in real clinical settings.

Provide your response in this exact JSON format:
{
  "diagnosis": "${diagnosis}",
  "specialty": "${specialtyContext}",
  "presenting_complaints": [
    {
      "complaint": "Name of presenting complaint",
      "description": "Brief clinical description relevant to history-taking", 
      "questions": [
        {
          "question": "Conversational question to ask patient/caregiver - use varied, natural phrasing",
          "rationale": "Specific clinical pattern, red flags, diagnostic clues, or management implications - NOT generic statements"
        }
      ]
    }
  ]
}

Generate at least 4 presenting complaints with 5-7 questions each. Make questions conversational with varied phrasing, and insights clinically specific and educational. Focus on what students need to recognize patterns and make clinical decisions.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.1,
      max_tokens: 3000,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    const parsed = JSON.parse(content);
    
    return {
      success: true,
      data: parsed,
    };
  } catch (error) {
    console.error('Error generating HPC content:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
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