// Task 2.3 — Loops and FizzBuzz
function sumTo(n){if(!Number.isInteger(n)||n<0)return 0;let total=0;for(let i=1;i<=n;i++)total+=i;return total;}
function countdown(start){const result=[];for(let i=start;i>=0;i--)result.push(i);return result;}
function collectNames(names){const result=[];for(const name of names)result.push(String(name).trim());return result;}
function fizzBuzz(n){const result=[];for(let i=1;i<=n;i++){if(i%15===0)result.push("FizzBuzz");else if(i%3===0)result.push("Fizz");else if(i%5===0)result.push("Buzz");else result.push(i);}return result;}
module.exports={sumTo,countdown,collectNames,fizzBuzz};
