import ReactPlayer from 'react-player';
import styled from 'styled-components';

interface LectureViewerProps {
  url: string;
}

const PlayerWrapper = styled.div`
  width: 100%;
  aspect-ratio: 16 / 9;
`;

const LectureViewer = ({ url }: LectureViewerProps): React.ReactElement => {
  return (
    <PlayerWrapper>
      <ReactPlayer
        src={url}
        width="100%"
        height="100%"
        controls
        playing={false}
      /> 
    </PlayerWrapper>
  );
};

export default LectureViewer;
