const assert = require("node:assert/strict");
const t1=require("../solutions/01-hello-console");
const t2=require("../solutions/02-variables");
const t3=require("../solutions/03-operators-and-types");
const t4=require("../solutions/04-functions");
const t5=require("../solutions/05-conditions");
const t6=require("../solutions/06-loops");
const t7=require("../solutions/07-arrays");
const t8=require("../solutions/08-objects");
const t9=require("../solutions/09-array-methods");
const t10=require("../solutions/10-dom-select-and-change");
const t11=require("../solutions/11-events-counter");
const t12=require("../solutions/12-forms-tip-calculator");
const t13=require("../solutions/13-todo-app");

const tests=[
["1.1 console basics",function(){const r=t1.runHelloConsole("AMR");assert.equal(r.hoursInWeek,168);assert.equal(r.textType,"string");assert.equal(r.numberType,"number");}],
["1.2 variables",function(){const r=t2.makeStudentSummary("AMR",9);assert.equal(r.score,10);assert.equal(r.greeting,"Hello, AMR!");assert.equal(r.summary,"AMR has 10 points.");}],
["1.3 operators and types",function(){const r=t3.operatorExamples();assert.equal(r.multiply,42);assert.equal(r.remainder,2);assert.equal(r.joined,"53");assert.equal(r.added,8);assert.equal(r.strictEquality,false);}],
["2.1 functions",function(){assert.equal(t4.greet(),"Hello, friend!");assert.equal(t4.square(5),25);assert.equal(t4.add(2,3),5);assert.equal(t4.canVote(18),true);assert.equal(t4.multiply(4),4);assert.equal(t4.cube(3),27);}],
["2.2 conditions",function(){assert.equal(t5.describeScore(90),"Excellent");assert.equal(t5.describeScore(89),"Good");assert.equal(t5.describeScore(60),"Passed");assert.equal(t5.describeScore(101),"Invalid score");assert.equal(t5.canAccessDashboard(true,false),false);assert.equal(t5.shouldBringUmbrella(false,60),true);}],
["2.3 loops and FizzBuzz",function(){assert.equal(t6.sumTo(5),15);assert.deepEqual(t6.countdown(3),[3,2,1,0]);assert.deepEqual(t6.collectNames([" Ana ","Bob"]),["Ana","Bob"]);assert.deepEqual(t6.fizzBuzz(5),[1,2,"Fizz",4,"Buzz"]);assert.equal(t6.fizzBuzz(15)[14],"FizzBuzz");}],
["3.1 arrays",function(){assert.equal(t7.firstItem([8,9]),8);assert.equal(t7.lastItem([8,9]),9);assert.deepEqual(t7.addItem([1],2),[1,2]);assert.equal(t7.contains(["a","b"],"b"),true);assert.equal(t7.largest([-8,-3,-11]),-3);assert.equal(t7.sumArray([1,2,3]),6);}],
["3.2 objects",function(){const person={name:"Amr",age:22};assert.equal(t8.getProperty(person,"age"),22);assert.deepEqual(t8.addCity(person,"Damascus"),{name:"Amr",age:22,city:"Damascus"});assert.equal(t8.describePerson(person),"Amr is 22 years old.");assert.deepEqual(t8.listKeys(person),["name","age"]);}],
["3.3 array methods",function(){assert.deepEqual(t9.doubleAll([1,2,3]),[2,4,6]);assert.deepEqual(t9.adults([{name:"A",age:17},{name:"B",age:18}]),[{name:"B",age:18}]);assert.equal(t9.findByName([{name:"A"}],"A").name,"A");assert.equal(t9.total([1,2,3,4]),10);assert.equal(t9.totalAdultAges([{age:17},{age:20},{age:30}]),50);}],
["4.1 DOM selection",function(){const state={highlighted:false,toggle:function(k){this[k]=!this[k];}};const text={textContent:"before",classList:state};const list={children:[],appendChild:function(x){this.children.push(x);}};const root={querySelector:function(s){return s==="#missing"?null:s==="#list"?list:text;},createElement:function(tag){return {tagName:tag.toUpperCase(),textContent:""};}};assert.equal(t10.setText("#message","after",root),true);assert.equal(text.textContent,"after");assert.equal(t10.setText("#missing","x",root),false);assert.equal(t10.toggleClass("#message","highlighted",root),true);assert.equal(state.highlighted,true);assert.equal(t10.appendListItem("#list","Hello",root).textContent,"Hello");}],
["4.2 counter",function(){const c=t11.createCounter(2);assert.equal(c.increment(),3);assert.equal(c.decrement(),2);assert.equal(c.reset(),0);}],
["4.3 tip calculator",function(){assert.deepEqual(t12.calculateTip(100,15),{ok:true,bill:100,tip:15,total:115});assert.equal(t12.calculateTip(0,15).ok,false);assert.equal(t12.calculateTip(100,150).ok,false);}],
["5.1 Todo app",function(){const todos=t13.createTodoManager();assert.equal(todos.add("  "),null);const a=todos.add(" Learn JS ");const b=todos.add("Practice loops");assert.equal(a.title,"Learn JS");assert.equal(todos.remaining(),2);assert.equal(todos.toggle(a.id),true);assert.equal(todos.remaining(),1);assert.equal(todos.remove(b.id),true);assert.equal(todos.clearCompleted(),1);assert.equal(todos.all().length,0);}]
];
let failures=0;
tests.forEach(function(test){try{test[1]();console.log("✓ "+test[0]);}catch(error){failures++;console.error("✗ "+test[0]+"\n  "+error.message);}});
console.log("\n"+(tests.length-failures)+"/"+tests.length+" test groups passed.");
if(failures)process.exitCode=1;
