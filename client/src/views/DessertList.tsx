/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/react-hooks';
import Table from '../components/Table';

const LIST_DESSERTS = gql`
  query {
    listDesserts {
      id
      dessert
      nutritionInfo {
        carb
        fat
        calories
        protein
      }
    }
  }
`;

const REMOVE_DESSERT = gql`
  mutation($id: ID!) {
    removeDessert(id: $id) {
      id
      dessert
      nutritionInfo {
        carb
        fat
        calories
        protein
      }
    }
  }
`;

const RESET_DESSERTS = gql`
  mutation {
    resetDesserts {
      id
    }
  }
`;

interface DessertListProps {
  addDessert: Function
  rowsSelected: number
}

function DesertList({ addDessert }: DessertListProps) {
  const { data, loading, refetch } = useQuery(LIST_DESSERTS, { fetchPolicy: 'network-only' });
  const [removeDessert] = useMutation(REMOVE_DESSERT, { fetchPolicy: 'no-cache' });
  const [resetDesserts] = useMutation(RESET_DESSERTS, { fetchPolicy: 'no-cache' });
  const [selectedRows, setSelectedRows] = useState([]);
  const columns = React.useMemo(
    () => [
      {
        Header: 'Dessert',
        accessor: 'dessert',
      },
      {
        Header: 'Calories',
        accessor: 'nutritionInfo.calories',
      },
      {
        Header: 'Fat (g)',
        accessor: 'nutritionInfo.fat',
      },
      {
        Header: 'Carbs (g)',
        accessor: 'nutritionInfo.carb',
      },
      {
        Header: 'Protein (g)',
        accessor: 'nutritionInfo.protein',
      },
    ],
    []
  )

  const handleRemoveDesserts = async () => {
    const promises = selectedRows.map((row: any) => {
      return removeDessert({
        variables: { id: row.original.id },
        fetchPolicy: 'no-cache',
      })
    });
    await Promise.all(promises);
    await refetch();
  };

  const handleResetDesserts = async () => {
    await resetDesserts({ fetchPolicy: 'no-cache' });
    await refetch();
  };
  if (loading) return <div>Loading...</div>;
  return (
    <>
      <div className="pa4 mw8 pv2 flex">
        {/* @ts-ignore */}
        <a className="ma3 f6 link dim br1 ba bw2 ph3 pv2 mb2 dib dark-red" disabled={selectedRows.length === 0} ariaDisabled={data?.listDesserts.length === 0} onClick={handleResetDesserts} href="#">Reset</a>
      </div>
      <div className="pa4 mw8 pv3 flex">
        <a className="ma3 f6 link dim br1 ba bw2 ph3 pv2 mb2 dib dark-green" href="#" onClick={() => addDessert()}>Add New</a>
        {/* @ts-ignore */}
        <a className="ma3 f6 link dim br1 ba bw2 ph3 pv2 mb2 dib dark-pink" disabled={selectedRows.length === 0} ariaDisabled={selectedRows.length === 0} onClick={handleRemoveDesserts} href="#">Delete</a>
      </div>
      <div className="ph3">
        <Table columns={columns} data={data?.listDesserts} onSelectedRowsChange={setSelectedRows} />
      </div>
    </>
  );
}

export default DesertList;
