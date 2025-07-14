'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

const ActivityTracker = () => {
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    const getSessionId = async () => {
      try {
        const res = await axios.get('/api/auth/session-id', {
          withCredentials: true,
        });

        if (res.data) {
          setSessionId(res.data);
          console.log('Session ID:', res.data);
          logActivity({ pagesVisited: [window.location.href] });
        }
      } catch (err) {
        console.error('Error fetching session ID', err);
      }
    };

    const logActivity = async (activity) => {
      if (!sessionId) return;

      try {
        await axios.post(
          '/api/activity/track',
          { sessionId, ...activity },
          { withCredentials: true }
        );
      } catch (err) {
        console.error('Error logging activity:', err);
      }
    };

    const handleClick = (e) => {
      logActivity({ buttonsClicked: [e.target.outerHTML] });
    };

    const handleSubmit = (e) => {
      logActivity({ formsSubmitted: [e.target.outerHTML] });
    };

    const handleNavigation = () => {
      logActivity({ pagesVisited: [window.location.href] });
    };

    getSessionId();

    window.addEventListener('click', handleClick);
    window.addEventListener('submit', handleSubmit);
    window.addEventListener('popstate', handleNavigation);

    return () => {
      window.removeEventListener('click', handleClick);
      window.removeEventListener('submit', handleSubmit);
      window.removeEventListener('popstate', handleNavigation);
    };
  }, [sessionId]);

  return null;
};

export default ActivityTracker;



// 'use client';

// import { useEffect } from 'react';
// import axios from 'axios';

// const ActivityTracker = () => {
//   useEffect(() => {
//     let sessionId = null;

//     const logActivity = async (activity) => {
//       if (!sessionId) {
//         console.warn('No sessionId yet. Skipping activity:', activity);
//         return;
//       }

//       try {
//         const res = await fetch('/api/activity/track', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           credentials: 'include', // Send cookies/session
//           body: JSON.stringify({ sessionId, ...activity }),
//         });

//         if (!res.ok) {
//           console.error('Failed to log activity:', res.statusText);
//         }
//       } catch (err) {
//         console.error('Error logging activity:', err);
//       }
//     };

//     const getSessionId = async () => {
//       try {
//         const res = await axios.get('/api/auth/session-id', {
//           withCredentials: true,
//         });

//         if (res.data) {
//           sessionId = res.data;
//           console.log('Session ID:', sessionId);

//           // Log session-start now
//           await logActivity({ type: 'session-start', url: window.location.href });
//         }
//       } catch (err) {
//         console.error('Error fetching session ID', err);
//       }
//     };

//     const handleClick = (e) => logActivity({ type: 'click', target: e.target.outerHTML });
//     const handleSubmit = (e) => logActivity({ type: 'form-submit', form: e.target.outerHTML });
//     const handleVisibilityChange = () => logActivity({ type: document.hidden ? 'inactive' : 'active' });
//     const handleNavigation = () => logActivity({ type: 'navigation', url: window.location.href });

//     getSessionId().then(() => {
//       window.addEventListener('click', handleClick);
//       window.addEventListener('submit', handleSubmit);
//       document.addEventListener('visibilitychange', handleVisibilityChange);
//       window.addEventListener('popstate', handleNavigation);
//     });

//     return () => {
//       window.removeEventListener('click', handleClick);
//       window.removeEventListener('submit', handleSubmit);
//       document.removeEventListener('visibilitychange', handleVisibilityChange);
//       window.removeEventListener('popstate', handleNavigation);
//     };
//   }, []);

//   return null;
// };

// export default ActivityTracker;
