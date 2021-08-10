import { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, push, get, child } from 'firebase/database';
import { useAuth } from '../context/authContext';
import { formatDate } from '../utilities/utils';
import { Link } from 'react-router-dom';
import { colors, Wrapper } from '../styles/variables';
import styled from 'styled-components';

const { primary, secondary } = colors;

const RoomHeaderContainer = styled.div`
  background-color: ${primary};
  height: 88px;
  left: 0;
  position: fixed;
  top: 0;
  width: 100%;
`;

const RoomHeader = styled.header`
  color: ${secondary};
  display: flex;
  flex-direction: column;
  padding: 10px 0;
`;

const TitleContainer = styled.div`
  align-items: center;
  display: flex;
  margin-bottom: 10px;
`;

const Title = styled.h2`
  margin: 0;
  text-transform: uppercase;
`;

const BackButton = styled(Link)`
  color: ${secondary};
  padding-right: 10px;
  text-decoration: none;
`;

const DescriptionContainer = styled.div`
  margin-bottom: 5px;
`;

const Description = styled.h3`
  margin: 0;
`;

const MessagesContainer = styled.div`
  height: calc(100vh - 88px - 25px);
  overflow: scroll;
  padding-top: 10px;
  position: absolute;
  top: 88px;
`;

const MessageForm = styled.form`
  bottom: 0;
  display: flex;
  height: 25px;
  left: 0;
  position: fixed;
  width: 100%;
`;

const MessageInput = styled.input`
  flex: 1;
`;

const ChatRoom = (props) => {
  const { match: { params: { roomId } } } = props;

  const { user } = useAuth();
  const [ room, setRoom ] = useState();
  const [ messages, setMessages ] = useState();
  const [ newMessage, setNewMessage ] = useState('');

  const handleNewMessage = (event) => {
    event.preventDefault();

    const db = getDatabase();
    const messagesRef = ref(db, `Messages`);
    const date = new Date();
    push(messagesRef, {
      content: newMessage,
      sentBy: user.uid,
      room: roomId,
      timestamp: formatDate(date),
    });
    setNewMessage('');
    console.log(user);
  }
  
  useEffect(() => {
    const db = getDatabase();
    const roomRef = ref(db, `Rooms/${roomId}`);
    onValue(roomRef, (snapshot) => {
      const data = snapshot.val();
      setRoom(data);
    });
  }, [roomId])

  useEffect(() => {
    const db = getDatabase();
    const messagesRef = ref(db, `Messages`);
    const usersRef = ref(db, `Users`);
    const formatMessages = async (snapshot) => {
      const data = snapshot.val();
      const newDataArray = [];
      for (let key in data) {
        if (roomId === data[key].room) {
          // using sentBy id to get the displayName of the user who sent message
          await get(child(usersRef, `${data[key].sentBy}`))
            .then((snapshot) => {
              if (snapshot.exists()) {
                const thisUser = snapshot.val();
                data[key].sentBy = thisUser.displayName;
                data[key].sentByPhoto = thisUser.photoURL;
              }
              newDataArray.push({
                key,
                room: data[key].room,
                content: data[key].content,
                sentBy: data[key].sentBy,
                sentByPhoto: data[key].sentByPhoto,
                timestamp: data[key].timestamp,
              })
            })
            .catch(error => {
              newDataArray.push({
                key,
                room: data[key].room,
                content: data[key].content,
                sentBy: data[key].sentBy,
                sentByPhoto: null,
                timestamp: data[key].timestamp,
              })
            })
        }
      }
      // console.log(newDataArray);
      setMessages(newDataArray);
    }

    onValue(messagesRef, (snapshot) => {
      if (snapshot.exists()) {
        formatMessages(snapshot);
      }
    });
  }, [roomId])

  return (
    <>
      {
        room
        ? <>
            <RoomHeaderContainer>
              <Wrapper>
                <RoomHeader>
                  <TitleContainer>
                    <BackButton to="/rooms">Back</BackButton>
                    <Title>{room.name}</Title>
                  </TitleContainer>
                  <DescriptionContainer>
                    <Description>{room.description}</Description>
                  </DescriptionContainer>
                </RoomHeader>
              </Wrapper>
            </RoomHeaderContainer>
            
            <Wrapper>
              <MessagesContainer>
                {
                  messages
                  ? messages.map((message) => {
                      return (
                        <div key={message.key}>
                          <div>
                            <img src={message.sentByPhoto} alt={`${message.sentBy}`}/>
                          </div>
                          <p>{`${message.sentBy}: ${message.content}`}</p>
                        </div>
                      )
                    })
                  : null
                }
              </MessagesContainer>  
            </Wrapper>
            <MessageForm action="submit" onSubmit={(event) => handleNewMessage(event)}>
              <MessageInput type="text" name="enterMessage" id="enterMessage" onChange={(event) => setNewMessage(event.target.value)} value={newMessage} />
              <button type="submit">Send</button>
            </MessageForm>
          </>
        : null
      }

    </>
  )
};


export default ChatRoom;