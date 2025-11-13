import React, { useState, useEffect, useMemo } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper'; // Usado tipicamente como Container

import './tableGastos.css'

function TableGastos(infos) {
  const data = infos.gastos
  const [sortConfig, setSortConfig] = useState({ key: 'data', direction: 'desc' });
  const [expandedRowId, setExpandedRowId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  const categories = useMemo(() => {
    const uniqueCategories = new Set(data.map(item => item.categoria));
    return ['Todas', ...Array.from(uniqueCategories).sort()];
  }, [data]);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const sortedData = useMemo(() => {
    let filteredItems = data;
  
    if (selectedCategory !== 'Todas') {
      filteredItems = data.filter(item => item.categoria === selectedCategory);
    }

    let sortableItems = [...filteredItems];

    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        const key = sortConfig.key;
        let valA = a[key];
        let valB = b[key];
        
        let comparisonResult = 0;

        if (key === 'data') {
          const parseDate = (dateString) => {
              const parts = dateString.split('/'); 
              if (parts.length === 3) {
                  return new Date(`${parts[1]}/${parts[0]}/${parts[2]}`).getTime(); 
              }
              return new Date(dateString).getTime(); 
          };

          const timeA = parseDate(valA);
          const timeB = parseDate(valB);

          comparisonResult = timeA - timeB;
        } else if (key === 'valorBRL') {
          const numA = parseFloat(String(valA).replace(',', '.'));
          const numB = parseFloat(String(valB).replace(',', '.'));
          comparisonResult = numA - numB;
        } else {
          if (valA < valB) {
            comparisonResult = -1;
          }
          if (valA > valB) {
            comparisonResult = 1;
          }
        }

        return sortConfig.direction === 'asc' ? comparisonResult : -comparisonResult;
      });
    }
    return sortableItems;
  }, [data, sortConfig, selectedCategory]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleRowClick = (id) => {
    setExpandedRowId(id === expandedRowId ? null : id);
  };

  return (
    <div className='tableGastos'>
      <div className='filterSelect'>
        <label htmlFor="categoryFilter">Filtrar por Categoria: </label>
        <select 
          id="categoryFilter"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <Table>
        <TableHead>
          <TableRow className='headerTable'>
            {['data', 'categoria', 'valorBRL'].map((key) => (
              <th key={key} onClick={() => requestSort(key)} className='headerItem'>
                {key.toUpperCase()}
                {sortConfig.key === key ? (sortConfig.direction === 'asc' ? ' ↑' : ' ↓') : ''}
              </th>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedData.map((item) => (
            <React.Fragment key={item.id}>
              <TableRow onClick={() => handleRowClick(item.id)} style={{ cursor: 'pointer' }} className='rowData'>
                <TableCell>
                  {item.data}
                  <br/>
                  {expandedRowId === item.id && (
                    <>{item.titulo}: {item.descricao}</>
                  )}
                </TableCell>

                <TableCell>
                  {item.categoria}
                  <br/>
                  {expandedRowId === item.id && (
                    <>{item.metodo}</>
                  )}
                </TableCell>

                <TableCell className={expandedRowId === item.id ? 'lastChild lastChildActive' : 'lastChild'}>
                  {item.valorBRL}BRL
                  <br/>
                  {expandedRowId === item.id && (
                    <>{item.valor}{item.moeda}</>
                  )}
                  <span>
                    <svg width="15" height="15" viewBox="0 0 25 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M0.732233 0.732233C1.70854 -0.244078 3.29146 -0.244078 4.26777 0.732233L12.5 8.96447L20.7322 0.732233C21.7085 -0.244078 23.2915 -0.244078 24.2678 0.732233C25.2441 1.70854 25.2441 3.29146 24.2678 4.26777L14.2678 14.2678C13.7989 14.7366 13.163 15 12.5 15C11.837 15 11.2011 14.7366 10.7322 14.2678L0.732233 4.26777C-0.244078 3.29146 -0.244078 1.70854 0.732233 0.732233Z" fill="#F8F3EA"/>
                    </svg>
                  </span>
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  )
  
}

export default TableGastos
