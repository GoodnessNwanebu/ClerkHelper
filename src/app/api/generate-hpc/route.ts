import { NextRequest, NextResponse } from 'next/server';
import { generateHPCContent, validateDiagnosisInput } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { diagnosis, specialty } = body;

    // Validate input
    const validation = validateDiagnosisInput(diagnosis);
    if (!validation.isValid) {
      return NextResponse.json({
        success: false,
        error: validation.error,
      }, { status: 400 });
    }

    const startTime = Date.now();

    // Map specialty from frontend values to backend format
    let specialtyHint: string | undefined;
    
    if (specialty === 'pediatrics') {
      specialtyHint = 'pediatrics';
    } else if (specialty === 'obs_gyn') {
      specialtyHint = 'obstetrics_gynecology';
    } else {
      specialtyHint = undefined;
    }

    console.log('Generating HPC content for:', { 
      diagnosis, 
      originalSpecialty: specialty, 
      mappedSpecialty: specialtyHint 
    });

    // Generate HPC content using OpenAI
    const response = await generateHPCContent(diagnosis, specialtyHint);

    if (!response.success) {
      return NextResponse.json({
        success: false,
        error: response.error || 'Failed to generate HPC content',
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: response.data,
      generation_time: Date.now() - startTime,
    });

  } catch (error) {
    console.error('Generate HPC error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to generate HPC content.' },
    { status: 405 }
  );
} 