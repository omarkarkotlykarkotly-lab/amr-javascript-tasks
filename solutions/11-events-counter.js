// Task 4.2 — Click counter
function createCounter(initialValue){
  let count=initialValue===undefined?0:initialValue;
  return {getValue:function(){return count;},increment:function(){count++;return count;},decrement:function(){count--;return count;},reset:function(){count=0;return count;}};
}
function connectCounter(elements){
  const counter=createCounter(Number(elements.value.textContent)||0);
  function render(){elements.value.textContent=String(counter.getValue());}
  elements.increment.addEventListener("click",function(){counter.increment();render();});
  elements.decrement.addEventListener("click",function(){counter.decrement();render();});
  elements.reset.addEventListener("click",function(){counter.reset();render();});
  render();return counter;
}
if(typeof module!=="undefined")module.exports={createCounter,connectCounter};
