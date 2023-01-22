import { Images } from "../enums/images";

const getNFT = (stage: number) => {
  let img = Images.zero;

  switch (stage) {
    case 0:
      img = Images.zero;
      break;
    case 1:
      img = Images.one;
      break;
    case 2:
      img = Images.two;
      break;
    case 3:
      img = Images.three;
      break;
    case 4:
      img = Images.four;
      break;
    default:
      break;
  }

  return img;
};

export default getNFT;
