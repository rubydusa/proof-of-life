export default function dataURIParse (dataUri) {
  const JSON_DATA_URI = 'data:application/json;base64,';

  const jsonString = atob(dataUri.slice(JSON_DATA_URI.length));
  const json = JSON.parse(jsonString);
  return json;
}
