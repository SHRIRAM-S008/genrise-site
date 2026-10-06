"use client";

import { Player } from "@remotion/player";
import ToolsFilm, { FILM } from "./ToolsFilm";

export default function FilmPlayer() {
  return (
    <Player
      component={ToolsFilm}
      durationInFrames={FILM.durationInFrames}
      fps={FILM.fps}
      compositionWidth={FILM.width}
      compositionHeight={FILM.height}
      style={{ width: "100%", aspectRatio: `${FILM.width} / ${FILM.height}` }}
      autoPlay
      loop
      initiallyMuted
      acknowledgeRemotionLicense
    />
  );
}
