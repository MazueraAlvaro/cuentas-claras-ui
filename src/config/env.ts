type Env = {
  REACT_APP_API_URL: string | undefined;
};

// @ts-ignore
const windowEnv: Env | undefined = window.env;
export const env =
  process.env.NODE_ENV === "production" ? windowEnv : process.env;
