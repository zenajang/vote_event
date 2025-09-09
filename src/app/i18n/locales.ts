import i18next from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { i18nConfig } from './settings';

export const namespaces = [i18nConfig.defaultNS];

export function addBackend() {
  i18next.use(
    resourcesToBackend((lng: string, ns: string, cb: any) => {
      import(`../../../public/locales/${lng}/${ns}.json`)
        .then((res) => cb(null, res))
        .catch((err) => cb(err, null));
    })
  );
}
