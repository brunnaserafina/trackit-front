import Header from './Header';
import Footer from './Footer';
import styled from 'styled-components';
import { useState, useContext, useEffect } from 'react';
import UserContext from '../context/UserContext';
import axios from 'axios';

export default function PageToday() {
  const { token } = useContext(UserContext);
  const [habitos, setHabitos] = useState([]);
  const [reloadHabits, setReloadHabits] = useState(false);

  useEffect(
    () => {
      const request = axios.get(
        'https://mock-api.bootcamp.respondeai.com.br/api/v2/trackit/habits/today',
        { headers: { Authorization: `Bearer ${token}` } }
      );

      request.catch((response) => {
        console.log('erro', response);
      });

      request.then((response) => {
        console.log(response.data);
        setHabitos(response.data);
      });
    },
    [reloadHabits],
    []
  );

  return (
    <>
      <Header />
      <TodayContainer>
        {habitos.map((habit, index) => (
          <MyHabits
            key={index}
            habit={habit}
            reloadHabits={reloadHabits}
            setReloadHabits={setReloadHabits}
          />
        ))}
      </TodayContainer>
      <Footer />
    </>
  );
}

function MyHabits({ habit, reloadHabits, setReloadHabits }) {
  const { token } = useContext(UserContext);
  const sameSequence = habit.currentSequence === habit.highestSequence && habit.highestSequence !== 0;

  function habitDone() {
    if (habit.done === false) {
      const request = axios.post(
        `https://mock-api.bootcamp.respondeai.com.br/api/v2/trackit/habits/${habit.id}/check`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      request.catch((response) => {
        console.log(response);
      });
      request.then((response) => {
        console.log(response);
        setReloadHabits(!reloadHabits);
      });
    } else {
      const promise = axios.post(
        `https://mock-api.bootcamp.respondeai.com.br/api/v2/trackit/habits/${habit.id}/uncheck`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      promise.catch((response) => {
        console.log(response);
      });
      promise.then((response) => {
        console.log(response);
        setReloadHabits(!reloadHabits);
      });
    }
  }

  return (
    <Sequence>
      <div>
        <h4>{habit.name}</h4>
        <p>
          Sequência atual:{' '}
          <Current $color={habit.done}>{habit.currentSequence} dias</Current>
        </p>
        <p>
          Seu recorde:{' '}
          <Highest $color={sameSequence}>
            {habit.highestSequence} dias
          </Highest>
        </p>
      </div>
      <Check onClick={habitDone} $color={habit.done}>
        <ion-icon name="checkbox"></ion-icon>
      </Check>
    </Sequence>
  );
}

const TodayContainer = styled.div`
  background-color: #e5e5e5;
  height: 200vh;
  padding: 30px 15px;
  margin-top: 70px;
`;

const Sequence = styled.div`
  width: 90vw;
  height: 95px;
  background-color: #ffffff;
  border-radius: 5px;
  margin-bottom: 10px;
  padding: 15px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h4 {
    font-size: 20px;
    color: #666666;
    margin-bottom: 7px;
  }

  p {
    font-size: 13px;
    color: #666666;
    margin-bottom: 3px;
  }

`;

const Current = styled.span`
  font-size: 13px;
  color: ${(props) => (props.$color ? '#8FC549' : '#666666')};
`;

const Highest = styled.span`
  font-size: 13px;
  color: ${(props) => (props.$color ? '#8FC549' : '#666666')};
`;

const Check = styled.div`
  ion-icon {
    font-size: 69px;
    color: ${(props) => (props.$color ? '#8FC549' : '#e7e7e7')};
  }
`;
