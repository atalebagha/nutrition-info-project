import React, { Ref } from 'react';
import type { CElement } from 'react';
import * as R from 'ramda';
import { useTable, useRowSelect, useMountedLayoutEffect, useSortBy } from 'react-table';


interface TableCheckboxProps {
  indeterminate?: boolean;
  name: string;
}

interface TableHeaderProps {
  getToggleAllRowsSelectedProps: Function;
  name: string;
}

interface TableProps {
  columns: any,
  data: Array<Object>,
  onSelectedRowsChange: Function
};

const useCombinedRefs = (...refs: any[]): React.MutableRefObject<any> => {
  const targetRef = React.useRef();

  React.useEffect(() => {
    refs.forEach(ref => {
      if (!ref) return;

      if (typeof ref === 'function') {
        ref(targetRef.current);
      } else {
        ref.current = targetRef.current;
      }
    });
  }, [refs]);

  return targetRef;
};

const TableCheckbox: any = React.forwardRef<HTMLInputElement, TableCheckboxProps>(
  ({ indeterminate, ...rest }: any, ref: Ref<any>) => {
    const defaultRef = React.useRef<HTMLInputElement>()
    const resolvedRef = useCombinedRefs(ref, defaultRef);

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate ?? false;
    }, [resolvedRef, indeterminate]);

    return (
      <>
        <input className="mr2" type="checkbox" ref={resolvedRef} {...rest} />
      </>
    )
  }
)


const Table = (props: TableProps): CElement<TableProps, any> => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    // @ts-ignore
    selectedFlatRows,
  } = useTable({
    columns: props.columns,
    data: props.data,
  },
  useSortBy,
  useRowSelect,
  hooks => {
    R.hasPath(['visibleColumns'], hooks) && hooks.visibleColumns.push((columns: any[]) => [
      {
        id: 'id',
        Header: ({ getToggleAllRowsSelectedProps }: TableHeaderProps) => (
          <div className="items-center mb2">
            <TableCheckbox {...getToggleAllRowsSelectedProps()} />
          </div>
        ),
        Cell: ({ row }: any) => (
          <div className="items-center mb2">
            <TableCheckbox {...row.getToggleRowSelectedProps()} />
          </div>
        ),
      },
      ...columns,
    ])
  });

  useMountedLayoutEffect(() => {
    props.onSelectedRowsChange && props.onSelectedRowsChange(selectedFlatRows);
  }, [props.onSelectedRowsChange, selectedFlatRows]);

  return (
    <table className="f3 w-100 mw8 center" cellSpacing="0" {...getTableProps()}>
      <thead>
      {headerGroups.map((headerGroup: any) => (
        <tr {...headerGroup.getHeaderGroupProps()}>
          {headerGroup.headers.map((column: any )=> (
            <th className="fw6 tl pa3 bg-white" {...column.getHeaderProps(column.getSortByToggleProps())}>
              {column.render('Header')}
              <span>
                {column.isSorted
                  ? column.isSortedDesc
                    ? ' 🔽'
                    : ' 🔼'
                  : ''}
              </span>
            </th>
          ))}
        </tr>
      ))}
      </thead>
      <tbody className="lh-copy" {...getTableBodyProps()}>
        {rows.map((row: any, i: Number) => {
          prepareRow(row)
          return (
            <tr className="stripe-dark" {...row.getRowProps()}>
              {R.hasPath(['cells'], row) && row.cells.map((cell: any) => {
                return <td className="pa3" {...cell.getCellProps()}>{cell.render('Cell')}</td>
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default Table;
