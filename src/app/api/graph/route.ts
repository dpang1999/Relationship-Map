import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const people = await prisma.person.findMany();
  const connections = await prisma.connection.findMany();

  const nodes = people.map(p => ({
    id: p.id,
    name: p.name,
    val: 1, // Node size
  }));

  const links = connections.map(c => ({
    source: c.fromPersonId,
    target: c.toPersonId,
    label: c.label,
  }));

  return NextResponse.json({ nodes, links });
}
