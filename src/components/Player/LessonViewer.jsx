import ReactPlayer from "react-player";

const LessionViewer = ({ url }) => {
  return (
    <div className="w-full overflow-hidden bg-black rounded-xl aspect-video">
      <ReactPlayer
        src={url}
        width="100%"
        height="100%"
        controls
        playing={false}
      />
    </div>
  );
};

export default LessionViewer;