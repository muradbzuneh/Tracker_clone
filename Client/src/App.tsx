import { Route, Routes } from "react-router-dom";
import { useAppContext } from "./context/AppContext";
import Login from "./pages/Login";
import Layout from "./pages/Layout";
import Loading from "./components/Loading";
import Onboarding from "./pages/Onboarding";
import Activity from "./pages/Activity";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";

const App = () => {
  const { user, isUserFetched, onboardingCompleted } = useAppContext();

  if (!user) {
    return isUserFetched ? <Login /> : <Loading />;
  }

  if (!onboardingCompleted) {
    return <Onboarding />;
  }

  return (
    <Routes>
      {/* Layout wraps all pages */}
      <Route path="/" element={<Layout />}>
        
        {/* Child routes */}
        <Route index element={<Dashboard />} />
        <Route path="activity" element={<Activity />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />

      </Route>
    </Routes>
  );
};

export default App;