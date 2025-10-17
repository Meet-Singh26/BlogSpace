// This component creates a reusable input field with a built-in icon.
const InputBox = ({
  name,
  type,
  id,
  value,
  placeholder,
  icon,
  disable = false,
}) => {
  return (
    // The main container for the input and its icon.
    <div className="relative w-[100%] mb-4">
      {/* The actual input element. */}
      <input
        name={name} // The name attribute, used for form submission.
        type={type} // The input type (e.g., 'text', 'email', 'password').
        placeholder={placeholder} // Placeholder text for the input.
        defaultValue={value} // The default value of the input.
        id={id} // The id attribute for the input.
        className="input-box" // Tailwind CSS classes for styling.
        disabled={disable}
      />

      {/* The icon is positioned absolutely within the relative container. */}
      <i className={"fi " + icon + " input-icon"}></i>
    </div>
  );
};

export default InputBox;
