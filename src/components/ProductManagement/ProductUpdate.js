import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../Header';
import '../../css/ProductManagement/ProductUpdate.css'; // 스타일 시트 경로 수정

const ProductUpdate = () => {
    const [product, setProduct] = useState(null); // 상품 상세 정보 상태
    const [updatedProduct, setUpdatedProduct] = useState({
        name: '',
        category: '',
        price: 0,
        description: '',
        sizeStock: {} // 사이즈별 재고를 위한 객체
    }); // 수정된 상품 데이터
    const { id } = useParams(); // URL에서 상품 ID를 가져옴
    const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅

    useEffect(() => {
        const fetchProductDetail = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.log('로그인 정보가 없습니다.');
                    return;
                }

                const response = await axios.get(
                    `http://127.0.0.1:8863/api/products/Product/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.data && response.data.success) {
                    setProduct(response.data.product);
                    setUpdatedProduct({
                        name: response.data.product.name,
                        category: response.data.product.category,
                        price: response.data.product.price,
                        description: response.data.product.description,
                        sizeStock: response.data.product.sizeStock || {}, // 기존 사이즈별 재고가 있으면 불러옴
                    });
                } else {
                    console.log('상품 상세 데이터 로드 실패');
                }
            } catch (error) {
                console.error('상품 상세 정보를 가져오는데 실패했습니다.', error);
            }
        };

        fetchProductDetail();
    }, [id]);

    // 수정 내용 변경 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('size')) {
            const size = name.split('_')[1]; // 'size_S', 'size_M' 형식으로 이름을 분리
            setUpdatedProduct(prev => ({
                ...prev,
                sizeStock: {
                    ...prev.sizeStock,
                    [size]: value
                }
            }));
        } else {
            setUpdatedProduct(prev => ({ ...prev, [name]: value }));
        }
    };

    // 수정 완료 버튼 클릭 핸들러
    const handleSave = async (e) => {
        e.preventDefault();
        const confirmation = window.confirm('수정사항을 저장하시겠습니까?');
        if (!confirmation) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('로그인 정보가 없습니다.');
                return;
            }

            const response = await axios.put(
                `http://127.0.0.1:8863/api/products/update/${id}`,
                updatedProduct,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data && response.data.success) {
                alert('상품이 수정되었습니다.');
                navigate(`/products`); // 수정 후 상품 목록 페이지로 리디렉션
            } else {
                alert('상품 수정에 실패했습니다.');
            }
        } catch (error) {
            console.error('상품 수정 중 오류가 발생했습니다.', error);
            alert('서버와의 연결에 문제가 발생했습니다. 다시 시도해주세요.');
        }
    };

    if (!product) {
        return <div>로딩 중...</div>;
    }

    return (
        <div className="product-update-container">
            <h2 className="product-update-title">상품 수정</h2>
            <form className="product-update-form" onSubmit={handleSave}>
                {/* Product Name */}
                <div className="product-update-field">
                    <label className="product-update-label" htmlFor="name">상품 이름</label>
                    <input
                        className="product-update-input"
                        type="text"
                        id="name"
                        name="name"
                        value={updatedProduct.name}
                        onChange={handleChange}
                        placeholder="상품 이름을 입력하세요"
                        required
                    />
                </div>

                {/* Category */}
                <div className="product-update-field">
                    <label className="product-update-label" htmlFor="category">카테고리</label>
                    <select
                        className="product-update-input"
                        id="category"
                        name="category"
                        value={updatedProduct.category}
                        onChange={handleChange}
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

                {/* Price */}
                <div className="product-update-field">
                    <label className="product-update-label" htmlFor="price">가격</label>
                    <input
                        className="product-update-input"
                        type="number"
                        id="price"
                        name="price"
                        value={updatedProduct.price}
                        onChange={handleChange}
                        placeholder="가격을 입력하세요"
                        required
                    />
                </div>

                {/* Size Stock - 사이즈별 재고 */}
                <div className="product-update-field">
                    <label className="product-update-label">사이즈별 재고</label>
                    <div>
                        {['S', 'M', 'L', 'XL'].map(size => (
                            <div key={size} className="product-update-size-field">
                                <label className="product-update-size-label">{size} 사이즈</label>
                                <input
                                    className="product-update-input"
                                    type="number"
                                    name={`size_${size}`}
                                    value={updatedProduct.sizeStock[size] || ''}
                                    onChange={handleChange}
                                    placeholder={`${size} 사이즈의 재고 수량`}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Description */}
                <div className="product-update-field">
                    <label className="product-update-label" htmlFor="description">상품 설명</label>
                    <textarea
                        className="product-update-input"
                        id="description"
                        name="description"
                        value={updatedProduct.description}
                        onChange={handleChange}
                        placeholder="상품 설명을 입력하세요"
                        rows="4"
                    />
                </div>

                <button type="submit" className="product-update-button">수정 완료</button>
            </form>
        </div>
    );
};

export default ProductUpdate;
