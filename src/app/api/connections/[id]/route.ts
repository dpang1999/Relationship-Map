import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  await prisma.connection.delete({
    where: { id }
  });
  return NextResponse.json({ success: true });
}
