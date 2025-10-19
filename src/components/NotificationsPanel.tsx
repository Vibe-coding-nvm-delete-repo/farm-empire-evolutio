import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Bell, X, Trophy, TreeStructure, Sparkle } from '@phosphor-icons/react'
import { formatDistanceToNow } from 'date-fns'
import { useNotifications, type Notification } from '@/contexts/NotificationsContext'
import { useKV } from '@github/spark/hooks'

export function NotificationsPanel() {
  const { notifications } = useNotifications()
  const [, setNotificationsKV] = useKV<Notification[]>('notifications', [])
  const [open, setOpen] = useState(false)

  const unreadCount = (notifications || []).filter(n => !n.read).length

  const markAsRead = (id: string) => {
    setNotificationsKV(current => 
      (current || []).map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotificationsKV(current => 
      (current || []).map(n => ({ ...n, read: true }))
    )
  }

  const clearAll = () => {
    setNotificationsKV([])
  }

  const deleteNotification = (id: string) => {
    setNotificationsKV(current => (current || []).filter(n => n.id !== id))
  }

  const getIcon = (notification: Notification) => {
    if (notification.icon) {
      return <span className="text-2xl">{notification.icon}</span>
    }

    switch (notification.type) {
      case 'achievement':
        return <Trophy weight="fill" className="w-5 h-5 text-yellow-500" />
      case 'tech':
        return <TreeStructure weight="fill" className="w-5 h-5 text-blue-500" />
      case 'progression':
        return <Sparkle weight="fill" className="w-5 h-5 text-purple-500" />
      default:
        return <Bell weight="fill" className="w-5 h-5 text-primary" />
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell weight="fill" className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs animate-pulse"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[500px]">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Bell weight="fill" className="w-5 h-5" />
              Notifications
            </span>
            {(notifications || []).length > 0 && (
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={markAllAsRead}
                    className="text-xs"
                  >
                    Mark all read
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearAll}
                  className="text-xs text-destructive hover:text-destructive"
                >
                  Clear all
                </Button>
              </div>
            )}
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-100px)] mt-6 pr-4">
          {(notifications || []).length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <Bell className="w-12 h-12 mb-4 opacity-50" />
              <p className="text-sm">No notifications yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {(notifications || [])
                .sort((a, b) => b.timestamp - a.timestamp)
                .map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border transition-all cursor-pointer ${
                      notification.read 
                        ? 'bg-card opacity-70' 
                        : 'bg-accent/50 border-primary/30'
                    }`}
                    onClick={() => !notification.read && markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {getIcon(notification)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="font-semibold text-sm">
                            {notification.title}
                          </h4>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 shrink-0"
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteNotification(notification.id)
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
