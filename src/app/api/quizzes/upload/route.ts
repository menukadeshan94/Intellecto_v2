// /app/api/quizzes/upload/route.ts (Fixed TypeScript Issues)
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '../../../../../utils/connect';
import * as XLSX from 'xlsx';

// Types for Excel data processing
interface ExcelRow {
  title: string;
  description?: string;
  question: string;
  option1_A: string;
  option2_B: string;
  option3_C: string;
  option4_D: string;
  correct_answer: 'A' | 'B' | 'C' | 'D';
  explanation?: string;
  [key: string]: any; // Allow additional properties from Excel
}

interface QuizQuestion {
  text: string;
  options: Array<{
    text: string;
    isCorrect: boolean;
  }>;
  answer: string;
  explanation: string;
}

interface QuizGroup {
  title: string;
  description: string;
  questions: QuizQuestion[];
}

export async function POST(request: NextRequest) {
  console.log('📝 Quiz upload request received');
  
  try {
    // Check authentication
    const { userId } = await auth();
    console.log('🔐 Clerk User ID:', userId);
    
    if (!userId) {
      console.log('❌ No user ID found');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Check if user exists in MongoDB
    let user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });
    console.log('👤 MongoDB User found:', user ? `${user.id} (${user.role})` : 'null');

    // Create user if doesn't exist
    if (!user) {
      console.log('🔧 Creating user in MongoDB...');
      user = await prisma.user.create({
        data: {
          clerkId: userId,
          role: 'admin', // Set as admin for testing
        },
      });
      console.log('✅ User created:', user.id);
    }

    if (user.role !== 'admin') {
      console.log('❌ User not admin:', user.role);
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const categoryId = formData.get('categoryId') as string;
    const creatorId = formData.get('creatorId') as string;

    console.log('📋 Form data:', { 
      fileName: file?.name,
      fileSize: file?.size,
      categoryId,
      creatorId,
      userIdMatch: creatorId === user.id
    });

    if (!file || !categoryId || !creatorId) {
      console.log('❌ Missing required fields');
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify category exists in MongoDB
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });
    console.log('📂 MongoDB Category found:', category ? `${category.name} (${category.id})` : 'null');

    if (!category) {
      console.log('❌ Category not found in MongoDB');
      return NextResponse.json(
        { message: 'Category not found' },
        { status: 404 }
      );
    }

    // Convert file to buffer and parse Excel
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet) as ExcelRow[];

    console.log('📊 Excel data rows:', data.length);
    console.log('📊 First row sample:', JSON.stringify(data[0], null, 2));

    if (!data || data.length === 0) {
      console.log('❌ Excel file is empty');
      return NextResponse.json(
        { message: 'Excel file is empty or invalid' },
        { status: 400 }
      );
    }

    // Validate Excel structure - Fixed column names
    const firstRow = data[0] as ExcelRow;
    const requiredColumns = ['title', 'question', 'option1_A', 'option2_B', 'option3_C', 'option4_D', 'correct_answer'];
    const missingColumns = requiredColumns.filter(col => !(col in firstRow));
    
    if (missingColumns.length > 0) {
      console.log(`❌ Missing columns:`, missingColumns);
      console.log('📋 Available columns:', Object.keys(firstRow));
      return NextResponse.json(
        { message: `Missing required columns: ${missingColumns.join(', ')}` },
        { status: 400 }
      );
    }
    console.log('✅ Excel structure validated');

    // Group data by quiz title - Fixed property references
    const quizGroups: Record<string, QuizGroup> = data.reduce<Record<string, QuizGroup>>((acc, row) => {
      const rowData = row as ExcelRow;
      const title = rowData.title?.toString().trim();
      
      if (!title) {
        console.log('⚠️ Skipping row with empty title:', row);
        return acc;
      }
      
      if (!acc[title]) {
        acc[title] = {
          title,
          description: rowData.description?.toString() || '',
          questions: []
        };
      }
      
      // Fixed: Use correct property names from ExcelRow interface
      acc[title].questions.push({
        text: rowData.question?.toString() || '',
        options: [
          { text: rowData.option1_A?.toString() || '', isCorrect: rowData.correct_answer === 'A' },
          { text: rowData.option2_B?.toString() || '', isCorrect: rowData.correct_answer === 'B' },
          { text: rowData.option3_C?.toString() || '', isCorrect: rowData.correct_answer === 'C' },
          { text: rowData.option4_D?.toString() || '', isCorrect: rowData.correct_answer === 'D' }
        ],
        answer: rowData.correct_answer?.toString() || '',
        explanation: rowData.explanation?.toString() || ''
      });
      
      return acc;
    }, {});

    console.log('📚 Grouped quizzes:', Object.keys(quizGroups));
    console.log('📊 Quiz details:', Object.entries(quizGroups).map(([title, data]) => 
      `${title}: ${data.questions.length} questions`
    ));

    // Create quizzes in MongoDB
    const createdQuizzes = [];
    
    for (const [title, quizData] of Object.entries(quizGroups)) {
      console.log(`🎯 Creating quiz in MongoDB: "${title}" with ${quizData.questions.length} questions`);
      
      try {
        const quiz = await prisma.quiz.create({
          data: {
            title: quizData.title,
            description: quizData.description,
            categoryId: categoryId,
            creatorId: user.id,
            questions: {
              create: quizData.questions.map((q) => ({
                text: q.text,
                answer: q.answer,
                explanation: q.explanation,
                options: {
                  create: q.options
                }
              }))
            }
          },
          include: {
            questions: {
              include: {
                options: true
              }
            }
          }
        });
        
        console.log(`✅ Created quiz in MongoDB: "${quiz.title}" (ID: ${quiz.id})`);
        createdQuizzes.push(quiz);
        
      } catch (createError) {
        console.error(`❌ Error creating quiz "${title}":`, createError);
        throw createError;
      }
    }

    console.log('🎉 All quizzes created successfully in MongoDB');

    return NextResponse.json({
      message: 'Quizzes created successfully',
      quizzes: createdQuizzes.map(q => ({
        id: q.id,
        title: q.title,
        questionsCount: q.questions.length,
        optionsCount: q.questions.reduce((sum: number, question: any) => sum + question.options.length, 0)
      }))
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    console.error('💥 Error creating quiz:', error);
    console.error('💥 Error stack:', errorStack);
    
    return NextResponse.json(
      { 
        message: 'Internal server error', 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? errorStack : undefined
      },
      { status: 500 }
    );
  }
}