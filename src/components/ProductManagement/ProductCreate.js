import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // react-quill 기본 스타일
import '../../css/ProductManagement/ProductCreate.css';

const ProductCreate = () => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);  // 대표 이미지 상태
  const [size, setSize] = useState([]);
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [stock, setStock] = useState('');
  const [gender, setGender] = useState('공용');
  const navigate = useNavigate();

  const handleSizeChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSize([...size, value]);
    } else {
      setSize(size.filter((s) => s !== value));
    }
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

  const handleImageUpload = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      // 이미지를 업로드하고 이미지 URL을 Quill 에디터에 삽입
      const range = quillRef.current.getEditor().getSelection();
      const url = reader.result;
      quillRef.current.getEditor().insertEmbed(range.index, 'image', url);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const quillRef = React.useRef(null); // Quill Editor reference

  return (
    <div className="product-create-container">
      <h2 className="product-create-title">상품 등록</h2>
      <form className="product-create-form">
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

        <div className="product-create-field">
          <label className="product-create-label" htmlFor="category">카테고리</label>
          <select
            className="product-create-input"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
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

        <div className="product-create-field">
          <label className="product-create-label" htmlFor="image">대표 이미지</label>
          <input
            className="product-create-input"
            type="file"
            id="image"
            onChange={handleImageChange}  // 파일 선택 시 상태 업데이트
            accept="image/*"
            required
          />
          {/* 선택된 대표 이미지 미리보기 */}
          {image && <img src={image} alt="대표 이미지 미리보기" className="image-preview" />}
        </div>

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
              </label>
            ))}
          </div>
        </div>

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
                ['link', 'image'], // 이미지 삽입 툴 활성화
              ],
            }}
            formats={['header', 'font', 'list', 'bold', 'italic', 'underline', 'link', 'image']}
          />
        </div>

        <div className="product-create-preview-images">
          {images.map((imageUrl, index) => (
            <img key={index} src={imageUrl} alt={`설명 이미지 ${index + 1}`} className="description-image-preview" />
          ))}
        </div>

        <div className="product-create-field">
          <label className="product-create-label" htmlFor="stock">재고</label>
          <input
            className="product-create-input"
            type="number"
            id="stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            placeholder="재고 수량을 입력하세요"
          />
        </div>

        <button type="submit" className="product-create-button">등록</button>
      </form>
    </div>
  );
};

export default ProductCreate;
