export const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return `${minutes.toString().padStart(1, "0")}:${Math.floor(seconds)
    .toString()
    .padStart(2, "0")}`;
};
