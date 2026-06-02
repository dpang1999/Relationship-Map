import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  const person = await prisma.person.findUnique({
    where: { id },
    include: {
      outgoingConnections: {
        include: { toPerson: true }
      },
      incomingConnections: {
        include: { fromPerson: true }
      }
    }
  });

  if (!person) {
    return new NextResponse('Not found', { status: 404 });
  }

  return NextResponse.json(person);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const body = await request.json();
  
  const person = await prisma.person.update({
    where: { id },
    data: { name: body.name, notes: body.notes }
  });
  return NextResponse.json(person);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  await prisma.person.delete({
    where: { id }
  });
  return NextResponse.json({ success: true });
}
