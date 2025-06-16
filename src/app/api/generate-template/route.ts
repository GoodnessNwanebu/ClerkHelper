import { NextRequest, NextResponse } from 'next/server';
import { generateHistoryTemplate, validateDiagnosisInput } from '@/lib/openai';
import { supabaseHelpers, createServerSupabaseClient } from '@/lib/supabase';
import { generateId } from '@/lib/utils';
import type { GenerateTemplateRequest, GenerateTemplateResponse, HistoryTemplate } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: GenerateTemplateRequest = await request.json();
    const { diagnosis, specialty_hint, use_cache = true } = body;

    // Validate input
    const validation = validateDiagnosisInput(diagnosis);
    if (!validation.isValid) {
      return NextResponse.json<GenerateTemplateResponse>({
        success: false,
        error: validation.error,
      }, { status: 400 });
    }

    const startTime = Date.now();

    // Check cache first if requested
    let cachedTemplate = null;
    if (use_cache) {
      try {
        cachedTemplate = await supabaseHelpers.getCachedTemplate(diagnosis.toLowerCase());
      } catch (error) {
        console.warn('Cache check failed:', error);
        // Continue without cache
      }
    }

    if (cachedTemplate) {
      // Update access statistics
      try {
        await supabaseHelpers.updateTemplateStats(cachedTemplate.id);
      } catch (error) {
        console.warn('Failed to update template stats:', error);
      }

      // Transform database row to HistoryTemplate
      const template: HistoryTemplate = {
        id: cachedTemplate.id,
        diagnosis_id: cachedTemplate.diagnosis_id || '',
        diagnosis_name: cachedTemplate.diagnosis_name,
        specialty: cachedTemplate.specialty,
        sections: cachedTemplate.sections,
        generated_by: cachedTemplate.generated_by,
        llm_model: cachedTemplate.llm_model,
        created_at: cachedTemplate.created_at,
        updated_at: cachedTemplate.updated_at,
        cached: true,
      };

      return NextResponse.json<GenerateTemplateResponse>({
        success: true,
        data: template,
        from_cache: true,
        generation_time: Date.now() - startTime,
      });
    }

    // Generate new template using OpenAI
    const llmResponse = await generateHistoryTemplate(diagnosis, specialty_hint);

    if (!llmResponse.success) {
      return NextResponse.json<GenerateTemplateResponse>({
        success: false,
        error: llmResponse.error || 'Failed to generate template',
      }, { status: 500 });
    }

    // Create template object
    const template: HistoryTemplate = {
      id: generateId(),
      diagnosis_id: '', // We'll set this later if we implement diagnosis management
      diagnosis_name: llmResponse.diagnosis_name,
      specialty: llmResponse.specialty,
      sections: llmResponse.sections,
      generated_by: 'llm',
      llm_model: llmResponse.model_used,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      cached: false,
    };

    // Cache the template for future use
    try {
      const supabaseClient = createServerSupabaseClient();
      await supabaseClient.from('history_templates').insert([{
        id: template.id,
        diagnosis_name: template.diagnosis_name.toLowerCase(),
        specialty: template.specialty,
        sections: template.sections,
        generated_by: template.generated_by,
        llm_model: template.llm_model,
        cached: true,
        access_count: 1,
        last_accessed: new Date().toISOString(),
      }]);

      template.cached = true;
    } catch (error) {
      console.error('Failed to cache template:', error);
      // Continue without caching - don't fail the request
    }

    return NextResponse.json<GenerateTemplateResponse>({
      success: true,
      data: template,
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