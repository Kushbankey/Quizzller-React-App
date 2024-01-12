import Options from "./Options";

function Questions({ filterQuestions, dispatch, answer }) {
  console.log(filterQuestions)
  return (
    <div>
      <h4>{filterQuestions.question}</h4>

      <Options filterQuestions={filterQuestions} dispatch={dispatch} answer={answer} />
    </div>
  );
}

export default Questions;
