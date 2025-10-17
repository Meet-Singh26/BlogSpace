// A simple component to display a message when there is no data to show.
const NoDataMessage = ({ message }) => {
  return (
    // The main container for the message.
    <div className="text-center w-full p-4 rounded-full bg-grey/50 mt-4">
      {/* The message to be displayed is passed as a prop. */}
      <p>{message}</p>
    </div>
  );
};

export default NoDataMessage;