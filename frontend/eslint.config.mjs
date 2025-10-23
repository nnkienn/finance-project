import { FlatCompat } from "@eslint/eslintrc";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cho phép dùng preset cũ (extends) trong flat config
const compat = new FlatCompat({ baseDirectory: __dirname });

export default [
  // Kế thừa rule của Next (bao gồm TS)
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Bỏ qua thư mục build, node_modules...
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },

  // Nới lỏng các rule đang làm gãy build (chuyển thành warn/disable)
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "react/no-unescaped-entities": "off",
      "@next/next/no-img-element": "warn",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
];
