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
      },
      tags: true
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
  let body: any;
  try {
    body = await request.json();
  } catch (err) {
    console.error('Invalid JSON in update request for person', id, err);
    return new NextResponse('Invalid JSON', { status: 400 });
  }

  console.log("Received update for person ID:", id, "with data:", body);

  const data: any = {};
  if (typeof body.name === 'string') data.name = body.name;
  if (body.notes !== undefined) data.notes = body.notes;
  if (body.color !== undefined) data.color = body.color;
  if (body.tags !== undefined) {
    data.tags = {
      set: [],  // disconnect all existing tags first
      connectOrCreate: body.tags.map((tag: string) => ({
        where: { name: tag },
        create: { name: tag }
      }))
    };
  }

  if (Object.keys(data).length === 0) {
    return new NextResponse('No valid fields to update', { status: 400 });
  }

  try {
    const person = await prisma.person.update({ where: { id }, data });
    return NextResponse.json(person);
  } catch (err: any) {
    console.error('Error updating person', id, err);
    const message = err?.message || String(err);
    return NextResponse.json({ error: 'Update failed', details: message }, { status: 500 });
  }
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
