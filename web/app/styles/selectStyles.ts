import { CSSObjectWithLabel} from 'react-select';

export const customSelectStyles = {
  control: (base: CSSObjectWithLabel) => ({
    ...base,
    background: "#1f2937",
    borderColor: "#374151",
    "&:hover": {
      borderColor: "#6d28d9",
    },
    boxShadow: "none",
  }),
  menu: (base: CSSObjectWithLabel) => ({
    ...base,
    background: "#1f2937",
    border: "1px solid #374151",
  }),
  option: (base: CSSObjectWithLabel, state: { isFocused: boolean }) => ({
    ...base,
    backgroundColor: state.isFocused ? "#4c1d95" : "#1f2937",
    "&:hover": {
      backgroundColor: "#5b21b6",
    },
    color: "#f3f4f6",
  }),
  singleValue: (base: CSSObjectWithLabel) => ({
    ...base,
    color: "#f3f4f6",
  }),
  input: (base: CSSObjectWithLabel) => ({
    ...base,
    color: "#f3f4f6",
  }),
}; 