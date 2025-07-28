import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

export async function GET() {
  try {
    // Create sample data for the template
    const templateData = [
      {
        title: 'Sample Quiz Title',
        description: 'This is a sample quiz description',
        question: 'What is the capital of France?',
        option1_A: 'London',
        option2_B: 'Berlin',
        option3_C: 'Paris',
        option4_D: 'Madrid',
        correct_answer: 'C',
        explanation: 'Paris is the capital and largest city of France.'
      },
      {
        title: 'Sample Quiz Title',
        description: 'This is a sample quiz description',
        question: 'Which planet is known as the Red Planet?',
        option1_A: 'Venus',
        option2_B: 'Mars',
        option3_C: 'Jupiter',
        option4_D: 'Saturn',
        correct_answer: 'B',
        explanation: 'Mars is called the Red Planet due to its reddish appearance.'
      },
      {
        title: 'Another Quiz',
        description: 'Second quiz example',
        question: 'What is 2 + 2?',
        option1_A: '3',
        option2_B: '4',
        option3_C: '5',
        option4_D: '6',
        correct_answer: 'B',
        explanation: 'Basic arithmetic: 2 + 2 equals 4.'
      },
      // Add an empty template row for users to fill
      {
        title: '[ENTER QUIZ TITLE]',
        description: '[OPTIONAL: Enter quiz description]',
        question: '[Enter your question here]',
        option1_A: '[Option A]',
        option2_B: '[Option B]',
        option3_C: '[Option C]',
        option4_D: '[Option D]',
        correct_answer: '[A, B, C, or D]',
        explanation: '[Optional: Explanation for the correct answer]'
      }
    ];

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(templateData);

    // Set column widths for better readability
    const columnWidths = [
      { wch: 20 }, // title
      { wch: 30 }, // description
      { wch: 50 }, // question
      { wch: 20 }, // option1_A
      { wch: 20 }, // option2_B
      { wch: 20 }, // option3_C
      { wch: 20 }, // option4_D
      { wch: 15 }, // correct_answer
      { wch: 40 }  // explanation
    ];
    worksheet['!cols'] = columnWidths;

    // Add some styling (optional enhancement)
    const headerStyle = {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "4472C4" } },
      alignment: { horizontal: "center" }
    };

    // Apply header styling to first row
    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
      if (!worksheet[cellAddress]) continue;
      worksheet[cellAddress].s = headerStyle;
    }

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Quiz Template');

    // Add instructions sheet
    const instructions = [
      ['Quiz Upload Template Instructions'],
      [''],
      ['Column Descriptions:'],
      ['title', 'The name of your quiz (questions with same title will be grouped together)'],
      ['description', 'Optional description of the quiz'],
      ['question', 'The question text'],
      ['option1_A', 'First answer option (labeled as A)'],
      ['option2_B', 'Second answer option (labeled as B)'],
      ['option3_C', 'Third answer option (labeled as C)'],
      ['option4_D', 'Fourth answer option (labeled as D)'],
      ['correct_answer', 'The correct answer: A, B, C, or D'],
      ['explanation', 'Optional explanation for why the answer is correct'],
      [''],
      ['Important Notes:'],
      ['• Questions with the same title will be grouped into one quiz'],
      ['• All columns except description and explanation are required'],
      ['• correct_answer must be exactly A, B, C, or D'],
      ['• You can add as many rows as needed for your questions'],
      ['• Delete the sample data before uploading your own questions']
    ];

    const instructionSheet = XLSX.utils.aoa_to_sheet(instructions);
    
    // Set column widths for instructions
    instructionSheet['!cols'] = [{ wch: 30 }, { wch: 60 }];
    
    XLSX.utils.book_append_sheet(workbook, instructionSheet, 'Instructions');

    // Generate buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Generate filename with timestamp for uniqueness
    const timestamp = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const filename = `quiz-template-${timestamp}.xlsx`;

    // Return file as response
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache'
      }
    });

  } catch (error) {
    console.error('Error generating template:', error);
    return NextResponse.json(
      { 
        message: 'Error generating template',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}