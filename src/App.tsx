import { useSelector } from "react-redux";

import reactLogo from "./assets/react.svg";
import "./App.css";
import { useAppDispatch } from "./redux/store";
import { increment } from "./redux/counter/counterSlice";
import { selectCounterValue } from "./redux/counter/selectors";

function App() {
    const dispatch = useAppDispatch();
    const counter = useSelector(selectCounterValue);

    const onCounterIncrement = () => {
        dispatch(increment());
    };

    return (
        <>
            <div>
                <a href="https://react.dev" target="_blank">
                    <img
                        src={reactLogo}
                        className="logo react"
                        alt="React logo"
                    />
                </a>
            </div>
            <h1 className="font-bold">Vite + React</h1>
            <div className="card">
                <button onClick={onCounterIncrement}>count is {counter}</button>
                <p>
                    Edit <code>src/App.tsx</code> and save to test HMR
                </p>
            </div>
            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p>
        </>
    );
}

export default App;
