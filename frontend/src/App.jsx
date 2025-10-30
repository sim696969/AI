import React, { useState, useEffect, useRef } from 'react'
export default function App(){
  const [convId, setConvId] = useState('default')
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef(null)
  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:'smooth'}) }, [messages])
  async function send(){
    if(!input.trim()) return
    const userMsg = input
    setMessages(m => [...m, {role:'user', content:userMsg}])
    setInput(''); setLoading(true)
    try{
      const res = await fetch('/chat', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ conv_id: convId, message: userMsg })
      })
      const data = await res.json()
      setMessages(m => [...m, {role:'assistant', content: data.reply}])
      setConvId(data.conv_id)
    }catch(e){
      setMessages(m => [...m, {role:'assistant', content: 'Error: ' + String(e)}])
    }
    setLoading(false)
  }
  return (
    <div style={{maxWidth:800, margin:'20px auto', fontFamily:'Inter, sans-serif'}}>
      <h1>GF-AI Chat</h1>
      <div style={{border:'1px solid #ddd', borderRadius:8, padding:12, minHeight:300}}>
        {messages.map((m,i)=> (
          <div key={i} style={{margin:'8px 0'}}>
            <strong style={{textTransform:'capitalize'}}>{m.role}:</strong>
            <div style={{whiteSpace:'pre-wrap'}}>{m.content}</div>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div style={{display:'flex', gap:8, marginTop:12}}>
        <input value={input} onChange={e=>setInput(e.target.value)} style={{flex:1, padding:8}} placeholder='Type your message' />
        <button onClick={send} disabled={loading} style={{padding:'8px 12px'}}>{loading ? '...' : 'Send'}</button>
      </div>
    </div>
  )
}
