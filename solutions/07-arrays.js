// Task 3.1 — Arrays
function firstItem(items){return items.length?items[0]:undefined;}
function lastItem(items){return items.length?items[items.length-1]:undefined;}
function addItem(items,item){return items.concat([item]);}
function contains(items,value){return items.includes(value);}
function largest(numbers){if(!numbers.length)return undefined;let biggest=numbers[0];for(const n of numbers)if(n>biggest)biggest=n;return biggest;}
function sumArray(numbers){return numbers.reduce(function(sum,n){return sum+n;},0);}
module.exports={firstItem,lastItem,addItem,contains,largest,sumArray};
