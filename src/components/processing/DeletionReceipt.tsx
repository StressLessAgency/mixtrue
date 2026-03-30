import { motion } from 'framer-motion'
import { Shield, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { DeletionReceipt as DeletionReceiptType } from '@/types/analysis'

interface DeletionReceiptProps {
  receipt: DeletionReceiptType
}

export default function DeletionReceipt({ receipt }: DeletionReceiptProps) {
  const receiptText = `
SECURE DELETION CONFIRMED
==========================
File: ${receipt.fileName}
Deleted: ${receipt.deletedAt}
Session ID: ${receipt.sessionId}
Storage: ${receipt.storage}
Model Training: ${receipt.aiTraining}
Receipt ID: ${receipt.receiptId}
`.trim()

  const handleDownload = () => {
    const blob = new Blob([receiptText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `deletion-receipt-${receipt.receiptId}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass-card p-6 border-accent-green/20"
    >
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-5 h-5 text-accent-green" />
        <h3 className="font-display font-semibold text-text-primary">Secure Deletion Confirmed</h3>
      </div>

      <div className="bg-bg-primary rounded-lg p-4 font-mono text-xs text-text-secondary space-y-1.5 border border-border-subtle">
        <div className="flex justify-between">
          <span className="text-text-muted">File:</span>
          <span className="text-text-primary truncate ml-4 max-w-[300px]">{receipt.fileName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-muted">Deleted:</span>
          <span className="text-text-primary">{new Date(receipt.deletedAt).toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-muted">Session ID:</span>
          <span className="text-text-primary">{receipt.sessionId.substring(0, 18)}...</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-muted">Storage:</span>
          <span className="text-accent-green">{receipt.storage}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-muted">Model Training:</span>
          <span className="text-accent-green">{receipt.aiTraining}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-muted">Receipt ID:</span>
          <span className="text-text-primary">{receipt.receiptId}</span>
        </div>
      </div>

      <Button variant="outline" size="sm" className="mt-4" onClick={handleDownload}>
        <Download className="w-3 h-3" />
        Download Receipt
      </Button>
    </motion.div>
  )
}
