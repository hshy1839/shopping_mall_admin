import React, { useState, useEffect } from 'react';
import '../../css/NoticeManagement/Notice.css';
import Header from '../Header.js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Product = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchCategory, setSearchCategory] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.log('로그인 정보가 없습니다.');
                    return;
                }
    
                const response = await axios.get('http://127.0.0.1:8863/api/products/allProduct', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
    
                if (response.data.success && Array.isArray(response.data.products)) {
                    setProducts(response.data.products);
                } else {
                    console.error('올바르지 않은 데이터 형식:', response.data);
                }
            } catch (error) {
                console.error('상품 정보를 가져오는데 실패했습니다.', error);
            }
        };
    
        fetchProducts();
    }, []);

    const handleSearch = () => {
        const filteredProducts = products.filter((product) => {
            if (searchCategory === 'all') {
                return (
                    product.name.includes(searchTerm) ||
                    product.category.includes(searchTerm)
                );
            } else if (searchCategory === 'name') {
                return product.name.includes(searchTerm);
            } else if (searchCategory === 'category') {
                return product.category.includes(searchTerm);
            }
            return true;
        });

        setProducts(filteredProducts);
        setCurrentPage(1);
    };

    const handleWriteClick = () => {
        navigate('/products/productCreate');
    };

    const handleProductClick = (id) => {
        navigate(`/products/productDetail/${id}`); // 해당 상품의 상세 페이지로 이동
    };

    const indexOfLastProduct = currentPage * itemsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(products.length / itemsPerPage);

    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="notice-management-container">
            <Header />
            <div className="notice-management-container-container">
                <div className="notice-top-container-container">
                    <h1>상품 관리</h1>
                    <div className="notice-search-box">
                        <select
                            className="search-category"
                            value={searchCategory}
                            onChange={(e) => setSearchCategory(e.target.value)}
                        >
                            <option value="all">전체</option>
                            <option value="name">상품 이름</option>
                            <option value="category">카테고리</option>
                        </select>
                        <input
                            type="text"
                            placeholder="검색..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="search-button" onClick={handleSearch}>
                            검색
                        </button>
                    </div>

                    <table className="notice-table">
                        <thead>
                            <tr>
                                <th>번호</th>
                                <th>상품 이름</th>
                                <th>카테고리</th>
                                <th>재고</th>
                                <th>가격</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentProducts.length > 0 ? (
                                currentProducts.map((product, index) => (
                                    <tr key={product.id} onClick={() => handleProductClick(product._id)}>
                                        <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                                        <td>{product.name || 'Unknown Product'}</td>
                                        <td>{product.category || 'Unknown Category'}</td>
                                        <td>{product.stock || 0}</td>
                                        <td>{product.price || 0}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="no-results">
                                        데이터가 없습니다.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <div className="pagination">
                        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                            이전 페이지
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => handlePageChange(i + 1)}
                                className={currentPage === i + 1 ? 'active' : ''}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                            다음 페이지
                        </button>
                    </div>
                </div>
                <div className="write-btn-container">
                    <button className="write-btn" onClick={handleWriteClick}>
                        글쓰기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Product;
