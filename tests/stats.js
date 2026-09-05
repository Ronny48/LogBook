import http from "k6/http";
import { check } from "k6";

export const options = {
  vus: 10,
  duration: "30s",
};


export function setup() {
  const loginResponse = http.post(
    "https://logbook-e507.onrender.com/auth/login",
    JSON.stringify({
      name: "officeA",
      password: "securet123",
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  console.log("LOGIN STATUS:", loginResponse.status);
  console.log("LOGIN BODY:", loginResponse.body);

  const token = loginResponse.json("token");

  return {
    token,
  };
}


export default function (data) {
  const res = http.get(
    "https://logbook-e507.onrender.com/stats",
    {
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
    },
  );

  check(res, {
    "stats returns 200": (r) => r.status === 200,
  });
}