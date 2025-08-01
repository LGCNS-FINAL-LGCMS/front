import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

// ✅ Redux 관련 import
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);
