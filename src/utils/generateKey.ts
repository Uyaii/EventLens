import { generateKey, randomBytes } from "crypto";

// export const generateApiKey = () => {
//   const generatedKey = randomBytes(256, (error, buf) => {
//     if (error) throw error;
//     console.log(`${buf.length} bytes of random data: ${buf.toString("hex")}`);
//     return buf.toString("hex");
//   });

//   return generatedKey;
// };

export const generateApiKey = () => {
  const buff = randomBytes(32);

  const key = buff.toString("hex");

  return key;
};
