
const TogglePanel = ({ side, title, text, buttonText, onClick }) => {
  return (
    <div className={`toggle-panel toggle-${side}`}>
      <i className="fi fi-rr-user-add"></i>
      <h1>{title}</h1>
      <p>{text}</p>
      <button type="button" className="btn" onClick={onClick}>
        {buttonText}
      </button>
    </div>
  );
};

export default TogglePanel;
