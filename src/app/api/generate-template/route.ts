import { NextRequest, NextResponse } from 'next/server';
import { generateHPCContent, validateDiagnosisInput } from '@/lib/openai';
import type { GenerateTemplateRequest, GenerateTemplateResponse } from '@/types';
import { MedicalSpecialty } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: GenerateTemplateRequest = await request.json();
    const { diagnosis, specialty, specialty_hint, patient_age } = body;
    
    // Use specialty parameter if provided, otherwise fall back to specialty_hint
    const finalSpecialty = specialty || specialty_hint;

    // Validate input
    const validation = validateDiagnosisInput(diagnosis);
    if (!validation.isValid) {
      return NextResponse.json<GenerateTemplateResponse>({
        success: false,
        error: validation.error,
      }, { status: 400 });
    }

    const startTime = Date.now();

    // Map specialty from frontend values to backend format
    let specialtyHint: string | undefined;
    
    if (finalSpecialty === 'pediatrics') {
      specialtyHint = 'pediatrics';
    } else if (finalSpecialty === 'obs_gyn') {
      specialtyHint = 'obstetrics_gynecology';
    } else {
      // Default to general or undefined for general cases
      specialtyHint = undefined;
    }

    console.log('Generating PC/HPC content for:', { 
      diagnosis, 
      originalSpecialty: finalSpecialty, 
      mappedSpecialty: specialtyHint,
      patientAge: patient_age 
    });

    // Generate new PC/HPC content using OpenAI with age parameter
    const hpcResponse = await generateHPCContent(diagnosis, specialtyHint, patient_age);

    if (!hpcResponse.success) {
      return NextResponse.json<GenerateTemplateResponse>({
        success: false,
        error: hpcResponse.error || 'Failed to generate PC/HPC content',
      }, { status: 500 });
    }

    // Transform HPC response to match existing template structure
    const sections = hpcResponse.data?.presenting_complaints.map((complaint, index) => ({
      id: `complaint_${index + 1}`,
      title: complaint.complaint,
      questions: complaint.questions.map(q => ({
        question: q.question,
        clinical_rationale: q.rationale
      })),
      order: index + 1,
      is_specialty_specific: true
    })) || [];

    // Map specialty string to enum value
    let specialtyEnum: MedicalSpecialty;
    if (specialtyHint === 'obstetrics_gynecology') {
      specialtyEnum = MedicalSpecialty.OBSTETRICS_GYNECOLOGY;
    } else if (specialtyHint === 'pediatrics') {
      specialtyEnum = MedicalSpecialty.PEDIATRICS;
    } else {
      specialtyEnum = MedicalSpecialty.GENERAL;
    }

    // Return the transformed response
    return NextResponse.json<GenerateTemplateResponse>({
      success: true,
      data: {
        id: `temp_${Date.now()}`,
        diagnosis_id: '',
        diagnosis_name: hpcResponse.data?.diagnosis || diagnosis,
        specialty: specialtyEnum,
        sections: sections,
        generated_by: 'llm',
        llm_model: 'gpt-4o-mini',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        cached: false,
      },
      from_cache: false,
      generation_time: Date.now() - startTime,
    });

  } catch (error) {
    console.error('Generate template error:', error);
    
    return NextResponse.json<GenerateTemplateResponse>({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to generate templates.' },
    { status: 405 }
  );
}

// Handle preflight requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
} 