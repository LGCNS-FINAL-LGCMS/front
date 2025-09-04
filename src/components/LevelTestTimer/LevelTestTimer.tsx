import { useEffect, useState, memo } from "react";
import styled from "styled-components";

const TimerSection = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 10px 20px;
  border-radius: 16px;
  margin-bottom: 20px;
`;

const TimeBox = styled.div<{ isWarning: number }>`
  background: ${(props) => {
    const { isWarning } = props;

    if (isWarning <= 60) {
      const progress = (60 - isWarning) / 50; // 10초일 때부터 빨간색
      return `rgba(220, 53, 69, ${progress})`;
    } else {
      return props.theme.colors.border_Light;
    }
  }};

  padding: 15px;
  border-radius: 12px;
  text-align: center;
  min-width: 100px;
  box-shadow: ${(props) => props.theme.shadow.md};
  transition: ${(props) => props.theme.transition.default};
  ${(props) =>
    props.isWarning <= 60 &&
    `animation: pulse 1s infinite;
    
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
  `}
`;

const TimeNumber = styled.div`
  font-size: ${(props) => props.theme.fontSize.title.min};
  font-weight: bold;
  color: ${(props) => props.theme.colors.border_Dark};
`;

const TimeLabel = styled.div`
  font-size: ${(props) => props.theme.fontSize.small.min};
  color: #666;
  margin-top: 4px;
`;

interface TimerProps {
  onTimeover: () => void;
  initialTime?: number;
}

const LevelTestTimer = memo(
  ({ onTimeover, initialTime = 1 * 60 }: TimerProps) => {
    const [seconds, setSeconds] = useState(initialTime);

    const getTimeDisplay = () => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;

      return {
        hours: hours.toString().padStart(2, "0"),
        minutes: minutes.toString().padStart(2, "0"),
        seconds: secs.toString().padStart(2, "0"),
      };
    };

    // 1초마다 1초씩 빼기
    useEffect(() => {
      if (seconds > 0) {
        const timer = setTimeout(() => {
          setSeconds(seconds - 1);
        }, 1000);
        return () => clearTimeout(timer);
      } else {
        onTimeover();
      }
    }, [seconds, onTimeover]);

    const timeDisplay = getTimeDisplay();

    return (
      <TimerSection>
        <TimeBox isWarning={seconds}>
          <TimeNumber>{timeDisplay.hours}</TimeNumber>
          <TimeLabel>Hours</TimeLabel>
        </TimeBox>
        <TimeBox isWarning={seconds}>
          <TimeNumber>{timeDisplay.minutes}</TimeNumber>
          <TimeLabel>Minutes</TimeLabel>
        </TimeBox>
        <TimeBox isWarning={seconds}>
          <TimeNumber>{timeDisplay.seconds}</TimeNumber>
          <TimeLabel>Seconds</TimeLabel>
        </TimeBox>
      </TimerSection>
    );
  }
);
LevelTestTimer.displayName = "LevelTestTimer";

export default LevelTestTimer;
