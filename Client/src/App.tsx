import { Route, Routes } from "react-router-dom";
import { useAppContext } from "./context/AppContext";
import Login from "./pages/Login";
import Layout from "./pages/Layout";
import Loading from "./components/Loading";
import Onboarding from "./pages/Onboarding";

const App = () => {
  const { user, isUserFetched, onboardingCompleted } = useAppContext();
  
  if (!user) {
    return isUserFetched ? <Login /> : <Loading />;
  }
  if(!onboardingCompleted){
  return  <Onboarding />

 }
  return (
    <div>
      <Routes>
        <Route path="/" element={<Layout />} />
      </Routes>
    </div>
  );
};

export default App;