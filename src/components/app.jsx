import { useState } from "react"

import { createTopic, joinTopic, sendMessage, useSwarm } from "../lib/swarm"

export default function App () {
  const [error, setError] = useState('')
  const [newTopic, setNewTopic] = useState('')
  const [inputTopic, setInputTopic] = useState('')
  const [joinStatus, setJoinStatus] = useState('')
  const [inputMessage, setInputMessage] = useState('')
  const [size, setSize] = useState(0)
  const [messages, setMessages] = useState([])

  useSwarm({
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

  const onCreateTopic = async () => {
    setNewTopic('creating...')
    const topic = await createTopic()
    setNewTopic(topic)
  }

  const onJoinTopic = async () => {
    if (!inputTopic) {
      alert('Please enter a topic')
      return
    }
    setJoinStatus('Joining...')
    const topic = await joinTopic(inputTopic)
    setJoinStatus(`Joined ${topic}`)
    setInputTopic('')
  }

  const onSendMessage = () => {
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

      <button onClick={onCreateTopic}>Create topic</button>
      <p>New topic: {newTopic}</p>
      
      <hr />

      <h2>Join topic</h2>
      <div>
        <textarea type="text" value={inputTopic} onChange={(evt) => setInputTopic(evt.currentTarget.value)} />
      </div>
      <button onClick={onJoinTopic}>Join topic {inputTopic}</button>
      <div>{joinStatus}</div>

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
