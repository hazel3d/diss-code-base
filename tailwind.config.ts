import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite-react/**/*.js",
  ],
  plugins: [
    // other plugins...
    require("flowbite/plugin"),
  ],
  theme: {},
};
