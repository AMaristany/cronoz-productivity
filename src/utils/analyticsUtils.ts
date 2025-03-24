
// Mixpanel integration for product analytics
import mixpanel from 'mixpanel-browser';

const MIXPANEL_TOKEN = '7cb00a0199be8d0cf0dcc1e9d6819bda'; // This is just a placeholder token

export const initAnalytics = () => {
  try {
    mixpanel.init(MIXPANEL_TOKEN, { debug: false });
    console.log('Analytics initialized');
  } catch (error) {
    console.error('Error initializing analytics:', error);
  }
};

export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  try {
    mixpanel.track(eventName, properties);
    console.log(`Tracked event: ${eventName}`, properties);
  } catch (error) {
    console.error(`Error tracking event ${eventName}:`, error);
  }
};

export const identifyUser = (userId: string, userProperties?: Record<string, any>) => {
  try {
    mixpanel.identify(userId);
    if (userProperties) {
      mixpanel.people.set(userProperties);
    }
  } catch (error) {
    console.error('Error identifying user:', error);
  }
};

// Analytics event names
export const ANALYTICS_EVENTS = {
  CREATE_ACTIVITY: 'create_activity',
  DELETE_ACTIVITY: 'delete_activity',
  RENAME_ACTIVITY: 'rename_activity',
  START_TIMER: 'start_timer',
  STOP_TIMER: 'stop_timer',
  VIEW_ACTIVITY_DETAIL: 'view_activity_detail',
  VIEW_STATISTICS: 'view_statistics',
  VIEW_ACTIVITIES: 'view_activities',
  VIEW_HOME: 'view_home',
  OPEN_MANIFESTO: 'open_manifesto',
  CLOSE_MANIFESTO: 'close_manifesto'
};
