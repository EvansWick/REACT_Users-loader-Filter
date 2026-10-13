import { useState } from "react";
import UsersLoader from "./components/UsersLoader";
import "./App.sass";

function App() {
  const [count, setCount] = useState(0);

  return <UsersLoader></UsersLoader>;
}

export default App;
