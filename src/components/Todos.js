import {useEffect, useState} from 'react';
import {firestore} from '../fbConfig/fbConfig';
import trashIcon from '../icons/delete.svg';
import addIcon from '../icons/plus.svg';

const collection = firestore.collection('todos');

export default function Todos() {

  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);

  // Retrieve Firestore Todos
  useEffect(() =>{
    collection.onSnapshot(snapshot =>{
      const fbData = [];
      snapshot.forEach(doc => {
        console.log(doc.data());
        fbData.push(({...doc.data(), id: doc.id}))
      });
      setTodos(fbData); 
      setLoading(false);
    })
  }, [])

  // Add New Todo to Firestore
  const newTodo = (title) =>{
    collection.add({ title })
    setTitle('');
  }

  const handleSubmit = (e) =>{
    e.preventDefault();
    newTodo(title);
  }

  // Delete a todo
  const deleteTodo = (id) =>{
    collection.doc(id).delete();
  }

  return (
    <div className="todo-component">
      <h1 className="heading">
        Todo(s)
        </h1>
      <form 
      className="todo-form"
      onSubmit={handleSubmit}>
        <input
        autoFocus
        placeholder="Add a new todo" 
        className="todo-input"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        />    
        <input 
        className="icon-add"
        type="image" src={addIcon}/>
      </form>
      {loading ? (<p className="loading">Loading ...</p>) : 
      // if loading is false execute code below
      (<ul className="todo-list">
        { todos.length ? todos.map(todo =>{
          return(
            <div 
            data-id={todo.id}
            key={todo.id} 
            className="todo-item">
              <p
              className="todo-title">
                {todo.title}
              </p>
              <img className="icons icon-delete"
                src={trashIcon} alt="trashIcon"
                id={todo.id}
                draggable="false  "
                onClick={(e) => deleteTodo(e.target.id)}/>
            </div>
          )
        }) :
        <p className="no-todo">
          No todo today!
        </p>
        }
      </ul>)
}
    </div>
  )
}
