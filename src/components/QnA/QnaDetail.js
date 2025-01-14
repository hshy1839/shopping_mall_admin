import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../Header';
import '../../css/NoticeManagement/NoticeDetail.css';

const QnaDetail = () => {
    const [qna, setQna] = useState(null); // QnA 상세 정보 상태
    const [isEditing, setIsEditing] = useState(false); // 수정 모드 상태
    const [updatedQna, setUpdatedQna] = useState({ title: '', body: '' }); // 수정된 QnA 데이터
    const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅
    const location = useLocation(); // 전달된 state 데이터 가져오기
    const id = location.state?.id; // 전달받은 id

    useEffect(() => {
        if (!id) {
            console.error('ID 정보가 없습니다.');
            return;
        }

        const fetchQnaDetail = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.log('로그인 정보가 없습니다.');
                    return;
                }

                const response = await axios.get(
                    `http://127.0.0.1:8863/api/qnaQuestion/getinfoByid/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.data && response.data.success) {
                    setQna(response.data.question);
                    setUpdatedQna({
                        title: response.data.question.title,
                        body: response.data.question.body,
                    });
                } else {
                    console.log('QnA 상세 데이터 로드 실패');
                }
            } catch (error) {
                console.error('QnA 상세 정보를 가져오는데 실패했습니다.', error);
            }
        };

        fetchQnaDetail();
    }, [id]);

    const handleEdit = () => {
        setUpdatedQna({
            title: qna.title,
            body: qna.body,
        });
        setIsEditing(true); // 수정 모드로 전환
    };

    const handleDelete = async () => {
        const confirmation = window.confirm('문의 내용을 삭제하시겠습니까?');
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
                `http://127.0.0.1:8863/qnaQuestion/delete/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data && response.data.success) {
                alert('문의가 삭제되었습니다.');
                navigate('/qna'); // QnA 목록 페이지로 리디렉션
            } else {
                alert('문의 삭제에 실패했습니다.');
            }
        } catch (error) {
            console.error('문의 삭제 중 오류가 발생했습니다.', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedQna((prev) => ({ ...prev, [name]: value }));
    };

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
                `http://127.0.0.1:8863/qnaQuestion/update/${id}`,
                updatedQna,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data && response.data.success) {
                setQna((prev) => ({ ...prev, ...updatedQna }));
                setIsEditing(false); // 수정 완료 후 수정 모드 종료
                alert('문의 내용이 수정되었습니다.');
                navigate('/qna'); // 수정 후 QnA 목록 페이지로 리디렉션
            } else {
                alert('문의 수정에 실패했습니다.');
            }
        } catch (error) {
            console.error('문의 수정 중 오류가 발생했습니다.', error);
            alert('서버와의 연결에 문제가 발생했습니다. 다시 시도해주세요.');
        }
    };

    if (!qna) {
        return <div>로딩 중...</div>;
    }

    return (
        <div className="notice-detail-container">
            <Header />
            <div className="notice-detail-container-container">
                {isEditing ? (
                    <>
                        <input
                            type="text"
                            name="title"
                            value={updatedQna.title}
                            onChange={handleChange}
                            className="edit-input"
                        />
                        <textarea
                            name="body"
                            value={updatedQna.body}
                            onChange={handleChange}
                            className="edit-textarea"
                        />
                        <button className="save-button" onClick={handleSave}>
                            완료
                        </button>
                    </>
                ) : (
                    <>
                        <h1>{qna.title}</h1>
                        <p>
                            <strong>작성자:</strong> {qna.userId?.username || '알 수 없음'}
                        </p>
                        <p>
                            <strong>작성 날짜:</strong>{' '}
                            {new Date(qna.createdAt).toLocaleDateString()}
                        </p>
                        <div className="notice-content">
                            <p>{qna.body}</p>
                        </div>
                        <div className="button-container">
                            <button className="edit-button" onClick={handleEdit}>
                                수정
                            </button>
                            <button className="delete-button" onClick={handleDelete}>
                                삭제
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default QnaDetail;
