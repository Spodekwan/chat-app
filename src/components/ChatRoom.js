import { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, push, get, child, update } from 'firebase/database';
import { useAuth } from '../context/authContext';
import { formatDate } from '../utilities/utils';
import { Link, useHistory } from 'react-router-dom';
import { colors, Wrapper } from '../styles/variables';
import styled from 'styled-components';
import ScrollToBottom from 'react-scroll-to-bottom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const { primary, secondary, black, background } = colors;

const RoomHeaderContainer = styled.div`
  background-color: ${primary};
  height: 88px;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
`;

const RoomHeader = styled.header`
  color: ${secondary};
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  height: 88px;
  width: 100%;
`;

const Title = styled.h1`
  color: ${secondary};
  font-family: 'Lobster', cursive;
  font-size: 4rem;
  text-align: center;
  margin: 0;
  width: 100%;
`;

const BackButton = styled(Link)`
  color: ${primary};
  font-size: 2rem;
  // padding-right: 10px;
  text-decoration: none;
  position: absolute;
  top: calc(88px / 2 - 14px);
  left: 2.5%;
  z-index: 20;
  background: ${secondary};
  padding: 5px 10px 7px;
  border-radius: 7px;
`;

const SignOutButton = styled.button`
  width: 100%;
  padding: 15px 10px;
  background: transparent;
  color: ${secondary};
  border: none;
  border-radius: 7px;
  font-weight: bold;
  font-size: 1.6rem;
  font-family: 'Open Sans', sans-serif;
  text-transform: uppercase;
  cursor: pointer;
  &:hover {
    color: ${primary};
  }
`;

const ProfileImageContainer = styled.button`
  width: 50px;
  height: 50px;
  overflow: hidden;
  border-radius: 30px;
  flex-shrink: 0;
  border: none;
  padding: 0;
  position: absolute;
  right: 2.5%;
  top: calc(88px / 2 - 25px);
`;

const ProfileImage = styled.img`
  cursor: pointer;
  width: 100%;
  display: block;
`;

const DropDownMenu = styled.ul`
  width: 150px;
  position: absolute;
  top: calc(88px - 20px);
  right: 2.5%;
  background: ${primary};
  list-style: none;
  padding: 15px 0;
  border-radius: 7px;
  border: 2px solid ${secondary};
  overflow: hidden;
  display: ${props => props.open ? "block" : "none"};
  z-index: 10;
`;

const DropDownItem = styled.li`
  width: 100%;
  cursor: pointer;
  text-align: center;
  background: ${primary};
  color: ${secondary};
  font-weight: bold;
  font-size: 1.6rem;
  text-transform: uppercase;
  &:hover {
    background: ${secondary};
    color: ${primary};
    box-shadow: none;
    & button {
      color: ${primary};
    }
  }
`;

const DropDownLink = styled(Link)`
  padding: 15px 10px;
  color: ${secondary};
  text-decoration: none;
  display: block;
  &:hover {
    color: ${primary};
  }
`;

const ChatContainer = styled(ScrollToBottom)`
  height: calc(100vh - 88px - 70px - 25px);
  overflow: scroll;
  position: absolute;
  width: 100%;
  background: ${background};
  scrollbar-color: grey transparent;
  scrollbar-width: none;
  z-index: 1;
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
  border-radius: 10px 10px 10px 0;
  color: ${secondary};
  font-size: 2rem;
  line-height: 1.4;
  margin-bottom: 10px;
  overflow-wrap: break-word;
  padding: 10px;
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
  overflow-wrap: break-word;
`;

const CurrentUserMessageAuthor = styled(MessageAuthor)`
  color: transparent;
  overflow-wrap: break-word;
  width: 0;
`;

const MessageContent = styled.div`
  max-width: 60%;
  overflow-wrap: break-word;
`;

const MessageForm = styled.form`
  background-color: ${background};
  bottom: 25px;
  height: 70px;
  left: 0;
  position: fixed;
  width: 100%;
`;

const MessageFormContainer = styled.div`
  display: flex;
  align-items: flex-end;
  height: 60px;
  margin: 0 auto;
  width: 95%;
`;

const MessageInput = styled.textarea`
  background-color: ${primary};
  border-radius: 30px;
  border: none;
  border-right: 25px solid ${primary};
  color: ${secondary};
  cursor: text;
  flex: 1;
  font-size: 2rem;
  height: 60px;
  line-height: 1.4;
  overflow: hidden;
  overflow-y: scroll;
  padding: 2px 28px;
  resize: none;
  scrollbar-color: grey transparent;
  scrollbar-width: thin;
`;

const MessageButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  flex-basis: 100px;
  font-size: 4rem;
  height: 60px;
  text-align: center;
`;

const SendIcon = styled(FontAwesomeIcon)`
  color: ${primary};
  transform: rotate(20deg);
  &:hover {
    font-size: 4.5rem;
  }
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

  const { user, handleSignOut } = useAuth();
  const history = useHistory();
  const [ room, setRoom ] = useState();
  const [ messages, setMessages ] = useState();
  const [ newMessage, setNewMessage ] = useState('');
  const [ dropDownOpen, setDropDownOpen ] = useState(false);

  const handleClick = async () => {
    await handleSignOut();
    history.push("/");
  }

  const handleNewMessage = (event) => {
    event.preventDefault();

    if (newMessage.length) {
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
  }

  const handleKeydown = (event) => {
    if (event.key === 'Enter') {
      handleNewMessage(event)
    }
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
            <BackButton to="/rooms">Back</BackButton>
            <RoomHeaderContainer>
              <RoomHeader>
                <Title>{room.name}</Title>
                <ProfileImageContainer onClick={() => setDropDownOpen(!dropDownOpen)}>
                  <ProfileImage src={user.photoURL} alt="your profile picture"></ProfileImage>
                </ProfileImageContainer>
                <DropDownMenu open={dropDownOpen}>
                  <DropDownItem><DropDownLink to="/profile">Profile</DropDownLink></DropDownItem>
                  <DropDownItem><SignOutButton onClick={handleClick}>Sign Out</SignOutButton></DropDownItem>
                </DropDownMenu>
              </RoomHeader>
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
            <MessageForm onSubmit={(event) => handleNewMessage(event)}>
              <MessageFormContainer>
                <MessageInput 
                  name="enterMessage" id="enterMessage" 
                  onChange={(event) => setNewMessage(event.target.value)} 
                  onKeyDown={(event) => handleKeydown(event)}
                  required
                  type="text" 
                  value={newMessage} 
                />
                <MessageButton type="submit">
                  <SendIcon icon="paper-plane"/>
                </MessageButton>
              </MessageFormContainer>
            </MessageForm>
            <RoomFooter />
          </>
        : null
      }

    </>
  )
};


export default ChatRoom;