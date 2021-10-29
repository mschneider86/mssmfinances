import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { HighlightCard } from '../../../components/HighlightCard';
import {
  TransactionCard,
  TransactionCardProps,
} from '../../../components/TransactionCard';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  Container,
  Header,
  UserWrapper,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  Icon,
  LogoutButton,
  HighlightCards,
  Transactions,
  Title,
  TransactionList,
} from './styles';

export interface DataListProps extends TransactionCardProps {
  id: string;
}

interface HighlightProps {
  amount: string;
}

interface HighlightData {
  entries: HighlightProps;
  expenses: HighlightProps;
  total: HighlightProps;
}

export function Dashboard() {
  const [transactions, setTransactions] = useState<DataListProps[]>([]);
  const [highligtData, setHighlightData] = useState<HighlightData>(
    {} as HighlightData
  );

  async function loadTransactions() {
    const dataKey = '@mssmfinances:transactions';
    const response = await AsyncStorage.getItem(dataKey);
    const transactions = response ? JSON.parse(response) : [];

    let entriesTotal = 0;
    let expensesTotal = 0;

    const formattedTransactions: DataListProps[] = transactions.map(
      (item: DataListProps) => {
        if (item.type === 'income') {
          entriesTotal += Number(item.amount);
        } else {
          expensesTotal += Number(item.amount);
        }

        const amount = Number(item.amount).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        });

        const date = Intl.DateTimeFormat('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        }).format(new Date(item.date));

        return {
          id: item.id,
          name: item.name,
          amount,
          type: item.type,
          category: item.category,
          date,
        };
      }
    );

    setTransactions(formattedTransactions);

    const total = entriesTotal - expensesTotal;

    setHighlightData({
      entries: {
        amount: entriesTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
      },
      expenses: {
        amount: expensesTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
      },
      total: {
        amount: total.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
      },
    });
  }

  useEffect(() => {
    loadTransactions();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, [])
  );

  return (
    <Container>
      <Header>
        <UserWrapper>
          <UserInfo>
            <Photo
              source={{
                uri: 'https://avatars.githubusercontent.com/u/26752887?v=4',
              }}
            />
            <User>
              <UserGreeting>Olá,</UserGreeting>
              <UserName>Matheus</UserName>
            </User>
          </UserInfo>

          <LogoutButton onPress={() => {}}>
            <Icon name='power' />
          </LogoutButton>
        </UserWrapper>
      </Header>

      <HighlightCards>
        <HighlightCard
          type='income'
          title='Entradas'
          amount={highligtData.entries.amount}
          lastTransaction='Última entrada dia 23 de março'
        />
        <HighlightCard
          type='outcome'
          title='Saídas'
          amount={highligtData.expenses.amount}
          lastTransaction='Última entrada dia 25 de março'
        />
        <HighlightCard
          type='total'
          title='Total'
          amount={highligtData.total.amount}
          lastTransaction='Última entrada dia 28 de março'
        />
      </HighlightCards>

      <Transactions>
        <Title>Listagem</Title>

        <TransactionList
          data={transactions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TransactionCard data={item} />}
        />
      </Transactions>
    </Container>
  );
}
