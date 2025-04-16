'use client';
import { useEffect, useState, useCallback, useMemo } from 'react';
import UserCard from '@/components/headers_menu_users/UserCard';
import FiltroEvento from '@/components/headers_menu_users/FiltroEvento';
import * as Icons from '@/components/icons';
import withIconDecorator from '@/components/decorators/IconDecorator';

const iconMap: Record<string, keyof typeof Icons> = {
  Participantes: 'User',
  Colaboradoras: 'Users',
  Administración: 'IdentificationBadge',
  SEDES: 'Bank',
};

const CardSection = () => {
  const [mounted, setMounted] = useState(false);
  const [resumenEvento, setResumenEvento] = useState<any>({});
  const [fade, setFade] = useState(false);
  const [fadeSec, setFadeSec] = useState(false);
  const [filters, setFilters] = useState({
    page: 'evento',
    sede: '',
    colab: '',
    coord: '',
  });
  const [section, setSection] = useState('Participantes');
  const [sedes, setSedes] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchDashboardData = async (filters: {
    page: string;
    sede?: string;
    colab?: string;
    coord?: string;
  }): Promise<any> => {
    const { page, sede, colab, coord } = filters;
    const params = new URLSearchParams();
    if (sede) params.append('id', sede);
    if (colab) params.append('colab', colab);
    if (coord) params.append('coord', coord);

    try {
      const res = await fetch(`/api/data?page=${page}&${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
        },
      });
      return await res.json();
    } catch (error) {
      console.error('Error cargando resumenEvento:', error);
      return null;
    }
  };

  const toValidNumber = (val: any): number => {
    const num = Number(val);
    return isNaN(num) ? 0 : num;
  };

  const loadData = useCallback(async () => {
    const data = await fetchDashboardData(filters);
    if (data?.resumenEvento) setResumenEvento(data.resumenEvento);
  }, [filters]);

  const loadSedes = useCallback(async () => {
    const response = await fetchDashboardData({ page: 'venues' });
    if (response?.venues) {
      const opciones = response.venues.map((sede: any) => ({
        value: sede.id.toString?.() ?? `${sede.id}`,
        label: sede.name,
      }));

      setSedes([{ value: '', label: 'Todas las sedes' }, ...opciones]);
    }
  }, []);

  const IconComponent = useMemo(() => {
    const iconKey = iconMap[section] || 'CaretDoubleDown';
    return withIconDecorator(Icons[iconKey]);
  }, [section]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    loadSedes();
  }, [loadSedes]);

  useEffect(() => {
    setFilters((prev) => {
      const newFilters = { ...prev };

      if (section !== 'Colaboradoras' && prev.colab !== '') newFilters.colab = '';
      if (section !== 'Administración' && prev.coord !== '') newFilters.coord = '';
      if (section === 'SEDES' && prev.sede !== '') newFilters.sede = '';

      if (JSON.stringify(prev) !== JSON.stringify(newFilters)) return newFilters;
      return prev;
    });
  }, [section]);

  const renderCards = () => {
    switch (section) {
      case 'Participantes': {
        const p = resumenEvento.total_participantes || {};
        return (
          <>
            <UserCard type='activas' count={toValidNumber(p.Aprobadas)} />
            <UserCard type='pendientes' count={toValidNumber(p.Pendientes)} />
            <UserCard
              type='desactivadas'
              count={toValidNumber(p.Rechazadas) + toValidNumber(p.Canceladas)}
            />
            <UserCard
              type='totales'
              count={toValidNumber(
                Object.values(p).reduce((a, b) => toValidNumber(a) + toValidNumber(b), 0),
              )}
            />
          </>
        );
      }
      case 'Colaboradoras': {
        const c = resumenEvento.total_colaboradores || {};
        return (
          <>
            <UserCard type='aprobadas' count={toValidNumber(c.Aprobadas)} />
            <UserCard type='pendientes' count={toValidNumber(c.Pendientes)} />
            <UserCard
              type='desactivadas'
              count={toValidNumber(c.Rechazadas) + toValidNumber(c.Canceladas)}
            />
            <UserCard
              type='totales'
              count={toValidNumber(
                Object.values(c).reduce((a, b) => toValidNumber(a) + toValidNumber(b), 0),
              )}
            />
          </>
        );
      }
      case 'Administración':
        return (
          <>
            <UserCard type='mentoras' count={toValidNumber(resumenEvento.total_mentoras)} />
            <UserCard
              type='coordinadoras'
              count={toValidNumber(resumenEvento.total_coordinadoras)}
            />
          </>
        );
      case 'SEDES': {
        const s = resumenEvento.total_sedes || {};
        return (
          <>
            <UserCard
              type='activas'
              count={
                toValidNumber(s['Registrada sin participantes']) +
                toValidNumber(s['Registrada con participantes'])
              }
            />
            <UserCard type='pendientes' count={toValidNumber(s.Pendiente)} />
            <UserCard
              type='desactivadas'
              count={toValidNumber(s.Rechazada) + toValidNumber(s.Cancelada)}
            />
            <UserCard
              type='totales'
              count={toValidNumber(
                Object.values(s).reduce((a, b) => toValidNumber(a) + toValidNumber(b), 0),
              )}
            />
          </>
        );
      }
      default:
        return null;
    }
  };

  const extraHandleFilterChange = (key: string, value: string) => {
    setFade(true);
    setTimeout(() => {
      setFade(false);
      setFilters({ ...filters, [key]: value });
    }, 300);
  };

  const sectionFilterChange = (value: string) => {
    setFade(true);
    setFadeSec(true);
    setTimeout(() => {
      setFade(false);
      setFadeSec(false);
      setSection(value);
    }, 300);
  };

  if (!mounted) return null;

  return (
    <div className='flex flex-col gap-3 items-center justify-center'>
      <div className='flex justify-between w-full items-center'>
        <div className='flex flex-col md:flex-row items-center justify-center w-full relative'>
          <div
            className={`flex items-center gap-3 transition-opacity duration-300 ${fadeSec ? 'opacity-0' : 'opacity-100'}`}
          >
            <IconComponent
              fillColor='var(--text-color)'
              strokeColor='var(--background)'
              strokeWidth={0.7}
              width={'3vmax'}
              height={'3vmax'}
            />
            <h1 className='text-text text-[3vmax]'>{section}</h1>
          </div>
          <FiltroEvento
            disableCheckboxes
            label='Filtros'
            showSecciones
            labelSecciones='Secciones'
            secciones={[
              { label: 'Participantes', value: 'Participantes' },
              { label: 'Colaboradoras', value: 'Colaboradoras' },
              { label: 'Administración', value: 'Administración' },
              { label: 'SEDES', value: 'SEDES' },
            ]}
            seccionActiva={section}
            onChangeSeccion={sectionFilterChange}
            extraFilters={[
              section === 'Colaboradoras'
                ? {
                    label: 'Tipo de colaboradora',
                    key: 'colab',
                    options: [
                      { label: 'Todas', value: '' },
                      { label: 'Instructora', value: 'in' },
                      { label: 'Facilitadora', value: 'fa' },
                      { label: 'Staff', value: 'st' },
                    ],
                  }
                : section === 'Administración'
                  ? {
                      label: 'Tipo de coordinadora',
                      key: 'coord',
                      options: [
                        { label: 'Todas', value: '' },
                        { label: 'General', value: 'cg' },
                        { label: 'Asociada', value: 'ca' },
                        { label: 'Informes', value: 'ci' },
                      ],
                    }
                  : null,
              section !== 'SEDES'
                ? {
                    label: 'SEDE',
                    key: 'sede',
                    options: sedes,
                  }
                : null,
            ].filter(Boolean)}
            onExtraFilterChange={extraHandleFilterChange}
            fade={fadeSec}
          />
        </div>
      </div>
      <div className='w-full lg:w-4/7 flex flex-col'>
        <div
          className={`flex gap-4 justify-between flex-wrap transition-opacity duration-300 ${fade ? 'opacity-0' : 'opacity-100'}`}
        >
          {renderCards()}
        </div>
      </div>
    </div>
  );
};

export default CardSection;
