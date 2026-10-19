"use strict";

const tasks = [
  {id:"1.1",level:1,title:"Hello, Console",kind:"Basics",description:"Print messages and inspect the type of a value.",concepts:["console.log()","strings","numbers","typeof"],path:"solutions/01-hello-console.js",detail:"Quotes make strings; numbers do not need quotes."},
  {id:"1.2",level:1,title:"Variables",kind:"Basics",description:"Store values with const and let, then build a sentence.",concepts:["const","let","++","strings"],path:"solutions/02-variables.js",detail:"Choose const unless the binding itself needs reassignment."},
  {id:"1.3",level:1,title:"Operators & Types",kind:"Basics",description:"Practice math, conversion, booleans, and equality.",concepts:["* / %","Number()","==="],path:"solutions/03-operators-and-types.js",detail:"The plus sign can join strings or add numbers."},
  {id:"2.1",level:2,title:"Functions",kind:"Logic",description:"Use parameters, return values, default arguments, and arrow functions.",concepts:["parameters","return","defaults"],path:"solutions/04-functions.js",detail:"Returning a value lets another part of the program reuse it."},
  {id:"2.2",level:2,title:"Conditions",kind:"Logic",description:"Branch with if and else, including boundary cases.",concepts:["if / else","&&","||"],path:"solutions/05-conditions.js",detail:"Check the highest score boundary first."},
  {id:"2.3",level:2,title:"Loops",kind:"Logic",description:"Repeat actions, accumulate totals, and create FizzBuzz.",concepts:["for","for...of","FizzBuzz"],path:"solutions/06-loops.js",detail:"Check multiples of 15 before multiples of 3 or 5."},
  {id:"3.1",level:3,title:"Arrays",kind:"Data",description:"Read and add items, check membership, and find a maximum.",concepts:["index","length","includes"],path:"solutions/07-arrays.js",detail:"Start maximum search from the first value, even if all values are negative."},
  {id:"3.2",level:3,title:"Objects",kind:"Data",description:"Read properties, add data, and list keys.",concepts:["properties","bracket notation","Object.keys()"],path:"solutions/08-objects.js",detail:"Use bracket notation when a key is stored in a variable."},
  {id:"3.3",level:3,title:"Array Methods",kind:"Data",description:"Transform, filter, search, and combine arrays.",concepts:["map()","filter()","find()","reduce()"],path:"solutions/09-array-methods.js",detail:"Each array method has a different job."},
  {id:"4.1",level:4,title:"Select & Change",kind:"DOM",description:"Select elements, update text, toggle classes, and add items.",concepts:["querySelector()","textContent","classList"],path:"solutions/10-dom-select-and-change.js",detail:"Check that a selector found an element before changing it."},
  {id:"4.2",level:4,title:"Click Counter",kind:"DOM",description:"Update state in event handlers and render the result.",concepts:["events","state","render()"],path:"solutions/11-events-counter.js",detail:"Pass a callback to addEventListener instead of calling it immediately."},
  {id:"4.3",level:4,title:"Tip Calculator",kind:"DOM",description:"Read form values, validate them, and round money.",concepts:["submit","validation","Number()"],path:"solutions/12-forms-tip-calculator.js",detail:"Input values are strings; convert and validate before calculating."},
  {id:"5.1",level:5,title:"Todo App",kind:"Mini project",description:"Manage a list of tasks using objects and delegated events.",concepts:["objects","filter()","events"],path:"solutions/13-todo-app.js",detail:"One delegated click listener can handle every task action."}
];

const grid=document.querySelector("#task-grid");
const search=document.querySelector("#task-search");
const filterContainer=document.querySelector("#level-filters");
const taskCount=document.querySelector("#task-count");
const emptyState=document.querySelector("#empty-state");
let activeLevel="all";

function escapeHTML(value){return String(value).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});}
function renderTasks(){
  const term=search.value.trim().toLowerCase();
  const visible=tasks.filter(function(task){
    const levelMatches=activeLevel==="all"||String(task.level)===activeLevel;
    const haystack=[task.id,task.title,task.description,task.concepts.join(" "),task.detail].join(" ").toLowerCase();
    return levelMatches&&haystack.indexOf(term)!==-1;
  });
  taskCount.textContent=String(visible.length);
  emptyState.hidden=visible.length>0;
  grid.innerHTML=visible.map(function(task){
    return '<article class="task-card"><div class="task-card-top"><span class="task-number">TASK <b>'+escapeHTML(task.id)+'</b></span><span class="level-pill level-'+task.level+'">Level '+task.level+'</span></div>'+
      '<h3>'+escapeHTML(task.title)+'</h3><p>'+escapeHTML(task.description)+'</p><div class="concept-label">Key concepts</div><div class="concept-tags">'+task.concepts.map(function(c){return '<span>'+escapeHTML(c)+'</span>';}).join("")+'</div><p>'+escapeHTML(task.detail)+'</p>'+
      '<div class="task-card-footer"><a href="'+escapeHTML(task.path)+'">Open solution ↗</a><span class="task-kind">'+escapeHTML(task.kind)+'</span></div></article>';
  }).join("");
}
search.addEventListener("input",renderTasks);
filterContainer.addEventListener("click",function(event){
  const button=event.target.closest("button[data-level]");
  if(!button)return;
  activeLevel=button.dataset.level;
  filterContainer.querySelectorAll("button[data-level]").forEach(function(item){
    const selected=item===button;
    item.classList.toggle("is-active",selected);
    item.setAttribute("aria-pressed",String(selected));
  });
  renderTasks();
});
function describeScore(score){
  if(!Number.isFinite(score)||score<0||score>100)return "Enter a valid score from 0 to 100.";
  if(score>=90)return "Excellent — you got it!";
  if(score>=75)return "Good work — keep building on it.";
  if(score>=60)return "Passed — a little more practice will help.";
  return "Keep practising. Review the basics and try again.";
}
document.querySelector("#check-score").addEventListener("click",function(){
  const score=Number(document.querySelector("#score-input").value);
  document.querySelector("#score-output").textContent=describeScore(score);
});
document.querySelector("#calculate-sum").addEventListener("click",function(){
  const input=Number(document.querySelector("#sum-input").value);
  const output=document.querySelector("#sum-output");
  if(!Number.isInteger(input)||input<0||input>1000){output.textContent="Enter a whole number between 0 and 1,000.";return;}
  let total=0;for(let number=1;number<=input;number++)total+=number;
  output.textContent="Sum = "+total.toLocaleString();
});
let count=0;
const counterValue=document.querySelector("#counter-value");
function renderCounter(){counterValue.textContent=String(count);}
document.querySelector("#counter-minus").addEventListener("click",function(){count--;renderCounter();});
document.querySelector("#counter-plus").addEventListener("click",function(){count++;renderCounter();});
document.querySelector("#counter-reset").addEventListener("click",function(){count=0;renderCounter();});
document.querySelector("#tip-form").addEventListener("submit",function(event){
  event.preventDefault();
  const data=new FormData(event.currentTarget),bill=Number(data.get("bill")),percent=Number(data.get("tipPercent")),output=document.querySelector("#tip-output");
  if(!Number.isFinite(bill)||bill<=0||!Number.isFinite(percent)||percent<0||percent>100){output.textContent="Enter a bill greater than zero and a tip from 0% to 100%.";return;}
  const tip=Math.round((bill*percent/100+Number.EPSILON)*100)/100;
  const total=Math.round((bill+tip+Number.EPSILON)*100)/100;
  output.textContent="Tip: $"+tip.toFixed(2)+" · Total: $"+total.toFixed(2);
});
let domAdded=1;
const domMessage=document.querySelector("#dom-message");
document.querySelector("#dom-change").addEventListener("click",function(){
  domMessage.textContent=domMessage.textContent==="This text is controlled by JavaScript."?"Nice! You changed this text with textContent.":"This text is controlled by JavaScript.";
});
document.querySelector("#dom-highlight").addEventListener("click",function(){domMessage.classList.toggle("is-highlighted");});
document.querySelector("#dom-add").addEventListener("click",function(){
  const item=document.createElement("li");item.textContent="New item "+(++domAdded);document.querySelector("#dom-list").appendChild(item);
});
const todos=[];
let nextTodoId=1;
const todoForm=document.querySelector("#todo-form"),todoInput=document.querySelector("#todo-input"),todoList=document.querySelector("#todo-list"),todoCountLeft=document.querySelector("#todo-count");
function renderTodos(){
  todoList.replaceChildren();
  todos.forEach(function(todo){
    const row=document.createElement("li");row.className=todo.done?"todo-row is-done":"todo-row";row.dataset.id=String(todo.id);
    const title=document.createElement("span");title.textContent=todo.title;
    const toggle=document.createElement("button");toggle.type="button";toggle.dataset.action="toggle";toggle.textContent=todo.done?"Undo":"Done";
    toggle.setAttribute("aria-label",(todo.done?"Mark active: ":"Complete: ")+todo.title);
    const remove=document.createElement("button");remove.type="button";remove.dataset.action="remove";remove.textContent="Delete";remove.setAttribute("aria-label","Delete: "+todo.title);
    row.append(title,toggle,remove);todoList.appendChild(row);
  });
  todoCountLeft.textContent=todos.filter(function(todo){return !todo.done;}).length+" left";
}
todoForm.addEventListener("submit",function(event){
  event.preventDefault();const title=todoInput.value.trim();if(!title){todoInput.focus();return;}
  todos.push({id:nextTodoId++,title:title,done:false});todoInput.value="";renderTodos();todoInput.focus();
});
todoList.addEventListener("click",function(event){
  const button=event.target.closest("button[data-action]");if(!button)return;
  const row=button.closest("li[data-id]");if(!row)return;
  const id=Number(row.dataset.id),index=todos.findIndex(function(todo){return todo.id===id;});if(index<0)return;
  if(button.dataset.action==="toggle")todos[index].done=!todos[index].done;
  if(button.dataset.action==="remove")todos.splice(index,1);
  renderTodos();
});
document.querySelector("#todo-clear").addEventListener("click",function(){
  for(let i=todos.length-1;i>=0;i--)if(todos[i].done)todos.splice(i,1);
  renderTodos();
});
renderTasks();renderCounter();renderTodos();
