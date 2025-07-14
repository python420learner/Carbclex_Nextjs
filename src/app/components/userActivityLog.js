'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

const UserActivityLog = () => {
  const [sessionId, setSessionId] = useState(null);
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get session ID
  useEffect(() => {
    const fetchSessionId = async () => {
      try {
        const res = await axios.get('/api/auth/session-id', {
          withCredentials: true,
        });

        if (res.data) {
          setSessionId(res.data);
        }
      } catch (err) {
        console.error('Failed to get session ID:', err);
      }
    };

    fetchSessionId();
  }, []);

  // Fetch activity from backend
  useEffect(() => {
    if (!sessionId) return;

    const fetchActivity = async () => {
      try {
        const res = await axios.get(`/api/activity/${sessionId}`);
        setActivity(res.data);
      } catch (err) {
        console.error('Failed to fetch activity:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [sessionId]);

  if (loading) return <p>Loading activity...</p>;

  if (!activity) return <p>No activity found.</p>;

  return (
    <div style={{ padding: '1rem' }}>
      <h2>User Activity Log</h2>
      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <tbody>
          <tr><td><strong>Session ID:</strong></td><td>{activity.sessionId}</td></tr>
          <tr><td><strong>User ID:</strong></td><td>{activity.userId || 'N/A'}</td></tr>
          <tr><td><strong>Last Active:</strong></td><td>{new Date(activity.lastActive).toLocaleString()}</td></tr>
          <tr><td><strong>Activity Type:</strong></td><td>{activity.type}</td></tr>
          {activity.url && (
            <tr><td><strong>URL:</strong></td><td>{activity.url}</td></tr>
          )}
          {activity.target && (
            <tr><td><strong>Target:</strong></td><td>{activity.target}</td></tr>
          )}
          {activity.form && (
            <tr><td><strong>Form:</strong></td><td>{activity.form}</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserActivityLog;
