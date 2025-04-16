'use client';
import React, { useState, useEffect, useRef } from 'react';
import withIconDecorator from '../decorators/IconDecorator';
import * as Icons from '../icons';

interface Option {
  label: string;
  value: string;
}

interface ExtraFilter {
  label: string;
  key: string;
  options: Option[];
}

interface FiltroEventoProps {
  disableCheckboxes?: boolean;
  options?: Option[];
  selected?: string[];
  onChange?: (updated: string[]) => void;
  label?: string;
  labelOptions?: string;
  iconName?: keyof typeof Icons;
  showSecciones?: boolean;
  labelSecciones?: string;
  secciones?: Option[];
  seccionActiva?: string;
  onChangeSeccion?: (s: string) => void;
  extraFilters?: (ExtraFilter | null)[];
  onExtraFilterChange?: (key: string, value: string) => void;
  fade?: boolean;
}

const FiltroEvento: React.FC<FiltroEventoProps> = ({
  options = [],
  selected = [],
  onChange = () => {},
  label = 'Filtros',
  labelOptions = 'Opciones',
  iconName,
  showSecciones = false,
  labelSecciones = 'Sección',
  secciones = [],
  seccionActiva = '',
  onChangeSeccion = () => {},
  extraFilters = [],
  onExtraFilterChange = () => {},
  disableCheckboxes = false,
  fade = false,
}) => {
  const [show, setShow] = useState(false);
  const [filterVisibility, setFilterVisibility] = useState<Record<string, boolean>>({});
  const dropdownRef = useRef<HTMLDivElement>(null);
  const filterVisibilityRef = useRef(filterVisibility);

  useEffect(() => {
    filterVisibilityRef.current = filterVisibility;
  }, [filterVisibility]);

  const toggleDropdown = () => {
    if (!show) {
      setShow(true);
    } else {
      setShow(false);
    }
  };

  const handleToggle = (value: string) => {
    const updated = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value];
    onChange(updated);
  };

  useEffect(() => {
    if (fade) {
      setFilterVisibility({});
    } else {
      extraFilters.forEach((filter, index) => {
        if (filter && !filterVisibilityRef.current[filter.key]) {
          setTimeout(() => {
            setFilterVisibility((prev) => ({
              ...prev,
              [filter.key]: true,
            }));
          }, index * 100);
        }
      });
    }
  }, [extraFilters, fade]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if ((event.target as HTMLElement).closest('#filter-bar')) return;
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShow(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const IconComponent = withIconDecorator(
    iconName && Icons[iconName] ? Icons[iconName] : Icons.CaretDoubleDown,
  );

  return (
    <div className='flex items-center w-full justify-end relative'>
      <div
        id='filter-bar'
        className='flex items-center rounded-lg px-3 py-2 cursor-pointer w-full md:max-w-xs gap-3 bg-[#E6E1ECFF] text-primaryShade'
        onClick={toggleDropdown}
      >
        <IconComponent
          fillColor='var(--primary)'
          strokeColor='var(--primary)'
          strokeWidth={1}
          width={25}
          height={25}
        />
        <span className='font-bold text-lg'>{label}</span>
      </div>

      <div
        ref={dropdownRef}
        id='filter-bar'
        className={`absolute top-full right-0 mt-2 w-full md:max-w-xs bg-white rounded-lg shadow-custom-dark z-10 transform transition-all duration-300 ease-in-out
      ${show ? 'opacity-100 scale-100 visible pointer-events-auto' : 'opacity-0 scale-95 invisible pointer-events-none'}
    `}
      >
        {showSecciones && secciones.length > 0 && (
          <div
            className={`px-4 py-2 transform transition-all duration-300 ease-in-out
            ${show && !fade ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95'} ${fade ? 'pointer-events-none' : ''}`}
          >
            <label className='text-sm font-semibold text-gray-700'>{labelSecciones}</label>
            <select
              className='w-full bg-text font-semibold mt-1 p-2 rounded-lg'
              value={seccionActiva}
              onChange={(e) => onChangeSeccion(e.target.value)}
            >
              {secciones.map((sec, index) => (
                <option
                  key={sec.value}
                  value={sec.value}
                  className={`bg-text ${index % 2 === 0 ? 'text-primaryShade' : 'text-secondaryShade'}`}
                >
                  {sec.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {extraFilters.map((filter) =>
          filter ? (
            <div
              key={filter.key}
              className={`px-4 py-2 transform transition-all duration-300 ease-in-out ${
                filterVisibility[filter.key]
                  ? 'opacity-100 scale-100 visible'
                  : 'opacity-0 scale-95'
              }`}
            >
              <label className='text-sm font-semibold text-gray-700'>{filter.label}</label>
              <select
                className='w-full bg-text mt-1 p-2 rounded-lg'
                onChange={(e) => onExtraFilterChange(filter.key, e.target.value)}
              >
                {filter.options.map((opt, index) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    className={`bg-text ${
                      index % 2 === 0 ? 'text-primaryShade' : 'text-secondaryShade'
                    }`}
                  >
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          ) : null,
        )}

        {!disableCheckboxes && options.length > 0 && (
          <div className='px-4 py-2'>
            <label className='text-sm font-semibold text-gray-700'>{labelOptions}</label>
            {options.map((option, index) => (
              <label
                key={option.value}
                className={`flex items-center px-2 py-1 hover:bg-purple-100 cursor-pointer rounded-md ${index % 2 === 0 ? 'text-primaryShade' : 'text-secondaryShade'}`}
              >
                <input
                  type='checkbox'
                  checked={selected.includes(option.value)}
                  onChange={() => handleToggle(option.value)}
                  className={`checkbox-circle mr-2 ${
                    index % 2 === 0 ? 'checkbox-odd' : 'checkbox-even'
                  }`}
                />
                <span className='text-sm'>{option.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FiltroEvento;
