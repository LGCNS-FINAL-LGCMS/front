import ReactPlayer from 'react-player';
import styled from 'styled-components';

interface LessonPlayerProps {
  src: string;
}

const LessonPlayer = ({ src }: LessonPlayerProps): React.ReactElement => {
  return (
      <ReactPlayer
        src = {src}
        width="100%"
        height="100%"
        controls
        playing={false}
      /> 
  );
};

export default LessonPlayer;
