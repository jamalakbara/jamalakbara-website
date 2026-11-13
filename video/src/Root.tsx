import { Composition, Folder } from "remotion";
import { LOOP_DURATION, LOOP_FPS, ProjectLoop, loopSize } from "./loops/ProjectLoop";
import { LOOPS } from "./loops/projects";
import "./theme";

export const RemotionRoot: React.FC = () => {
  return (
    <Folder name="work-loops">
      {Object.entries(LOOPS).map(([id, props]) => (
        <Composition
          key={id}
          id={`loop-${id}`}
          component={ProjectLoop}
          durationInFrames={LOOP_DURATION}
          fps={LOOP_FPS}
          {...loopSize(props.slots)}
          defaultProps={props}
        />
      ))}
    </Folder>
  );
};
