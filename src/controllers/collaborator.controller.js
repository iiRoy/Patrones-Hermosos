const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs').promises;
const { sendEmail } = require('../lib/emails/emailSender');

// Crear una nueva colaboradora
const createCollaborator = async (req, res) => {
  const {
    name,
    paternal_name,
    maternal_name,
    email,
    phone_number,
    college,
    degree,
    semester,
    preferred_role,
    preferred_language,
    preferred_level,
    preferred_group,
    gender,
  } = req.body;

  try {
  await prisma.$queryRaw`
      CALL registrar_colab(
        ${name}, 
        ${paternal_name}, 
        ${maternal_name}, 
        ${email}, 
        ${phone_number},
        ${college}, 
        ${degree}, 
        ${semester},
        ${preferred_role}, 
        ${preferred_language}, 
        ${preferred_level},
        ${preferred_group}, 
        ${gender}
      );
    `;

    // Send confirmation email (non-critical)
    try {
      let venueName = 'No asignada';
      let groupName = 'No asignado';
      if (preferred_group) {
        const group = await prisma.groups.findUnique({
          where: { id_group: parseInt(preferred_group) },
          include: { venues: { select: { name: true } } },
        });
        if (group) {
          groupName = group.name || 'No asignado';
          groupMode = group.mode || 'No asignado';
          venueName = group.venues?.name || 'No asignada';
        }
      }

      await sendEmail({
        to: email,
        subject: 'Confirmación de Solicitud - Patrones Hermosos',
        template: 'templates/colaboradores/solicitud',
        data: {
          cName: `${name || ''} ${paternal_name || ''} ${maternal_name || ''}`.trim(),
          venueName: venueName,
          cEmail: email || 'No especificado',
          role: preferred_role || 'No especificado',
          language: preferred_language || 'No especificado',
          level: preferred_level || 'No especificado',
          mode: groupMode || 'No determinado', // Assuming mode is not provided in request
          iEmail: process.env.EMAIL_USER || 'contacto@patroneshermosos.org',
        },
      });
      console.log(`Solicitud email sent to ${email}`);
    } catch (emailError) {
      console.error(`Error sending solicitud email to ${email}:`, emailError.message);
    }

    res.status(201).json({
      success: true,
      message: 'Colaborador creado',
    });
  } catch (error) {
    if (error.code === 'P0001' && error.message.includes('Ya existe un colaborador')) {
      return res.status(422).json({ success: false, message: 'Ya existe un colaborador registrado con estos datos.' });
    }
    console.error('Error al crear colaborador:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

// Obtener todos los colaboradores (incluye ambos formateos)
const getAllCollaborators = async (req, res) => {
  try {
    const collaborators = await prisma.collaborators.findMany({
      include: {
        groups: {
          select: {
            id_group: true,
            name: true,
            venues: {
              select: {
                id_venue: true, // Cambiado de id a id_venue
                name: true,
              },
            },
          },
        },
        preferredGroup: {
          select: {
            id_group: true,
            name: true,
            venues: {
              select: {
                id_venue: true, // Cambiado de id a id_venue
                name: true,
              },
            },
          },
        },
      },
    });

    const formattedCollaborators = collaborators.map(collab => ({
      id_collaborator: collab.id_collaborator,
      name: collab.name || 'Sin nombre',
      paternal_name: collab.paternal_name || 'Sin apellido',
      maternal_name: collab.maternal_name || 'Sin apellido',
      email: collab.email || 'Sin correo',
      phone_number: collab.phone_number || 'Sin teléfono',
      role: collab.role || 'Sin rol',
      level: collab.level || 'Sin nivel',
      language: collab.language || 'Sin idioma',
      group: collab.groups?.name || 'Sin grupo',
      id_venue: collab.groups?.venues?.id_venue || null,
      venue: collab.groups?.venues?.name || 'Sin sede',
      college: collab.college || 'Sin universidad',
      degree: collab.degree || 'Sin carrera',
      semester: collab.semester || 'Sin semestre',
      gender: collab.gender || 'Sin género',
      status: collab.status || 'Sin estado',
      preferred_role: collab.preferred_role || 'Sin rol preferido',
      preferred_language: collab.preferred_language || 'Sin idioma preferido',
      preferred_level: collab.preferred_level || 'Sin nivel preferido',
      preferred_group: collab.preferred_group || null,
    }));

    const formattedCollaboratorsForRequests = collaborators.map(collab => ({
      id_collaborator: collab.id_collaborator,
      name: collab.name || 'Sin nombre',
      paternal_name: collab.paternal_name || 'Sin apellido',
      maternal_name: collab.maternal_name || 'Sin apellido',
      email: collab.email || 'Sin correo',
      phone_number: collab.phone_number || 'Sin teléfono',
      role: collab.role || 'Sin rol',
      level: collab.level || 'Sin nivel',
      language: collab.language || 'Sin idioma',
      college: collab.college || 'Sin universidad',
      degree: collab.degree || 'Sin carrera',
      semester: collab.semester || 'Sin semestre',
      gender: collab.gender || 'Sin género',
      status: collab.status || 'Sin estado',
      preferred_role: collab.preferred_role || 'Sin rol preferido',
      preferred_language: collab.preferred_language || 'Sin idioma preferido',
      preferred_level: collab.preferred_level || 'Sin nivel preferido',
      preferred_group: collab.preferred_group || null,
      groups: collab.preferredGroup
        ? {
          name: collab.preferredGroup.name || 'No asignado',
          venues: collab.preferredGroup.venues || { name: 'No asignado' },
        }
        : null,
    }));

    res.json({
      success: true,
      data: formattedCollaborators,
      dataForRequests: formattedCollaboratorsForRequests,
    });
  } catch (error) {
    console.error('Error al obtener colaboradores:', error);
    res.status(500).json({ success: false, message: `Error interno del servidor: ${error.message}` });
  }
};

// Obtener un colaborador por ID
const getCollaboratorById = async (req, res) => {
  const { id } = req.params;

  try {
    const collaborator = await prisma.collaborators.findUnique({
      where: { id_collaborator: parseInt(id) },
      include: {
        groups: {
          select: {
            id_group: true,
            name: true,
            venues: {
              select: {
                id_venue: true, // Cambiado de id a id_venue
                name: true,
              },
            },
          },
        },
        preferredGroup: {
          select: {
            id_group: true,
            name: true,
            venues: {
              select: {
                id_venue: true, // Cambiado de id a id_venue
                name: true,
              },
            },
          },
        },
      },
    });

    if (!collaborator) {
      return res.status(404).json({ success: false, message: `El colaborador con ID ${id} no existe` });
    }

    const formattedCollaborator = {
      ...collaborator,
      groups: collaborator.preferredGroup
        ? {
          name: collaborator.preferredGroup.name || 'No asignado',
          venues: collaborator.preferredGroup.venues || { name: 'No asignado' },
        }
        : null,
    };

    res.json({ success: true, data: formattedCollaborator });
  } catch (error) {
    console.error('Error al obtener colaborador:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

// Actualizar un colaborador (versión completa)
const updateCollaborator = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    paternal_name,
    maternal_name,
    email,
    phone_number,
    college,
    degree,
    semester,
    preferred_role,
    preferred_language,
    preferred_level,
    preferred_group,
    gender,
    role,
    status,
    level,
    language,
  } = req.body;

  try {
    const updatedCollaborator = await prisma.collaborators.update({
      where: { id_collaborator: parseInt(id) },
      data: {
        name,
        paternal_name,
        maternal_name,
        email,
        phone_number,
        college,
        degree,
        semester,
        preferred_role,
        preferred_language,
        preferred_level,
        gender,
        role,
        status,
        level,
        language,
        preferred_group: preferred_group ? parseInt(preferred_group) : null,
      },
    });

    res.json({ success: true, message: 'Colaborador actualizado', data: updatedCollaborator });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return res.status(404).json({ success: false, message: `El colaborador con ID ${id} no existe` });
    }
    console.error('Error al actualizar colaborador:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

// Eliminar un colaborador
const deleteCollaborator = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.collaborators.delete({
      where: { id_collaborator: parseInt(id) },
    });

    res.json({ success: true, message: 'Colaborador eliminado correctamente' });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return res.status(404).json({ success: false, message: `El colaborador con ID ${id} no existe` });
    }
    console.error('Error al eliminar colaborador:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

// Actualizar información básica de un colaborador
  const updateCollaboratorBasicInfo = async (req, res) => {
    const { id } = req.params;
    const {
      name,
      paternal_name,
      maternal_name,
      email,
      phone_number,
      college,
      degree,
      semester,
      gender,
      preferred_role,
      preferred_language,
      preferred_level,
    } = req.body;

    try {
      // Crear objeto de datos dinámicamente, incluyendo solo campos proporcionados
      const updateData = {};
      if (name !== undefined) updateData.name = name?.trim() || null;
      if (paternal_name !== undefined) updateData.paternal_name = paternal_name?.trim() || null;
      if (maternal_name !== undefined) updateData.maternal_name = maternal_name?.trim() || null;
      if (email !== undefined) updateData.email = email?.trim() || null;
      if (phone_number !== undefined) updateData.phone_number = phone_number?.trim() || null;
      if (college !== undefined) updateData.college = college?.trim() || null;
      if (degree !== undefined) updateData.degree = degree?.trim() || null;
      if (semester !== undefined) updateData.semester = semester?.trim() || null;
      if (gender !== undefined) updateData.gender = gender?.trim() || null;
      if (preferred_role !== undefined) updateData.preferred_role = preferred_role?.trim() || null;
      if (preferred_language !== undefined) updateData.preferred_language = preferred_language?.trim() || null;
      if (preferred_level !== undefined) updateData.preferred_level = preferred_level?.trim() || null;

      console.log('Datos enviados al controlador:', updateData); // Log para depurar

      const updatedCollaborator = await prisma.collaborators.update({
        where: { id_collaborator: parseInt(id) },
        data: updateData,
      });

      res.json({
        success: true,
        message: 'Información básica del colaborador actualizada',
        data: updatedCollaborator,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return res.status(404).json({
          success: false,
          message: `El colaborador con ID ${id} no existe`,
        });
      }
      console.error('Error al actualizar información básica del colaborador:', error);
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  };

// Obtener datos específicos para tabla
const getCollaboratorsTable = async (req, res) => {
  try {
    const collaborators = await prisma.collaborators.findMany({
      select: {
        id_collaborator: true,
        name: true,
        email: true,
        phone_number: true,
        groups: {
          select: {
            id_group: true,
            name: true,
            venues: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    const formatted = collaborators.map((collab) => ({
      id_collaborator: collab.id_collaborator,
      name: collab.name,
      venue: collab.groups?.venues?.name || 'Sin sede',
      group: collab.groups?.name || 'Sin grupo',
      email: collab.email || 'Sin correo',
      phone_number: collab.phone_number || 'Sin teléfono',
    }));

    res.json({ success: true, data: formatted });
  } catch (error) {
    console.error('Error al obtener datos para tabla de colaboradores:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

// Get available groups for a collaborator's venue
const getAvailableGroups = async (req, res) => {
  try {
    const { collaboratorId } = req.params;

    // Validate collaboratorId
    if (!collaboratorId || isNaN(parseInt(collaboratorId))) {
      return res.status(400).json({ message: 'ID de colaborador inválido' });
    }

    // Get collaborator’s details, including venue via preferred_group
    const collaborator = await prisma.collaborators.findUnique({
      where: { id_collaborator: parseInt(collaboratorId) },
      include: {
        preferredGroup: {
          select: {
            id_venue: true,
            venues: { select: { name: true } },
          },
        },
      },
    });

    if (!collaborator) {
      return res.status(404).json({ message: 'Colaborador no encontrado' });
    }

    const venueId = collaborator.preferredGroup?.id_venue;
    if (!venueId) {
      return res.status(400).json({ message: 'El colaborador no tiene una sede asignada' });
    }

    // Get all active groups in the venue
    const groups = await prisma.groups.findMany({
      where: {
        id_venue: venueId,
        status: 'Aprobada',
      },
      select: {
        id_group: true,
        name: true,
        level: true,
        mode: true,
        language: true,
      },
    });

    // Define maximum capacities per role
    const maxCapacities = {
      Instructora: 1,
      Facilitadora: 2,
      Staff: 1,
    };

    // Calculate role counts and format groups
    const availableGroups = [];
    for (const group of groups) {
      // Count approved collaborators per role in the group
      const roleCounts = await prisma.collaborators.groupBy({
        by: ['role'],
        where: {
          id_group: group.id_group,
          status: 'Aprobada',
          role: { in: ['Instructora', 'Facilitadora', 'Staff'] },
        },
        _count: {
          id_collaborator: true,
        },
      });

      // Convert to a map for easier lookup
      const roleCountMap = {
        Instructora: 0,
        Facilitadora: 0,
        Staff: 0,
      };
      roleCounts.forEach(({ role, _count }) => {
        if (role) {
          roleCountMap[role] = _count.id_collaborator;
        }
      });

      // Calculate available slots per role
      const roleAvailability = {
        Instructora: maxCapacities.Instructora - roleCountMap.Instructora,
        Facilitadora: maxCapacities.Facilitadora - roleCountMap.Facilitadora,
        Staff: maxCapacities.Staff - roleCountMap.Staff,
      };

      // Calculate total available places
      const availablePlaces = Object.values(roleAvailability).reduce((sum, count) => sum + Math.max(0, count), 0);

      // Include group if it has capacity
      if (availablePlaces > 0) {
        availableGroups.push({
          id_group: group.id_group,
          name: group.name || 'Sin nombre',
          level: group.level || 'No especificado',
          mode: group.mode || 'No especificado',
          language: group.language || 'No especificado',
          available_places: availablePlaces,
          role_availability: roleAvailability,
        });
      }
    }

    res.json({
      success: true,
      collaborator: {
        name: `${collaborator.name || ''} ${collaborator.paternal_name || ''} ${collaborator.maternal_name || ''}`.trim(),
        preferred_role: collaborator.preferred_role || 'No especificado',
        preferred_level: collaborator.preferred_level || 'No especificado',
        preferred_language: collaborator.preferred_language || 'No especificado',
        venue: collaborator.preferredGroup?.venues?.name || 'Sin sede',
      },
      groups: availableGroups,
      roles: ['Instructora', 'Facilitadora', 'Staff'],
    });
  } catch (error) {
    console.error('Error fetching available groups:', JSON.stringify(error, null, 2));
    res.status(500).json({ message: 'Error al obtener grupos disponibles', error: error.message });
  }
};


// Approve collaborator
const approveCollaborator = async (req, res) => {
  const { collaboratorId } = req.params;
  const { role, groupId } = req.body;

  console.log(`Approving collaborator ${collaboratorId} with role ${role} for group ${groupId}`);

  try {
    // Validate collaborator
    const collaborator = await prisma.collaborators.findUnique({
      where: { id_collaborator: parseInt(collaboratorId) },
      include: {
        preferredGroup: { select: { id_venue: true } },
        groups: { select: { id_venue: true } },
      },
    });

    if (!collaborator) {
      return res.status(404).json({ message: 'Colaborador no encontrado' });
    }

    if (collaborator.status !== 'Pendiente') {
      return res.status(400).json({ message: 'El colaborador no está en estado Pendiente' });
    }

    // Validate role
    const validRoles = ['Instructora', 'Facilitadora', 'Staff'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Rol no válido' });
    }

    // Validate group
    const group = await prisma.groups.findUnique({
      where: { id_group: parseInt(groupId) },
      select: {
        id_group: true,
        id_venue: true,
        status: true,
        level: true,
        language: true,
      },
    });

    if (!group) {
      return res.status(404).json({ message: 'Grupo no encontrado' });
    }

    if (group.status !== 'Aprobada') {
      return res.status(400).json({ message: 'El grupo no está activo' });
    }

    // Verify group is in the same venue
    const collaboratorVenueId = collaborator.preferredGroup?.id_venue || collaborator.groups?.id_venue;
    if (group.id_venue !== collaboratorVenueId) {
      return res.status(400).json({ message: 'El grupo no pertenece a la sede del colaborador' });
    }

    // Check role capacity in the group
    const maxCapacities = {
      Instructora: 1,
      Facilitadora: 2,
      Staff: 1,
    };

    const collaboratorsInGroup = await prisma.collaborators.findMany({
      where: {
        id_group: group.id_group,
        role: role,
        status: 'Aprobada',
      },
      select: {
        id_collaborator: true,
        role: true,
        status: true,
        id_group: true,
      },
    });

    console.log(`Collaborators in group ${groupId} with role ${role} and status Aprobada:`, JSON.stringify(collaboratorsInGroup, null, 2));

    const approvedCount = collaboratorsInGroup.length;

    console.log(`Role ${role} count for group ${groupId}: ${approvedCount} (max: ${maxCapacities[role]})`);

    if (approvedCount >= maxCapacities[role]) {
      return res.status(400).json({ message: `El rol ${role} en el grupo seleccionado está lleno` });
    }

    // Determine level and language
    const validLevels = ['Básico', 'Avanzado'];
    const validLanguages = ['Inglés', 'Español'];
    const selectedLevel = collaborator.preferred_level !== 'Pendiente' && validLevels.includes(collaborator.preferred_level)
      ? collaborator.preferred_level
      : (group.level && validLevels.includes(group.level) ? group.level : 'Básico');
    const selectedLanguage = collaborator.preferred_language !== 'Pendiente' && validLanguages.includes(collaborator.preferred_language)
      ? collaborator.preferred_language
      : (group.language && validLanguages.includes(group.language) ? group.language : 'Español');

    console.log(`Setting level: ${selectedLevel}, language: ${selectedLanguage}`);

    // Approve collaborator
    const updatedCollaborator = await prisma.collaborators.update({
      where: { id_collaborator: parseInt(collaboratorId) },
      data: {
        role: role,
        status: 'Aprobada',
        level: selectedLevel,
        language: selectedLanguage,
        groups: {
          connect: { id_group: group.id_group }, // Use relation to set group
        },
      },
    });

    // Send approval email (non-critical)
    try {
      const fullName = `${collaborator.name || ''} ${collaborator.paternal_name || ''} ${collaborator.maternal_name || ''}`.trim();
      await sendEmail({
        to: collaborator.email,
        subject: 'Resultados de la postulación - Patrones Hermosos',
        template: 'templates/collaborators/aceptado',
        data: {
          pName: fullName,
          role: updatedCollaborator.role,
          sede: group.venues?.name || 'No asignada',
          grupo: group.name || 'No asignado',
          direccion: group.venues?.address || 'No disponible',
          mName: group.mentors?.name || 'No asignada',
          mEmail: group.mentors?.email || 'no-reply@patroneshermosos.org',
          iName: 'Soporte Patrones Hermosos',
          iEmail: process.env.EMAIL_USER || 'soporte@patroneshermosos.org',
        },
      });
      console.log(`Approval email sent to ${collaborator.email}`);
    } catch (emailError) {
      console.error(`Error sending approval email to ${collaborator.email}:`, emailError.message);
    }

    // Create audit log
    await prisma.audit_log.create({
      data: {
        action: 'UPDATE',
        table_name: 'collaborators',
        message: `Se aprobó la colaboradora con ID ${collaboratorId}`,
        username: req.user?.username || 'unknown',
        id_venue: group.id_venue,
      },
    });

    res.json({
      success: true,
      message: 'Colaborador aprobado exitosamente',
      collaborator: {
        id_collaborator: updatedCollaborator.id_collaborator,
        name: `${updatedCollaborator.name || ''} ${updatedCollaborator.paternal_name || ''} ${updatedCollaborator.maternal_name || ''}`.trim(),
        role: updatedCollaborator.role,
        group_id: updatedCollaborator.id_group,
        level: updatedCollaborator.level,
        language: updatedCollaborator.language,
        status: updatedCollaborator.status,
      },
    });
  } catch (error) {
    console.error('Error approving collaborator:', JSON.stringify(error, null, 2));
    res.status(500).json({ message: 'Error al aprobar colaborador', error: error.message });
  }
};

// Cancelar una colaboradora (cambiar status de Aprobada a Cancelada)
const cancelCollaborator = async (req, res) => {
  const { id } = req.params;
  const username = req.user.username; // Usar username del token JWT

  try {
    // Log para depurar id
    console.log('ID recibido:', id, 'Parsed ID:', parseInt(id));

    // Verificar si la colaboradora existe y está Aprobada
    const collaborator = await prisma.collaborators.findUnique({
      where: { id_collaborator: Number(id) },
      select: {
        id_collaborator: true,
        status: true,
        name: true,
        paternal_name: true,
        maternal_name: true,
        email: true, // Añadido para el correo
        role: true, // Añadido para el correo
        groups: {
          select: {
            id_venue: true,
            name: true,
            venues: { // Correct relation
              select: { name: true }
            }
          }
        }
      }
    });

    if (!collaborator) {
      return res.status(404).json({ message: 'La colaboradora no existe.' });
    }

    if (collaborator.status !== 'Aprobada') {
      return res.status(400).json({ message: 'Solo se pueden cancelar colaboradoras con status Aprobada.' });
    }

    // Actualizar el status a Cancelada
    await prisma.collaborators.update({
      where: { id_collaborator: Number(id) },
      data: { status: 'Cancelada' }
    });

    // Registrar en audit_log
    await prisma.audit_log.create({
      data: {
        action: 'UPDATE',
        table_name: 'collaborators',
        message: `Se canceló la colaboradora con ID ${id} (${collaborator.name || ''} ${collaborator.paternal_name || ''} ${collaborator.maternal_name || ''})`,
        username,
        id_venue: collaborator.groups?.id_venue || null
      }
    });

    // Send cancellation email (non-critical)
    try {
      const fullName = [collaborator.name, collaborator.paternal_name, collaborator.maternal_name]
        .filter(Boolean)
        .join(' ')
        .trim();

      const emailData = {
        pName: fullName || 'Colaboradora',
        venue: collaborator.groups?.venues?.name || 'No asignada',
        role: collaborator.role || 'No especificado',
        reason: 'Cancelación solicitada por el usuario o administrador.',
        code: `COL-${id}-${new Date().getFullYear()}`,
        iEmail: process.env.EMAIL_USER || 'contacto@patroneshermosos.org'
      };

      // Validate email before sending
      if (collaborator.email && collaborator.email.trim()) {
        await sendEmail({
          to: collaborator.email,
          subject: 'Actualización sobre tu solicitud - Patrones Hermosos',
          template: 'templates/colaboradores/rechazado',
          data: emailData
        });
        console.log(`Cancellation email sent to ${collaborator.email}`);
      } else {
        console.log(`No email sent for collaborator ${id}: No valid email address`);
      }
    } catch (emailError) {
      console.error(`Error sending cancellation email to ${collaborator.email || 'unknown'}:`, emailError.message);
    }

    res.status(200).json({
      message: `Colaboradora con ID ${id} cancelada exitosamente`
    });
  } catch (error) {
    console.error('Error al cancelar la colaboradora:', error);
    res.status(500).json({ message: 'Error interno al cancelar la colaboradora', error: error.message });
  }
};

const rejectCollaborator = async (req, res) => {
  const { id } = req.params;
  const { action } = req.body;
  const username = req.user?.username || 'unknown';

  // Validar acción
  if (action !== 'desactivar') {
    return res.status(400).json({ message: 'La acción debe ser "desactivar"' });
  }

  try {
    // Fetch collaborator data
    const collaborator = await prisma.collaborators.findUnique({
      where: { id_collaborator: parseInt(id) },
      include: {
        groups: { select: { id_venue: true } },
        preferredGroup: {
          select: {
            id_venue: true,
            venues: { select: { name: true } },
          },
        },
      },
    });

    if (!collaborator) {
      return res.status(404).json({ message: 'Colaborador no encontrado' });
    }

    // Verificar estado Pendiente
    if (collaborator.status !== 'Pendiente') {
      return res.status(400).json({ message: 'Solo se pueden rechazar colaboradores con estatus Pendiente' });
    }

    // Actualizar estado a Rechazada
    await prisma.collaborators.update({
      where: { id_collaborator: parseInt(id) },
      data: { status: 'Rechazada' },
    });

    // Crear registro en audit_log
    await prisma.audit_log.create({
      data: {
        action: 'UPDATE',
        table_name: 'collaborators',
        message: `Se rechazó el colaborador con ID ${id}`,
        username,
        id_venue: collaborator.groups?.id_venue || collaborator.preferredGroup?.id_venue,
      },
    });

    // Send cancellation email (non-critical)
    try {
      const fullName = `${collaborator.name || ''} ${collaborator.paternal_name || ''} ${collaborator.maternal_name || ''}`.trim();
      await sendEmail({
        to: collaborator.email,
        subject: 'Actualización sobre tu solicitud - Patrones Hermosos',
        template: 'templates/collaborators/rechazado',
        data: {
          pName: fullName,
          venue: collaborator.groups?.venues?.name || 'No asignada',
          role: collaborator.role || 'No especificado',
          reason: 'No se cumplieron los criterios de aceptación.',
          code: `COL-${id}-${new Date().getFullYear()}`,
          iEmail: process.env.EMAIL_USER || 'contacto@patroneshermosos.org',
        },
      });
      console.log(`Cancellation email sent to ${collaborator.email}`);
    } catch (emailError) {
      console.error(`Error sending cancellation email to ${collaborator.email}:`, emailError.message);
    }

    res.status(200).json({
      message: `Colaborador con ID ${id} rechazado exitosamente`,
    });
  } catch (error) {
    console.error('Error al rechazar colaborador:', error);
    res.status(500).json({ message: 'Error interno al rechazar colaborador', error: error.message });
  }
};

module.exports = {
  createCollaborator,
  getAllCollaborators,
  getCollaboratorById,
  updateCollaborator,
  deleteCollaborator,
  getCollaboratorsTable,
  updateCollaboratorBasicInfo,
  getAvailableGroups,
  approveCollaborator,
  cancelCollaborator,
  rejectCollaborator,
};