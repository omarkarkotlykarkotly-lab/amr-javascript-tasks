// Task 2.1 — Functions
function greet(name){return "Hello, "+(name===undefined?"friend":name)+"!";}
function square(number){return number*number;}
function add(a,b){return a+b;}
function canVote(age){return age>=18;}
function multiply(a,b){return a*(b===undefined?1:b);}
function logDouble(number){return number*2;}
const cube=function(number){return number**3;};
module.exports={greet,square,add,canVote,multiply,logDouble,cube};
