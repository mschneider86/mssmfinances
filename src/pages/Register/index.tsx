import React, { useState } from 'react';
import { Modal } from 'react-native';

import { Input } from '../../../components/Forms/Input';
import { InputForm } from '../../../components/InputForm';

import { Button } from '../../../components/Forms/Button';
import { TransactionTypeButton } from '../../../components/Forms/TransactionTypeButton';
import { CategorySelectButton } from '../../../components/Forms/CategorySelectButton';

import { CategorySelect } from '../CategorySelect';

import {
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionTypes,
} from './styles';

interface FormData {
  name: string;
  amount: string;
}

import { useForm } from 'react-hook-form';

export function Register() {
  const [transactionType, setTransactionType] = useState('');
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  const { control, handleSubmit } = useForm();

  const [category, setCategory] = useState({
    key: 'category',
    name: 'Categoria',
  });

  function handleTransacionTypeSelection(type: 'income' | 'outcome') {
    setTransactionType(type);
  }

  function handleOpenSelectCategoryModal() {
    setCategoryModalOpen(true);
  }

  function handleCloseSelectCategoryModal() {
    setCategoryModalOpen(false);
  }

  function handleRegister(form: FormData) {
    const data = {
      name: form.name,
      amount: form.amount,
      transactionType,
      category: category.key,
    };

    console.log(data);
  }
  return (
    <Container>
      <Header>
        <Title>Cadastro</Title>
      </Header>

      <Form>
        <Fields>
          <InputForm name='name' control={control} placeholder='Nome' />
          <InputForm name='amount' control={control} placeholder='Preço' />

          <TransactionTypes>
            <TransactionTypeButton
              type='income'
              title='Income'
              onPress={() => handleTransacionTypeSelection('income')}
              isActive={transactionType === 'income'}
            />
            <TransactionTypeButton
              type='outcome'
              title='Outcome'
              onPress={() => handleTransacionTypeSelection('outcome')}
              isActive={transactionType === 'outcome'}
            />
          </TransactionTypes>

          <CategorySelectButton
            title={category.name}
            onPress={handleOpenSelectCategoryModal}
          />
        </Fields>

        <Button title='Enviar' onPress={handleSubmit(handleRegister)} />
      </Form>

      <Modal visible={categoryModalOpen}>
        <CategorySelect
          category={category}
          setCategory={setCategory}
          closeSelectCategory={handleCloseSelectCategoryModal}
        />
      </Modal>
    </Container>
  );
}
