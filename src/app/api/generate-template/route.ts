import { NextRequest, NextResponse } from 'next/server';
import { generateHistoryTemplate, validateDiagnosisInput } from '@/lib/openai';
import type { GenerateTemplateRequest, GenerateTemplateResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: GenerateTemplateRequest = await request.json();
    const { diagnosis, specialty, specialty_hint } = body;
    
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

    console.log('Generating template for:', { 
      diagnosis, 
      originalSpecialty: finalSpecialty, 
      mappedSpecialty: specialtyHint 
    });

    // Generate new template using OpenAI
    const llmResponse = await generateHistoryTemplate(diagnosis, specialtyHint);

    if (!llmResponse.success) {
      return NextResponse.json<GenerateTemplateResponse>({
        success: false,
        error: llmResponse.error || 'Failed to generate template',
      }, { status: 500 });
    }

    // Return the LLM response with generation time
    return NextResponse.json<GenerateTemplateResponse>({
      success: true,
      data: {
        id: `temp_${Date.now()}`,
        diagnosis_id: '',
        diagnosis_name: llmResponse.diagnosis_name,
        specialty: llmResponse.specialty,
        sections: llmResponse.sections,
        generated_by: 'llm',
        llm_model: llmResponse.model_used,
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