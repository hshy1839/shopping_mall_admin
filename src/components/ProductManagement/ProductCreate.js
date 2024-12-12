import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // react-quill 기본 스타일
import '../../css/ProductManagement/ProductCreate.css';

const ProductCreate = () => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);  // 대표 이미지 상태
  const [size, setSize] = useState([]);  // 사이즈 배열
  const [sizeStock, setSizeStock] = useState({});  // 사이즈별 재고 상태
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [gender, setGender] = useState('공용');
  const navigate = useNavigate();

  // 사이즈 변경 처리 함수
  const handleSizeChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSize([...size, value]);
      setSizeStock({
        ...sizeStock,
        [value]: 0,  // 새 사이즈 선택 시, 재고는 0으로 초기화
      });
    } else {
      setSize(size.filter((s) => s !== value));
      const updatedStock = { ...sizeStock };
      delete updatedStock[value];  // 사이즈 제외 시, 해당 사이즈의 재고 삭제
      setSizeStock(updatedStock);
    }
  };

  // 사이즈별 재고 수량 변경 처리
  const handleStockChange = (e, size) => {
    const { value } = e.target;
    const numericStock = Number(value);  // 숫자로 변환
    setSizeStock({
      ...sizeStock,
      [size]: numericStock,  // 숫자 형식으로 저장
    });
  };
  

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(URL.createObjectURL(file));  // 선택된 이미지 URL을 상태에 저장
  };

  const handleDescriptionChange = (value) => {
    setDescription(value);
  };

  const handleFileUpload = (e) => {
    const newImages = [...images];
    for (let i = 0; i < e.target.files.length; i++) {
      newImages.push(URL.createObjectURL(e.target.files[i]));
    }
    setImages(newImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 선택된 사이즈와 그에 해당하는 재고만 포함하는 sizeStock 객체 만들기
    const filteredSizeStock = {};
    size.forEach((s) => {
      filteredSizeStock[s] = sizeStock[s] || 0;  // 사이즈별 재고 수량 (기본값은 0)
    });
  
    const productData = {
      name,
      category,
      price,
      description,
      gender,
      sizeStock: filteredSizeStock,  // 사이즈별 재고 데이터
      images,  // 추가 이미지
      main_image: image,  // 대표 이미지
    };
  
    const token = localStorage.getItem('token');  // localStorage에서 토큰 가져오기
    
    try {
      // axios POST 요청
      const response = await axios.post('http://127.0.0.1:8863/api/products/productCreate', 
        productData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          },
        }
      );
    
      const data = await response.data;  // 응답 데이터 받기
    
      if (response.status === 200) {
        alert('상품이 성공적으로 등록되었습니다.');
        navigate('/products');  // 상품 등록 후 상품 목록 페이지로 이동
      } else {
        alert('상품 등록 실패: ' + data.message);
      }
    } catch (error) {
      console.error('상품 등록 실패:', error);
      alert('상품 등록 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="product-create-container">
      <h2 className="product-create-title">상품 등록</h2>
      <form className="product-create-form" onSubmit={handleSubmit}>
        {/* Product Name */}
        <div className="product-create-field">
          <label className="product-create-label" htmlFor="name">상품 이름</label>
          <input
            className="product-create-input"
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="상품 이름을 입력하세요"
            required
          />
        </div>

        {/* Category */}
        <div className="product-create-field">
          <label className="product-create-label" htmlFor="category">카테고리</label>
          <select
            className="product-create-input"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">카테고리를 선택하세요</option>
            <optgroup label="일반의류">
              <option value="일반의류 > 남성의류">남성의류</option>
              <option value="일반의류 > 여성의류">여성의류</option>
              <option value="일반의류 > 지갑">지갑</option>
              <option value="일반의류 > 가방">가방</option>
              <option value="일반의류 > 신발">신발</option>
              <option value="일반의류 > 기타">기타</option>
            </optgroup>
            <optgroup label="골프의류">
              <option value="골프의류 > 남성골프">남성골프</option>
              <option value="골프의류 > 여성골프">여성골프</option>
              <option value="골프의류 > 골프가방">골프가방</option>
              <option value="골프의류 > 골프신발">골프신발</option>
              <option value="골프의류 > 골프기타">골프기타</option>
            </optgroup>
          </select>
        </div>

        {/* Main Image */}
        <div className="product-create-field">
          <label className="product-create-label" htmlFor="image">대표 이미지</label>
          <input
            className="product-create-input"
            type="file"
            id="image"
            onChange={handleImageChange}
            accept="image/*"
          />
          {image && <img src={image} alt="대표 이미지 미리보기" className="image-preview" />}
        </div>

        {/* Size Selection */}
        <div className="product-create-field">
          <label className="product-create-label">사이즈</label>
          <div className="product-create-sizes">
            {['S', 'M', 'L', 'XL'].map((sizeOption) => (
              <label key={sizeOption}>
                <input
                  type="checkbox"
                  value={sizeOption}
                  checked={size.includes(sizeOption)}
                  onChange={handleSizeChange}
                />
                {sizeOption}
                {size.includes(sizeOption) && (
                  <input
                    type="number"
                    value={sizeStock[sizeOption] || 0}
                    onChange={(e) => handleStockChange(e, sizeOption)}
                    placeholder="재고 수량"
                    min="0"
                  />
                )}
              </label>
            ))}
          </div>
        </div>

        {/* Price */}
        <div className="product-create-field">
          <label className="product-create-label" htmlFor="price">가격</label>
          <input
            className="product-create-input"
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="가격을 입력하세요"
            required
          />
        </div>

        {/* Gender */}
        <div className="product-create-field">
          <label className="product-create-label">성별</label>
          <div className="product-create-gender">
            {['남성', '여성'].map((option) => (
              <label key={option}>
                <input
                  type="radio"
                  value={option}
                  checked={gender === option}
                  onChange={(e) => setGender(e.target.value)}
                />
                {option}
              </label>
            ))}
          </div>
        </div>

        {/* Product Description */}
        <div className="product-create-field">
          <label className="product-create-label">상품 설명</label>
          <ReactQuill
            value={description}
            onChange={handleDescriptionChange}
            placeholder="상품 설명을 입력하세요"
            modules={{
              toolbar: [
                [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                ['bold', 'italic', 'underline'],
                ['link', 'image'],
              ],
            }}
            formats={['header', 'font', 'list', 'bold', 'italic', 'underline', 'link', 'image']}
          />
        </div>

        {/* Additional Images */}
        <div className="product-create-preview-images">
          {images.map((imageUrl, index) => (
            <img key={index} src={imageUrl} alt={`설명 이미지 ${index + 1}`} className="description-image-preview" />
          ))}
        </div>

        <button type="submit" className="product-create-button">등록</button>
      </form>
    </div>
  );
};

export default ProductCreate;
