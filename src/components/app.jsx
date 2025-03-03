import { useState } from "react"

import { createSwarm, createTopic, joinTopic, sendMessage } from "../lib/swarm"

export default function App () {
  const [error, setError] = useState('')
  
  const [inputName, setInputName] = useState('')
  const [swarm, setSwarm] = useState()
  const [size, setSize] = useState(0)

  const [newTopic, setNewTopic] = useState('')
  
  const [inputTopic, setInputTopic] = useState('')
  const [statusJoin, setStatusJoin] = useState('')
  
  const [inputMessage, setInputMessage] = useState('')
  const [messages, setMessages] = useState([])

  const onStart = async () => {
    if (!inputName) {
      alert('Please enter a unique name per app instance')
      return
    }
    const newSwarm = await createSwarm({
      name: inputName,
      onError: (err) => {
        console.error(err)
        setError(err)
      },
      onUpdate: (size) => setSize(size),
      onData: (data) => {
        console.log(data)
        setMessages((items) => [...items, data])
      },
    })
    setSwarm(newSwarm)
  }

  const onCreateTopic = async () => {
    if (!swarm) {
      alert('Please start the app first')
      return
    }
    setNewTopic('creating...')
    const topic = await createTopic(swarm)
    setNewTopic(topic)
  }

  const onJoinTopic = async () => {
    if (!swarm) {
      alert('Please start the app first')
      return
    }
    if (!inputTopic) {
      alert('Please enter a topic')
      return
    }
    setStatusJoin('Joining...')
    const topic = await joinTopic(swarm, inputTopic)
    setStatusJoin(`Joined ${topic}`)
    setInputTopic('')
  }

  const onSendMessage = () => {
    if (!swarm) {
      alert('Please start the app first')
      return
    }
    if (!size) {
      alert('Please join a topic')
      return
    }
    if (!inputMessage) {
      alert('Please enter a message')
      return
    }
    sendMessage(swarm, inputMessage)
    setInputMessage('')
  }

  return (
    <div style={{ padding: 10, background: 'cyan' }}>
      <h1>MyApp</h1>
      <pre>{error}</pre>

      <hr />

      <h2>Your name</h2>
      <div style={{ display: 'flex', gap: 10 }}>
        <input type="text" value={inputName} onChange={(evt) => setInputName(evt.currentTarget.value)} />
        <button onClick={onStart}>Start</button>
      </div>
      <p>Hi: {swarm ? inputName : ''}</p>

      <hr />

      <button onClick={onCreateTopic}>Create topic</button>
      <p>New topic: {newTopic}</p>
      
      <hr />

      <h2>Join topic</h2>
      <div>
        <textarea type="text" value={inputTopic} onChange={(evt) => setInputTopic(evt.currentTarget.value)} />
      </div>
      <button onClick={onJoinTopic}>Join topic {inputTopic}</button>
      <div>{statusJoin}</div>

      <hr />

      <h2>Message</h2>
      <div>
        <textarea type="text" value={inputMessage} onChange={(evt) => setInputMessage(evt.currentTarget.value)} />
      </div>
      <button onClick={onSendMessage}>Send message</button>
      <p>Connections: {size}</p>
      <p>Messages: </p>
      {messages.map((item, index) => (
        <div key={`msg-${index}`} style={{ display: 'flex', gap: 10 }}>
          <div>{item.name}</div>
          <div>{`${item.msg}`}</div>
        </div>
      ))}
    </div>
  )
}
