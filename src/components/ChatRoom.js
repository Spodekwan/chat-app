import { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, push, get, child, update } from 'firebase/database';
import { useAuth } from '../context/authContext';
import { formatDate } from '../utilities/utils';
import { Link } from 'react-router-dom';
import { colors, Wrapper } from '../styles/variables';
import styled from 'styled-components';
import ScrollToBottom from 'react-scroll-to-bottom';

const { primary, secondary, black } = colors;

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

const ChatContainer = styled(ScrollToBottom)`
  height: calc(100vh - 88px - 25px - 25px);
  overflow: scroll;
  padding-top: 10px;
  position: absolute;
  width: 100%;
`;

const MessageContainer = styled.div`
  display: flex;
  align-items: flex-end;
  width: 95%;
  padding-right: 10%;
  margin: 10px auto;
`;

const CurrentUserMessageContainer = styled(MessageContainer)`
  flex-direction: row-reverse;
  justify-content: flex-start;
  padding-left: 10%;
  padding-right: 0;
`;

const UserImageContainer = styled.div`
  width: 40px;
  height: 40px;
  overflow: hidden;
  margin-right: 12px;
  border-radius: 20px;
  flex-shrink: 0;
`;

const CurrentUserImageContainer = styled(UserImageContainer)`
  margin-right: 0;
  margin-left: 12px;
`;

const UserImage = styled.img`
  width: 100%;
  display: block;
`;

const MessageText = styled.p`
  background: ${black};
  color: ${secondary};
  border-radius: 10px 10px 10px 0;
  padding: 10px;
  margin-bottom: 10px;
`;

const CurrentUserMessageText = styled(MessageText)`
  background: ${primary};
  border-radius: 10px 10px 2px 10px;
`;

const MessageAuthor = styled.p`
  color: gray;
  line-height: 0;
  font-size: 14px;
  margin-top: 0;
`;

const CurrentUserMessageAuthor = styled(MessageAuthor)`
  color: transparent;
  width: 0;
`;

const MessageContent = styled.div`
  max-width: 60%;
`;

const MessageForm = styled.form`
  bottom: 25px;
  height: 25px;
  left: 0;
  position: fixed;
  width: 100%;
`;

const MessageFormContainer = styled.div`
  display: flex;
  width: 100%;
`;

const MessageInput = styled.input`
  flex: 1;
  cursor: text;
`;

const RelativeWrapper = styled(Wrapper)`
  margin-top: 88px;
  position: relative;
  width: 100%;
  max-width: 100%;
`;

const RoomFooter = styled.div`
  background-color: ${primary};
  height: 25px;
  left: 0;
  position: fixed;
  bottom: 0;
  width: 100%;
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

    const roomRef = ref(db, `Rooms/${roomId}`);
    update(roomRef, {
      totalMessages: (messages.length + 1),
      latestMessage: formatDate(date),
    });
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
                data[key].sentByName = thisUser.displayName;
                data[key].sentByPhoto = thisUser.photoURL;
              }
              newDataArray.push({
                key,
                room: data[key].room,
                content: data[key].content,
                sentBy: data[key].sentBy,
                sentByName: data[key].sentByName,
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
            
            <RelativeWrapper>
              <ChatContainer>
                {
                  messages
                  ? messages.map((message) => {
                      console.log(message.sentBy, user.uid);
                      if (message.sentBy === user.uid) {
                        return (
                          <CurrentUserMessageContainer key={message.key}>
                            <CurrentUserImageContainer>
                              <UserImage src={message.sentByPhoto} alt={`${message.sentByName}`}/>
                            </CurrentUserImageContainer>
                            <MessageContent>
                              <CurrentUserMessageText>{message.content}</CurrentUserMessageText>
                              <CurrentUserMessageAuthor>{`${message.sentByName}`}</CurrentUserMessageAuthor>
                            </MessageContent>
                          </CurrentUserMessageContainer>
                        )
                      } else {
                        return (
                          <MessageContainer key={message.key}>
                            <UserImageContainer>
                              <UserImage src={message.sentByPhoto} alt={`${message.sentByName}`}/>
                            </UserImageContainer>
                            <MessageContent>
                              <MessageText>{`${message.content}`}</MessageText>
                              <MessageAuthor>{`${message.sentByName}`}</MessageAuthor>
                            </MessageContent>
                          </MessageContainer>
                        )
                      }
                      
                    })
                  : null
                }
              </ChatContainer>  
            </RelativeWrapper>
            <MessageForm action="submit" onSubmit={(event) => handleNewMessage(event)}>
              <Wrapper>
                <MessageFormContainer>
                  <MessageInput type="text" name="enterMessage" id="enterMessage" onChange={(event) => setNewMessage(event.target.value)} value={newMessage} required/>
                  <button type="submit">Send</button>
                </MessageFormContainer>
              </Wrapper>
            </MessageForm>
            <RoomFooter />
          </>
        : null
      }

    </>
  )
};


export default ChatRoom;