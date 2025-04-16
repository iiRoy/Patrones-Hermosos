const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();

const getAll = async (req, res) => {
  const venues = await prisma.venues.findMany();
  res.json(venues);
};

const getById = async (req, res) => {
  const { id } = req.params;
  const venue = await prisma.venues.findUnique({
    where: { id_venue: parseInt(id) },
  });

  if (!venue) {
    return res.status(404).json({ message: 'Venue no encontrado' });
  }

  res.json(venue);
};

const create = async (req, res) => {
  const { name, location, address, logo, participation_file, status } = req.body;

  try {
    const newVenue = await prisma.venues.create({
      data: {
        name,
        location,
        address,
        logo,
        participation_file: participation_file
          ? Buffer.from(Object.values(participation_file))
          : null,
        status,
      },
    });

    res.status(201).json({ message: 'Venue creado', data: newVenue });
  } catch (error) {
    console.error('Error al crear venue:', error);
    res.status(500).json({ message: 'Error al crear venue', error });
  }
};

const update = async (req, res) => {
  const { id } = req.params;
  const { name, location, address, logo, participation_file, status } = req.body;

  try {
    const updatedVenue = await prisma.venues.update({
      where: { id_venue: parseInt(id) },
      data: {
        name,
        location,
        address,
        logo,
        participation_file: participation_file
          ? Buffer.from(Object.values(participation_file))
          : null,
        status,
      },
    });

    res.json({ message: 'Venue actualizado', data: updatedVenue });
  } catch (error) {
    console.error('Error al actualizar venue:', error);
    res.status(500).json({ message: 'Error al actualizar venue', error });
  }
};

const remove = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    await prisma.venues.delete({ where: { id_venue: id } });
    res.json({ message: `Venue con ID ${id} eliminado correctamente` });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return res.status(404).json({ message: `El venue con ID ${id} no existe` });
    }

    console.error('Error al eliminar venue:', error);
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
