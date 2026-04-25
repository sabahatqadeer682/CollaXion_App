import IndustryNotification from "../models/IndustryNotification.js";

/**
 * Persist a notification for an industry user and push it via WebSocket.
 *
 * @param {import("express").Request} req
 * @param {object} payload
 * @param {string} payload.industryEmail
 * @param {string} payload.title
 * @param {string} payload.message
 * @param {"mou"|"application"|"invitation"|"event"|"general"} [payload.type]
 * @param {object} [payload.meta]
 */
export const notifyIndustry = async (req, payload) => {
  try {
    if (!payload?.industryEmail) return null;
    const notif = await IndustryNotification.create({
      industryEmail: payload.industryEmail,
      title:   payload.title,
      message: payload.message,
      type:    payload.type || "general",
      meta:    payload.meta || {},
    });

    const broadcast = req?.app?.locals?.broadcast;
    if (broadcast) {
      broadcast(payload.industryEmail, { event: "newNotification", data: notif });
    }
    return notif;
  } catch (err) {
    console.error("notifyIndustry error:", err.message);
    return null;
  }
};
