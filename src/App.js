import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Main from './components/Main';
import Loading from './components/Loading';
import Vacation from './components/EmployManagement/Vacation';
import Salary from './components/EmployManagement/Salary';
import Users from './components/EmployManagement/Users';
import Notice from './components/NoticeManagement/Notice';
import Login from './components/Login';
import NoticeCreate from './components/NoticeManagement/NoticeCreate';
import NoticeDetail from './components/NoticeManagement/NoticeDetail';
import Product from './components/ProductManagement/Product';
import { jwtDecode } from 'jwt-decode';
import ProductCreate from './components/ProductManagement/ProductCreate';

function App() {
  const [loading, setLoading] = useState(true); // 초기 로딩 상태를 true로 설정
  const location = useLocation(); // URL 추적

  useEffect(() => {
    const handleLoad = () => {
      setLoading(false); // 로딩 완료
    };
  
    setLoading(true); // 로딩 시작
  
    if (document.readyState === 'complete') {
      handleLoad(); // 이미 로드된 경우 바로 종료
    } else {
      window.addEventListener('load', handleLoad);
    }
  
    return () => {
      window.removeEventListener('load', handleLoad);
    };
  }, [location]);
  

  return (
    <div className="App">
      {loading ? (
        <Loading /> // 로딩 중일 때 로딩 페이지 표시
      ) : (
        <Routes>
          <Route path="/" element={<PrivateRoute><Header /><Main /></PrivateRoute>} />
          <Route path="/employeeManagement/vacation" element={<><Header /><Vacation /></>} />
          <Route path="/employeeManagement/salary" element={<><Header /><Salary /></>} />
          <Route path="/employeeManagement/users" element={<><Users /></>} />
          <Route path="/notice" element={<><Header /><Notice /></>} />
          <Route path="/notice/noticeCreate" element={<><Header /><NoticeCreate /></>} />
          <Route path="/notice/noticeDetail/:id" element={<NoticeDetail />} />
          <Route path="/login" element={<><Login /></>} />
          <Route path="/products" element={<><Header /><Product/></>} />
          <Route path="/products/productCreate" element={<><Header /><ProductCreate/></>} />
        </Routes>
      )}
    </div>
  );
}

function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

const PrivateRoute = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); // 로컬스토리지에서 토큰 가져오기

  useEffect(() => {
    if (!token) {
      navigate('/login'); // 토큰이 없으면 로그인 페이지로 리디렉션
      return;
    }

    try {
      const decodedToken = jwtDecode(token); // jwtDecode 함수로 토큰을 디코딩합니다.
      const currentTime = Date.now() / 1000; // 현재 시간 (초 단위)

      if (decodedToken.exp < currentTime) {
        // 토큰 만료 시간 비교
        localStorage.removeItem('token'); // 만료된 토큰 제거
        navigate('/login'); // 로그인 페이지로 리디렉션
      }
    } catch (error) {
      console.error('토큰 디코딩 오류:', error);
      localStorage.removeItem('token');
      navigate('/login'); // 오류 발생 시 로그인 페이지로 리디렉션
    }
  }, [token, navigate]);

  return children;
};


export default AppWrapper;
