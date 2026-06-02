import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const body = await req.json();
  const connection = await prisma.connection.create({
    data: {
      fromPersonId: body.fromPersonId,
      toPersonId: body.toPersonId,
      label: body.label,
    },
  });
  return NextResponse.json(connection);
}
