import * as Haptics from "expo-haptics";

export const haptics = {
  light: () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {
      // haptics not available on all devices — fail silently
    });
  },
  medium: () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
  },
  success: () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
      () => {}
    );
  },
  error: () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(
      () => {}
    );
  },
  warning: () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(
      () => {}
    );
  },
};
