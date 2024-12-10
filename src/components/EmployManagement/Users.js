import React, { useState, useEffect } from 'react';
import '../../css/Users.css';
import Header from '../Header.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faCheck,faTrash, faBan } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const Users = () => {
    const [employees, setEmployees] = useState([]);  // 검색 후 표시할 직원 리스트
    const [allEmployees, setAllEmployees] = useState([]);  // 전체 직원 데이터 (원본 데이터)
    const [searchTerm, setSearchTerm] = useState('');  // 검색어 상태
    const [searchCategory, setSearchCategory] = useState('all');  // 검색 기준 상태

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.log('로그인 정보가 없습니다.');
                    return;
                }

                const response = await axios.get('http://192.168.25.31:8863/api/users/userinfo', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data && response.data.success) {
                    const users = response.data.users; // 모든 유저 데이터
                    if (users && users.length > 0) {
                        // created_at 기준 내림차순 정렬
                        users.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                        setEmployees(users);  // 현재 표시할 직원 리스트
                        setAllEmployees(users);  // 원본 데이터 저장
                    } else {
                        console.error('유저 데이터가 없습니다.');
                    }
                } else {
                    console.log('유저 정보 로드 실패');
                }
            } catch (error) {
                console.error('유저 데이터를 가져오는데 실패했습니다.', error);
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        handleSearch();
    }, [searchTerm, searchCategory]);

    const handleSearch = () => {
        // 검색 결과 필터링
        const filteredEmployees = allEmployees.filter((employee) => {
            if (searchCategory === 'all') {
                return (
                    employee.username.includes(searchTerm) ||
                    employee.name.includes(searchTerm) ||
                    employee.company.includes(searchTerm)
                );
            } else if (searchCategory === 'user') {
                return employee.username.includes(searchTerm);
            } else if (searchCategory === 'name') {
                return employee.name.includes(searchTerm);
            } else if (searchCategory === 'company') {
                return employee.company.includes(searchTerm);
            }
            return true;
        });

        setEmployees(filteredEmployees);  // 필터된 결과로 상태 업데이트
    };

    // 각 기능 핸들러
    const handleApprove = async (id) => {const isConfirmed = window.confirm("해당 사용자계정을 승인하시겠습니까?");

        if (!isConfirmed) {
            console.log("승인이 취소되었습니다.");
            return;  // "아니오"를 선택하면 삭제 취소
        }
    
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.log('로그인 정보가 없습니다.');
                return;
            }
    
            const response = await axios.put(
                `http://192.168.25.31:8863/api/users/userinfo/${id}`,
                { is_active: true },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
    
            if (response.data.success) {
                const updatedEmployees = employees.map((employee) =>
                    employee._id === id ? { ...employee, is_active: true } : employee
                );
                setEmployees(updatedEmployees);
            } else {
                console.log('승인 실패');
            }
        } catch (error) {
            console.error('승인 처리 중 오류 발생:', error);
        }
    };

    const handleReject = async (id) => {
        const isConfirmed = window.confirm("해당 사용자 계정을 사용중지 하시겠습니까?");

    if (!isConfirmed) {
        console.log("사용중지가 취소되었습니다.");
        return;  // "아니오"를 선택하면 삭제 취소
    }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.log('로그인 정보가 없습니다.');
                return;
            }
    
            const response = await axios.put(
                `http://192.168.25.31:8863/api/users/userinfo/${id}`,
                { is_active: false },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
    
            if (response.data.success) {
                const updatedEmployees = employees.map((employee) =>
                    employee._id === id ? { ...employee, is_active: false } : employee
                );
                setEmployees(updatedEmployees);
            } else {
                console.log('거부 실패');
            }
        } catch (error) {
            console.error('거부 처리 중 오류 발생:', error);
        }
    };
    

    const handleDelete = async (id) => {
        const isConfirmed = window.confirm("해당 사용자를 삭제하시겠습니까?");

    if (!isConfirmed) {
        console.log("삭제가 취소되었습니다.");
        return;  // "아니오"를 선택하면 삭제 취소
    }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.log('로그인 정보가 없습니다.');
                return;
            }
    
            const response = await axios.delete(
                `http://192.168.25.31:8863/api/users/userinfo/${id}`,  // URL에 ID 포함
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
    
            if (response.data.success) {
                const updatedEmployees = employees.filter((employee) => employee._id !== id);
                setEmployees(updatedEmployees);
            } else {
                console.log('삭제 실패');
            }
        } catch (error) {
            console.error('삭제 처리 중 오류 발생:', error);
        }
    };
    
    
    

    return (
        <div className="users-management-container">
            <Header />
            <div className='users-management-container-container'>
                <div className='users-top-container-container'>
                    <h1>사용자 관리</h1>

                    {/* 검색 박스 */}
                    <div className="users-search-box">
                        <select
                            className="search-category"
                            value={searchCategory}
                            onChange={(e) => setSearchCategory(e.target.value)} // 검색 기준 변경
                        >
                            <option value="all">전체</option>
                            <option value="user">아이디</option>
                            <option value="post">이름</option>
                            <option value="company">회사</option>
                        </select>
                        <input
                            type="text"
                            placeholder="검색..."
                            value={searchTerm} // 입력된 검색어
                            onChange={(e) => setSearchTerm(e.target.value)} // 검색어 변경
                        />
                        <button className="search-button" onClick={handleSearch}>
                            검색
                        </button>
                    </div>

                    {/* 직원 정보 테이블 */}
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>번호</th>
                                <th>아이디</th>
                                <th>이름</th>
                                <th>연락처</th>
                                <th>회사</th>
                                <th>소속</th>
                                <th>직책</th>
                                <th>가입일</th>
                                <th>상태</th>
                                <th>액션</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.length === 0 ? (
                                <tr>
                                    <td colSpan="10" className="no-results">
                                        존재하지 않습니다.
                                    </td>
                                </tr>
                            ) : (
                                employees.map((employee, index) => (
                                    <tr key={employee._id}>
                                        <td>{employees.length > 0 ? employees.length - index : 0}</td>
                                        <td>{employee.username}</td>
                                        <td>{employee.name}</td>
                                        <td>{employee.phoneNumber}</td>
                                        <td>{employee.company}</td>
                                        <td>{employee.team}</td>
                                        <td>{employee.position}</td>
                                        <td>{new Date(employee.created_at).toLocaleDateString()}</td>
                                        <td>{employee.is_active ? '가입 승인' : '대기'}</td>
                                        <td>
                                            <div className="actions-btns">
                                                <FontAwesomeIcon 
                                                    icon={faCheck} 
                                                    onClick={() => handleApprove(employee._id)} 
                                                    className="approve-btn"
                                                />
                                                <FontAwesomeIcon 
                                                    icon={faBan} 
                                                    onClick={() => handleReject(employee._id)} 
                                                    className="reject-btn"
                                                />
                                                <FontAwesomeIcon 
                                                    icon={faTrash} 
                                                    onClick={() => handleDelete(employee._id)} 
                                                    className="delete-btn"
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {/* 페이지 네비게이션 */}
                    <div className="pagination-container">
                        <button className='pagination-prev-btn'>이전</button>
                        <span className='pagination-number'>1</span>
                        <button className='pagination-next-btn'>다음</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Users;
