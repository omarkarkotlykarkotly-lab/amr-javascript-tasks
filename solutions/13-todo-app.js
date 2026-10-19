// Task 5.1 — Todo app state and actions
function createTodoManager(){
  let nextId=1,todos=[];
  return {
    all:function(){return todos.map(function(todo){return Object.assign({},todo);});},
    add:function(text){const title=String(text===undefined||text===null?"":text).trim();if(!title)return null;const todo={id:nextId++,title:title,done:false};todos=todos.concat([todo]);return Object.assign({},todo);},
    toggle:function(id){if(!todos.some(function(todo){return todo.id===id;}))return false;todos=todos.map(function(todo){return todo.id===id?Object.assign({},todo,{done:!todo.done}):todo;});return true;},
    remove:function(id){const before=todos.length;todos=todos.filter(function(todo){return todo.id!==id;});return todos.length!==before;},
    remaining:function(){return todos.filter(function(todo){return !todo.done;}).length;},
    clearCompleted:function(){const before=todos.length;todos=todos.filter(function(todo){return !todo.done;});return before-todos.length;}
  };
}
function connectTodoApp(elements){
  const manager=createTodoManager();
  function render(){
    elements.list.replaceChildren();
    manager.all().forEach(function(todo){
      const item=document.createElement("li");item.dataset.id=String(todo.id);item.className=todo.done?"todo-item is-done":"todo-item";
      const label=document.createElement("span");label.textContent=todo.title;
      const toggle=document.createElement("button");toggle.type="button";toggle.dataset.action="toggle";toggle.textContent=todo.done?"Undo":"Done";
      const remove=document.createElement("button");remove.type="button";remove.dataset.action="remove";remove.textContent="Delete";
      item.append(label,toggle,remove);elements.list.appendChild(item);
    });
    elements.count.textContent=manager.remaining()+" left";
  }
  elements.form.addEventListener("submit",function(event){event.preventDefault();if(manager.add(elements.input.value))elements.input.value="";render();});
  elements.list.addEventListener("click",function(event){
    const button=event.target.closest("button[data-action]");if(!button)return;
    const item=button.closest("li[data-id]");if(!item)return;
    const id=Number(item.dataset.id);
    if(button.dataset.action==="toggle")manager.toggle(id);
    if(button.dataset.action==="remove")manager.remove(id);
    render();
  });
  render();return manager;
}
if(typeof module!=="undefined")module.exports={createTodoManager,connectTodoApp};
