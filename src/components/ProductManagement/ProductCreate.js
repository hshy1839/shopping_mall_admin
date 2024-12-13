import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../css/ProductManagement/ProductCreate.css';

const ProductCreate = () => {
  const [name, setName] = useState('');
  const [categoryMain, setCategoryMain] = useState('');
  const [categorySub, setCategorySub] = useState('');
  const [image, setImage] = useState(null);
  const [size, setSize] = useState([]);
  const [sizeStock, setSizeStock] = useState({});
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);  // 추가 이미지 배열
  const navigate = useNavigate();

  const handleCategoryMainChange = (e) => {
    setCategoryMain(e.target.value);
    setCategorySub('');
  };

  const handleSizeChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSize([...size, value]);
      setSizeStock({
        ...sizeStock,
        [value]: 0,
      });
    } else {
      setSize(size.filter((s) => s !== value));
      const updatedStock = { ...sizeStock };
      delete updatedStock[value];
      setSizeStock(updatedStock);
    }
  };

  const handleStockChange = (e, size) => {
    const { value } = e.target;
    const numericStock = Number(value);
    setSizeStock({
      ...sizeStock,
      [size]: numericStock,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(URL.createObjectURL(file));
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleFileUpload = (e) => {
    const newImages = [...images];
    for (let i = 0; i < e.target.files.length; i++) {
      newImages.push(URL.createObjectURL(e.target.files[i]));
    }
    setImages(newImages);
  };

  // 이미지 삭제 함수
  const handleImageDelete = (index) => {
    const newImages = images.filter((_, idx) => idx !== index);
    setImages(newImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const filteredSizeStock = {};
    size.forEach((s) => {
      filteredSizeStock[s] = sizeStock[s] || 0;
    });

    const productData = {
      name,
      categoryMain,
      categorySub,
      price,
      description,
      sizeStock: filteredSizeStock,
      images,
      main_image: image,
    };

    const token = localStorage.getItem('token');

    try {
      const response = await axios.post('http://127.0.0.1:8863/api/products/productCreate', 
        productData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert('상품이 성공적으로 등록되었습니다.');
        navigate('/products');
      } else {
        alert('상품 등록 실패: ' + response.data.message);
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
          <label className="product-create-label" htmlFor="categoryMain">상위 카테고리</label>
          <select
            className="product-create-input"
            id="categoryMain"
            value={categoryMain}
            onChange={handleCategoryMainChange}
            required
          >
            <option value="">상위 카테고리를 선택하세요</option>
            <optgroup label="일반의류">
              <option value="일반의류">일반의류</option>
              <option value="골프의류">골프의류</option>
            </optgroup>
          </select>
        </div>

        <div className="product-create-field">
          <label className="product-create-label" htmlFor="categorySub">하위 카테고리</label>
          <select
            className="product-create-input"
            id="categorySub"
            value={categorySub}
            onChange={(e) => setCategorySub(e.target.value)}
            required
            disabled={!categoryMain}
          >
            <option value="">하위 카테고리를 선택하세요</option>
            {categoryMain === '일반의류' && (
              <>
                <option value="남성의류">남성의류</option>
                <option value="여성의류">여성의류</option>
                <option value="지갑">지갑</option>
                <option value="가방">가방</option>
                <option value="신발">신발</option>
                <option value="기타">기타</option>
              </>
            )}
            {categoryMain === '골프의류' && (
              <>
                <option value="남성골프">남성골프</option>
                <option value="여성골프">여성골프</option>
                <option value="골프가방">골프가방</option>
                <option value="골프신발">골프신발</option>
                <option value="골프기타">골프기타</option>
              </>
            )}
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

        {/* Additional Images */}
        <div className="product-create-field">
  <label className="product-create-label" htmlFor="images">상세 이미지</label>
  <input
    className="product-create-input"
    type="file"
    id="images"
    onChange={handleFileUpload}
    accept="image/*"
    multiple
  />
  
  {/* 이미지 목록 및 삭제 버튼 */}
  {images.length > 0 && (
  <div className="product-create-preview-images">
    {images.map((imageUrl, index) => (
      <div key={index} className="product-create-image-item">
        <img 
          src={imageUrl} 
          alt={`설명 이미지 ${index + 1}`} 
          className="description-image-preview" 
        />
        <button 
          className="delete-image-button"
          onClick={() => handleImageDelete(index)}
        >
          x
        </button>
      </div>
    ))}
  </div>
)}

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

        {/* Product Description */}
        <div className="product-create-field">
          <label className="product-create-label" htmlFor="description">상품 설명</label>
          <textarea
            className="product-create-input"
            id="description"
            value={description}
            onChange={handleDescriptionChange}
            placeholder="상품 설명을 입력하세요"
            required
          />
        </div>

        <button type="submit" className="product-create-button">등록</button>
      </form>
    </div>
  );
};

export default ProductCreate;
