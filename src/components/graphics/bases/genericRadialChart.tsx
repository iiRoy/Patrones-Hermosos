'use client';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';
import withIconDecorator from '../../decorators/IconDecorator';
import * as Icons from '../../icons';

export const Options = withIconDecorator(Icons.DotsThree);

interface GenericRadialChartProps {
  apiEndpoint: string;
  dataPath: string;
  title?: string;
  legendKeys?: string[];
  colorPalette?: string[];
}

interface DataItem {
  rol: string;
  total: number;
  fill: string;
}

const GenericRadialChart: React.FC<GenericRadialChartProps> = ({
  apiEndpoint,
  dataPath,
  title = 'Gráfico Radial',
  legendKeys,
  colorPalette,
}) => {
  const [data, setData] = useState<DataItem[]>([]);
  const [total, setTotal] = useState(0);
  const [fade, setFade] = useState(false);
  const isFirstRender = useRef(true);

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(apiEndpoint, {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}` || '',
          },
        });
  
        const json = await res.json();
        const source = dataPath ? json[dataPath] : json;
  
        if (!source || typeof source !== 'object') {
          console.warn(`⚠️ No se encontró ${dataPath} en la respuesta.`);
          return;
        }
  
        const defaultPalette = [
          { fill: '#683756' },
          { fill: '#97639c' },
          { fill: '#B77690' },
        ];
  
        const parsedPalette = (colorPalette ?? defaultPalette).map((color) =>
          typeof color === 'string' ? { fill: color } : color,
        );
  
        const keys = Object.keys(source);
        const processed = keys.map((key, index) => {
          const palette = parsedPalette[index % parsedPalette.length];
          return {
            rol: key.charAt(0).toUpperCase() + key.slice(1),
            total: Number(source[key]) || 0,
            fill: palette.fill,
          };
        });
  
        const totalCantidad = processed.reduce((sum, d) => sum + d.total, 0);
  
        setFade(true);
        setTimeout(() => {
          setData([{ rol: 'Total', total: totalCantidad, fill: 'white' }, ...processed]);
          setTotal(totalCantidad);
          setFade(false);
          isFirstRender.current = false;
        }, 100);
      } catch (err) {
        console.error('❌ Error al cargar datos:', err);
      }
    };
  
    fetchData();
  }, [apiEndpoint, dataPath, colorPalette]);  

  const legendToShow = legendKeys ?? data.filter((d) => d.rol !== 'Total').map((d) => d.rol);

  return (
    <div className='bg-white rounded-xl w-full h-full p-4 justify-between min-gap-2 flex flex-col'>
      {/* Título */}
      <div className='flex justify-between items-center'>
        <h1 className='flex justify-between font-bold items-center text-2xl'>{title}</h1>
        <Options
          fillColor='var(--secondary)'
          strokeColor='var(--secondary)'
          strokeWidth={2.5}
          width={'3vmax'}
          height={'3vmax'}
        />
      </div>

      {/* Contenedor con animación */}
      <div
        className={`size-full transition-opacity duration-300 ${
          fade ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {data.length <= 1 || total === 0 ? (
          <div className='flex justify-center items-center h-full'>
            <p className='text-textDim text-lg'>No hay datos para mostrar</p>
          </div>
        ) : (
          <>
            {/* Gráfico */}
            <div className='relative w-full h-full'>
              <ResponsiveContainer>
                <RadialBarChart
                  cx='50%'
                  cy='50%'
                  innerRadius='40%'
                  outerRadius='100%'
                  barSize={32}
                  data={data}
                >
                  <RadialBar
                    background={{ fill: '#E6E1ECFF' }}
                    dataKey='total'
                    fill='#000'
                    cornerRadius={10}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
              <Image
                src='/assets/logo.png'
                alt='Logo centro'
                width={50}
                height={50}
                className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
              />
            </div>
          </>
        )}
      </div>

      {/* Leyenda */}
      <div className='flex justify-between gap-3 items-center w-auto ml-5 mr-5 mt-1'>
        {legendToShow.map((rol) => {
          const item = data.find((d) => d.rol === rol);
          return (
            <div key={rol} className='flex flex-col items-center' style={{color: item?.fill || '#ccc',}} >
              <div className={`w-5 h-5 rounded-full`} style={{ backgroundColor: item?.fill || '#ccc'}} />
              <h1 className='font-semibold'>{item?.total ?? 0}</h1>
              <h2 className='text-xs text-gray-600'>{rol}</h2>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GenericRadialChart;
