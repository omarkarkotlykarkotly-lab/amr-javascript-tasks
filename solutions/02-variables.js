// Task 1.2 — Variables and template strings
function makeStudentSummary(name,startingScore){
  name=name===undefined?"AMR":name;
  startingScore=startingScore===undefined?10:startingScore;
  const studentName=name;
  let score=startingScore;
  score++;
  return {studentName:studentName,score:score,greeting:"Hello, "+studentName+"!",summary:studentName+" has "+score+" points."};
}
if(require.main===module){const result=makeStudentSummary();console.log(result.greeting);console.log(result.summary);}
module.exports={makeStudentSummary};
