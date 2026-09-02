import {
  defaultGemTone,
  fontSize,
  neutral,
  radii,
  spacing,
  type GemTone,
} from '@ceylon-gems/ui-tokens'
import { type ReactNode } from 'react'
import { Modal as RNModal, Pressable, StyleSheet, Text, View } from 'react-native'
import { useFontFamily } from '../hooks/useFontFamily'
import { Button, GhostButton } from './Button'
import { GlassSurface } from './primitives/GlassSurface'

interface BottomSheetProps {
  visible: boolean
  onClose: () => void
  children: ReactNode
}

// The native Modal + slide animation drives the sheet motion (no custom
// gesture-driven JS bottom sheet) — used for filter panels, share sheets,
// location/language/currency pickers. Tapping the dimmed backdrop closes it.
export function BottomSheet({ visible, onClose, children }: BottomSheetProps) {
  return (
    <RNModal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable
        style={styles.backdrop}
        onPress={onClose}
        accessibilityLabel="Close"
        accessibilityRole="button"
      />
      <View style={styles.sheetWrap}>
        <GlassSurface clarity={35} radius={radii.lg} style={styles.sheet}>
          <View style={styles.grabber} />
          {children}
        </GlassSurface>
      </View>
    </RNModal>
  )
}

interface ConfirmDialogProps {
  visible: boolean
  title: string
  message?: string
  confirmLabel: string
  cancelLabel: string
  destructive?: boolean
  tone?: GemTone
  onConfirm: () => void
  onCancel: () => void
}

// Centered confirmation dialog (delete account, discard changes, log out).
export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel,
  destructive,
  tone = defaultGemTone,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const fonts = useFontFamily()

  return (
    <RNModal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.dialogBackdrop}>
        <GlassSurface clarity={30} radius={radii.lg} style={styles.dialog}>
          <Text style={[styles.dialogTitle, { fontFamily: fonts.semibold }]}>{title}</Text>
          {message ? (
            <Text style={[styles.dialogMessage, { fontFamily: fonts.regular }]}>{message}</Text>
          ) : null}
          <View style={styles.dialogActions}>
            <GhostButton label={cancelLabel} onPress={onCancel} style={styles.dialogButton} />
            <Button
              label={confirmLabel}
              onPress={onConfirm}
              tone={tone}
              danger={destructive}
              style={styles.dialogButton}
            />
          </View>
        </GlassSurface>
      </View>
    </RNModal>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: neutral.overlay[2],
  },
  sheetWrap: {
    marginTop: 'auto',
  },
  sheet: {
    padding: spacing.xl,
    paddingBottom: spacing['3xl'],
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  grabber: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginBottom: spacing.lg,
  },
  dialogBackdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    backgroundColor: neutral.overlay[2],
  },
  dialog: {
    width: '100%',
    padding: spacing.xl,
    gap: spacing.sm,
  },
  dialogTitle: {
    fontSize: fontSize.lg,
    color: neutral.white,
  },
  dialogMessage: {
    fontSize: fontSize.sm,
    color: 'rgba(255,255,255,0.7)',
  },
  dialogActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  dialogButton: {
    flex: 1,
  },
})
