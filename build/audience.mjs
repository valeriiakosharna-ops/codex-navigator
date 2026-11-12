// Who a page is for: one of three groups, never a list of job titles.
export const AUDIENCES = ["everyone", "technical", "non-technical"];
export const AUDIENCE_SHORT = { everyone: "Everyone", technical: "Technical", "non-technical": "Non-technical" };
export const AUDIENCE_LABEL = { everyone: "For everyone", technical: "For technical specialists", "non-technical": "For non-technical specialists" };
// A page has exactly one audience.
export const audienceKey = (a) => (Array.isArray(a) ? a[0] : a);
export const audienceText = (a) => (a ? AUDIENCE_LABEL[audienceKey(a)] : "");
export const audienceShort = (a) => (a ? AUDIENCE_SHORT[audienceKey(a)] : "");
