import { NextRequest, NextResponse } from 'next/server';
//import prisma from '../../../../utils/connect';

/*export async function GET(req: NextRequest) {
  try {

    // this is public route get all categories
    // no authentication required
    const categories = await prisma.category.findMany({})

    return NextResponse.json(categories, { status: 200 });

  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' }, 
      { status: 500 });  
  }
}*/

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch all categories
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        quizzes: {
          include: {
            questions: {
              include: {
                options: true
              }
            }
          }
        }
      }
    });
    
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { message: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST - Create a new category
export async function POST(request: NextRequest) {
  try {
    const { name, description, image } = await request.json();

    // Validate input
    if (!name || !description) {
      return NextResponse.json(
        { message: 'Name and description are required' },
        { status: 400 }
      );
    }

    // Check if category already exists (case-insensitive)
    const existingCategory = await prisma.category.findFirst({
      where: {
        name: {
          equals: name.trim(),
          mode: 'insensitive'
        }
      }
    });

    if (existingCategory) {
      return NextResponse.json(
        { message: 'Category already exists' },
        { status: 409 }
      );
    }

    // Create new category
    const newCategory = await prisma.category.create({
      data: {
        name: name.trim(),
        description: description.trim(),
        image: image?.trim() || null
      },
      include: {
        quizzes: {
          include: {
            questions: {
              include: {
                options: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { message: 'Failed to create category' },
      { status: 500 }
    );
  }
}

// For cleanup (optional) - disconnect prisma when the process ends
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
