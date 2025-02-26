import React, { useState, useEffect } from 'react';
import '../css/Main.css';
import axios from 'axios';

const Main = () => {
  const [unansweredCount, setUnansweredCount] = useState(0);
  const [pendingPaymentCount, setPendingPaymentCount] = useState(0);
  const [inactiveUsersCount, setInactiveUsersCount] = useState(0);

  useEffect(() => {
    const fetchInactiveUsersCount = async () => {
      try {
        const token = localStorage.getItem('token'); // 로그인 토큰 가져오기
        const response = await axios.get('http://localhost:8865/api/inactiveUsersCount', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setInactiveUsersCount(response.data.inactiveUsersCount);
      } catch (error) {
        console.error('비활성 유저 개수 가져오기 실패:', error);
      }
    };

    fetchInactiveUsersCount();
  }, []);

  useEffect(() => {
    const fetchPendingPaymentCount = async () => {
      try {
        const token = localStorage.getItem('token'); // 로그인 토큰 가져오기
        const response = await axios.get('http://localhost:8865/api/order/pendingCount', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPendingPaymentCount(response.data.pendingOrdersCount);
      } catch (error) {
        console.error('결제 대기 주문 개수 가져오기 실패:', error);
      }
    };

    fetchPendingPaymentCount();
  }, []);

  useEffect(() => {
    // API 호출로 답변 없는 질문 개수 가져오기
    const fetchUnansweredCount = async () => {
      try {
        const token = localStorage.getItem('token'); // 로그인 토큰 가져오기
        const response = await axios.get('http://localhost:8865/api/qnaQuestion/unansweredCount', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUnansweredCount(response.data.unansweredQuestionsCount);
      } catch (error) {
        console.error('답변 없는 질문 개수 가져오기 실패:', error);
      }
    };

    fetchUnansweredCount();
  }, []);


  return (
    <div className="main-container">
      <div className="main-container-container">
        <div className="main-section1">
          <div className="main-section1-item-container">
            <div className="main-section1-item">
              <div className="main-section1-item-text">답변 전 문의</div>
              <div className="main-section1-item-percent">
                <div className="main-section1-item-detail"> {unansweredCount} 개</div>
              </div>
            </div>
            <div className="main-section1-item">
              <div className="main-section1-item-text">주문 완료</div>
              <div className="main-section1-item-percent">
                <div className="main-section1-item-detail"> {pendingPaymentCount} 개</div>
              </div>
            </div>
            <div className="main-section1-item">
              <div className="main-section1-item-text">가입 승인 대기</div>
              <div className="main-section1-item-percent">
              <div className="main-section1-item-detail"> {inactiveUsersCount} 명</div>
              </div>
            </div>
            
          </div>
        </div>
      
      </div>
    </div>
  );
};

export default Main;
