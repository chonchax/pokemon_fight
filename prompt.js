import readlineSync from "readline-sync";

export function prompt(question) {
  const answer = readlineSync.question(question);

  return answer;
}
