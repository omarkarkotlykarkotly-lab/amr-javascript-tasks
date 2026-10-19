// Task 1.1 — Hello, Console
function runHelloConsole(name){
  name=name||"AMR";
  console.log("Hello, JavaScript!");
  console.log(name);
  console.log(7);
  console.log(7*24);
  console.log(typeof "hello");
  console.log(typeof 42);
  console.log("Age:",20);
  return {greeting:"Hello, JavaScript!",name:name,number:7,hoursInWeek:168,textType:"string",numberType:"number",age:20};
}
if(require.main===module)runHelloConsole();
module.exports={runHelloConsole};
