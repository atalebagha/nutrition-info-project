import React from 'react';
import { useMutation, gql } from '@apollo/react-hooks';
import { useForm } from 'react-hook-form';
import * as R from 'ramda';
import Input from '../components/Input';

const CREATE_DESSERT = gql`
  mutation createDessert($input: DessertInput!) {
    createDessert(input: $input) {
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

interface DessertListProps {
  onClose: Function
}

function DesertList({ onClose }: DessertListProps) {
  const [createDessert, { loading }] = useMutation(CREATE_DESSERT, {
    onCompleted() {
      onClose();
    },
    refetchQueries: [
      { query: LIST_DESSERTS },
    ],
  });
  const { register, handleSubmit, errors } = useForm();

  const onSubmit = async (data: Object) => {
    await createDessert({
      variables: { input: R.evolve({ carb: Number, fat: Number, protein: Number, calories: Number }, data) },
    });
  }

  return (
    <form className="measer center" onSubmit={handleSubmit(onSubmit)}>
      <fieldset id="new-dessert" className="ba b--transparent ph0 mh0">
        <legend className="f4 fw6 ph0 mh0">Please fill all details before you submit</legend>
        <Input
          errors={errors.dessert}
          ref={register({ required: true })}
          disabled={loading}
          name="dessert"
          label="Dessert Name*"
          type="text"
        />
        <Input
          errors={errors.calories}
          ref={register({ required: true })}
          disabled={loading}
          name="calories"
          label="Calories*"
          type="number"
        />
        <Input
          errors={errors.fat}
          ref={register({ required: true })}
          disabled={loading}
          name="fat"
          label="Fat*"
          type="number"
        />
        <Input
          errors={errors.carb}
          ref={register({ required: true })}
          disabled={loading}
          name="carb"
          label="Carbs*"
          type="number"
        />
        <Input
          errors={errors.protein}
          ref={register({ required: true })}
          disabled={loading}
          name="protein"
          label="Protein*"
          type="number"
        />
        <div className="mt3">
          <input className="f6 f5-l button-reset fl pv2 tc bn bg-animate bg-dark-green hover-bg-black white pointer w-100 br2-ns br--right-ns" type="submit" value="SUBMIT" />
        </div>
      </fieldset>
    </form>
  )

}

export default DesertList;
