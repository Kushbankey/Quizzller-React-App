import { useEffect, useReducer } from "react";

import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Questions";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import Footer from "./Footer";
import Timer from "./Timer";

const SECS_PER_QUESTIONS = 20;

const initialState = {
  questions: [],
  filterQuestions: [],

  //loading, error, ready, active, finished
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highScore: 0,
  secondsRemaining: null,
  difficulty: "",
  numberOfQues: 1,
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return {
        ...state,
        questions: action.payload,
        filterQuestions: action.payload,
        status: "ready",
      };
    case "dataFailed":
      return {
        ...state,
        status: "error",
      };
    case "start":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.filterQuestions.length * SECS_PER_QUESTIONS,
      };
    case "newAnswer":
      const question = state.filterQuestions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    case "nextQuestion":
      return {
        ...state,
        index: state.index + 1,
        answer: null,
      };
    case "finish":
      return {
        ...state,
        status: "finished",
        highScore:
          state.points > state.highScore ? state.points : state.highScore,
      };
    case "restart":
      return {
        ...initialState,
        filterQuestions: state.filterQuestions,
        status: "ready",
        highScore: state.highScore,
      };
    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      };
    case "setDifficulty":
      return {
        ...state,
        difficulty: action.payload,
        numberOfQues: 1,
      };
    case "selectNumQues":
      return {
        ...state,
        filterQuestions: state.filterQuestions.slice(0, action.payload),
        numberOfQues: action.payload,
      };

    default:
      throw new Error("Unknown action!");
  }
}

export default function App() {
  const [
    {
      questions,
      filterQuestions,
      status,
      index,
      answer,
      points,
      highScore,
      secondsRemaining,
      difficulty,
      numberOfQues,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  function filterQuestionsByDifficulty(questions, difficulty) {
    switch (difficulty) {
      case "easy":
        return questions.filter((question) => question.points === 10);
      case "medium":
        return questions.filter((question) => question.points === 20);
      case "hard":
        return questions.filter((question) => question.points === 30);
      default:
        // If difficulty is not specified or 'all', return all questions
        return questions;
    }
  }

  useEffect(
    function () {
      fetch("https://my-json-server.typicode.com/Kushbankey/fakeApi/questions")
        .then((res) => res.json())
        .then((data) => {
          const filteredQuestions = filterQuestionsByDifficulty(
            data,
            difficulty
          );
          dispatch({ type: "dataReceived", payload: filteredQuestions });
        })
        .catch((err) => dispatch({ type: "dataFailed" }));
    },
    [difficulty]
  );

  return (
    <div className="app">
      <Header />

      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen
            numQuestions={questions.length}
            dispatch={dispatch}
            numberOfQues={numberOfQues}
            difficulty={difficulty}
          />
        )}
        {status === "active" && (
          <>
            <Progress
              index={index}
              numQuestions={filterQuestions.length}
              points={points}
              maxPossiblePoints={filterQuestions.reduce(
                (prev, cur) => prev + cur.points,
                0
              )}
              answer={answer}
            />
            <Question
              filterQuestions={filterQuestions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <Footer>
              <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
              <NextButton
                dispatch={dispatch}
                answer={answer}
                index={index}
                numQuestions={filterQuestions.length}
              />
            </Footer>
          </>
        )}
        {status === "finished" && (
          <FinishScreen
            points={points}
            maxPossiblePoints={filterQuestions.reduce(
              (prev, cur) => prev + cur.points,
              0
            )}
            highScore={highScore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}
