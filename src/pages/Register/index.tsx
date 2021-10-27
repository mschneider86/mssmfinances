import React, { useState } from 'react';

import { Input } from '../../../components/Forms/Input';
import { Button } from '../../../components/Forms/Button';
import { TransactionTypeButton } from '../../../components/Forms/TransactionTypeButton';

import {
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionTypes,
} from './styles';

export function Register() {
  const [transactionType, setTransactionType] = useState('');

  function handleTransacionTypeSelection(type: 'income' | 'outcome') {
    setTransactionType(type);
  }

  return (
    <Container>
      <Header>
        <Title>Cadastro</Title>
      </Header>

      <Form>
        <Fields>
          <Input placeholder='Nome' />
          <Input placeholder='Preço' />

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
        </Fields>

        <Button title='Enviar' />
      </Form>
    </Container>
  );
}
