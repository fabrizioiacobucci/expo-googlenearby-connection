/// <reference types="nativewind/types" />
// expo/types declares the `*.css` modules; `expo start` references it from the untracked expo-env.d.ts,
// so a fresh clone needs this reference too, to type-check the import of global.css.
/// <reference types="expo/types" />
