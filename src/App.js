import React, { useReducer, useContext, useEffect } from 'react'

function appReducer (state, action) {
  switch(action.type) {
    case 'ADD':
      return [...state, {id: Date.now(), text: '', completed: false}]
    case 'GET':
      return state = action.payload 
    case "DELETE":
      return state.filter( item => item.id !== action.payload)
    case 'COMPLETED':
      return state.map(item => {
        if (item.id === action.payload) {
          item.completed = !item.completed
        }
        return item
      })  
    default:
      return state
  }
}

const Context = React.createContext()

function App() {
  const [state, dispatch] = useReducer(appReducer, [])

  useEffect(async () => {
    const raw = await localStorage.getItem('data')

    dispatch({type: 'GET', payload: JSON.parse(raw)})
  }, [])

  useEffect(() => {
    localStorage.setItem('data', JSON.stringify(state))
  }, [state])
  return (
    <Context.Provider value={dispatch}>
      <div>
        <h1>Todo hooks</h1>
        <button onClick={() => dispatch({type: 'ADD'})}>Add</button>
        <TodosList items={state}/>
      </div>
    </Context.Provider>
  )
}

function TodosList({items}) {
  return  <div>
    {items.map( item => (
    <TodoItem key={item.id} {...item}/>
  ))}
  </div>
}

function TodoItem({id, text, completed}) {
  const dispatch = useContext(Context)
  return <div style={{
    display: 'flex',
    justifyContent: 'center'
  }}>
    <input type="checkbox" checked={completed} onChange={() => dispatch({type: 'COMPLETED', payload: id})}/>
    <input type="text" defaultValue={text}/>
    <button onClick={() => dispatch({type: 'DELETE', payload: id})}>Delete</button>
  </div>
}



export default App
