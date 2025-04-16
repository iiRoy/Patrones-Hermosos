'use client';
import React, { useEffect, useState, useRef } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Rectangle,
} from 'recharts';

import withIconDecorator from '../../decorators/IconDecorator';
import Filtro from '../../headers_menu_users/FiltroEvento';
import * as Icons from '../../icons';
export const Options = withIconDecorator(Icons.DotsThree);
export const Filtros = withIconDecorator(Icons.CaretDoubleDown);

import CustomTick from '../structure/customTick';
import CustomLegend from '../structure/customLegend';

interface GenericBarChartProps {
  apiEndpoint: string;
  title?: string;
  dataPath?: string;
  xKey?: string;
  labelFormatterPrefix?: string;
}

type GenericChartData = {
  [key: string]: string | number;
};

const GenericBarChart: React.FC<GenericBarChartProps> = ({
  apiEndpoint,
  title = 'Gráfica',
  dataPath,
  xKey = 'name',
  labelFormatterPrefix = '',
}) => {
  const [data, setData] = useState<GenericChartData[]>([]);
  const [filteredData, setFilteredData] = useState<GenericChartData[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [fade, setFade] = useState(false);
  const isFirstRender = useRef(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(apiEndpoint, {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
          },
        });

        const json = await res.json();
        console.log('📦 Respuesta JSON completa:', json);

        const rawData = dataPath ? json[dataPath] : json;

        if (!rawData) {
          setError(`No se encontró la propiedad "${dataPath}" en la respuesta.`);
          return;
        }

        if (!Array.isArray(rawData)) {
          setError(`La propiedad "${dataPath}" no contiene un arreglo válido.`);
          return;
        }

        if (rawData.length === 0) {
          setError(`La lista está vacía.`);
          return;
        }

        console.log('✅ Datos listos para graficar:', rawData);
        setError(null);
        setData(rawData);
        setFilteredData(rawData);
        setSelectedKeys(rawData.map((d) => d[xKey] as string));
        setTimeout(() => {
          isFirstRender.current = false;
        }, 10);
      } catch (err) {
        console.error('❌ Error cargando datos:', err);
        setError('Error al cargar los datos del servidor.');
      }
    };

    fetchData();

    const handleClickOutside = (event: MouseEvent) => {
      if ((event.target as HTMLElement).closest('#filter-bar')) return;
      const dropdown = document.getElementById('filter-dropdown');
      if (dropdown && !dropdown.contains(event.target as Node)) {
        dropdown.classList.add('hidden');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [apiEndpoint, dataPath, xKey]);

  const handleFilterChange = (updated: string[]) => {
    setFade(true);
    setTimeout(() => {
      setSelectedKeys(updated);
      setFilteredData(data.filter((d) => updated.includes(d[xKey] as string)));
      setFade(false);
    }, 200);
  };

  const options = data.map((d) => ({
    value: d[xKey] as string,
    label: d[xKey] as string,
  }));

  const seriesKeys =
    data.length > 0
      ? Object.keys(data[0]).filter((key) => key !== xKey && typeof data[0][key] === 'number')
      : [];

  return (
    <div className='bg-white rounded-xl w-full h-full p-4 flex flex-col justify-between'>
      <div className='flex justify-between items-center'>
        <h1 className='font-bold text-2xl'>{title}</h1>
        <Options
          fillColor='var(--secondary)'
          strokeColor='var(--secondary)'
          strokeWidth={2.5}
          width={'3vmax'}
          height={'3vmax'}
        />
      </div>

      <div className='flex flex-col md:flex-row gap-3 md:gap-6 justify-between items-center mt-4 mb-4 ml-7 mr-7'>
        <CustomLegend legendKeys={seriesKeys} />
        <div className='flex justify-between w-full items-center'>
          <div className='flex items-center w-full justify-end'>
              <Filtro
                options={options}
                selected={selectedKeys}
                onChange={handleFilterChange}
                iconName= {undefined}
                label='Filtros'
                labelOptions='SEDEs'
              />
          </div>
        </div>
      </div>

      <div
        className={`w-full h-full transition-opacity duration-300 ${
          fade ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {filteredData.length === 0 || seriesKeys.length === 0 ? (
          <div className='flex justify-center items-center h-full'>
            <p className='text-textDim text-lg'>No hay datos para mostrar</p>
          </div>
        ) : (
          <ResponsiveContainer>
            <BarChart data={filteredData} barSize={20}>
              <CartesianGrid strokeDasharray='3 3' vertical={false} stroke='#BBA5BDFF' />
              <XAxis
                dataKey={xKey}
                axisLine={false}
                tick={<CustomTick numElements={filteredData.length} />}
                tickLine={false}
                interval={0}
                height={60}
              />
              <YAxis axisLine={false} tick={{ fill: '#8E76A3FF' }} tickLine={false} />
              <Tooltip
                labelFormatter={(label) => (
                  <span style={{ fontWeight: 'bold' }}>{`${labelFormatterPrefix} ${label}`}</span>
                )}
                formatter={(value, name) => {
                  const upperName =
                    typeof name === 'string' ? name.charAt(0).toUpperCase() + name.slice(1) : name;
                  return [`${value}`, upperName];
                }}
                contentStyle={{
                  backgroundColor: '#fff',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                }}
              />
              {seriesKeys.map((key, index) => (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={index === 0 ? '#97639c' : '#C57FAB'}
                  radius={[10, 10, 0, 0]}
                  activeBar={
                    index === 0 ? <Rectangle fill='#6E2D75' /> : <Rectangle fill='#683756' />
                  }
                  isAnimationActive={isFirstRender.current}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default GenericBarChart;