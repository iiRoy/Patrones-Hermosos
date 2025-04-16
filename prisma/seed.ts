// npx prisma db seed
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const { execSync } = require('child_process');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const prisma = new PrismaClient();

// 🔧 Convierte "Con espacios" a "Con_espacios"
function fixEnum(value: string): string {
  return value.replace(/ /g, '_');
}

// 🕒 Convierte "09:00:00" a Date con hora
function parseTimeToDate(baseDate: Date, timeStr: string): Date {
  const [hours, minutes, seconds] = timeStr.split(':').map(Number);
  const date = new Date(baseDate);
  date.setHours(hours);
  date.setMinutes(minutes);
  date.setSeconds(seconds || 0);
  return date;
}

async function main() {
  console.log('🧨 Borrando registros previos...');
  await prisma.participants.deleteMany();
  await prisma.collaborators.deleteMany();
  await prisma.tutors.deleteMany();
  await prisma.groups.deleteMany();
  await prisma.excluded_days.deleteMany();
  await prisma.mentors.deleteMany();
  await prisma.assistant_coordinators.deleteMany();
  await prisma.venue_coordinators.deleteMany();
  await prisma.venues.deleteMany();
  await prisma.superusers.deleteMany();

  console.log('🌱 Insertando datos...');

  // 1. VENUES
  const venues = JSON.parse(fs.readFileSync('./prisma/seed/venues.json', 'utf-8'));
  for (const venue of venues) {
    await prisma.venues.create({
      data: {
        ...venue,
        status: fixEnum(venue.status),
        participation_file: Buffer.from('ArchivoPDF'),
      },
    });
  }

  // 2. VENUE COORDINATORS
  const coordinators = JSON.parse(
    fs.readFileSync('./prisma/seed/venue_coordinators.json', 'utf-8'),
  );
  for (const coordinator of coordinators) {
    const hashedPassword = await bcrypt.hash(coordinator.password, 10);
    await prisma.venue_coordinators.create({
      data: {
        ...coordinator,
        password: hashedPassword,
      },
    });
  }

  // 3. ASSISTANT COORDINATORS
  const assistants = JSON.parse(
    fs.readFileSync('./prisma/seed/assistant_coordinators.json', 'utf-8'),
  );
  for (const a of assistants) {
    await prisma.assistant_coordinators.create({
      data: {
        ...a,
        role: fixEnum(a.role),
      },
    });
  }

  // 4. MENTORS
  const mentors = JSON.parse(fs.readFileSync('./prisma/seed/mentors.json', 'utf-8'));
  for (const m of mentors) {
    await prisma.mentors.create({ data: m });
  }

  // 5. GROUPS
  const groups = JSON.parse(fs.readFileSync('./prisma/seed/groups.json', 'utf-8'));
  for (const g of groups) {
    const baseDate = new Date(g.start_date);
    await prisma.groups.create({
      data: {
        ...g,
        start_date: baseDate,
        end_date: new Date(g.end_date),
        start_hour: parseTimeToDate(baseDate, g.start_hour),
        end_hour: parseTimeToDate(baseDate, g.end_hour),
      },
    });
  }

  // 6. EXCLUDED DATES
  const excluded = JSON.parse(fs.readFileSync('./prisma/seed/excluded_date.json', 'utf-8'));
  for (const e of excluded) {
    await prisma.excluded_days.create({
      data: {
        ...e,
        excluded_date: new Date(e.excluded_date),
      },
    });
  }

  // 7. TUTORS
  const tutors = JSON.parse(fs.readFileSync('./prisma/seed/tutors.json', 'utf-8'));
  for (const t of tutors) {
    await prisma.tutors.create({ data: t });
  }

  // 8. PARTICIPANTS
  const participants = JSON.parse(fs.readFileSync('./prisma/seed/participants.json', 'utf-8'));
  for (const p of participants) {
    await prisma.participants.create({
      data: {
        ...p,
        participation_file: Buffer.from('ArchivoPDF'),
      },
    });
  }

  // 9. COLLABORATORS
  const collaborators = JSON.parse(fs.readFileSync('./prisma/seed/collaborators.json', 'utf-8'));
  for (const c of collaborators) {
    await prisma.collaborators.create({ data: c });
  }

  // 10. SUPERUSERS
  const superusers = JSON.parse(fs.readFileSync('./prisma/seed/superuser.json', 'utf-8'));
  for (const s of superusers) {
    const hashedPassword = await bcrypt.hash(s.password, 10);
    await prisma.superusers.create({
      data: {
        ...s,
        password: hashedPassword,
      },
    });
  }

  console.log('✅ ¡Datos insertados exitosamente!');

  const dbUrl = process.env.DATABASE_URL;

  if (!dbUrl) {
    throw new Error('DATABASE_URL no definida en .env');
  }

  console.log('🔍 DATABASE_URL:', dbUrl);

  // Nuevo regex compatible con o sin contraseña
  const regex = /^mysql:\/\/([^:@]+)(?::([^@]*))?@([^:\/]+):(\d+)\/([^?]+)/;
  const match = dbUrl.match(regex);
  if (!match) {
    throw new Error('DATABASE_URL no es válida');
  }

  const [, user, pass, host, port, db] = match;

  // Construir comando mysql con o sin contraseña
  const sqlFile = path.join(__dirname, 'after-migrate.sql');

  execSync(`mysql -u root -h localhost -P 3306 -D patrones-hermosos < "${sqlFile}"`, {
    stdio: 'inherit',
  });
  console.log('✅ ¡Funciones, procedimientos y triggers insertados exitosamente!');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
