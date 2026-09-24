import { Routes, Route } from 'react-router-dom'
import PageTransition from './components/PageTransition.jsx'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import Research from './pages/Research.jsx'
import BlogPost from './pages/BlogPost.jsx'
import Story from './pages/Story.jsx'
import StoryChapter from './pages/StoryChapter.jsx'
import Privacy from './pages/Privacy.jsx'
import Cookies from './pages/Cookies.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <PageTransition>
      {(location) => (
        // The controlled location makes Routes render the *displayed* page,
        // which PageTransition holds one step behind the URL during the wipe.
        <Routes location={location}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="research" element={<Research />} />
            <Route path="research/:slug" element={<BlogPost />} />
            <Route path="story" element={<Story />} />
            <Route path="story/:slug" element={<StoryChapter />} />
            <Route path="privacy" element={<Privacy />} />
            <Route path="cookies" element={<Cookies />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      )}
    </PageTransition>
  )
}
