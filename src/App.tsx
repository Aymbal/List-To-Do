import { useEffect, useState } from "react";
import TodoItem from "./TodoItem";
import { Construction } from "lucide-react";

type Priority ="Urgent" |"Average" | "Low"

type Todo={
  id:number;
  text :string;
  priority : Priority
}

function App() {
  const[input,setInput]=useState<string>("")
  const [priority,setPriority]=useState<Priority>("Low") 

  const savedTodos =localStorage.getItem("todos")
  const initialTodos = savedTodos ? JSON.parse(savedTodos) : []
  const [todos , setTodos] = useState<Todo[]>(initialTodos)
  const [filter,setFilter]=useState<Priority |"tous">("tous") 


  useEffect(() =>{
    localStorage.setItem("todos",JSON.stringify(todos))
  },[todos])

  
  function addTodo(){
    if (input.trim()==""){
      return 
    }
    const newTodo: Todo ={
      id:Date.now(),
      text: input.trim(),
      priority : priority ,
      }
  
  const newTodos =[newTodo, ...todos]
  setTodos(newTodos)
  setInput("")
  setPriority("Low")
}
let filterertTodos : Todo[] = []

if (filter==="tous"){
  filterertTodos=todos
}else {
  filterertTodos =todos.filter((todo)=> todo.priority ===filter)
}

const urgentCount = todos.filter((t) => t.priority=== "Urgent").length
const moyennetCount = todos.filter((t) => t.priority=== "Low").length
const basseCount = todos.filter((t) => t.priority=== "Average").length
const totalCount = todos.length

function deleteTodo (id : number){
  const newsTodos = todos.filter((todo) => todo.id !==id)
  setTodos(newsTodos)
 } 
 const [selectedTodos,setselectedTodos]= useState<Set<number>>(new Set())

 function toggleSelecteTodo(id:number){
  const newSelected = new Set(selectedTodos)
  if(newSelected.has(id)){
    newSelected.delete(id)
  }
  else{
    newSelected.add(id)
  }
  setselectedTodos(newSelected)
 }

function finishSelected(){
  const newTodos = todos.filter((todo)=>{
    if (selectedTodos.has(todo.id)){
      return false
    }else{
      return true
    } 
  })
  setTodos (newTodos)
  setselectedTodos(new Set())
}

 return (
      <div className="flex justify-center">
       <div className="w-2/3 flex flex-col gap-4 my-15 bg-base-300 p-5 rounded-2x1">
        <div className="flex gap-4">
          <input type="text"
            className="input w-full"
            placeholder="Add a task..."
            value={input}
            onChange={(e)=>setInput(e.target.value)}
            />
           
            <select 
              className="select w-full"
              value={priority}
              onChange={(e)=>setPriority(e.target.value as Priority)}
            >
              <option value="Urgent">Urgent</option>
              <option value="Average">Average</option>
              <option value="Low">Low</option>
            </select>
            <button onClick={addTodo} className="btn btn-primary">
              Add
            </button>
        </div>
        <div className="space-y-2 flex-1 h-fit">
        <div className=" flex items-center justify-between" >
        <div className=" flex flex-warp gap-4">
            <button 
              className={`btn btn-soft ${filter === "tous"? "btn btn-primary":""}`} 
              onClick={() => setFilter("tous")
              }>
                all ({totalCount})
            </button>
            <button 
              className={`btn btn-soft ${filter === "Urgent"? "btn btn-primary":""}`} 
              onClick={() => setFilter("Urgent")
              }>
                Urgent ({urgentCount})
            </button>
            <button 
              className={`btn btn-soft ${filter === "Average"? "btn btn-primary":""}`} 
              onClick={() => setFilter("Average")
              }>
                Average ({moyennetCount})
            </button>
            <button 
              className={`btn btn-soft ${filter === "Low"? "btn btn-primary":""}`} 
              onClick={() => setFilter("Low")
              }>
                Low ({basseCount})
            </button>
          </div>
          <button 
            className="btn btn-primary"
            disabled={selectedTodos.size==0}  
            onClick={finishSelected}
            >
            Finish The Task {(selectedTodos.size)}
          </button>
        </div>

          {filterertTodos.length> 0 ?(
            <ul className="divide-y divide-primary/20">
              {filterertTodos.map((todo)=>(
                <li key={todo.id}>
                  <TodoItem 
                  todo={todo}
                  isSelected={selectedTodos.has(todo.id)}
                  onDelete={()=>deleteTodo(todo.id)}
                  onToggleSelect={toggleSelecteTodo}
                  />
                </li>
              ))}    
                </ul> 
              ):(
                <div className="flex justify-center items-center flex-col p-5">
                  <div>
                    <Construction strokeWidth={1} className="w-40 h-40 text-primary"/>
                  </div>
                  <p className="text-sm">Nothing to see here !</p>
                </div>
              )}
        </div>
       </div> 
      </div>
        )
}

export default App
