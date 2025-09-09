const LoginForm = () => {
  return (
    <div className="form-box login">
      <form>
        <h1>LogIn</h1>
        <div className="input-box">
          <input type="Email" placeholder="Email Address" required />
          <i className="bx bxs-user"></i>
        </div>
        <div className="input-box">
          <input type="password" placeholder="Password" required />
          <i className="bx bxs-lock-alt"></i>
        </div>
        <div className="forgot-link">
          <a href="#">Forget Password??</a>
        </div>
        <button type="submit" className="btn">LogIn</button>
        <p>or login with social platforms.</p>
        <div className="social-icons">
          <a href="#"><i className="bx bxl-google"></i></a>
          <a href="#"><i className="bx bxl-facebook"></i></a>
          <a href="#"><i className="bx bxl-github"></i></a>
          <a href="#"><i className="bx bxl-linkedin"></i></a>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
