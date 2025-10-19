import { createContext, useContext, ReactNode } from 'react'
import { useKV } from '@github/spark/hooks'

export type Notification = {
  id: string
  type: 'achievement' | 'tech' | 'progression' | 'info' | 'warning'
  title: string
  message: string
  timestamp: number
  read: boolean
  icon?: string
}

type NotificationsContextType = {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
}

const NotificationsContext = createContext<NotificationsContextType | null>(null)

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useKV<Notification[]>('notifications', [])

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    setNotifications(current => [
      {
        ...notification,
        id: `notif-${Date.now()}-${Math.random()}`,
        timestamp: Date.now(),
        read: false,
      },
      ...(current || []),
    ])
  }

  return (
    <NotificationsContext.Provider value={{ notifications: notifications || [], addNotification }}>
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationsContext)
  if (!context) {
    throw new Error('useNotifications must be used within NotificationsProvider')
  }
  return context
}
