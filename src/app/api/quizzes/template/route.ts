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
        option1: 'London',
        option2: 'Berlin',
        option3: 'Paris',
        option4: 'Madrid',
        correct_answer: 'C',
        explanation: 'Paris is the capital and largest city of France.'
      },
      {
        title: 'Sample Quiz Title',
        description: 'This is a sample quiz description',
        question: 'Which planet is known as the Red Planet?',
        option1: 'Venus',
        option2: 'Mars',
        option3: 'Jupiter',
        option4: 'Saturn',
        correct_answer: 'B',
        explanation: 'Mars is called the Red Planet due to its reddish appearance.'
      },
      {
        title: 'Another Quiz',
        description: 'Second quiz example',
        question: 'What is 2 + 2?',
        option1: '3',
        option2: '4',
        option3: '5',
        option4: '6',
        correct_answer: 'B',
        explanation: 'Basic arithmetic: 2 + 2 equals 4.'
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
      { wch: 20 }, // option1
      { wch: 20 }, // option2
      { wch: 20 }, // option3
      { wch: 20 }, // option4
      { wch: 15 }, // correct_answer
      { wch: 40 }  // explanation
    ];
    worksheet['!cols'] = columnWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Quiz Template');

    // Generate buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Return file as response
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="quiz-template.xlsx"'
      }
    });

  } catch (error) {
    console.error('Error generating template:', error);
    return NextResponse.json(
      { message: 'Error generating template' },
      { status: 500 }
    );
  }
}