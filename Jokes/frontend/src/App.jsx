import { useState } from 'react'
import './App.css'
import exios from 'axios'
import { useEffect } from 'react'

function App() {
  const [jokes,setJokes] = useState([])

  useEffect(() => {
    exios.get("/api/jokes")
    .then((res) => {
      setJokes(res.data)
    })
    .catch((error) => {
      console.log(error);
      
    })
  },[])
  return (
    <>
      <h1>This are jokes.</h1>
      <p>jokes: {jokes.length}</p>
      {
        jokes.map((joke) => (
          <div key={jokes.id}>
            <h3>{joke.type}</h3>
            <h5>{joke.content}</h5>
          </div>
        ))
      }

    </>
  )
}

export default App
