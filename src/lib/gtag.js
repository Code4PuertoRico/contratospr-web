export const GA_TRACKING_ID = process.env.GA_TRACKING_ID;

export const pageview = (url) => {
  window.gtag('config', GA_TRACKING_ID, {
    anonymize_ip: true,
    page_location: url
  });
};

export const event = ({ action, category, label, value }) => {
  window.gtag('event', action, {
    anonymize_ip: true,
    event_category: category,
    event_label: label,
    value: value
  });
};
