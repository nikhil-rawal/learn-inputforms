import { useState, useEffect, useRef, useCallback } from "react";
import debounce from "lodash.debounce";

// Custom Hook for Debouncing
const useDebounce = (callback, delay) => {
  const debouncedCallback = useCallback(debounce(callback, delay), [
    callback,
    delay,
  ]);
  return debouncedCallback;
};

const RenderSearchSuggestions = ({ suggestions, fnc }) => {
  return (
    <>
      {suggestions?.length > 0 ? (
        <div className="absolute bg-white rounded-md shadow-black drop-shadow-lg py-2 mt-1 cursor-default">
          <ul className="py-2" role="listbox" aria-label="Search Suggestions">
            {suggestions.map((suggestion, index) => (
              <li
                className="pl-4 text-sm hover:bg-gray-200 w-full rounded border-white border py-2 flex items-center"
                key={`${index}-${suggestion}`}
                role="option"
                aria-selected="false"
                onClick={() => fnc(suggestion)}
              >
                🔍 {suggestion}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </>
  );
};

function App() {
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputValue.length > 1) {
      const timer = setTimeout(() => {
        getSearchSuggestions(inputValue);
      }, 300);
      return () => clearTimeout(timer);
    } else if (inputValue.length < 2) {
      setSearchSuggestions([]);
    }
  }, [inputValue]);

  const submitFormHandler = useCallback(
    (e) => {
      if (inputValue) {
        e.preventDefault();
        setSearchQuery(inputValue);
        setInputValue("");
        setSearchSuggestions([]);
      }
    },
    [inputValue]
  );

  const changeInputValueHandler = useCallback((e) => {
    setInputValue(e.target.value);
  }, []);

  const getSearchSuggestions = async (query) => {
    if (query.length > 1) {
      try {
        const data = await fetch(
          `https://corsproxy.io/?http://suggestqueries.google.com/complete/search?client=firefox&ds=yt&q=${query}`
        );
        const json = await data?.json();
        setSearchSuggestions(json[1]);
      } catch (error) {
        console.error("Error while fetching suggestions");
      }
    }
  };

  const handleSuggestionClick = (value) => {
    setInputValue(value);
    console.log("Current Suggestion", value);
  };

  useEffect(() => {
    inputValue && console.log("inputValue", inputValue);
  }, [inputValue]);
  useEffect(() => {
    searchQuery && console.log("searchQuery", searchQuery);
  }, [searchQuery]);
  useEffect(() => {
    searchSuggestions.length > 0 &&
      console.log("searchSuggestions", searchSuggestions);
  }, [searchSuggestions]);

  return (
    <div className="App flex m-auto p-20 justify-center h-full  w-full">
      <form className="flex" onSubmit={submitFormHandler}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search"
          className="w-[550px] h-[42px] p-4 rounded-l-full border border-solid outline-none focus:outline-none"
          value={inputValue}
          onChange={changeInputValueHandler}
        />
        <div></div>
        {inputValue && (
          <div
            className="absolute cursor-pointer hover:bg-gray-300 rounded-full p-2 left-[350px]"
            onClick={() => {
              setInputValue("");
              setSearchSuggestions([]);
              setSearchQuery("");
            }}
          >
            X
          </div>
        )}
        <div className="flex items-center justify-center border h-[42px] w-20 bg-gray-50  hover:bg-gray-200 border-solid rounded-r-full">
          <button type="submit">Submit</button>
        </div>
      </form>
      <RenderSearchSuggestions
        suggestions={searchSuggestions}
        fnc={handleSuggestionClick}
      />
    </div>
  );
}

export default App;
