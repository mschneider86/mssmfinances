import React from 'react';
import { HighlightCard } from '../../../components/HighlightCard';
import { TransactionCard } from '../../../components/TransactionCard';

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
  HighlightCards,
  Transactions,
  Title,
} from './styles';

export function Dashboard() {
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
          <Icon name='power' />
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

        <TransactionCard />
      </Transactions>
    </Container>
  );
}
