'use client';

import Pagination from '@/components/buttons_inputs/Pagination';
import InputField from '@/components/buttons_inputs/InputField';
import Button from '@/components/buttons_inputs/Button';
import PageTitle from '@/components/headers_menu_users/pageTitle';
import FiltroEvento from '@/components/headers_menu_users/FiltroEvento';
import Dropdown from '@components/buttons_inputs/Dropdown';
import { Envelope } from '@/components/icons';
import withIconDecorator from '@/components/decorators/IconDecorator'; // Import withIconDecorator
import { useState, useMemo, useEffect } from 'react';

const CorreosAdmin = () => {
    const [inputValue, setInputValue] = useState('');
    const [section, setSection] = useState('SEDES');
    const [filterActivaExtra, setFilterActivaExtra] = useState({});
    const [fadeSec, setFadeSec] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [correosData, setCorreosData] = useState([
        { id: '01', nombre: 'María González', sede: 'ITESM Monterrey', grupo: '07', correo: 'maria@correo.com', asunto: 'aceptado' },
        { id: '02', nombre: 'Sofía González', sede: 'ITESM Monterrey', grupo: '07', correo: 'maria@correo.com', asunto: 'aceptado' },
        { id: '03', nombre: 'Bárbara González', sede: 'ITESM Monterrey', grupo: '07', correo: 'maria@correo.com', asunto: 'aceptado' },
        { id: '04', nombre: 'Jessica González', sede: 'ITESM Monterrey', grupo: '07', correo: 'maria@correo.com', asunto: 'aceptado' },
        { id: '05', nombre: 'Ana González', sede: 'ITESM Monterrey', grupo: '07', correo: 'maria@correo.com', asunto: 'aceptado' },
        { id: '06', nombre: 'Natalia González', sede: 'ITESM Monterrey', grupo: '07', correo: 'maria@correo.com', asunto: 'aceptado' },
        { id: '07', nombre: 'Fernanda González', sede: 'ITESM Monterrey', grupo: '07', correo: 'maria@correo.com', asunto: 'aceptado' },
        { id: '08', nombre: 'María González', sede: 'ITESM Monterrey', grupo: '07', correo: 'maria@correo.com', asunto: 'aceptado' },
        { id: '09', nombre: 'Sofía González', sede: 'ITESM Monterrey', grupo: '07', correo: 'maria@correo.com', asunto: 'aceptado' },
        { id: '10', nombre: 'Bárbara González', sede: 'ITESM Monterrey', grupo: '07', correo: 'maria@correo.com', asunto: 'aceptado' },
        { id: '11', nombre: 'Jessica González', sede: 'ITESM Monterrey', grupo: '07', correo: 'maria@correo.com', asunto: 'aceptado' },
        { id: '12', nombre: 'Ana González', sede: 'ITESM Monterrey', grupo: '07', correo: 'maria@correo.com', asunto: 'aceptado' },
        { id: '13', nombre: 'Natalia González', sede: 'ITESM Monterrey', grupo: '07', correo: 'maria@correo.com', asunto: 'aceptado' },
        { id: '14', nombre: 'Fernanda González', sede: 'ITESM Monterrey', grupo: '07', correo: 'maria@correo.com', asunto: 'aceptado' },
    ]);

    const rowsPerPage = 5;

    const extraHandleFilterChange = (key: string, value: string) => {
        setFilterActivaExtra((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    // Function to handle dropdown change for a specific row
    const handleAsuntoChange = (id: string, newAsunto: string) => {
        setCorreosData((prevData) =>
            prevData.map((item) =>
                item.id === id ? { ...item, asunto: newAsunto.toLowerCase() } : item
            )
        );
    };

    // Filtrar los datos según el valor de búsqueda (por las columnas "Nombre", "Sede", "Grupo", "Correo", "Asunto")
    const filteredData = useMemo(() => {
        const searchTerm = inputValue.toLowerCase().trim();
        if (!searchTerm) {
            return correosData;
        }

        return correosData.filter(item =>
            item.nombre.toLowerCase().includes(searchTerm) ||
            item.sede.toLowerCase().includes(searchTerm) ||
            item.grupo.toLowerCase().includes(searchTerm) ||
            item.correo.toLowerCase().includes(searchTerm) ||
            item.asunto.toLowerCase().includes(searchTerm)
        );
    }, [inputValue, correosData]);

    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    const paginatedData = filteredData.slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage);

    // Añadimos un useEffect para reiniciar currentPage cuando filteredData cambie
    useEffect(() => {
        if (currentPage >= totalPages && totalPages > 0) {
            setCurrentPage(totalPages - 1);
        } else if (totalPages === 0) {
            setCurrentPage(0);
        }
    }, [filteredData.length, currentPage, totalPages]);

    return (
        <div className="p-6 pl-14 flex gap-4 flex-col text-primaryShade pagina-sedes">
            <PageTitle>Gestión de Correos</PageTitle>

            <div className="fondo-sedes flex flex-col p-6 gap-4 ">
                {/* Fila de búsqueda, filtro y botón */}
                <div className="flex flex-wrap items-center justify-between">
                    <div className="flex flex-1 gap-4">
                        <div className="basis-2/3">
                            <InputField
                                label=""
                                showDescription={false}
                                placeholder="Search"
                                showError={false}
                                variant="primary"
                                icon="MagnifyingGlass"
                                value={inputValue}
                                onChangeText={(val) => setInputValue(val)}
                            />
                        </div>

                        <div className="basis-1/3">
                            <FiltroEvento
                                disableCheckboxes
                                label="Filtros"
                                showSecciones
                                labelSecciones="Secciones"
                                secciones={[
                                    { label: 'ITESM Puebla', value: 'Participantes' },
                                    { label: 'ITESM Monterrey', value: 'Colaboradoras' },
                                ]}
                                seccionActiva={section}
                                extraFilters={[]}
                                filterActiva={filterActivaExtra}
                                onExtraFilterChange={extraHandleFilterChange}
                                fade={fadeSec}
                            />
                        </div>
                    </div>
                </div>

                {/* Tabla */}
                <div className="overflow-x-auto flex-1">
                    <table className="min-w-full text-left text-sm">
                        <thead className="text-purple-800 font-bold">
                            <tr className='texto-primary-shade'>
                                <th className="p-2 text-center">Nombre</th>
                                <th className="p-2 text-center">Sede</th>
                                <th className="p-2 text-center">Grupo</th>
                                <th className="p-2 text-center">Correo</th>
                                <th className="p-2 text-center">Asunto</th>
                                <th className="p-2 text-center"></th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700">
                            {paginatedData.map((diploma) => (
                                <tr key={diploma.id} className="border-t border-gray-300">
                                    <td className="p-2 text-center">{diploma.nombre}</td>
                                    <td className="p-2 text-center">{diploma.sede}</td>
                                    <td className="p-2 text-center">{diploma.grupo}</td>
                                    <td className="p-2 text-center">{diploma.correo}</td>
                                    <td className="p-2 text-center">
                                        <Dropdown
                                            label=""
                                            options={['Aceptada', 'Rechazada']}
                                            value={diploma.asunto.charAt(0).toUpperCase() + diploma.asunto.slice(1)} // Capitalize for display
                                            onChange={(value: string) => handleAsuntoChange(diploma.id, value)}
                                            variant="accent"
                                            Icon={withIconDecorator(Envelope)}
                                        />
                                    </td>
                                    <td className="p-2 justify-center">
                                        <Button label='' variant="primary" round showLeftIcon IconLeft={Envelope} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Paginación */}
                <div className="mt-auto pt-4 flex justify-center">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        variant="secondary-shade"
                        pageLinks={Array(totalPages).fill('#')}
                    />
                </div>
            </div>
        </div>
    );
};

export default CorreosAdmin;