const TogglePanel = ({ side, img, title, text, buttonText, onClick }) => {
  return (
    <div className={`toggle-panel toggle-${side}`}>
      <img src={img} alt="Logo" />
      <h1>{title}</h1>
      <p>{text}</p>
      <button type="button" className="btn" onClick={onClick}>
        {buttonText}
      </button>
    </div>
  );
};

export default TogglePanel;
