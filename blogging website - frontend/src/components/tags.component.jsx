import { useContext } from "react";
import { EditorContext } from "../pages/editor.pages";

// This component represents a single tag in the publish form.
const Tag = ({ tag, tagIndex }) => {
  // Access the blog data from the EditorContext.
  let {
    blog,
    blog: { tags },
    setBlog,
  } = useContext(EditorContext);

  // Deletes the current tag from the tags array.
  const handleTagDelete = () => {
    // Filter out the tag to be deleted.
    let updatedTags = tags.filter((t) => t !== tag);
    // Update the blog state with the new tags array.
    setBlog({ ...blog, tags: updatedTags });
  };

  // Handles the editing of a tag when the Enter key is pressed.
  const handleTagEdit = (e) => {
    // Check if the key pressed is Enter.
    if (e.keyCode == 13) {
      e.preventDefault();
      let currentTag = e.target.innerText;
      // Update the tag at the specified index.
      tags[tagIndex] = currentTag;
      setBlog({ ...blog, tags });
      // Make the tag non-editable again.
      e.target.setAttribute("contentEditable", false);
    }
  };

  // Makes the tag editable when clicked.
  const addEditable = (e) => {
    e.target.setAttribute("contentEditable", true);
    e.target.focus();
  };

  return (
    <div className="relative p-2 mt-2 mr-2 px-5 bg-white rounded-full inline-block hover:bg-opacity-50 pr-10">
      {/* The tag text itself, which can be edited. */}
      <p
        className="outline-none"
        onClick={addEditable}
        onKeyDown={handleTagEdit}
      >
        {tag}
      </p>
      {/* The delete button for the tag. */}
      <button
        className="mt-[2px] rounded-full absolute right-3 top-1/2 -translate-y-1/2"
        onClick={handleTagDelete}
      >
        <i className="fi fi-br-cross text-sm pointer-events-none"></i>
      </button>
    </div>
  );
};

export default Tag;
