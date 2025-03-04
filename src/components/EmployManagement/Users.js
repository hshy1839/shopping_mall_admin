import React, { useState, useEffect } from 'react';
import '../../css/Users.css';
import Header from '../Header.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faCheck, faTrash, faBan } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const Users = () => {
    const [users, setUsers] = useState([]);  // 검색 후 표시할 사용자 리스트
    const [allUsers, setAllUsers] = useState([]);  // 전체 사용자 데이터 (원본 데이터)
    const [searchTerm, setSearchTerm] = useState('');  // 검색어 상태
    const [searchCategory, setSearchCategory] = useState('all');  // 검색 기준 상태
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
        const itemsPerPage = 10; // 페이지당 표시할 항목 수

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    return;
                }

                const response = await axios.get('http://3.36.74.8:8865/api/users/userinfo', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data && response.data.success) {
                    const users = response.data.users; // 모든 유저 데이터
                    if (users && users.length > 0) {
                        // created_at 기준 내림차순 정렬
                        users.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                        setUsers(users);  // 현재 표시할 사용자 리스트
                        setAllUsers(users);  // 원본 데이터 저장
                    } else {
                        console.error('사용자 데이터가 없습니다.');
                    }
                } else {
                    console.log('사용자 정보 로드 실패');
                }
            } catch (error) {
                console.error('사용자 데이터를 가져오는데 실패했습니다.', error);
            }
        };

        fetchUsers();
    }, []);

  

    const handleSearch = () => {
        // 검색 결과 필터링
        const filteredUsers = allUsers.filter((user) => {
            if (searchCategory === 'all') {
                return (
                    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.name.toLowerCase().includes(searchTerm.toLowerCase())
                );
            } else if (searchCategory === 'user') {
                return user.username.toLowerCase().includes(searchTerm.toLowerCase());
            } else if (searchCategory === 'name') {
                return user.name.toLowerCase().includes(searchTerm.toLowerCase());
            }
            return true;
        });
    
        setUsers(filteredUsers);  // 필터된 결과로 상태 업데이트
    };
    
    
    const indexOfLastNotice = currentPage * itemsPerPage;
    const indexOfFirstNotice = indexOfLastNotice - itemsPerPage;
    const currentNotices = users.slice(indexOfFirstNotice, indexOfLastNotice);
    const totalPages = Math.ceil(users.length / itemsPerPage);


    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    // 각 기능 핸들러
   
    const handleAction = async (id, action) => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('로그인 정보가 없습니다.');
            return;
        }

        let url = `http://3.36.74.8:8865/api/users/userinfo/${id}`;
        let method = 'put';
        let data = {};
        let message = '';

        switch (action) {
            case 'approve':
            case 'reject':
                message = action === 'approve' ? "해당 사용자 계정을 승인하시겠습니까?" : "해당 사용자 계정을 사용중지 하시겠습니까?";
                data = { is_active: action === 'approve' };
                break;
            case 'delete':
                message = "해당 사용자를 삭제하시겠습니까?";
                method = 'delete';
                break;
            case '1':
            case '2':
            case '3':
                message = `해당 사용자를 ${action === '1' ? '관리자' : action === '2' ? '부관리자' : '일반유저'}로 설정하시겠습니까?`;
                data = { user_type: action };
                break;
        }

        const isConfirmed = window.confirm(message);
        if (!isConfirmed) return;

        try {
            const response = await axios({
                method,
                url,
                data,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                const updatedUsers = users.map((user) => {
                    if (user._id === id) {
                        return { ...user, ...data };
                    }
                    return user;
                }).filter((user) => !(action === 'delete' && user._id === id));
                setUsers(updatedUsers);
            } else {
                console.log(`${action} 실패`);
            }
        } catch (error) {
            console.error(`${action} 처리 중 오류 발생:`, error);
        }
    };
    
    return (
        <div className="users-management-container">
            <Header />
            <div className='users-management-container-container'>
                <div className='users-top-container-container'>
                    <h1>회원 관리</h1>

                    {/* 검색 박스 */}
                    <div className="users-search-box">
                        <select
                            className="search-category"
                            value={searchCategory}
                            onChange={(e) => setSearchCategory(e.target.value)} // 검색 기준 변경
                        >
                            <option value="all">전체</option>
                            <option value="user">아이디</option>
                            <option value="name">이름</option>
                        </select>
                        <input
                            type="text"
                            className='users-search-box-input'
                            placeholder="검색..."
                            value={searchTerm} // 입력된 검색어
                            onChange={(e) => setSearchTerm(e.target.value)} // 검색어 변경
                        />
                        <button className="search-button" onClick={handleSearch}>
                            검색
                        </button>
                    </div>

                    {/* 사용자 정보 테이블 */}
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>번호</th>
                                <th>아이디</th>
                                <th>이름</th>
                                <th>연락처</th>
                                <th>타입</th>
                                <th>가입일시</th>
                                <th>상태</th>
                                <th>권한설정</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan="10" className="no-results">
                                        존재하지 않습니다.
                                    </td>
                                </tr>
                            ) : (
                                users.map((user, index) => (
                                    <tr key={user._id}>
                                        <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                                        <td>{user.username}</td>
                                        <td>{user.name}</td>
                                        <td>{user.phoneNumber}</td>
                                        <td>
                                            {user.user_type ==3 ? '일반유저' :
                                             user.user_type == 2 ? '부관리자' : 
                                             user.user_type ==1 ? '관리자' : 
                                             '알 수 없음'}
                                        </td>
                                        <td>{new Date(user.created_at).toLocaleDateString()}</td>
                                        <td>{user.is_active ? '가입 승인' : '대기'}</td>
                                        <td>
                                            <select  className='users-role-select' onChange={(e) => handleAction(user._id, e.target.value)} defaultValue="">
                                                <option value="" disabled>선택하세요</option>
                                                <option value="approve">가입승인</option>
                                                <option value="reject">활동중지</option>
                                                <option value="delete">계정삭제</option>
                                                <option value="1">관리자 변경</option>
                                                <option value="2">부관리자 변경</option>
                                                <option value="3">일반유저 변경</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {/* 페이지 네비게이션 */}
                    <div className="pagination">
                        <button className="prev-page-btn" onClick={handlePreviousPage} disabled={currentPage === 1}>
                            이전
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => handlePageChange(i + 1)}
                                className={currentPage === i + 1 ? 'active' : ''}
                                id='page-number-btn'
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button className='next-page-btn' onClick={handleNextPage} disabled={currentPage === totalPages}>
                            다음
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Users;
