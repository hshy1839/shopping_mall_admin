import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../Header';
import '../../css/ProductManagement/ProductDetail.css'; // 스타일 시트 경로 수정

const ProductDetail = () => {
    const [product, setProduct] = useState(null); // 상품 상세 정보 상태
    const [isEditing, setIsEditing] = useState(false); // 수정 모드 상태
    const [updatedProduct, setUpdatedProduct] = useState({ name: '', category: '', price: '', stock: '' }); // 수정된 상품 데이터
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

                console.log('상품 상세 정보:', response.data); // 상품 응답 확인

                if (response.data && response.data.success) {
                    setProduct(response.data.product);
                    setUpdatedProduct({
                        name: response.data.product.name,
                        category: response.data.product.category,
                        price: response.data.product.price,
                        stock: response.data.product.stock,
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

    // 수정 버튼 클릭 핸들러
    const handleEdit = () => {
        setUpdatedProduct({
            name: product.name,
            category: product.category,
            price: product.price,
            stock: product.stock,
        });
        setIsEditing(true); // 수정 모드로 전환
    };

    // 삭제 버튼 클릭 핸들러
    const handleDelete = async () => {
        const confirmation = window.confirm('이 상품을 삭제하시겠습니까?');
        if (!confirmation) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.log('로그인 정보가 없습니다.');
                return;
            }

            const response = await axios.delete(
                `http://127.0.0.1:8863/api/products/delete/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data && response.data.success) {
                alert('상품이 삭제되었습니다.');
                navigate('/products'); // 상품 목록 페이지로 리디렉션
            } else {
                alert('상품 삭제에 실패했습니다.');
            }
        } catch (error) {
            console.error('상품 삭제 중 오류가 발생했습니다.', error);
        }
    };

    // 수정 내용 변경 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedProduct(prev => ({ ...prev, [name]: value }));
    };

    // 완료 버튼 클릭 핸들러
    const handleSave = async () => {
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
                setProduct(prev => ({ ...prev, ...updatedProduct }));
                setIsEditing(false); // 수정 완료 후 수정 모드 종료
                alert('상품이 수정되었습니다.');
                navigate('/products'); // 수정 후 상품 목록 페이지로 리디렉션
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
        <div className="product-detail-container">
            <Header />
            <div className='product-detail-container-container'>
                {isEditing ? (
                    <>
                        <input
                            type="text"
                            name="name"
                            value={updatedProduct.name}
                            onChange={handleChange}
                            className="edit-input"
                        />
                        <input
                            type="text"
                            name="category"
                            value={updatedProduct.category}
                            onChange={handleChange}
                            className="edit-input"
                        />
                        <input
                            type="number"
                            name="price"
                            value={updatedProduct.price}
                            onChange={handleChange}
                            className="edit-input"
                        />
                        <input
                            type="number"
                            name="stock"
                            value={updatedProduct.stock}
                            onChange={handleChange}
                            className="edit-input"
                        />
                        <button className="save-button" onClick={handleSave}>완료</button>
                    </>
                ) : (
                    <>
                        <h1>{product.name}</h1>
                        <p><strong>카테고리:</strong> {product.category}</p>
                        <p><strong>가격:</strong> {product.price.toLocaleString()} 원</p>
                        <p><strong>재고:</strong> {product.stock} 개</p>

                        {/* 수정 및 삭제 버튼 */}
                        <div className="button-container">
                            <button className="edit-button" onClick={handleEdit}>수정</button>
                            <button className="delete-button" onClick={handleDelete}>삭제</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ProductDetail;
