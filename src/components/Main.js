import React, { useState, useEffect } from 'react';
import '../css/Main.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts';

const Main = () => {
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [totalUsers, setTotalUsers] = useState(0); // 총 유저 수 상태
  const [attendanceCount, setAttendanceCount] = useState(0); // 출근 중인 사람 수 상태
  const [leaveCount, setLeaveCount] = useState(0);
  const [leaveAllCount, setLeaveAllCount] = useState(0);
  const [timeAvr, setTimeAvr] = useState([]); // 근무 시간 상태

  // 출근 인원과 총 유저 수를 API에서 받아오는 함수
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const totalUsersResponse = await fetch('http://192.168.25.24:8864/api/users/userinfo', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const totalUsersData = await totalUsersResponse.json();

        if (Array.isArray(totalUsersData)) {
          setTotalUsers(totalUsersData.length);
        } else {
          setTotalUsers(totalUsersData.users ? totalUsersData.users.length : 0);
        }

        const attendanceResponse = await fetch('http://192.168.25.24:8864/api/users/allAttendanceInfo', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const attendanceData = await attendanceResponse.json();

        if (Array.isArray(attendanceData)) {
          // 출근 완료 인원
          const attendanceInProgress = attendanceData.filter(user => user.attendanceStatus === '출근 완료');
          setAttendanceCount(attendanceInProgress.length);

          const today = new Date().toISOString().split('T')[0];
          // 퇴근 완료 인원 및 퇴근 시간 가져오기
           const leaveInProgress = attendanceData.filter(user => {
          const checkOutDate = new Date(user.date).toISOString().split('T')[0]; // 퇴근 날짜 (YYYY-MM-DD)
          return user.attendanceStatus === '퇴근 완료' && checkOutDate === today;
          
        });

        const leaveAllInProgress = attendanceData.filter(user => user.attendanceStatus === '퇴근 완료' );
        
        setLeaveCount(leaveInProgress.length);
        setLeaveAllCount(leaveAllInProgress.length);
          // 퇴근 완료 인원의 출근 및 퇴근 시간 정보
          const leaveDetails = leaveAllInProgress.map(user => {
            const checkInTimeStr = user.checkInTime; // checkInTime 문자열
            const checkOutTimeStr = user.checkOutTime; // checkOutTime 문자열

            // 오늘 날짜 가져오기 (yyyy-mm-dd 형식)
            const today = new Date().toISOString().split('T')[0]; // '2024-11-29' 형식

            // 시간만 있는 문자열을 오늘 날짜와 결합하여 Date 객체로 변환
            const checkInTime = new Date(`${today}T${checkInTimeStr}`);
            const checkOutTime = new Date(`${today}T${checkOutTimeStr}`);

            // 날짜 유효성 체크
            if (isNaN(checkInTime) || isNaN(checkOutTime)) {
              console.error(`유효하지 않은 날짜 형식: checkInTime - ${checkInTimeStr}, checkOutTime - ${checkOutTimeStr}`);
              return null; // 유효하지 않으면 건너뜁니다.
            }

            // checkOutTime이 checkInTime보다 작거나 같으면 12시간을 더한 후 빼기
            let duration = Math.floor((checkOutTime - checkInTime) / 1000 / 60 / 60); // 시간을 계산 (초 -> 분 -> 시간)

            if (duration <= 0) {
              duration += 12; // duration이 0 이하일 경우 12시간을 더함
            }

            return {
              userId: user.userId,
              checkInTime: user.checkInTime,
              checkOutTime: user.checkOutTime,
              date: user.date, // date 정보 추가
              duration: duration, // 계산된 duration 추가
            };
          }).filter(item => item !== null); // null 값은 필터링


          // 월별로 duration의 평균을 계산
          const monthlyAverage = calculateMonthlyAverage(leaveDetails);
          setTimeAvr(monthlyAverage); // 월별 평균 근무 시간 업데이트
        } else {
          console.error('attendanceData는 배열이 아닙니다:', attendanceData);
          setAttendanceCount(0);
          setLeaveAllCount(0);
        }
      } catch (error) {
        console.error('데이터 가져오기 실패:', error);
      }
    };

    fetchData();
    
  }, []);
  

  const calculateMonthlyAverage = (leaveDetails) => {
    const monthlyData = {};

    leaveDetails.forEach(item => {
      const month = new Date(item.date).getMonth(); // 월을 추출 (0-11)
      if (!monthlyData[month]) {
        monthlyData[month] = { totalDuration: 0, count: 0 };
      }
      monthlyData[month].totalDuration += item.duration;
      monthlyData[month].count += 1;
    });

    // 월별 평균 계산
    const result = Object.keys(monthlyData).map(month => {
      const avgDuration = monthlyData[month].totalDuration / monthlyData[month].count;
      return { name: `${parseInt(month) + 1}월`, 평균근무시간: Math.floor(avgDuration) }; // 월 별로 평균 근무 시간 저장
    });

    return result;
  };

  // 옵션 선택 시 실행될 함수
  const handleBranchChange = (event) => {
    setSelectedBranch(event.target.value);
  };

  const handlePeriodChange = (event) => {
    setSelectedPeriod(event.target.value);
  };

  // 선택된 지점과 기간에 따라 변경될 데이터 예시
  const data = [
    { name: '1월', 급여: 8000, 시간: 10 },
    { name: '2월', 급여: 3000, 시간: 10 },
    { name: '3월', 급여: 2000, 시간: 11 },
    { name: '4월', 급여: 2780, 시간: 9 },
    { name: '5월', 급여: 2780, 시간: 15 },
    { name: '6월', 급여: 2380, 시간: 8 },
    { name: '7월', 급여: 1780, 시간: 7 },
    { name: '8월', 급여: 3780, 시간: 10 },
    { name: '9월', 급여: 5780, 시간: 8 },
    { name: '10월', 급여: 3780, 시간: 9 },
    { name: '11월', 급여: 2780, 시간: 10 },
    { name: '12월', 급여: 1780, 시간: 11 },
  ];

  // 조건에 맞는 데이터 필터링 (예시로 데이터가 변하지 않도록 했습니다)
  const filteredData = data; // 선택된 지점이나 기간에 따라 데이터를 필터링할 수 있습니다
  

  return (
    <div className="main-container">
      <div className="main-container-container">
        <div className="main-section1">
          <div className="main-section1-item-container">
            <div className="main-section1-item">
              <div className="main-section1-item-text">출근 인원</div>
              <div className="main-section1-item-percent">
                <div className="main-section1-item-circle1">
                  <span>{totalUsers > 0 ? ((attendanceCount / totalUsers) * 100).toFixed(0) : 0}%</span>
                </div>
                <div className="main-section1-item-detail">{attendanceCount} / {totalUsers} 명</div>
              </div>
            </div>
            <div className="main-section1-item">
              <div className="main-section1-item-text">퇴근 인원</div>
              <div className="main-section1-item-percent">
                <div className="main-section1-item-circle2">
                <span>{totalUsers > 0 ? ((leaveCount / totalUsers) * 100).toFixed(0) : 0}%</span>
                </div>
                <div className="main-section1-item-detail">{leaveCount} / {totalUsers} 명</div>
              </div>
            </div>
            <div className="main-section1-item">
              <div className="main-section1-item-text">휴가 신청 인원</div>
              <div className="main-section1-item-percent">
                <div className="main-section1-item-circle3">
                  <span>5건</span>
                </div>
                <div className="main-section1-item-detail">5건</div>
              </div>
            </div>
          </div>
        </div>
        <div className="main-section2">
          <div className="main-section2-container">
            <div className="main-section2-graph">
              <div className="main-section2-graph-top-container">
                <div className="main-section2-graph-title">직원 평균 급여</div>
                <div className="main-section2-graph-select-container">
                  <select
                    value={selectedBranch}
                    onChange={handleBranchChange}
                    className="main-section2-graph-select"
                  >
                    <option value="">지점 선택</option>
                    <option value="강남">강남 지점</option>
                    <option value="목동">목동 지점</option>
                    <option value="안양">안양 지점</option>
                  </select>
                  <select
                    value={selectedPeriod}
                    onChange={handlePeriodChange}
                    className="main-section2-graph-select"
                  >
                    <option value="">기간 선택</option>
                    <option value="월">월</option>
                    <option value="주">주</option>
                    <option value="일">일</option>
                  </select>
                </div>
              </div>
              <div className="main-section2-graph-container">
                <BarChart width={1200} height={300} data={filteredData}>
                  <CartesianGrid horizontal={true} vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip cursor={{ fill: 'transparent' }} />
                  <Legend />
                  <Bar dataKey="급여" fill="#6B4EFF" />
                </BarChart>
              </div>
            </div>
            <div className="main-section2-graph">
              <div className="main-section2-graph-top-container">
                <div className="main-section2-graph-title">직원 평균 근무 시간</div>
                <div className="main-section2-graph-select-container">
                  <select
                    value={selectedBranch}
                    onChange={handleBranchChange}
                    className="main-section2-graph-select"
                  >
                    <option value="">지점 선택</option>
                    <option value="강남">강남 지점</option>
                    <option value="목동">목동 지점</option>
                    <option value="안양">안양 지점</option>
                  </select>
                  <select
                    value={selectedPeriod}
                    onChange={handlePeriodChange}
                    className="main-section2-graph-select"
                  >
                    <option value="">기간 선택</option>
                    <option value="월">월</option>
                    <option value="주">주</option>
                    <option value="일">일</option>
                  </select>
                </div>
              </div>
              <div className="main-section2-graph-container">
                <LineChart width={1200} height={300} data={timeAvr}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="평균근무시간" stroke="#4BC9FF" />
                </LineChart>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
