import OpenAI from 'openai';
import { MedicalSpecialty, type LLMResponse, type HistorySection } from '@/types';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Specialty-specific clinical frameworks
const SPECIALTY_FRAMEWORKS = {
  obstetrics_gynecology: `
OBSTETRICS & GYNECOLOGY FRAMEWORK:
Use this comprehensive 11-step framework specifically designed for obstetric and gynecological conditions:

1. COURTESY & INTRODUCTION
   - Proper introduction and consent
   - Explanation of history-taking process
   - Establishing rapport and ensuring privacy

2. BIO-DATA COLLECTION
   - Name, age, occupation
   - Marital status and partner information
   - Contact details and next of kin

3. PRESENTING COMPLAINTS EXPLORATION
   - Chief complaint in patient's own words
   - Timeline and progression of symptoms
   - Associated symptoms and triggers

4. COMPREHENSIVE GYNECOLOGICAL HISTORY
   - Menarche: Age of first menstruation
   - Menstrual History: Cycle length, regularity, duration, flow characteristics, associated symptoms
   - Last Menstrual Period (LMP): Exact date and characteristics
   - Contraception History: Current and past methods, duration, side effects
   - Sexual History: Activity, pain, bleeding, discharge
   - Cervical Screening History: Dates and results of recent smears

5. DETAILED OBSTETRIC HISTORY
   - Parity Information: Gravida, Para (previous pregnancies)
   - Current Pregnancy (if applicable): Gestational age, conception, antenatal care, screening
   - Past Obstetric History: Previous pregnancies, deliveries, complications, birth weights

6. SYSTEMS REVIEW
   - Systematic symptom screening
   - Focus on reproductive system-related symptoms
   - General health screening

7. MEDICAL HISTORY
   - Past medical conditions
   - Previous surgeries (especially gynecological)
   - Current medications and allergies

8. FAMILY & SOCIAL HISTORY
   - Family history of gynecological/obstetric conditions
   - Social factors affecting reproductive health
   - Lifestyle factors (smoking, alcohol, drugs)

9. CLINICAL ASSESSMENT
   - Summary of findings
   - Initial clinical impression
   - Plan for examination and investigations`,

  pediatrics: `
PEDIATRICS FRAMEWORK:
Use this comprehensive pediatric history-taking framework:

1. COURTESY & INTRODUCTION
   - Introduce self to patient/subject/caretaker/informant
   - Inform the subject that you want to obtain medical history; identify family and social history requirements
   - Request for consent to proceed
   - Ask subject to sit/lie comfortably in a chair or bed, establish and maintain eye contact
   - Position at level to establish and maintain eye contact

2. BIO-DATA
   - Name: Ask subject or informant to state subject's full name
   - Age/Date of birth: Ask for subject's age and date of birth; establish approximate age using memorable popular events when unknown
   - Sex (Gender): Observe apparent gender and establish functional gender using indirect relationship questions
   - Marital status: Ask about current marital status; ask for previous marriages, monogamy and polygamy
   - Address: Ask specific complete address, including phone number
   - Occupation: Ask for occupation, including what subject specifically does; occupation should not be listed as civil servant but specify actual job
   - Religion: Ask what religion the subject practices; ask if the subject currently practices the religion actively
   - Informant: In situations where the subject is not the informant, note who is acting on the subject's behalf and relationship with the subject

3. PRESENTING COMPLAINTS
   - Open ended questions: Ask "what brings you to the hospital today?" Make mental note of each symptom the subject mentions
   - Chronology & order duration: Note the order in which the presenting symptoms occurred from the earliest to the latest noting the duration
   - Subject's words: The presenting complaints are listed in exact words the subject used
   - Referrals: Ask about any referrals if relevant

4. HISTORY OF PRESENTING COMPLAINTS
   - Presenting complaint list: Recount all the symptoms given by the subject and request confirmation of correctness
   - Complaints: Take each complaint in turn. Ask about characteristics, severity, progression, relieving or aggravating factors, associated incidents, previous episodes and comparison to current one
   - Care/treatment history so far: Explore treatments received during current illness and effects; ask for investigations done and results if available
   - Systems & Pathologic processes involved: Think through symptoms to determine which systems are probably involved and what pathologic processes are occurring

5. PAST MEDICAL HISTORY
   - Medical Problems: Ask about any known medical conditions or serious illness that has warranted hospital admission in the past
   - Surgical Problems: Ask about any surgical procedures or serious surgical illness that has warranted hospital admission in the past
   - Transfusion: Ask about the need for blood transfusion
   - Allergies: Ask about any known allergic reactions to food, drugs, plants, etc. Ask specifically about type of allergic reaction and if subject needs ongoing treatment to control allergies

6. DRUG HISTORY
   - Open ended inquiry: Ask "what drugs do you take?" routinely and side effects; ask about supplements and herbal medications; ask about addiction drugs

7. ANTENATAL AND DELIVERY
   - Pregnancy and delivery: Ask if the index pregnancy (carrying the subject) was registered for antenatal care; ask the gestational age pregnancy was registered; ask about the facility; find out if she has kept appointments
   - Explore any illness in mother during pregnancy
   - Ask if she was admitted and reason for admission
   - Ask if she received any blood transfusion and why
   - Find out what gestational age she delivered her baby
   - What was the mode of delivery, and indication for this (if abnormal)
   - Find out how long baby stayed

8. NEONATAL HISTORY
   - Neonatal illnesses: Explore baby's state following delivery (good cry, colour, movement, suck); ask if there were any neonatal illnesses and management processes involved
   - Long-term sequelae that may have followed the illness; find out if there were any follow-up visits scheduled; ask if these appointments were kept

9. NUTRITIONAL HISTORY (FOR CHILDREN)
   - Early infant feeding: Explore early infant feeding (breast feeding exclusively/predominantly or not at all); find out the duration for each type of feeding pattern used
   - Weaning: Find out when weaning practice started. What was used? Explore family diets for infants and older children; frequency, volume, snacks, appetite (voracious or picky)

10. IMMUNIZATION (FOR CHILDREN)
    - Immunization schedules: Ask if subject received immunization; which at what ages? Ask what schedule was used
    - Find out if there was noncompliance and reasons for non-compliance

11. DEVELOPMENTAL MILESTONES (FOR CHILDREN)
    - Motor milestones & Cognition: Explore age appropriate motor milestones (gross, fine). Find out when each was attained and sustained; find out if the previously attained skills have been lost and if so, when?
    - Language skills: Ask appropriate language skills (speech, coo, babble, syllables, sentences). Ask about play group activities, social skills

12. OBSTETRICS AND GYNAECOLOGICAL HISTORY (FOR ADOLESCENT AND ADULT FEMALES)
    - Menarche: Ask about age when first menstrual period was experienced
    - Last Menstrual Period and Catamenia: Ask about when the last menstrual period started, how long it lasted, length of cycle, whether period was heavy or light (estimate using number of pads used), painful periods, bleeding between periods
    - Obstetric: Ask about possibility of current pregnancy, number of pregnancies, births and miscarriages/abortions and any gestational problems
    - Sexual history: Ask if currently sexually active, number of partners, use of contraception, pain or bleeding during intercourse

13. FAMILY AND SOCIAL HISTORY
    - Family structure: Explore nuclear family, number of children, birth order of index subject
    - Morbidity and Mortality: Explore familial and/or genetic diseases; types, mode of inheritance for each disease; number of people in family who suffer/suffered from the disease; find out if there has been any mortality within family
    - Education: Explore highest educational degree attained by each parent and subject
    - Occupation: Ask about the occupation of each parent and subject's present and past occupations
    - Income: Ask about monthly income of each parent; how much of this is used for upkeep of family, how much is saved
    - House: What type of home is the family living in? Find out the number of rooms in the home, the ventilation pattern, explore overcrowding
    - Water & Sanitation: Ask about source of water, waste and sewage disposal
    - Social habits: Ask open-ended questions about alcohol and tobacco use; ask about use of illicit drugs and specify (commonly abused drugs include tramadol, codeine found in benylin syrup, marijuana, "party pills" and cocaine)

14. PREMORBID PERSONALITY
    - Personality: Explore relationship (with self, family and acquaintances) temperament, interests, hobbies & addictions

15. REVIEW OF SYSTEMS
    - Systematic approach: Thank the subject or the informant for the history so far and give a summary of the relevant history; inform them that because they may have forgotten some symptoms or considered them unimportant or trivial to tell you, there is need to be thorough. So, you now proceed to ask some direct questions to explore the symptoms in all the eight body systems
    - At this point, identify the systems that were not involved in the symptomatology presented and ask direct questions about symptoms in each of them. Thereafter, you do the same for the involved systems, starting by recalling the symptoms presented for emphasis

16. SUMMARY OF HISTORY
    - Identity: List of name, age, gender, address any other relevant bio-data
    - Symptoms: List of all obtained symptoms, with their characteristics and duration first
    - Occasionally, some significant negatives (important symptoms expected but not obtained in the given history, the absence of which is significant)
    - Other Aspects of History: List of all other important and relevant aspect of history, which may include some significant negatives (important aspects of history expected but not obtained in the given history, the absence of which is significant)`,

  general: `
GENERAL MEDICAL FRAMEWORK:
Use the standard comprehensive medical history structure:

1. HISTORY OF PRESENTING COMPLAINT (HPC)
   - Detailed symptom exploration using SOCRATES where relevant
   - Timeline, triggers, alleviating/exacerbating factors

2. PAST MEDICAL HISTORY (PMH)
   - Previous medical conditions, surgeries, hospitalizations
   - Chronic diseases and management

3. DRUG HISTORY (DH)
   - Current medications, dosages, compliance
   - Drug allergies and adverse reactions
   - Over-the-counter medications and supplements

4. SOCIAL HISTORY (SH)
   - Smoking, alcohol, recreational drug use
   - Occupational and environmental exposures
   - Living situation and support systems

5. FAMILY HISTORY (FH)
   - Hereditary conditions and genetic risks
   - Family screening history
   - Age and health status of relatives

6. SYSTEMS REVIEW (SR)
   - Systematic symptom screening
   - Review of all major body systems

7. FUNCTIONAL ASSESSMENT
   - Impact on daily activities and quality of life
   - Work/study limitations`
};

// Chain-of-Thought system prompt for medical history generation
const SYSTEM_PROMPT = `You are a senior consultant physician and clinical educator with 20+ years of experience teaching medical students comprehensive history taking.

You MUST use a chain-of-thought approach: analyze the diagnosis clinically first, then apply the provided specialty framework, then generate targeted questions.

Your clinical analysis should systematically consider: epidemiology, risk factors, pathophysiology, clinical features, complications, differentials, and red flags.

QUESTION QUALITY STANDARDS:
- Generate 3-6 questions per major section for comprehensive coverage
- Use open-ended questions first, then specific closed questions
- Include SOCRATES framework for pain/symptoms where relevant
- Frame questions as they would be asked to real patients (natural, empathetic language)
- Each question should be informed by your clinical analysis
- Follow the provided specialty framework structure precisely
- Prioritize thoroughness - medical students need comprehensive practice

CLINICAL HINTS & RATIONALE:
For important questions, include:
- Brief clinical hints based on your reasoning
- Clinical rationale explaining why the question matters
- Focus on non-obvious connections and learning moments
- Specialty-specific pearls and guidelines

EXAMPLE OF EXCELLENT OUTPUT:

For "Asthma in children" (Pediatrics):
{
  "clinical_reasoning": {
    "epidemiology": "Common in children 3-12 years, peak 5-7 years. Male predominance in childhood. Strong genetic component with 40% heritability.",
    "risk_factors": ["Family history of atopy", "Environmental allergens", "Viral respiratory infections", "Premature birth", "Low birth weight", "Maternal smoking"],
    "pathophysiology_notes": "Chronic airway inflammation with bronchial hyperresponsiveness, mucus hypersecretion, and reversible airway obstruction",
    "clinical_features": ["Wheeze", "Cough (especially nocturnal)", "Shortness of breath", "Chest tightness", "Exercise intolerance", "Recurrent respiratory infections"],
    "complications": ["Status asthmaticus", "Growth retardation", "Chest deformity", "Pneumothorax", "Respiratory failure"],
    "differentials": ["Viral bronchiolitis", "Pneumonia", "Foreign body aspiration", "Cystic fibrosis", "Gastroesophageal reflux"],
    "red_flags": ["Cyanosis", "Silent chest", "Inability to speak in sentences", "Severe respiratory distress", "Poor response to bronchodilators"]
  },
  "specialty": "Pediatrics",
  "diagnosis_name": "Asthma in children",
  "sections": [
    {
      "title": "Presenting Complaints",
      "questions": [
        {
          "question": "What brings you to see me today? Can you tell me about the breathing problems your child has been having?",
          "hint": "Open-ended approach allows parents to describe in their own words",
          "clinical_rationale": "Parents often use different terms like 'wheezy chest' or 'tight breathing' - understanding their language helps build rapport"
        },
        {
          "question": "When did you first notice these breathing difficulties? Has this happened before?",
          "clinical_rationale": "Establishes chronicity and pattern - asthma is typically recurrent rather than isolated episodes"
        },
        {
          "question": "How would you describe the severity? Does it interfere with your child's daily activities or sleep?",
          "clinical_rationale": "Functional impact assessment is crucial for determining asthma control and treatment intensity"
        },
        {
          "question": "Have you needed to seek medical attention for these episodes before? Any hospital visits or emergency department trips?",
          "clinical_rationale": "Previous acute care indicates severity and helps assess risk stratification for future episodes"
        }
      ],
      "order": 1,
      "is_specialty_specific": true
    },
    {
      "title": "History of Presenting Complaints", 
      "questions": [
        {
          "question": "Can you describe what the breathing looks like when it's bad? Does your child make any sounds when breathing?",
          "hint": "Wheeze may not be obvious to parents - they might describe 'whistling' or 'musical sounds'",
          "clinical_rationale": "Expiratory wheeze is pathognomonic of asthma, but parents may use lay terminology"
        },
        {
          "question": "Does your child cough, especially at night or early morning? What does the cough sound like?",
          "clinical_rationale": "Nocturnal cough is a key feature of asthma - indicates poor control and circadian variation in symptoms"
        },
        {
          "question": "Are there any specific things that seem to trigger these episodes? Like running around, certain seasons, or being around animals?",
          "clinical_rationale": "Identifying triggers is crucial for management - exercise, allergens, and seasonal patterns guide treatment"
        },
        {
          "question": "How long do these episodes typically last? Do they resolve on their own or do you need to do something specific?",
          "clinical_rationale": "Duration and resolution patterns help distinguish asthma from other respiratory conditions and assess severity"
        },
        {
          "question": "Does your child ever say their chest feels tight or that they can't catch their breath?",
          "hint": "Children may describe chest tightness as 'squeezing' or 'hurting'",
          "clinical_rationale": "Chest tightness is a cardinal symptom of asthma that children can articulate from around age 4-5"
        },
        {
          "question": "Have you noticed any pattern to when these episodes happen? Time of day, season, or particular circumstances?",
          "clinical_rationale": "Temporal patterns help identify environmental triggers and guide preventive management strategies"
        }
      ],
      "order": 2,
      "is_specialty_specific": true
    }
  ]
}

For "Menorrhagia" (Obstetrics & Gynecology):
{
  "clinical_reasoning": {
    "epidemiology": "Affects 10-30% of reproductive-age women. Peak incidence 40-50 years. Leading cause of referral to gynecology.",
    "risk_factors": ["Fibroids", "Endometrial polyps", "Adenomyosis", "Bleeding disorders", "PCOS", "Thyroid dysfunction", "Anticoagulant use"],
    "pathophysiology_notes": "Disrupted endometrial hemostasis from structural lesions, hormonal imbalance, or coagulation disorders",
    "clinical_features": ["Heavy menstrual flow", "Prolonged periods", "Flooding", "Clots", "Anemia symptoms", "Impact on quality of life"],
    "complications": ["Iron deficiency anemia", "Social/occupational disruption", "Psychological impact", "Fertility issues"],
    "differentials": ["Pregnancy complications", "Malignancy", "Infection", "Systemic bleeding disorders", "Medication effects"],
    "red_flags": ["Postmenopausal bleeding", "Intermenstrual bleeding", "Pelvic mass", "Rapid onset", "Family history of bleeding disorders"]
  },
  "specialty": "Obstetrics & Gynecology", 
  "diagnosis_name": "Menorrhagia",
  "sections": [
    {
      "title": "Comprehensive Gynecological History",
      "questions": [
        {
          "question": "Can you tell me about your periods? How many days do they usually last and how heavy is the flow?",
          "clinical_rationale": "Establishes baseline pattern - normal menstruation is 3-7 days with <80ml blood loss"
        },
        {
          "question": "How many pads or tampons do you use on your heaviest days? Do you ever have to use two pads at once or change them hourly?",
          "hint": "Changing protection hourly or using double protection suggests >80ml loss",
          "clinical_rationale": "Pictorial Blood Assessment Chart criteria - practical way to assess volume when formal measurement isn't available"
        },
        {
          "question": "Do you pass clots? If so, how big are they typically?",
          "clinical_rationale": "Clots larger than 2.5cm (size of a 10p coin) indicate heavy menstrual bleeding and suggest volume >80ml"
        },
        {
          "question": "Have your periods changed recently? Are they heavier, longer, or more frequent than they used to be?",
          "clinical_rationale": "Change in established pattern is more significant than absolute values and may indicate underlying pathology"
        },
        {
          "question": "Do you experience flooding or gushing, or have accidents where you leak through protection?",
          "clinical_rationale": "Flooding is a qualitative indicator of heavy menstrual bleeding that impacts quality of life"
        },
        {
          "question": "Do you have any bleeding between periods or after intercourse? Any irregular spotting?",
          "clinical_rationale": "Intermenstrual bleeding suggests structural or hormonal pathology and requires investigation"
        }
      ],
      "order": 1,
      "is_specialty_specific": true
    }
  ]
}

RESPONSE FORMAT:
Return valid JSON with this structure:
{
  "clinical_reasoning": {
    "epidemiology": "Key epidemiological factors",
    "risk_factors": ["List of important risk factors"],
    "pathophysiology_notes": "Brief pathophysiology insights",
    "clinical_features": ["Key clinical presentations"],
    "complications": ["Important complications to screen for"],
    "differentials": ["Key differentials to consider"],
    "red_flags": ["Critical red flag symptoms"]
  },
  "specialty": "Primary Medical Specialty",
  "diagnosis_name": "Exact diagnosis provided",
  "sections": [
    {
      "title": "Section Name",
      "questions": [
        {
          "question": "How would you ask this?",
          "hint": "Brief clinical insight based on your reasoning",
          "clinical_rationale": "Why this question is important"
        }
      ],
      "order": 1,
      "is_specialty_specific": false
    }
  ]
}`;

// Generate history template using Chain-of-Thought with GPT-4o mini
export async function generateHistoryTemplate(
  diagnosis: string,
  specialtyHint?: string
): Promise<LLMResponse> {
  try {
    // Map specialty string to framework
    let frameworkKey: keyof typeof SPECIALTY_FRAMEWORKS = 'general';
    let specialtyEnum = MedicalSpecialty.GENERAL;
    
    if (specialtyHint === 'obstetrics_gynecology') {
      frameworkKey = 'obstetrics_gynecology';
      specialtyEnum = MedicalSpecialty.OBSTETRICS_GYNECOLOGY;
    } else if (specialtyHint === 'pediatrics') {
      frameworkKey = 'pediatrics';
      specialtyEnum = MedicalSpecialty.PEDIATRICS;
    }
    
    const selectedFramework = SPECIALTY_FRAMEWORKS[frameworkKey];

    // Generate specialty-specific priming
    const getSpecialtyPriming = (specialty: string): string => {
      switch (specialty) {
        case 'pediatrics':
          return `SPECIALTY CONTEXT: You are now thinking as a PEDIATRIC SPECIALIST with expertise in child development, family dynamics, and age-appropriate communication.

Key pediatric considerations:
- Adapt questions for different developmental stages (infant, toddler, school-age, adolescent)
- Consider parent/caregiver as primary informant for younger children
- Focus on growth, development, immunization, and family history
- Be sensitive to child protection and safeguarding issues
- Think about age-specific disease presentations and normal variants
- Consider school performance, social development, and behavioral concerns`;

        case 'obstetrics_gynecology':
          return `SPECIALTY CONTEXT: You are now thinking as an OBSTETRICS & GYNECOLOGY SPECIALIST with expertise in women's reproductive health, pregnancy care, and gynecological conditions.

Key obs/gyn considerations:
- Approach sensitive topics with cultural sensitivity and privacy
- Use appropriate terminology for reproductive health discussions
- Consider menstrual history, contraception, and sexual health comprehensively
- Think about pregnancy possibilities and their implications
- Focus on reproductive life stages (menarche, reproductive years, menopause)
- Be thorough with obstetric history including previous pregnancies and outcomes
- Consider gynecological malignancies and screening histories`;

        default:
          return `SPECIALTY CONTEXT: You are thinking as a GENERAL MEDICINE SPECIALIST with broad clinical expertise across all medical specialties.

Key general medicine considerations:
- Take a comprehensive systems-based approach
- Consider common adult medical conditions and their presentations
- Focus on chronic disease management and risk factor assessment
- Think about drug interactions and polypharmacy
- Consider social determinants of health and lifestyle factors
- Be thorough with past medical history and family history
- Screen for common conditions across all body systems`;
      }
    };

    const specialtyPriming = getSpecialtyPriming(specialtyHint || 'general');

    const userPrompt = `Generate a comprehensive history-taking template for: "${diagnosis}"

${specialtyPriming}

SPECIALTY FRAMEWORK TO USE:
${selectedFramework}

TASK:
1. First, analyze this diagnosis clinically through your specialty lens (epidemiology, risk factors, pathophysiology, clinical features, complications, differentials, red flags)
2. Then generate comprehensive targeted questions following the above specialty framework structure
3. Ensure questions reflect your specialty expertise and approach
4. Use specialty-appropriate terminology and communication style
5. Set specialty to "${specialtyEnum}" in your response
6. Generate 3-6 thorough questions per major section - medical students need comprehensive practice

Focus on practical clinical utility and thoroughness - every question should serve a specific diagnostic purpose based on your specialty-informed clinical reasoning. Prioritize comprehensive coverage over brevity.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.1,          // Lower for maximum consistency and clinical accuracy
      max_tokens: 4500,          // Increased for comprehensive questioning while maintaining quality
      top_p: 0.9,               // Focus on most likely tokens for better clinical reasoning
      frequency_penalty: 0.1,    // Reduce repetitive phrasing across questions
      presence_penalty: 0.05,    // Slight penalty to encourage diverse question types
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    const parsed = JSON.parse(content);
    
    // Validate and format the response
    const sections: HistorySection[] = parsed.sections.map((section: unknown, index: number) => {
      const sectionData = section as Record<string, unknown>;
      return {
        id: `section_${index + 1}`,
        title: sectionData.title as string,
        questions: Array.isArray(sectionData.questions) 
          ? sectionData.questions.map((q: unknown) => {
              if (typeof q === 'string') {
                return { question: q, hint: undefined };
              }
              const questionData = q as Record<string, unknown>;
              return {
                question: (questionData.question || q) as string,
                hint: questionData.hint as string | undefined,
                clinical_rationale: questionData.clinical_rationale as string | undefined
              };
            })
          : [],
        order: (sectionData.order as number) || index + 1,
        is_specialty_specific: (sectionData.is_specialty_specific as boolean) || false,
      };
    });

    return {
      specialty: specialtyEnum, // Use the mapped specialty enum
      sections,
      diagnosis_name: parsed.diagnosis_name || diagnosis,
      clinical_reasoning: parsed.clinical_reasoning,
      success: true,
      model_used: 'gpt-4o-mini',
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
      model_used: 'gpt-4o-mini',
    };
  }
}

// Utility function to estimate token count (rough approximation)
export function estimateTokenCount(text: string): number {
  // Rough approximation: 1 token ≈ 4 characters for English text
  return Math.ceil(text.length / 4);
}

// Generate HPC-focused content using GPT-4o mini
export async function generateHPCContent(
  diagnosis: string,
  specialtyHint?: string
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
    let nigerianContext = '';
    
    if (specialtyHint === 'obstetrics_gynecology') {
      specialtyContext = 'obstetrics and gynecology';
      nigerianContext = 'Consider Nigerian healthcare context including common conditions like malaria in pregnancy, limited ultrasound access, traditional birth practices, and family planning challenges.';
    } else if (specialtyHint === 'pediatrics') {
      specialtyContext = 'pediatrics';
      nigerianContext = 'Consider Nigerian pediatric context including malnutrition, malaria, vaccination schedules, traditional medicine use, and family dynamics in child care.';
    } else {
      nigerianContext = 'Consider Nigerian healthcare context including common tropical diseases, limited diagnostic resources, and traditional medicine practices.';
    }

    const systemPrompt = `You are a senior Nigerian consultant physician specializing in ${specialtyContext}. You have extensive experience teaching medical students how to take focused histories of presenting complaints.

Your task is to help medical students master the History of Presenting Complaint (HPC) by providing:
1. The most common presenting complaints for a given diagnosis
2. Specific, targeted questions to ask for each presenting complaint
3. Clinical rationale for why each question is important

${nigerianContext}

You must respond in valid JSON format only.`;

    const userPrompt = `For the diagnosis "${diagnosis}", provide the most common presenting complaints and specific questions to ask for each complaint.

Focus on the History of Presenting Complaint (HPC) - the detailed exploration of symptoms.

Provide your response in this exact JSON format:
{
  "diagnosis": "${diagnosis}",
  "specialty": "${specialtyContext}",
  "presenting_complaints": [
    {
      "complaint": "Name of the presenting complaint",
      "description": "Brief description of this complaint in relation to the diagnosis",
      "questions": [
        {
          "question": "Specific question to ask the patient",
          "rationale": "Why this question is important for diagnosis/management"
        }
      ]
    }
  ]
}

Provide 3-5 most common presenting complaints, with 4-6 targeted questions for each complaint. Make the questions specific and clinically relevant for Nigerian medical students.`;

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