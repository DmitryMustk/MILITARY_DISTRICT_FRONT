import { prisma } from '@/prisma/client';
import { getOpportunityInvitesNotificationHistory } from './opportunity-invite-queries';
import { sendMail } from '../send-mail';
import { logger } from '../logger';
import { getTranslations } from 'next-intl/server';

export async function notifyArtistsOpportunityInvite(token: string) {
  const schedulerToken = process.env.SCHEDULER_TOKEN;
  if (!token || (token as string) !== schedulerToken) {
    throw new Error(`Failed to send notification because tokens do not match`);
  }

  const opportunityInviteMinutes = process.env.SCHEDULER_OPPORTUNITY_INVITE_MINUTES;
  if (!opportunityInviteMinutes) {
    throw new Error('Failed to send notification because SCHEDULER_OPPORTUNITY_INVITE_MINUTES is not set');
  }
  const minutesUntilDeadline = opportunityInviteMinutes
    .split(',')
    .map((i) => parseInt(i))
    .filter((i) => !isNaN(i));
  if (minutesUntilDeadline.length < 1) {
    throw new Error(
      'Failed to send notification because of invalid SCHEDULER_OPPORTUNITY_INVITE_MINUTES. At least one minute must be set'
    );
  }

  const invites = await getOpportunityInvitesNotificationHistory(token);
  const invitesToSendNotification = invites.filter((invite) => {
    const deadline = invite.opportunity.applicationDeadline;
    const intervals = buildIntervals(minutesUntilDeadline, deadline);
    const currentIntervalIdx = findIntervalIdx(intervals, new Date());
    if (currentIntervalIdx === -1) {
      return false; // Now is not the time to send a notification.
    }
    const lastNotificationDate =
      invite.notificationHistory.length === 0
        ? undefined
        : invite.notificationHistory.map((i) => i.createdAt).reduce((a, b) => (a > b ? a : b));
    if (!lastNotificationDate) {
      return true; // Did not send notification yet.
    }
    const lastNotificationIntervalIdx = findIntervalIdx(intervals, lastNotificationDate);
    if (lastNotificationIntervalIdx !== -1 && currentIntervalIdx <= lastNotificationIntervalIdx) {
      return false; // Already notified.
    }
    return true;
  });

  const t = await getTranslations('Action.notifyArtistsOpportunityInvite');
  await prisma.opportunityInviteNotificationHistory.createMany({
    data: invitesToSendNotification.map((i) => ({ opportunityInviteId: i.id })),
  });
  Promise.all(
    invitesToSendNotification.map((invite) => {
      const msg = t('msg', {
        title: invite.opportunity.title,
        deadline: invite.opportunity.applicationDeadline.toDateString(),
        inviteUrl: process.env.ARTISTS_OPPORTUNITY_INVITES_URL,
        day: dateDifferenceInDays(new Date(), invite.opportunity.applicationDeadline),
      });
      const email = invite.artist.user.email;
      if (!email) {
        throw new Error('Failed to send notification because email is not set');
      }
      return sendMail(email, 'ASA | Opportunity Invite', msg);
    })
  ).then((statuses) => {
    if (statuses.some((status) => !status?.messageId)) {
      logger.warn(`Some emails have not been sent`);
    }
  });
}

/**
 * Finds the index of the interval in which the given date falls.
 * The intervals are defined by an array of dates, where each date represents the start of a new interval.
 *
 * @param dateInterval - An array of dates representing the start points of intervals.
 *                       The array should be sorted in ascending order.
 * @param date - The date to find the interval for. Must be in desc order. Array must be not empty.
 * @returns The index of the interval in which the date falls, or `-1` if the date is outside the range of intervals.
 */
const findIntervalIdx = (dateInterval: Date[], date: Date): number => {
  if (date < dateInterval[0] || date >= dateInterval[dateInterval.length - 1]) {
    return -1;
  }
  return dateInterval.findLastIndex((d) => date >= d);
};

/**
 * Builds an array of dates representing intervals based on the number of minutes until a deadline.
 * The intervals are calculated by subtracting each minute in `minuteUntilDeadline` from the `deadline` date.
 * The resulting array includes all calculated dates and the deadline itself, sorted in ascending order.
 *
 * @param minutesUntilDeadline - An array of numbers representing the number of minutes before the deadline.
 * @param deadline - The deadline date.
 * @returns An array of dates sorted in asc order, representing the intervals.
 */
const buildIntervals = (minutesUntilDeadline: number[], deadline: Date) => {
  const dates = minutesUntilDeadline.map((minute) => {
    const res = new Date(deadline);
    res.setMinutes(res.getMinutes() - minute);
    return res;
  });
  return [...dates, deadline].sort((a, b) => a.getTime() - b.getTime()); // asc order.
};

const dateDifferenceInDays = (firstDate: Date, secondDate: Date) => {
  const differenceInMs: number = Math.abs(secondDate.getTime() - firstDate.getTime());
  const millisecondsInDay: number = 1000 * 60 * 60 * 24;
  return Math.floor(differenceInMs / millisecondsInDay);
};
