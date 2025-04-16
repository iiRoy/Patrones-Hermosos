'use client';

import React from 'react';
import OptionLink from '../buttons_inputs/OptionLink';
import * as Icons from '../icons';

const menuItems = [
  {
    title: 'MENU',
    items: [
      {
        icon: 'ChartBarHorizontal',
        label: 'Estadísticas',
        href: '/estadísticas',
        visible: ['admin', 'coordinador'],
      },
      {
        icon: 'Bank',
        label: 'SEDES',
        href: '/admin/sedes',
        visible: ['admin'],
      },
      {
        icon: 'Bank',
        label: 'Mi SEDE',
        href: '/admin/mi-sede',
        visible: ['coordinador'],
      },
      {
        icon: 'Users',
        label: 'Gestionar Usuarios',
        href: '/admin/gestion-usuarios',
        visible: ['admin'],
      },
      {
        icon: 'PaperPlaneTilt',
        label: 'Solicitudes',
        href: '/admin/solicitudes',
        visible: ['admin', 'coordinador'],
      },
      {
        icon: 'Certificate',
        label: 'Diplomas',
        href: '/admin/diplomas',
        visible: ['admin', 'coordinador'],
      },
      {
        icon: 'Envelope',
        label: 'Correos',
        href: '/admin/correos',
        visible: ['admin'],
      },
    ],
  },
];

const Menu: React.FC = () => {
  return (
    <div className='text-[clamp(1rem,1.5vw,3rem)]'>
      {menuItems.map((section) => (
        <div key={section.title} className='flex flex-col gap-[1.5vmax] px-2'>
          {section.items.map((item) => {
            const IconComponent = Icons[item.icon as keyof typeof Icons];
            return (
              <OptionLink
                key={item.label}
                label={item.label}
                Icon={IconComponent}
                href={item.href}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Menu;
