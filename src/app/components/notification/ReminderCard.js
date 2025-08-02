"use client"
import React from 'react';

export const ReminderCard = ({ reminder }) => {
  const [daysLeft, setDaysLeft] = React.useState(0);
  const [progressWidth, setProgressWidth] = React.useState(10);

  function calculateDaysLeft(createdAt, validity) {
    if (!createdAt || !validity) return null;
    const created = new Date(createdAt);
    const expiryDate = new Date(created.getTime() + validity * 24 * 60 * 60 * 1000);
    const now = new Date();

    const msLeft = expiryDate.getTime() - now.getTime();
    const daysLeft = Math.max(0, Math.ceil(msLeft / (1000 * 60 * 60 * 24)));
    return daysLeft;
  }


  async function fetchProjectCreatedAt(projectId) {
    const res = await fetch(`/api/projects/${projectId}`);
    if (!res.ok) throw new Error("Failed to fetch project");
    const project = await res.json();
    return project.createdAt;
  }

  async function fetchUserCreatedAt(userId) {
    // Replace with your actual user API endpoint that returns createdAt or similar
    const res = await fetch(`/api/user/getById/${userId}`);
    if (!res.ok) throw new Error("Failed to fetch user data");
    const user = await res.json();
    return user.createdAt;
  }

  async function fetchCartCreatedAt(cartId) {
    console.log("Fetching cart createdAt for cartId:", cartId);
    // Replace with your actual user API endpoint that returns createdAt or similar
    const res = await fetch(`/api/cart/${cartId}`);
    if (!res.ok) throw new Error("Failed to fetch user data");
    const cart = await res.json();
    console.log(cart)
    return cart.createdAt;
  }

  const getProgressBarColor = (daysLeft) => {
    if (daysLeft <= 2) return 'bg-red-500';
    if (daysLeft <= 7) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const formatCountdown = (daysLeft) => {
    if (daysLeft === 0) return 'Expires today';
    if (daysLeft === 1) return '1 day left';
    return `${daysLeft} days left`;
  };

  React.useEffect(() => {
    let isMounted = true;

    async function fetchAndCalculate() {
      try {
        let createdAt;
        if (reminder.relatedEntityType === 'project' && reminder.relatedEntityId) {
          createdAt = await fetchProjectCreatedAt(reminder.relatedEntityId);
          if (!isMounted) return;
          const days = calculateDaysLeft(createdAt, 30);
          setDaysLeft(days);
          setProgressWidth(Math.max(10, (days / 30) * 100));
        } else if (reminder.relatedEntityType === 'user' && reminder.relatedEntityId) {
          createdAt = await fetchUserCreatedAt(reminder.relatedEntityId);
          if (!isMounted) return;
          const days = calculateDaysLeft(createdAt, 365);
          setDaysLeft(days);
          setProgressWidth(Math.max(10, (days / 365) * 100));
        } else if (reminder.relatedEntityType === 'cart' && reminder.relatedEntityId) {
          createdAt = await fetchCartCreatedAt(reminder.relatedEntityId);
          if (!isMounted) return;
          const days = calculateDaysLeft(createdAt, 15);
          setDaysLeft(days);
          setProgressWidth(Math.max(10, (days / 15) * 100));
        } else {
          setDaysLeft(30);
          setProgressWidth(100);
        }
      } catch (error) {
        setDaysLeft(0);
        setProgressWidth(0);
      }
    }

    fetchAndCalculate();

    return () => { isMounted = false; };
  }, [reminder.relatedEntityType, reminder.relatedEntityId]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">
          {formatCountdown(daysLeft > 0 && daysLeft)}

        </span>
        <span className="text-xs text-muted-foreground">
          {reminder.createdAt}
        </span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${getProgressBarColor(daysLeft)}`}
            style={{ width: `${progressWidth}%` }}
          />
        </div>
      </div>
    </div>
  );
};

