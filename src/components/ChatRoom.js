import { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, push, get, child } from 'firebase/database';
import { useAuth } from '../context/authContext';
import { formatDate } from '../utilities/utils';
import { Link } from 'react-router-dom';

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
            <Link to="/rooms">Back</Link>
            <h2>{room.name}</h2>
            <h3>{room.description}</h3>
            {
              messages
              ? messages.map((message) => {
                  return (
                    <div key={message.key}>
                      <div>
                        <img src={message.sentByPhoto} alt={`${message.sentBy}`}/>
                      </div>
                      <p>{`${message.timestamp} - ${message.sentBy}: ${message.content}`}</p>
                    </div>
                  )
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