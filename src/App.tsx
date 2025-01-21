import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import TopBar from './components/TopBar';
import ProfileView from './views/Profile';
import ExploreView from './views/Explore';
import ShareView from './views/NewPost';

const App = () => {
  return (
    <Router>
      <TopBar />
      <Routes>
        <Route index path="/explore" element={<ExploreView />} />
        <Route path="/profile" element={<ProfileView />} />
        <Route path="/post" element={<ShareView />} />
      </Routes>
    </Router>
  );
};

export default App;
