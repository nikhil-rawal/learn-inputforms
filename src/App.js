import { useState, useEffect, useRef, useCallback } from "react";
const yt_search_link =
  "https://corsproxy.io/?http://suggestqueries.google.com/complete/search?client=firefox&ds=yt&q=";
function App() {
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const inputRef = useRef(null);

  const submitFormHandler = useCallback(
    (e) => {
      e.preventDefault();
      setSearchQuery(inputValue);
    },
    [inputValue]
  );

  const changeInputValueHandler = useCallback((e) => {
    setInputValue(e.target.value);
  }, []);

  useEffect(() => {
    if (searchQuery) {
      console.log(searchQuery);
    }
  }, [searchQuery]);

  return (
    <div className="App flex m-auto p-20 justify-center">
      <form className="flex" onSubmit={submitFormHandler}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search"
          className="w-[550px] h-[42px] p-4 rounded-l-full border border-solid outline-none focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:bg-black dark:border-neutral-800"
          value={inputValue}
          onChange={changeInputValueHandler}
        />
        <div className="flex items-center justify-center border h-[42px] w-20 bg-gray-50 dark:bg-gray-950 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-neutral-800 border-solid rounded-r-full">
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}

export default App;
