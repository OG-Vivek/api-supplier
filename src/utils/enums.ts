export enum CollectionNames {
  Suppliers = 'suppliers',
  Projects = 'projects',
  Audit = 'audit',
  Surveys= 'surveys',
  ProjectStats = 'project_stats',
  Languages = 'languages',
  Quotas = 'quotas'
}

export enum Database {
  dbName = 'DDG_STAGE',
}

export enum Operation {
  Create = 'CREATE',
  Update = 'UPDATE',
  Delete = 'DELETE',
}

export enum DeviceTypes {
  Mobile = 0,
  Desktop = 1,
  Tablet = 2,
  MobileDesktop = 3,
  MobileTablet = 4,
  DesktopTablet = 5,
  All = 6,
}

// Function to get the device name by code
export function getDeviceNameByCode(code: DeviceTypes): string {
  return DeviceTypes[code];
}

export enum ProjectCategory {
  'Ailment' = 1,
  'Automotive' = 2,
  'Beauty/Cosmetics' = 3,
  'Beverages - Alcoholic' = 4,
  'Beverages - Non Alcoholic' = 5,
  'Education' = 6,
  'Electronics/Computer/Software' = 7,
  'Engineering' = 8,
  'Entertainment (Movies, Music, TV, etc)' = 9,
  'Explicit Content' = 10,
  'Fashion/Clothing' = 11,
  'Financial Services/Insurance' = 12,
  'Food/Snacks' = 13,
  'Gambling/Lottery' = 14,
  'Gaming' = 15,
  'HRDM' = 16,
  'Healthcare/Pharmaceuticals' = 17,
  'Home (Utilities, Appliances, ...)' = 18,
  'Home Entertainment (DVD, VHS)' = 19,
  'Home Improvement/Real Estate/Construction' = 20,
  'IT (Servers, Databases, etc)' = 21,
  'ITDM' = 22,
  'Job/Career' = 23,
  'Manufacturing' = 24,
  'Marketing/Advertising' = 25,
  'Opinion Elites' = 26,
  'Other' = 27,
  'Other - B2B' = 28,
  'Parenting' = 29,
  'Personal Care/Toiletries' = 30,
  'Pets' = 31,
  'Politics' = 32,
  'Publishing (Newspaper, Magazines, Books)' = 33,
  'Religion' = 34,
  'Restaurants' = 35,
  'Retail' = 36,
  'SBOs (Small Business Owners)' = 37,
  'Sensitive Content' = 38,
  'Shopping' = 39,
  'Social Media' = 40,
  'Sports/Outdoor' = 41,
  'Telecommunications (phone, cell phone, cable)' = 42,
  'Tobacco (Smokers)' = 43,
  'Toys' = 44,
  'Transportation/Shipping' = 45,
  'Travel' = 46,
  'Websites/Internet/E-Commerce' = 47,
}

function getCategoryNameByCode(code: ProjectCategory): string {
  return ProjectCategory[code];
}
