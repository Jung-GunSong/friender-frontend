
import './App.css';
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './HomePage';
import RegisterForm from './RegisterForm';
import CatPage from './CatPage';
import LoginForm from './LoginForm';
import FrienderApi from './api';

function App() {

  const [currCat, setCurrCat] = useState(JSON.parse(localStorage.getItem("currentCat")));
  const [allCats, setAllCats] = useState(null);

  async function handleSave(formData) {

    const userData = await FrienderApi.addCat(formData);
    setCurrCat(userData);
    localStorage.setItem("currentCat", JSON.stringify(userData));
  }

  async function handleLogin(loginData) {
      const username = await FrienderApi.loginCat(loginData);
      const foundCat = (allCats.filter(cat => cat.username === username))[0];

      setCurrCat(foundCat);
      localStorage.setItem("currentCat", JSON.stringify(foundCat));

      const newAllCats = allCats.filter(cat => cat.username !== username);
      setAllCats(newAllCats);
  }

  async function logOut(){
    localStorage.clear();

    const cats = await FrienderApi.getCats();
    setAllCats(cats);

    setCurrCat(null);
  }

  useEffect(function getAllCatsOnMount() {
    async function getAllCats() {
      const cats = await FrienderApi.getCats();

      if (currCat === null) {
        setAllCats(cats);
      } else {
        const newAllCats = cats.filter(cat => cat.username !== currCat.username);
        setAllCats(newAllCats);
      }
    }

    getAllCats();
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage currCat={currCat}/>} />
          { !currCat && <Route path="/login" element={<LoginForm handleLogin={handleLogin} />} /> }
          { !currCat && <Route path="/register" element={<RegisterForm handleSave={handleSave} />} /> }
          {allCats && currCat && <Route path="/cats" element={<CatPage cats={allCats}
            currCat={currCat} logOut={logOut} />} />}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
