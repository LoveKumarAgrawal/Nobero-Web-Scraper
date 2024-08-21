import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SubCategory from './pages/SubCategory';
import ProductPage from './pages/ProductPage';
  
function App() {

  return (
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/subcategory/:category" element={<SubCategory />} />
          <Route path="/product/id/:id" element={<ProductPage />} />
        </Routes>
      </Router>
  )
}

export default App


