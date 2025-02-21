import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import '../../css/PromotionManagement/Promotion.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faBan, faTrash } from '@fortawesome/free-solid-svg-icons';

const Promotion = () => {
    const [promotions, setPromotions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const navigate = useNavigate();

    const fetchPromotions = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.log('로그인 정보가 없습니다.');
                return;
            }

            const response = await axios.get('http://localhost:8865/api/promotion/read', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success && Array.isArray(response.data.promotions)) {
                const sortedPromotions = response.data.promotions.sort((a, b) => {
                    return new Date(b.createdAt) - new Date(a.createdAt);
                });

                setPromotions(sortedPromotions);
            } else {
            }
        } catch (error) {
            console.error('프로모션 정보를 가져오는데 실패했습니다.', error);
        }
    };

    useEffect(() => {
        fetchPromotions();
    }, []);

    const handleCreatePromotionClick = () => {
        navigate('/promotion/create');
    };

    const handleDelete = async (id) => {
        if (!window.confirm('프로모션을 삭제하시겠습니까?')) return;

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.log('로그인 정보가 없습니다.');
                return;
            }

            const response = await axios.delete(`http://localhost:8865/api/promotion/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                alert('프로모션이 삭제되었습니다.');
                fetchPromotions();
            }
        } catch (error) {
            console.error('프로모션 삭제 실패:', error);
        }
    };

    const indexOfLastPromotion = currentPage * itemsPerPage;
    const indexOfFirstPromotion = indexOfLastPromotion - itemsPerPage;
    const currentPromotions = promotions.slice(indexOfFirstPromotion, indexOfLastPromotion);
    const totalPages = Math.ceil(promotions.length / itemsPerPage);

    return (
        <div className="promotion-management-container">
            <Header />
            <div className="promotion-management-container-container">
                <div className="promotion-top-container-container">
                    <h1>프로모션 관리</h1>
                    <div className="promotion-search-box">
                        <input
                            type="text"
                            placeholder="검색..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="search-button">검색</button>
                    </div>

                    <table className="promotion-table">
                        <thead>
                            <tr>
                                <th>번호</th>
                                <th>프로모션 이름</th>
                                <th>생성 날짜</th>
                                <th>액션</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentPromotions.map((promotion, index) => (
                                <tr key={promotion._id}>
                                    <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                                    <td>{promotion.name || 'Unknown Promotion'}</td>
                                    <td>
                                        {promotion.createdAt
                                            ? new Date(promotion.createdAt).toLocaleDateString()
                                            : 'Unknown'}
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <FontAwesomeIcon
                                                icon={faTrash}
                                                onClick={() => handleDelete(promotion._id)}
                                                className="delete-btn"
                                                title="삭제"
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="write-btn-container">
                    <button className="write-btn" onClick={handleCreatePromotionClick}>
                        프로모션 등록
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Promotion;
