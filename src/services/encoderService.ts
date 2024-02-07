import { Base64 } from "js-base64";

const urlEncodeObject = <T>(object: T): string => {
  return Base64.encode(JSON.stringify(object), true);
};

const urlDecodeString = <T>(encodedString: string): T => {
  return JSON.parse(Base64.decode(encodedString));
};

export { urlEncodeObject, urlDecodeString };
