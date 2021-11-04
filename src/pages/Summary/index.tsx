import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VictoryPie } from 'victory-native';

import { HistoryCard } from '../../components/HistoryCard';

import { Container, Header, Title, Content, ChartContainer } from './styles';
import { TransactionCardProps } from '../../components/TransactionCard';
import { categories } from '../../utils/categories';

import { RFValue } from 'react-native-responsive-fontsize';

import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useTheme } from 'styled-components';

interface CategoryProps {
  key: string;
  name: string;
  total: number;
  formattedTotal: string;
  color: string;
  percent: string;
}

export function Summary() {
  const [totalByCategories, setTotalByCategories] = useState<CategoryProps[]>(
    []
  );

  const theme = useTheme();

  async function loadData() {
    const dataKey = '@mssmfinances:transactions';
    const response = await AsyncStorage.getItem(dataKey);
    const formattedResponse = response ? JSON.parse(response) : [];

    const expenses = formattedResponse.filter(
      (expense: TransactionCardProps) => expense.type === 'outcome'
    );

    const expensesTotal = expenses.reduce(
      (acc: number, expense: TransactionCardProps) => {
        return acc + Number(expense.amount);
      },
      0
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
        const formattedTotal = categorySum.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        });

        const percent = `${((categorySum / expensesTotal) * 100).toFixed(0)}%`;

        totalByCategory.push({
          key: category.key,
          name: category.name,
          color: category.color,
          total: categorySum,
          formattedTotal,
          percent,
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

      <Content
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: useBottomTabBarHeight(),
        }}
      >
        <ChartContainer>
          <VictoryPie
            data={totalByCategories}
            colorScale={totalByCategories.map((category) => category.color)}
            style={{
              labels: {
                fontSize: RFValue(18),
                fontWeight: 'bold',
                fill: theme.colors.shape,
              },
            }}
            labelRadius={50}
            x='percent'
            y='total'
          />
        </ChartContainer>

        {totalByCategories.map((item) => (
          <HistoryCard
            key={item.key}
            title={item.name}
            amount={item.formattedTotal}
            color={item.color}
          />
        ))}
      </Content>
    </Container>
  );
}
