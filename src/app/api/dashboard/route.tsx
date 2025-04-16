import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // 🔍 Obtener venues y sus relaciones
    const venues = await prisma.venues.findMany({
      include: {
        groups: {
          include: {
            participants: true,
            collaborators: true,
          },
        },
      },
    });

    const [instructoras, facilitadoras, staff] = await Promise.all([
      prisma.collaborators.count({ where: { role: 'Instructora' } }),
      prisma.collaborators.count({ where: { role: 'Facilitadora' } }),
      prisma.collaborators.count({ where: { role: 'Staff' } }),
    ]);

    const [colaboradores, participantes, mentoras, coordinadoras] = await Promise.all([
      prisma.collaborators.count(),
      prisma.participants.count(),
      prisma.mentors.count(),
      prisma.venue_coordinators.count(),
    ]);

    // 📊 Datos por sede
    const sedeData = venues.map((venue) => {
      let participantes = 0;
      let colaboradores = 0;

      venue.groups.forEach((group) => {
        participantes += group.participants.length;
        colaboradores += group.collaborators.length;
      });

      return {
        name: venue.name,
        participantes,
        colaboradores,
      };
    });

    return NextResponse.json({
      sedes: sedeData,
      resumenColaboradoras: {
        instructoras,
        facilitadoras,
        staff,
      },
      resumenEvento: {
        participantes,
        colaboradores,
        mentoras,
        coordinadoras,
      },
    });
  } catch (error: any) {
    console.error('❌ Error al obtener datos para el gráfico:', error.message, error.stack);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
