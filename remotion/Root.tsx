import { Composition } from "remotion"
import { PedagemyRaffleVideo } from "./PedagemyRaffleVideo"

export const videoConfig = {
  fps: 30,
  width: 1920,
  height: 1080,
  durationInFrames: 1800,
}

export const RemotionRoot = () => {
  return (
    <Composition
      id="PedagemyRaffle"
      component={PedagemyRaffleVideo}
      durationInFrames={videoConfig.durationInFrames}
      fps={videoConfig.fps}
      width={videoConfig.width}
      height={videoConfig.height}
    />
  )
}
