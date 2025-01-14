import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../css/ProductManagement/ProductCreate.css';

const CouponCreate = () => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState('percentage');
  const [discountValue, setDiscountValue] = useState('');
  const [validFrom, setValidFrom] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [applicableCategories, setApplicableCategories] = useState([]);
  const navigate = useNavigate();

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setApplicableCategories([...applicableCategories, value]);
    } else {
      setApplicableCategories(applicableCategories.filter((cat) => cat !== value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !code || !discountType || !discountValue || !validFrom || !validUntil) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    const token = localStorage.getItem('token');

    try {
      const response = await axios.post(
        'http://127.0.0.1:8863/api/coupon',
        {
          name,
          code,
          discountType,
          discountValue: Number(discountValue),
          validFrom,
          validUntil,
          applicableCategories,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert('쿠폰이 성공적으로 등록되었습니다.');
        navigate('/coupon');
      } else {
        alert('쿠폰 등록 실패: ' + response.data.message);
      }
    } catch (error) {
      console.error('쿠폰 등록 실패:', error.message);
      alert('쿠폰 등록 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="product-create-container">
      <h2 className="product-create-title">쿠폰 등록</h2>
      <form className="product-create-form" onSubmit={handleSubmit}>
        {/* Coupon Name */}
        <div className="product-create-field">
          <label className="product-create-label" htmlFor="name">쿠폰 이름</label>
          <input
            className="product-create-input"
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="쿠폰 이름을 입력하세요"
            required
          />
        </div>

        {/* Coupon Code */}
        <div className="product-create-field">
          <label className="product-create-label" htmlFor="code">쿠폰 코드</label>
          <input
            className="product-create-input"
            type="text"
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="쿠폰 코드를 입력하세요"
            required
          />
        </div>

        {/* Discount Type */}
        <div className="product-create-field">
          <label className="product-create-label" htmlFor="discountType">할인 유형</label>
          <select
            className="product-create-input"
            id="discountType"
            value={discountType}
            onChange={(e) => setDiscountType(e.target.value)}
            required
          >
            <option value="percentage">퍼센트 (%)</option>
            <option value="fixed">고정 금액</option>
          </select>
        </div>

        {/* Discount Value */}
        <div className="product-create-field">
          <label className="product-create-label" htmlFor="discountValue">할인 값</label>
          <input
            className="product-create-input"
            type="number"
            id="discountValue"
            value={discountValue}
            onChange={(e) => setDiscountValue(e.target.value)}
            placeholder="할인 값을 입력하세요"
            required
          />
        </div>

    

        {/* Valid From */}
        <div className="product-create-field">
          <label className="product-create-label" htmlFor="validFrom">시작 날짜</label>
          <input
            className="product-create-input"
            type="date"
            id="validFrom"
            value={validFrom}
            onChange={(e) => setValidFrom(e.target.value)}
            required
          />
        </div>

        {/* Valid Until */}
        <div className="product-create-field">
          <label className="product-create-label" htmlFor="validUntil">만료 날짜</label>
          <input
            className="product-create-input"
            type="date"
            id="validUntil"
            value={validUntil}
            onChange={(e) => setValidUntil(e.target.value)}
            required
          />
        </div>

        {/* Applicable Categories */}
        <div className="product-create-field">
          <label className="product-create-label">적용 카테고리</label>
          <div className="product-create-sizes">
            {['골프의류', '일반의류', '남성의류', '여성의류', '지갑', '신발', '가방', '기타'].map((category) => (
              <label key={category}>
                <input
                  type="checkbox"
                  value={category}
                  checked={applicableCategories.includes(category)}
                  onChange={handleCategoryChange}
                />
                {category}
              </label>
            ))}
          </div>
        </div>

        <button type="submit" className="product-create-button">등록</button>
      </form>
    </div>
  );
};

export default CouponCreate;
