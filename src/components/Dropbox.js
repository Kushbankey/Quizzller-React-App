function Dropbox({ numQuestions, dispatch, numberOfQues, difficulty }) {
  return (
    <>
    <p className="p-diff">Select difficulty:</p>
      <select
        className="btn btn-dropbox"
        onChange={(e) =>
          dispatch({ type: "setDifficulty", payload: e.target.value })
        }
      >
        <option value="all">All</option>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>

      {
        <>
          <p className="p-slider">Select number of questions:</p>
          <input
            className="slider"
            value={numberOfQues}
            type="range"
            max={numQuestions}
            min="1"
            onChange={(e) =>
              dispatch({
                type: "selectNumQues",
                payload: parseInt(e.target.value),
              })
            }
          />
        </>
      }
    </>
  );
}

export default Dropbox;
