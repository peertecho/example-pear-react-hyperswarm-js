/* global alert */
import { useEffect, useState } from 'react'

import { createTopic, joinTopic, onSwarm, sendMessage } from '../lib/swarm'

export default function App () {
  const [error, setError] = useState('')

  const [size, setSize] = useState(0)

  const [newTopic, setNewTopic] = useState('')

  const [inputJoinTopic, setInputJoinTopic] = useState('')
  const [statusJoinTopic, setStatusJoinTopic] = useState('')

  const [inputMessage, setInputMessage] = useState('')
  const [messages, setMessages] = useState([])

  useEffect(() => {
    onSwarm({
      onError: (err) => {
        console.error(err)
        setError(err)
      },
      onData: (data) => {
        console.log(data)
        setMessages((items) => [...items, data])
      },
      onUpdate: (size) => setSize(size)
    })
  }, [])

  const onCreateTopic = async () => {
    setNewTopic('creating...')
    const topic = await createTopic()
    setNewTopic(topic)
  }

  const onJoinTopic = async () => {
    if (!inputJoinTopic) {
      alert('Please enter a topic')
      return
    }
    setStatusJoinTopic('Joining...')
    const topic = await joinTopic(inputJoinTopic)
    setStatusJoinTopic(`Joined ${topic}`)
    setInputJoinTopic('')
  }

  const onSendMessage = () => {
    if (!size) {
      alert('Please join a topic')
      return
    }
    if (!inputMessage) {
      alert('Please enter a message')
      return
    }
    sendMessage(inputMessage)
    setInputMessage('')
  }

  return (
    <div style={{ padding: 10, background: 'cyan' }}>
      <h1>MyApp</h1>
      <pre>{error}</pre>

      <hr />

      <button onClick={onCreateTopic}>Create topic</button>
      <p>New topic: {newTopic}</p>

      <hr />

      <h2>Join topic</h2>
      <div>
        <textarea type='text' value={inputJoinTopic} onChange={(evt) => setInputJoinTopic(evt.currentTarget.value)} />
      </div>
      <button onClick={onJoinTopic}>Join topic {inputJoinTopic}</button>
      <div>{statusJoinTopic}</div>

      <hr />

      <h2>Message</h2>
      <div>
        <textarea type='text' value={inputMessage} onChange={(evt) => setInputMessage(evt.currentTarget.value)} />
      </div>
      <button onClick={onSendMessage}>Send message</button>

      <hr />

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
