import React, { useState } from 'react';

interface Column<T> {
    key: keyof T | string;
    label: string;
    render?: (item: T, index: number) => React.ReactNode; 
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    itemsPerPage: number;
}

const DataTable = <T extends object>({ data, columns, itemsPerPage }: DataTableProps<T>) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredData = data.filter(item =>
        columns.some(column =>
            String(item[column.key as keyof T]).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div>
            <div className="row mb-3">
                <div className="col-3">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="form-control"
                    />
                </div>
            </div>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>SR</th> 
                        {columns.map(column => (
                            <th key={String(column.key)}>{column.label}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {currentData.length > 0 ? (
                        currentData.map((item, index) => (
                            <tr key={index}>
                                <td>{startIndex + index + 1}</td> 
                                {columns.map(column => (
                                    <td key={String(column.key)}>
                                        {column.render ? column.render(item, index) : (item[column.key as keyof T] as unknown as React.ReactNode)}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length + 1} className="text-center"> 
                                No data available
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            <nav>
                <ul className="pagination">
                    <li className={`page-item ${currentPage <= 1 ? 'disabled' : ''}`}>
                        <a className="page-link" onClick={() => handlePageChange(currentPage - 1)}>Previous</a>
                    </li>
                    {[...Array(totalPages)].map((_, index) => (
                        <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                            <a className="page-link" onClick={() => handlePageChange(index + 1)}>
                                {index + 1}
                            </a>
                        </li>
                    ))}
                    <li className={`page-item ${currentPage >= totalPages ? 'disabled' : ''}`}>
                        <a className="page-link" onClick={() => handlePageChange(currentPage + 1)}>Next</a>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default DataTable;
