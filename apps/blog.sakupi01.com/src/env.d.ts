interface ImportMetaEnv {
  readonly PUBLIC_BLOG: string;
  readonly ZENN_URL: string;
  readonly PUBLIC_ZENN_BASE_URL: string;
  readonly PUBLIC_HOME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
