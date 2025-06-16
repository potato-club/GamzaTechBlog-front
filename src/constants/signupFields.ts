import { Position } from "../enums/position";

const signupFields = [
  {
    id: "email",
    label: "이메일",
    type: "email",
    placeholder: "이메일을 입력해주세요",
  },
  {
    id: "studentNumber",
    label: "학번",
    type: "text",
    placeholder: "학번을 입력해주세요",
  },
  {
    id: "gamjaBatch",
    label: "감자 기수",
    type: "text",
    placeholder: "기수를 입력해주세요",
  },
  {
    id: "position",
    label: "직군",
    type: "option",
    placeholder: "직군 선택",
    options: Object.values(Position),
  },
];

export default signupFields;