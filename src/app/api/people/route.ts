import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const people = await prisma.person.findMany({
    orderBy: { name: 'asc' }
  });
  return NextResponse.json(people);
}

export async function POST(req: Request) {
  const body = await req.json();
  const person = await prisma.person.create({
    data: {
      name: body.name,
      notes: body.notes,
      color: body.color || "#7fa7e4"
    },
  });
  return NextResponse.json(person);
}
