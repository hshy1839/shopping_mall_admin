import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import '../../css/CouponManagement/Coupon.css';

const Coupon = () => {
    const [coupons, setCoupons] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const navigate = useNavigate();

    // 쿠폰 데이터 가져오기
    const fetchCoupons = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.log('로그인 정보가 없습니다.');
                return;
            }

            const response = await axios.get('http://127.0.0.1:8863/api/coupons', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success && Array.isArray(response.data.coupons)) {
                // 최신 쿠폰이 먼저 오도록 정렬
                const sortedCoupons = response.data.coupons.sort((a, b) => {
                    return new Date(b.createdAt) - new Date(a.createdAt);
                });

                setCoupons(sortedCoupons);
            } else {
                console.error('올바르지 않은 데이터 형식:', response.data);
            }
        } catch (error) {
            console.error('쿠폰 정보를 가져오는데 실패했습니다.', error);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    // 쿠폰 검색
    const handleSearch = async () => {
        if (searchTerm === '') {
            fetchCoupons(); // 검색어가 없으면 전체 쿠폰을 다시 불러옵니다.
        } else {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.log('로그인 정보가 없습니다.');
                    return;
                }

                const response = await axios.get('http://127.0.0.1:8863/api/coupons', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data.success && Array.isArray(response.data.coupons)) {
                    const filteredCoupons = response.data.coupons.filter((coupon) => {
                        return coupon.name.includes(searchTerm) || coupon.code.includes(searchTerm);
                    });

                    setCoupons(filteredCoupons);
                } else {
                    console.error('올바르지 않은 데이터 형식:', response.data);
                }
            } catch (error) {
                console.error('쿠폰 정보를 가져오는데 실패했습니다.', error);
            }
        }
    };

    // 특정 쿠폰 클릭 처리
    const handleCouponClick = (id) => {
        navigate(`/coupons/detail/${id}`);
    };

    const indexOfLastCoupon = currentPage * itemsPerPage;
    const indexOfFirstCoupon = indexOfLastCoupon - itemsPerPage;
    const currentCoupons = coupons.slice(indexOfFirstCoupon, indexOfLastCoupon);
    const totalPages = Math.ceil(coupons.length / itemsPerPage);

    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleCreateCouponClick = () => {
        navigate('/coupon/create');
    };

    return (
        <div className="coupon-management-container">
            <Header />
            <div className="coupon-management-container-container">
                <div className="coupon-top-container-container">
                    <h1>쿠폰 관리</h1>
                    <div className="coupon-search-box">
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

                    <table className="coupon-table">
                        <thead>
                            <tr>
                                <th>번호</th>
                                <th>쿠폰 이름</th>
                                <th>코드</th>
                                <th>할인율</th>
                                <th>유효 기간</th>
                                <th>활성 상태</th>
                                <th>활성 카테고리</th>
                            </tr>
                        </thead>
                        <tbody>
    {currentCoupons.length > 0 ? (
        currentCoupons.map((coupon, index) => (
            <tr key={coupon._id}>
                <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                <td className="coupon-title" style={{ color: 'black' }}>
                    {coupon.name || 'Unknown Coupon'}
                </td>
                <td>{coupon.code || 'Unknown Code'}</td>
                <td>
                    {coupon.discountType === 'percentage'
                        ? `${coupon.discountValue}%`
                        : `${coupon.discountValue.toLocaleString()}원`}
                </td>
                <td>
                    {coupon.validUntil
                        ? new Date(coupon.validUntil).toLocaleDateString()
                        : '무제한'}
                </td>
                <td>
                    {coupon.isActive ? '활성화' : '비활성화'}
                </td>
                <td>
                    {coupon.applicableCategories && coupon.applicableCategories.length > 0
                        ? coupon.applicableCategories.join(', ')
                        : '모든 카테고리'}
                </td>
            </tr>
        ))
    ) : (
        <tr>
            <td colSpan="7" className="no-results">
                데이터가 없습니다.
            </td>
        </tr>
    )}
</tbody>


                    </table>

                    <div className="pagination">
                        <button
                            className="prev-page-btn"
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1}
                        >
                            이전 페이지
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => handlePageChange(i + 1)}
                                className={currentPage === i + 1 ? 'active' : ''}
                                id="page-number-btn"
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            className="next-page-btn"
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                        >
                            다음 페이지
                        </button>
                    </div>
                </div>
                <div className="write-btn-container">
                    <button className="write-btn" onClick={handleCreateCouponClick}>
                        쿠폰 등록
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Coupon;
