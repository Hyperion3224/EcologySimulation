import { useState } from "react";

export function useDeferredInput(initial: string) {
  const [value, setValue] = useState(initial);        // committed value
  const [inputValue, setInputValue] = useState(initial); // draft value

  const commit = () => {
    setValue(inputValue);
  };

  const onEnter =
    (fn?: () => void) =>
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        commit();
        fn?.();                // optional callback (like setConfig)
        (e.target as HTMLInputElement).blur();
      }
    };

  return {
    value,
    inputValue,
    setInputValue,
    commit,
    inputProps: {
      value: inputValue,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setInputValue(e.target.value),
    },
    onEnter,
  };
}
