import { supabase } from './supabase';
import type { Database } from '../types/supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

type Notification = Database['public']['Tables']['notifications']['Row'];

let notificationChannel: RealtimeChannel | null = null;

export async function createNotification(notification: Omit<Notification, 'id' | 'created_at' | 'read'>) {
  const { error } = await supabase
    .from('notifications')
    .insert(notification);

  if (error) throw error;
}

export async function broadcastNotification(title: string, message: string, userIds: string[]) {
  const notifications = userIds.map(userId => ({
    user_id: userId,
    title,
    message,
    type: 'info' as const,
  }));

  const { error } = await supabase
    .from('notifications')
    .insert(notifications);

  if (error) throw error;
}

export async function markAsRead(notificationId: string) {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId);

  if (error) throw error;
}

export async function markAllAsRead(userId: string) {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('user_id', userId)
    .eq('read', false);

  if (error) throw error;
}

export function subscribeToNotifications(userId: string, onNotification: (notification: Notification) => void) {
  if (notificationChannel) {
    notificationChannel.unsubscribe();
  }

  notificationChannel = supabase
    .channel('notifications')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        onNotification(payload.new as Notification);
      }
    )
    .subscribe();

  return () => {
    if (notificationChannel) {
      notificationChannel.unsubscribe();
      notificationChannel = null;
    }
  };
}