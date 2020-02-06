import * as React from "react";
import * as ReactDOM from "react-dom";
import { ApolloProvider } from "react-apollo";
import { IntlProvider } from "react-intl";

import { client } from "./popup/client";
import { Popup } from "./popup/Popup";
import { flattenMessages } from "./i18n/utils";
import * as supportedLocales from "./i18n";


type Locale = keyof typeof supportedLocales;
const locales = Object.keys(supportedLocales) as Array<Locale>;
const defaultLocale = locales[0];

export interface ILocaleContext {
  setLocale: (locale: Locale) => void;
  getLocale: () => Locale;
}

export const LocaleContext = React.createContext<ILocaleContext>(undefined!);

const Entry: React.FC = () => {
  const [locale, setLocale] = React.useState<Locale>(defaultLocale);

  const getLocale = (): Locale => locale;

  React.useEffect(() => {
    chrome.i18n.getAcceptLanguages((list: Array<Locale>) => {
      for (const l of list) {
        if (locales.includes(l)) {
          setLocale(l);
          break;
        }
      }
    });
  }, []);

  return (
    <LocaleContext.Provider
      value={{
        setLocale,
        getLocale,
      }}
    >
      <IntlProvider defaultLocale={defaultLocale} locale={locale} messages={flattenMessages(supportedLocales[locale])}>
        <ApolloProvider client={client}>
          <Popup />
        </ApolloProvider>
      </IntlProvider>
    </LocaleContext.Provider>
  );
};

ReactDOM.render(<Entry />, document.getElementById("app"));
