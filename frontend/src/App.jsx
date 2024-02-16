import { useState } from 'react'
import './App.css'
import io from 'socket.io-client'
import Chat from './Chat'
import { Card, Icon, Container, Divider } from 'semantic-ui-react'
import { Form, FormField, Button, Checkbox} from 'semantic-ui-react'


const socket = io.connect("http://localhost:3001") //Dirección del Backend

function App() {
  //Estados del Chat "" es vacío
  const [username, setUsername] = useState("")
  const [room, setRoom] = useState("")
  const [showChat, setShowChat] = useState(false)

  const joinRoom = () => {
    if (username != "" && room != "") {
      socket.emit("join_room", room)
      setShowChat(true)
    }
  }

  return (
    <Container>
      {!showChat ? (
        <Card fluid>
        <Card.Content header='Unirme al chat' />
        <Card.Content>
          <Form>
            <FormField>
              <label>Username</label>
              <input type='text' placeholder='Usuario' 
              onChange={e => setUsername(e.target.value)}/>
            </FormField>
            <FormField>
              <label>Sala</label>
              <input type='text' placeholder='ID Sala'
              onChange={e => setRoom(e.target.value)}/>
            </FormField>
            <FormField>
            </FormField>
            <Button onClick={joinRoom}>Unirme</Button>
          </Form>
        </Card.Content>
        <Card.Content extra>
          <Icon name='user' />4 Friends
        </Card.Content>
      </Card>
      ):(
      <Chat socket={socket} username={username} room={room}/>
      )}

    </Container>
  );
}

export default App
