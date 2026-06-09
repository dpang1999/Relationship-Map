import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const people = await prisma.person.findMany({
    orderBy: { name: 'asc' },
    include: { tags: true }
  });
  return NextResponse.json(people);
}

export async function POST(req: Request) {
  const body = await req.json();
  const person = await prisma.person.create({
    data: {
      name: body.name,
      notes: body.notes,
      color: body.color || "#7fa7e4",
      tags: {
        connectOrCreate: (body.tags || []).map((tag: string) => ({
          where: { name: tag },
          create: { name: tag }
        }))
      }
    },
    include: { tags: true }
  });
  return NextResponse.json(person);
}
