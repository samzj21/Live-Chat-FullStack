//Plantilla con Rafc
import React, { useEffect, useState } from 'react'
import { Card, Icon, Container, Divider, Item } from 'semantic-ui-react'
import { Form, FormField, Button, Input} from 'semantic-ui-react'
import { MessageHeader, Message } from 'semantic-ui-react'
import ScrollToBottom from 'react-scroll-to-bottom'


const Chat = ({socket, username, room}) => {

    const [currentMessage, setCurrentMessage] = useState("")
    const [messagesList, setMessagesList] = useState([])

    const sendMessage = async () => {
        if (username && currentMessage){
            const info = {
                message: currentMessage,
                room, 
                author:username,
                time:new Date(Date.now()).getHours() + 
                ":"
                + new Date(Date.now()).getMinutes(),
            };

            await socket.emit("send_message", info)
            setMessagesList((list) => [...list, info]);
            setCurrentMessage("")
        }
    }

    useEffect(()=>{
        const messageHandle = (data) => {
                setMessagesList((list) => [...list, data]);
            }
        socket.on("receive_message", messageHandle);

        return () => socket.off("receive_message", messageHandle);
    }, [socket]);

  return (
    <Container fluid>
        <Card fluid>
        <Card.Content header= {`Chat en Vivo | Sala ${room}`}/>
        <ScrollToBottom>
            <Card.Content style={{ height: "400px", padding: "5px"}}>
                    {messagesList.map((item, i) => {
                        return (
                            <span key={i}>
                            <Message style={{textAlign: username === item.author ? 'right':'left'}}
                            success={username === item.author}
                            info={username != item.author}
                            > 
                                <MessageHeader>{item.message}</MessageHeader>
                                <p>
                                    Enviador por <strong>{item.author}</strong> a las{" "}
                                    <i>{item.time}</i>
                                    </p>
                            </Message>
                            <Divider/>
                        </span>
                        );
                    })}
            </Card.Content>
        </ScrollToBottom>
        <Card.Content extra>
            <Form>
                <FormField>
                    <div className='ui action input'>
                    <Input value={currentMessage}
                        type="text" placeholder='Mensaje ...'
                        onChange={e => setCurrentMessage(e.target.value)}
                        onKeyPress={(e) => {
                            e.key === "Enter" && sendMessage()
                        }}
                        />
                        <Button type='button' onClick={() => sendMessage()}
                        className='ui teal icon right labeled button'>
                            <Icon name='send'/>
                                Enviar
                        </Button>
                    </div>
                </FormField>
            </Form>
        </Card.Content>
        </Card>
    </Container>
  )
}

export default Chat
