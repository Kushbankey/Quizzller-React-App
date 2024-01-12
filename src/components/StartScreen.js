import Dropbox from "./Dropbox";

function StartScreen({ numQuestions, dispatch, numberOfQues,difficulty }) {
  return (
    <div className="start">
      <h2>Welcome to the React Quiz!</h2>

      <Dropbox numQuestions={numQuestions} dispatch={dispatch} numberOfQues={numberOfQues} />

      <p className="p-numques">{numberOfQues} questions to test your React mastery!</p>
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "start" })}
      >
        Let's start
      </button>
    </div>
  );
}

export default StartScreen;
