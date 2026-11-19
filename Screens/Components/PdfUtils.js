import { Alert, PermissionsAndroid, Platform } from 'react-native';

// react-native-html-to-pdf saves into the app's own storage folder, so Android 10+
// needs no storage permission (Android 13+ always denies WRITE_EXTERNAL_STORAGE).
export const isPermitted = async () => {
  if (Platform.OS !== 'android' || Platform.Version >= 29) {
    return true;
  }
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'External Storage Write Permission',
        message: 'App needs access to Storage to save PDF files',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn('Write permission error:', err);
    return false;
  }
};

// react-native-share rejects when the user just closes the share sheet; that is not an error.
export const isShareDismissed = (err) =>
  /did not share|cancel|dismiss/i.test(String(err?.message ?? err ?? ''));

export const showShareError = (err) => {
  if (isShareDismissed(err)) return;
  Alert.alert('Share Error', String(err?.message || err || 'Could not share the PDF'));
};

// The PDF library rejects names containing / \ : * ? " < > | (e.g. dates like 13/Oct/2026).
export const safeFileName = (name, fallback = 'Sanjeevni Order') => {
  const clean = String(name ?? '')
    .replace(/[\\/:*?"<>|\r\n]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return clean || fallback;
};
