import React from 'react';
import { useTable } from 'react-table';
import './datatable.css';

const DataTable = ({ data, columns }) => {
    // Asegúrate de que useTable se llama correctamente
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data });

    return (
        <table {...getTableProps()} className="data-table">
            <thead>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th {...column.getHeaderProps()}>
                                {column.render('Header')}
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.length > 0 ? (
                    rows.map(row => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => (
                                    <td {...cell.getCellProps()}>
                                        {cell.render('Cell')}
                                    </td>
                                ))}
                            </tr>
                        );
                    })
                ) : (
                    <tr>
                        <td colSpan={columns.length} className="table-empty">
                            No hay datos para mostrar
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
};

export default DataTable;