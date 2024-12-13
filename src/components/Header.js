import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faGauge, faUsers, faCalendarAlt, faBullhorn, faCog, faSignOutAlt, faBars } from '@fortawesome/free-solid-svg-icons';
import '../css/Header.css';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <header className="header-container">
      <div className='header-container-container'>
        {/* 로고 및 인사 메시지 */}
        <div className='header-section1'>
          <div className='header-section1-logo'>
            System
          </div>
          <div className='header-section1-greeting'>
            안녕하세요 관리자님
          </div>
        </div>

        {/* 메뉴 아이템들 */}
        <div className='header-section2'>
          <Link to="/" onClick={handleLinkClick}>
            <div className='header-section2-item'>
              <FontAwesomeIcon icon={faGauge} className='header-section2-item-icon' />
              <div className='header-section2-item-text'>Overview</div>
            </div>
          </Link>
          <div className='header-section2-item-employee-container'>
            <Link to="#" onClick={toggleMenu}>
              <div className='header-section2-item-employee'>
                <FontAwesomeIcon icon={faCalendarAlt} className='header-section2-item-employee-icon' />
                <div className='header-section2-item-text'>상품 관리</div>
              </div>
            </Link>
            <div className={`submenu-employee ${isOpen ? 'open' : ''}`}>
              <Link to="/products" className='submenu-item-employee'>상품 목록</Link>
              <Link to="/employeeManagement/salary" className='submenu-item-employee'>주문 목록</Link>
              <Link to="/employeeManagement/users" className='submenu-item-employee'>이건 후에 추가</Link>
            </div>
          </div>

          <Link to="/employeeManagement/users" onClick={handleLinkClick}>
            <div className='header-section2-item'>
              <FontAwesomeIcon icon={faUsers} className='header-section2-item-icon' />
              <div className='header-section2-item-text'>고객 관리</div>
            </div>
          </Link>
          <Link to="/notice" onClick={handleLinkClick}>
            <div className='header-section2-item'>
              <FontAwesomeIcon icon={faBullhorn} className='header-section2-item-icon' />
              <div className='header-section2-item-text'>공지사항</div>
            </div>
          </Link>
        </div>

        {/* 설정 및 로그아웃 */}
        <div className='header-section3'>
          <Link to="/" onClick={handleLinkClick}>
            <div className='header-section3-item'>
              <FontAwesomeIcon icon={faCog} className='header-section2-item-icon' />
              <div className='header-section2-item-text'>설정</div>
            </div>
          </Link>
          <Link to="/" >
            <div className='header-section3-item'>
              <FontAwesomeIcon icon={faSignOutAlt} className='header-section2-item-icon' />
              <div className='header-section2-item-text'>로그아웃</div>
            </div>
          </Link>
        </div>
      </div>

      {/* 반응형 버거 메뉴 아이콘 */}
      <div className="burger-menu" onClick={toggleMenu}>
        <FontAwesomeIcon icon={faBars} className="burger-icon" />
      </div>
    </header>
  );
};

export default Header;
