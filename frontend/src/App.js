import './App.css';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./pages/Home"
import { withRouter } from './utils/withRouter';
import Form from './pages/Form'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { connect } from "react-redux";
import Nagation from "./components/Nagation"
import userActions from "../src/redux/actions/userActions"
import { useEffect } from 'react'
const Forms = withRouter(Form)

function App({ user, rdxAuth, rdxLogin }) {
  useEffect(() => {
    async function fetchData() {
      const user = await rdxAuth();

      user.error && toast(user.error)
      const userLogged = {
        email: user.response.email,
        password: user.response.password
      }
      user.response && rdxLogin(userLogged)
    }
    localStorage.getItem('token') && fetchData();
  }, [rdxAuth, rdxLogin])
  return (
    <BrowserRouter>
      <Nagation />
      <Routes>
        <Route path="/" element={<Home />} />
        {
          user === '' &&
          <>
            <Route path="/SignIn" element={<Forms />} />
            <Route path="/SignUp" element={<Forms />} />
          </>
        }

        <Route path="*" element={<Home />} />

      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.userReducers.user
  }
}

const mapDispatchToProps = {
  rdxAuth: userActions.isAuth,
  rdxLogin: userActions.signIn
}
export default connect(mapStateToProps, mapDispatchToProps)(App);
