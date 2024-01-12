import Options from "./Options";

function Questions({ filterQuestions, dispatch, answer }) {
  return (
    <div>
      <h4>{filterQuestions.filterQuestions}</h4>

      <Options filterQuestions={filterQuestions} dispatch={dispatch} answer={answer} />
    </div>
  );
}

export default Questions;
