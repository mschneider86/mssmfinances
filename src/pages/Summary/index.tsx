import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { HistoryCard } from '../../../components/HistoryCard';

import { Container, Header, Title, Content } from './styles';
import { TransactionCardProps } from '../../../components/TransactionCard';
import { categories } from '../../utils/categories';

interface CategoryProps {
  key: string;
  name: string;
  total: string;
  color: string;
}

export function Summary() {
  const [totalByCategories, setTotalByCategories] = useState<CategoryProps[]>(
    []
  );

  async function loadData() {
    const dataKey = '@mssmfinances:transactions';
    const response = await AsyncStorage.getItem(dataKey);
    const formattedResponse = response ? JSON.parse(response) : [];

    const expenses = formattedResponse.filter(
      (expense: TransactionCardProps) => expense.type === 'outcome'
    );

    const totalByCategory: CategoryProps[] = [];

    categories.forEach((category) => {
      let categorySum = 0;

      expenses.forEach((expense: TransactionCardProps) => {
        if (expense.category === category.key) {
          categorySum += Number(expense.amount);
        }
      });

      if (categorySum > 0) {
        const total = categorySum.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        });

        totalByCategory.push({
          key: category.key,
          name: category.name,
          color: category.color,
          total,
        });
      }
    });

    setTotalByCategories(totalByCategory);
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Container>
      <Header>
        <Title>Resumo por Categoria</Title>
      </Header>

      <Content>
        {totalByCategories.map((item) => (
          <HistoryCard
            key={item.key}
            title={item.name}
            amount={item.total}
            color={item.color}
          />
        ))}
      </Content>
    </Container>
  );
}
