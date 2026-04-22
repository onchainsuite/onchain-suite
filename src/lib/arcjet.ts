import arcjet, {
  detectBot,
  fixedWindow,
  protectSignup,
  sensitiveInfo,
  shield,
  slidingWindow,
} from "@arcjet/next";

import { serverEnv } from "./env";

export {
  detectBot,
  fixedWindow,
  protectSignup,
  sensitiveInfo,
  shield,
  slidingWindow,
};

export default arcjet({
  key: (() => {
    const key = serverEnv.ARCJET_KEY;
    if (!key) throw new Error("ARCJET_KEY is required");
    return key;
  })(),
  characteristics: ["fingerprint"],
  rules: [shield({ mode: "LIVE" })],
});
