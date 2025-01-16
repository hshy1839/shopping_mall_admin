import React, { useState, useEffect } from 'react';
import '../css/Main.css';

const Main = () => {
  const totalUsers = 5;
  return (
    <div className="main-container">
      <div className="main-container-container">
        <div className="main-section1">
          <div className="main-section1-item-container">
            <div className="main-section1-item">
              <div className="main-section1-item-text">답변 전 문의</div>
              <div className="main-section1-item-percent">
                <div className="main-section1-item-detail"> {totalUsers} 개</div>
              </div>
            </div>
            <div className="main-section1-item">
              <div className="main-section1-item-text">주문 완료</div>
              <div className="main-section1-item-percent">
                <div className="main-section1-item-detail"> {totalUsers} 명</div>
              </div>
            </div>
            <div className="main-section1-item">
              <div className="main-section1-item-text">가입 승인 대기</div>
              <div className="main-section1-item-percent">
              <div className="main-section1-item-detail"> {totalUsers} 명</div>
              </div>
            </div>
            
          </div>
        </div>
        <div className="main-section1">
          <div className="main-section1-item-container">
            <div className="main-section1-item">
              <div className="main-section1-item-text">답변 전 문의</div>
              <div className="main-section1-item-percent">
                <div className="main-section1-item-detail"> {totalUsers} 개</div>
              </div>
            </div>
            <div className="main-section1-item">
              <div className="main-section1-item-text">주문 완료</div>
              <div className="main-section1-item-percent">
                <div className="main-section1-item-detail"> {totalUsers} 명</div>
              </div>
            </div>
            <div className="main-section1-item">
              <div className="main-section1-item-text">가입 승인 대기</div>
              <div className="main-section1-item-percent">
              <div className="main-section1-item-detail"> {totalUsers} 명</div>
              </div>
            </div>
            
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Main;
