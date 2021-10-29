import React from 'react';
import { HighlightCard } from '../../../components/HighlightCard';
import {
  TransactionCard,
  TransactionCardProps,
} from '../../../components/TransactionCard';

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

export function Dashboard() {
  const data: DataListProps[] = [
    {
      id: '1',
      type: 'income',
      title: 'Desenvolvimento de Site',
      amount: 'R$15.000,00',
      category: { name: 'Vendas', icon: 'dollar-sign' },
      date: '26/10/2021',
    },
    {
      id: '2',
      type: 'outcome',
      title: 'PizzaHut',
      amount: 'R$120,00',
      category: { name: 'Alimentação', icon: 'dollar-sign' },
      date: '27/10/2021',
    },
  ];

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
          amount='R$ 15.000,00'
          lastTransaction='Última entrada dia 23 de março'
        />
        <HighlightCard
          type='outcome'
          title='Saídas'
          amount='R$ 5.000,00'
          lastTransaction='Última entrada dia 25 de março'
        />
        <HighlightCard
          type='total'
          title='Total'
          amount='R$ 10.000,00'
          lastTransaction='Última entrada dia 28 de março'
        />
      </HighlightCards>

      <Transactions>
        <Title>Listagem</Title>

        <TransactionList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TransactionCard data={item} />}
        />
      </Transactions>
    </Container>
  );
}
