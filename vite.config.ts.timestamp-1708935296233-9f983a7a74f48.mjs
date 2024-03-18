// vite.config.ts
import { defineConfig } from "file:///C:/GitHub/2din-spectrogram/node_modules/vite/dist/node/index.js";
import react from "file:///C:/GitHub/2din-spectrogram/node_modules/@vitejs/plugin-react-swc/index.mjs";
import tsconfigPaths from "file:///C:/GitHub/2din-spectrogram/node_modules/vite-tsconfig-paths/dist/index.mjs";
import { nodePolyfills } from "file:///C:/GitHub/2din-spectrogram/node_modules/vite-plugin-node-polyfills/dist/index.js";
var vite_config_default = defineConfig({
  plugins: [
    react({
      /* plugins: [["@swc-jotai/debug-label", {}]] */
    }),
    tsconfigPaths(),
    nodePolyfills({
      include: [
        "stream",
        "events",
        "util"
      ],
      globals: {
        Buffer: true,
        process: true
      }
    })
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxHaXRIdWJcXFxcMmRpbi1zcGVjdHJvZ3JhbVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcR2l0SHViXFxcXDJkaW4tc3BlY3Ryb2dyYW1cXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L0dpdEh1Yi8yZGluLXNwZWN0cm9ncmFtL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3Qtc3djXCI7XG5pbXBvcnQgdHNjb25maWdQYXRocyBmcm9tIFwidml0ZS10c2NvbmZpZy1wYXRoc1wiO1xuaW1wb3J0IHsgbm9kZVBvbHlmaWxscyB9IGZyb20gXCJ2aXRlLXBsdWdpbi1ub2RlLXBvbHlmaWxsc1wiO1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIHJlYWN0KHsgLyogcGx1Z2luczogW1tcIkBzd2Mtam90YWkvZGVidWctbGFiZWxcIiwge31dXSAqLyB9KSxcbiAgICB0c2NvbmZpZ1BhdGhzKCksXG4gICAgbm9kZVBvbHlmaWxscyh7XG4gICAgICBpbmNsdWRlOiBbXG4gICAgICAgICdzdHJlYW0nLFxuICAgICAgICAnZXZlbnRzJyxcbiAgICAgICAgJ3V0aWwnXG4gICAgICBdLFxuICAgICAgZ2xvYmFsczoge1xuICAgICAgICBCdWZmZXI6IHRydWUsXG4gICAgICAgIHByb2Nlc3M6IHRydWUsXG4gICAgICB9XG4gICAgfSlcbiAgXSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFzUSxTQUFTLG9CQUFvQjtBQUNuUyxPQUFPLFdBQVc7QUFDbEIsT0FBTyxtQkFBbUI7QUFDMUIsU0FBUyxxQkFBcUI7QUFHOUIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBO0FBQUEsSUFBa0QsQ0FBQztBQUFBLElBQ3pELGNBQWM7QUFBQSxJQUNkLGNBQWM7QUFBQSxNQUNaLFNBQVM7QUFBQSxRQUNQO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxNQUNGO0FBQUEsTUFDQSxTQUFTO0FBQUEsUUFDUCxRQUFRO0FBQUEsUUFDUixTQUFTO0FBQUEsTUFDWDtBQUFBLElBQ0YsQ0FBQztBQUFBLEVBQ0g7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
