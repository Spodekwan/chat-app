// import { useAuth } from '../context/authContext';
import { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { Link } from 'react-router-dom';
import Heading from './Heading';
import styled from 'styled-components';
import { Wrapper, colors } from '../styles/variables';

const { primary, black, background } = colors;

const Body = styled.div`
  background: ${background};
  padding-top: 10px;
  min-height: calc(100vh - 88px);
`;

const RoomsContainer = styled.ul`
  padding: 0;
  padding-bottom: 100px;
`;

const RoomListItem = styled.li`
  list-style: none;
  display: flex;
  padding: 10px;
  margin-bottom: 5px;
  height: 150px;
  border: 5px solid ${primary};
  border-radius: 5px;
`;

const RoomHeadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 60%;
`;

const RoomDetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 40%;
`;

const RoomLink = styled(Link)`
  color: ${black};
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 10px;
  text-decoration: none;
  text-transform: uppercase;
`;

const RoomDescription = styled.p`
  font-size: 1.8rem;
  margin: 0;
`;

const RoomDetails = styled.p`
  font-size: 1.8rem;
  margin: 0;
  margin-bottom: 10px;
`;

const PageTitle = styled.h2`
  color: ${black};
  font-size: 4rem;
  margin: 10px 0 20px;
`;

const RoomList = () => {
  // const { user } = useAuth();
  const [ rooms, setRooms ] = useState([]);

  useEffect(() => {
    const db = getDatabase();
    const roomsRef = ref(db, 'Rooms');
    onValue(roomsRef, (snapshot) => {
      const data = snapshot.val();
      console.log(data);
      const newDataArray = [];
      for (let key in data) {
        newDataArray.push({
          key,
          name: data[key].name,
          description: data[key].description,
          totalMessages: data[key].totalMessages,
          latestMessage: data[key].latestMessage,
        })
      }
      setRooms(newDataArray);
    });
  }, [])

  return (
    <>
      <Heading />
      <Body>
        <Wrapper>
          <PageTitle>Chat Rooms:</PageTitle>
          <RoomsContainer>
            {
              rooms.map((room) => {
                return (
                  <RoomListItem key={room.key}>
                    <RoomHeadingContainer>
                      <RoomLink to={`rooms/${room.key}`}>{room.name}</RoomLink>
                      <RoomDescription>{room.description}</RoomDescription>
                    </RoomHeadingContainer>
                    <RoomDetailsContainer>
                      <RoomDetails>{room.totalMessages ? room.totalMessages : 0} messages</RoomDetails>
                      <RoomDetails>latest message: {room.latestMessage ? room.latestMessage : 'no messages yet'}</RoomDetails>
                    </RoomDetailsContainer>
                  </RoomListItem>
                )
              })
            }
          </RoomsContainer>
        </Wrapper>
      </Body>
    </>
  )
}

export default RoomList;