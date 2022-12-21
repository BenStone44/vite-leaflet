export const parameters = {
  timeSeriesLength: 8472,
  windowSize: 24,
  windowNumber: 160, // 8472 / 24
  paddingPixel: 8,
  windowPixel: 16,
  distanceIn: 2,
  distanceOut: 4,
  visibleThreshold: 100,
  r: 5,
  lineWidth: 2, //线粗细
  bg_width: 4000,
  colorGradient: {
    main: {
      name: "main",
      show: "#47b5ff",
      light: "#f8fcff",
      dark: "#007dd0",
    },
    red: {
      name: "red",
      show: "#ff4759",
      light: "#fff8f8",
      dark: "#e40016",
    },
    orange: {
      name: "orange",
      show: "#ff9147",
      light: "#ffd7bd",
      dark: "#e45c00",
    },
    green: {
      name: "green",
      show: "#2aab2a",
      light: "#cef3ce",
      dark: "#269b26",
    },
    black: {
      name: "black",
      show: "#3B3838",
      light: "#D0CECE",
      dark: "#262626",
    },
  } as {
    [key: string]: {
      name: string;
      show: string;
      light: string;
      dark: string;
    };
  },
  vertical: {
    color: "#ddd",
    width: 1,
  },
};

export const map_param = {
  url: "https://api.mapbox.com/styles/v1/zikunrain/cl09ejle0003v14mglm1p9x13/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiemlrdW5yYWluIiwiYSI6ImNqeWE2dXJ1djBibmIzY21mMWl5MDljc2wifQ.NMe8T_yYFKIsraDJV4tIPw",
  params:
  {
    center: [37.65643826882609, 106.76826398809273],
    zoom: 4.5,
    zoomSnap: 0.5,
    zoomControl: false,
    attributionControl: false,
    touchZoom: true,
  }
}
