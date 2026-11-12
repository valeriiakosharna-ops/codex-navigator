// Who a page is for. Shown on the page, on the overview and on the Moodle setup page.
export const AUDIENCES = ["everyone", "non-technical", "technical", "leads"];
export const AUDIENCE_LABEL = { everyone: "Everyone", "non-technical": "Non-technical", technical: "Technical", leads: "Leads & admins" };
export const audienceText = (a) => (a || []).map((x) => AUDIENCE_LABEL[x]).join(", ");
