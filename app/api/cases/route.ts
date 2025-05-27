import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma-server'

export async function GET() {
  try {
    const cases = await prisma.case.findMany({
      include: {
        createdBy: {
          select: {
            email: true
          }
        }
      }
    })
    return NextResponse.json(cases)
  } catch (error) {
    console.error('Error fetching cases:', error)
    return NextResponse.json({ error: 'Failed to fetch cases' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const newCase = await prisma.case.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status,
        severity: data.severity,
        createdById: data.createdBy
      }
    })
    return NextResponse.json(newCase)
  } catch (error) {
    console.error('Error creating case:', error)
    return NextResponse.json({ error: 'Failed to create case' }, { status: 500 })
  }
} 