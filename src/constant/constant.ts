export const surveyStatus = [
  {
    All: -1,
    'Screener Dropouts': 0,
    'Client Completes': 1,
    'Client Fails': 2,
    'Client OverQuota': 3,
    'Client Quality Termination': 4,
    'Screener Terminates': 5,
    'Client Dropouts': 6,
    'Screener OverQuota': 7,
    'Screener Quality Termination': 8,
  },
];

export const questionTypes = [
  'Single Punch',
  'Multipunch',
  'Open End-Text',
  'Numeric Open Ended',
];

export const deviceTypes = [
  'Mobile',
  'Desktop',
  'Tablet',
  'Mobile + Desktop',
  'Mobile + Tablet',
  'Desktop + Tablet',
  'All',
];

export const qTypeMapping = {
  0: "Single Punch",
  1: "Multipunch",
  2: "Open End",
  3: "Numeric Open End"
};
