// Task 3.3 — map, filter, find, and reduce
function doubleAll(numbers){return numbers.map(function(n){return n*2;});}
function adults(people){return people.filter(function(person){return person.age>=18;});}
function findByName(people,name){return people.find(function(person){return person.name===name;});}
function total(numbers){return numbers.reduce(function(sum,n){return sum+n;},0);}
function totalAdultAges(people){return people.filter(function(p){return p.age>=18;}).map(function(p){return p.age;}).reduce(function(sum,age){return sum+age;},0);}
module.exports={doubleAll,adults,findByName,total,totalAdultAges};
