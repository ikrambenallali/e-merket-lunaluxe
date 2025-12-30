import { useTranslation } from "react-i18next";

function App() {
  const { t, i18n } = useTranslation();
  return (
    <div>
      <h1>{t("welcome")}</h1>

      <button onClick={() => i18n.changeLanguage("en")}>EN</button>
      <button onClick={() => i18n.changeLanguage("fr")}>FR</button>
    </div>
  );
}
