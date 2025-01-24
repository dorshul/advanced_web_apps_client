import { Routes, Route, useLocation } from 'react-router-dom';

import TopBar from './components/TopBar';
import ProfileView from './views/Profile';
import ExploreView from './views/Explore';
import ShareView from './views/NewPost';
import LoginView from './views/Login';
import RegistrationView from './views/Registration';

const App = () => {
  const location = useLocation();

  const noTopBarRoutes = ['/', '/register'];
      
  return (
    <>
      {!noTopBarRoutes.includes(location.pathname) && <TopBar />}
      <Routes>
        <Route index path="/" element={<LoginView />} />
        <Route path="/register" element={<RegistrationView />} />
        <Route path="/explore" element={<ExploreView />} />
        <Route path="/profile" element={<ProfileView />} />
        <Route path="/post" element={<ShareView />} />
      </Routes>
    </>
  );
};

export default App;
