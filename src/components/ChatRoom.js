import { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, push } from 'firebase/database';
import { useAuth } from '../context/authContext';
import { formatDate } from '../utilities/utils';

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
    })
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
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      const newDataArray = [];
      for (let key in data) {
        if (roomId === data[key].room) {
          newDataArray.push({
            key,
            room: data[key].room,
            content: data[key].content,
            sentBy: data[key].sentBy,
            timestamp: data[key].timestamp,
          })
        }
      }
      console.log(newDataArray);
      setMessages(newDataArray);
    });
  }, [roomId])

  return (
    <>
      {
        room
        ? <>
            <h2>{room.name}</h2>
            <h3>{room.description}</h3>
            {
              messages
              ? messages.map((message) => {
                  return <p key={message.key}>{`${message.timestamp} - ${message.sentBy}: ${message.content}`}</p>
                })
              : null
            }
            <form action="submit" onSubmit={(event) => handleNewMessage(event)}>
              <input type="text" name="enterMessage" id="enterMessage" onChange={(event) => setNewMessage(event.target.value)} value={newMessage} />
              <button type="submit">Send</button>
            </form>
          </>
        : null
      }

    </>
  )
};


export default ChatRoom;