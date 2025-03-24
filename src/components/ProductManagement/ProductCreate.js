import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import heic2any from "heic2any";
import '../../css/ProductManagement/ProductCreate.css';

const ProductCreate = () => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // 대표 이미지 미리보기
const [imagePreviews, setImagePreviews] = useState([]); // 추가 이미지 미리보기
  const [size, setSize] = useState([]);
  const [sizeStock, setSizeStock] = useState({});
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);  // 추가 이미지 배열
  const navigate = useNavigate();

const handleCategoryChange = (e) => {
    setCategory(e.target.value);
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


// const renderSizeOptions = () => {
//   if (categorySub === "신발") {
//     // 신발 카테고리일 경우 200~300, 5단위 생성
//     const shoeSizes = Array.from({ length: 21 }, (_, i) => 200 + i * 5);
//     return shoeSizes.map((sizeOption) => (
//       <label key={sizeOption}>
//         <input
//           type="checkbox"
//           value={sizeOption}
//           checked={size.includes(sizeOption.toString())}
//           onChange={handleSizeChange}
//         />
//         {sizeOption}
//         {size.includes(sizeOption.toString()) && (
//           <input
//             type="number"
//             value={sizeStock[sizeOption] || 0}
//             onChange={(e) => handleStockChange(e, sizeOption)}
//             placeholder="재고 수량"
//             min="0"
//           />
//         )}
//       </label>
//     ));
//   } else {
//     // 기본 카테고리 옵션
//     return ["S", "M", "L", "XL", "free"].map((sizeOption) => (
//       <label key={sizeOption}>
//         <input
//           type="checkbox"
//           value={sizeOption}
//           checked={size.includes(sizeOption)}
//           onChange={handleSizeChange}
//         />
//         {sizeOption}
//         {size.includes(sizeOption) && (
//           <input
//             type="number"
//             value={sizeStock[sizeOption] || 0}
//             onChange={(e) => handleStockChange(e, sizeOption)}
//             placeholder="재고 수량"
//             min="0"
//           />
//         )}
//       </label>
//     ));
//   }
// };

  // const handleStockChange = (e, size) => {
  //   const { value } = e.target;
  //   const numericStock = Number(value);
  //   setSizeStock({
  //     ...sizeStock,
  //     [size]: numericStock,
  //   });
  // };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const image = new Image();
      image.onload = () => {
       
          setImage(file);
          const previewUrl = URL.createObjectURL(file);
          setImagePreview(previewUrl);
      };
      image.src = URL.createObjectURL(file);
    }
  };


  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    const imageFiles = Array.from(files);
    const validImages = [];
    const validPreviews = [];
  
    for (const file of imageFiles) {
      const image = new Image();
      await new Promise((resolve, reject) => {
        image.onload = () => {
          const aspectRatio = image.width / image.height;
         
            validImages.push(file);
            const previewUrl = URL.createObjectURL(file);
            validPreviews.push(previewUrl);
            resolve();
        };
        image.src = URL.createObjectURL(file);
      });
    }
  
    setImagePreviews(validPreviews);
    setImages(validImages);
  };
  // 이미지 삭제 함수
  const handleImageDelete = (index) => {
    const updatedImages = images.filter((_, idx) => idx !== index);
    const updatedPreviews = imagePreviews.filter((_, idx) => idx !== index);
    setImages(updatedImages);
    setImagePreviews(updatedPreviews);
};

  
  
const handleSubmit = async (e) => {
  e.preventDefault();

  // 필수 필드 확인, 메인 이미지와 상세 이미지 포함
  if (!name || !category || !price || !image || images.length === 0) {
      alert('모든 입력란을 입력해주세요.');
      return;
  }

  const filteredSizeStock = {};
  size.forEach((s) => {
      filteredSizeStock[s] = sizeStock[s] || 0;
  });

  const formData = new FormData();
  formData.append('name', name);
  formData.append('category', category);
  formData.append('price', price);
  formData.append('description', description);
  formData.append('sizeStock', JSON.stringify(filteredSizeStock));

  // 메인 이미지 추가
  formData.append('mainImage', image);

  // 추가 이미지들 추가
  images.forEach((img) => {
      formData.append('additionalImages', img);
  });

  const token = localStorage.getItem('token');

  try {
      const response = await axios.post(
          'http://15.164.155.205:8865/api/products/productCreate',
          formData,
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
      console.error('상품 등록 실패:', error.message);
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
        onChange={handleCategoryChange}
        required
    >
        <option value="">카테고리를 선택하세요</option>
        <option value="지갑">지갑</option>
        <option value="가방">가방</option>
        <option value="신발">신발</option>
        <option value="기타">기타</option>
        <option value="모자">모자</option>
        <option value="악세사리">악세사리</option>
        <option value="골프의류">골프의류</option>  
        <option value="일반의류">일반의류</option>
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
          {image && <img src={imagePreview} alt="대표 이미지 미리보기" className="image-preview" />}
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
    <div className="product-create-preview-images">
        {imagePreviews.map((previewUrl, index) => (
            <div key={index} className="product-create-image-item">
                <img 
                    src={previewUrl} 
                    alt={`상세 이미지 ${index + 1}`} 
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
</div>


        {/* Size Selection */}
        {/* <div className="product-create-field">
    <label className="product-create-label">사이즈</label>
    <div className="product-create-sizes">{renderSizeOptions()}</div>
  </div> */}

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
