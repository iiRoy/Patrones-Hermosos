const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();

const getAll = async (req, res) => {
  const participants = await prisma.participants.findMany();
  res.json(participants);
};

const getById = async (req, res) => {
  const { id } = req.params;
  const participant = await prisma.participants.findUnique({
    where: { id_participant: parseInt(id) },
  });

  if (!participant) {
    return res.status(404).json({ message: 'Participante no encontrado' });
  }

  res.json(participant);
};

const create = async (req, res) => {
  const {
    name,
    paternal_name,
    maternal_name,
    email,
    year,
    education,
    participation_file,
    preferred_group,
    status,
    id_group,
    id_tutor,
  } = req.body;

  try {
    const newParticipant = await prisma.participants.create({
      data: {
        name,
        paternal_name,
        maternal_name,
        email,
        year,
        education,
        participation_file: participation_file
          ? Buffer.from(Object.values(participation_file))
          : null,
        preferred_group,
        status,
        id_group,
        id_tutor,
      },
    });

    res.status(201).json({
      message: 'Participante creado',
      data: newParticipant,
    });
  } catch (error) {
    console.error('Error al crear participante:', error);
    res.status(500).json({ message: 'Error al crear participante', error });
  }
};

const update = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    paternal_name,
    maternal_name,
    email,
    year,
    education,
    participation_file,
    preferred_group,
    status,
    id_group,
    id_tutor,
  } = req.body;

  try {
    const updated = await prisma.participants.update({
      where: { id_participant: parseInt(id) },
      data: {
        name,
        paternal_name,
        maternal_name,
        email,
        year,
        education,
        participation_file: participation_file
          ? Buffer.from(Object.values(participation_file))
          : null,
        preferred_group,
        status,
        id_group,
        id_tutor,
      },
    });

    res.json({ message: 'Participante actualizado', data: updated });
  } catch (error) {
    console.error('Error al actualizar participante:', error);
    res.status(500).json({
      message: 'Error al actualizar participante',
      error,
    });
  }
};

const remove = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    await prisma.participants.delete({ where: { id_participant: id } });
    res.json({
      message: `Participante con ID ${id} eliminado correctamente`,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return res.status(404).json({ message: `El participante con ID ${id} no existe` });
    }

    console.error('Error al eliminar participante:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
