
import * as React from "react"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

interface ConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  withDelay?: boolean
  delaySeconds?: number
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmLabel = "OK",
  cancelLabel = "Cancel",
  withDelay = false,
  delaySeconds = 5
}: ConfirmationDialogProps) {
  const [secondsLeft, setSecondsLeft] = React.useState(withDelay ? delaySeconds : 0)
  const [timerRunning, setTimerRunning] = React.useState(false)

  React.useEffect(() => {
    // Reset timer when dialog opens
    if (open && withDelay) {
      setSecondsLeft(delaySeconds)
      setTimerRunning(true)
    } else {
      setTimerRunning(false)
    }
  }, [open, withDelay, delaySeconds])

  React.useEffect(() => {
    if (!timerRunning) return

    const intervalId = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId)
          setTimerRunning(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(intervalId)
  }, [timerRunning])

  const handleConfirm = () => {
    onConfirm()
    onOpenChange(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
          {withDelay && secondsLeft > 0 ? (
            <Button 
              variant="destructive" 
              disabled 
              className="opacity-70"
            >
              {confirmLabel} ({secondsLeft}s)
            </Button>
          ) : (
            <AlertDialogAction 
              onClick={handleConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {confirmLabel}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
