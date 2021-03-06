import React, { useState, useEffect, useCallback } from 'react';

import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from 'styled-components';

import { HighlightCard } from '../../components/HighlightCard';

import { ActivityIndicator } from 'react-native';

import {
  TransactionCard,
  TransactionCardProps,
} from '../../components/TransactionCard';

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
  LoadContainer,
} from './styles';
import { useAuth } from '../../hooks/auth';

export interface DataListProps extends TransactionCardProps {
  id: string;
}

interface HighlightProps {
  amount: string;
  lastTransaction: string;
}

interface HighlightData {
  entries: HighlightProps;
  expenses: HighlightProps;
  total: HighlightProps;
}

export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);

  const [transactions, setTransactions] = useState<DataListProps[]>([]);
  const [highligtData, setHighlightData] = useState<HighlightData>(
    {} as HighlightData
  );

  const theme = useTheme();
  const { signOut, user } = useAuth();

  function getLastTransactionDate(
    collection: DataListProps[],
    type: 'income' | 'outcome'
  ) {
    const filteredCollection = collection.filter(
      (transaction) => transaction.type === 'income'
    );

    if (filteredCollection.length === 0) {
      return 0;
    }

    const lastTransaction = new Date(
      Math.max.apply(
        Math,
        filteredCollection.map((transaction) =>
          new Date(transaction.date).getTime()
        )
      )
    );

    return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString(
      'pt-BR',
      { month: 'long' }
    )}`;
  }

  async function loadTransactions() {
    const dataKey = `@mssmfinances:transactions_user:${user.id}`;
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

    const lastEntryTransaction = getLastTransactionDate(transactions, 'income');
    const lastExpenseTransaction = getLastTransactionDate(
      transactions,
      'outcome'
    );
    const totalInterval =
      lastExpenseTransaction === 0
        ? 'N??o h?? transa????es'
        : `01 a ${lastExpenseTransaction}`;

    const total = entriesTotal - expensesTotal;

    setHighlightData({
      entries: {
        amount: entriesTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        lastTransaction:
          lastEntryTransaction === 0
            ? 'N??o h?? transa????es'
            : `??ltima entrada dia ${lastEntryTransaction}`,
      },
      expenses: {
        amount: expensesTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        lastTransaction:
          lastExpenseTransaction === 0
            ? 'N??o h?? transa????es'
            : `??ltima sa??da dia ${lastExpenseTransaction}`,
      },
      total: {
        amount: total.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        lastTransaction: totalInterval,
      },
    });

    setIsLoading(false);
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
      {isLoading ? (
        <LoadContainer>
          <ActivityIndicator color={theme.colors.primary} size='large' />
        </LoadContainer>
      ) : (
        <>
          <Header>
            <UserWrapper>
              <UserInfo>
                <Photo
                  source={{
                    uri: user.photo,
                  }}
                />
                <User>
                  <UserGreeting>Ol??,</UserGreeting>
                  <UserName>{user.name}</UserName>
                </User>
              </UserInfo>

              <LogoutButton onPress={signOut}>
                <Icon name='power' />
              </LogoutButton>
            </UserWrapper>
          </Header>

          <HighlightCards>
            <HighlightCard
              type='income'
              title='Entradas'
              amount={highligtData.entries.amount}
              lastTransaction={highligtData.entries.lastTransaction}
            />
            <HighlightCard
              type='outcome'
              title='Sa??das'
              amount={highligtData.expenses.amount}
              lastTransaction={highligtData.expenses.lastTransaction}
            />
            <HighlightCard
              type='total'
              title='Total'
              amount={highligtData.total.amount}
              lastTransaction={highligtData.total.lastTransaction}
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
        </>
      )}
    </Container>
  );
}
