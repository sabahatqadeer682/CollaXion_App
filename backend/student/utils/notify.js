import Notification from "../models/Notification.js";

/**
 * Persist a notification for a student and push it to any open WS clients.
 * Failures are swallowed (but logged) so the caller's main flow isn't broken.
 *
 * @param {import("express").Request} req  Express req — used to reach app.locals.broadcast
 * @param {object} payload
 * @param {string} payload.studentEmail
 * @param {string} payload.title
 * @param {string} payload.message
 * @param {"application"|"event"|"deadline"|"general"} [payload.type]
 */
export const notifyStudent = async (req, payload) => {
    try {
        const notif = await Notification.create({
            studentEmail: payload.studentEmail,
            title: payload.title,
            message: payload.message,
            type: payload.type || "general",
        });

        const broadcast = req?.app?.locals?.broadcast;
        if (broadcast) {
            broadcast(payload.studentEmail, {
                event: "newNotification",
                data: notif,
            });
        }
        return notif;
    } catch (err) {
        console.error("notifyStudent error:", err.message);
        return null;
    }
};
