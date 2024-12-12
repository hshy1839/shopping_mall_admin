// login.js
import React, { useState } from 'react';
import { useNavigate  } from 'react-router-dom'; // react-router-dom을 사용하여 페이지 리디렉션

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate (); // useHistory 훅 사용하여 리디렉션

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (username === '' || password === '') {
      setErrorMessage('아이디와 비밀번호를 모두 입력하세요.');
      return;
    }
  
    try {
      const response = await fetch('http://127.0.0.1:8863/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
  
      if (!response.ok) {
        // 응답이 정상적이지 않은 경우 (예: 400, 500 등)
        const errorData = await response.json();
        setErrorMessage(errorData.message || '로그인 실패');
        return;
      }
  
      const data = await response.json();
      
      // 로그인 성공 시
      localStorage.setItem('isLoggedIn', true);  // 클라이언트에 로그인 상태 저장
      localStorage.setItem('token', data.token);  // jwt 토큰 저장
      navigate('/');  // 메인 페이지로 리디렉션
    } catch (error) {
      console.error('로그인 오류:', error);
      setErrorMessage('로그인 중 오류가 발생했습니다. 서버에 연결할 수 없습니다.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
      <h2>로그인</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="username">아이디</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="아이디를 입력하세요"
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력하세요"
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        <div>
          <button type="submit" style={{ width: '100%', padding: '10px' }}>
            로그인
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
