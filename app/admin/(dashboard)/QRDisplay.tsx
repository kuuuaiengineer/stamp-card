'use client'

import { QRCodeSVG } from 'qrcode.react'

export default function QRDisplay({ url }: { url: string }) {
  return (
    <div className="flex justify-center">
      <div className="border-4 border-amber-400 rounded-xl p-3 inline-block">
        <QRCodeSVG value={url} size={200} />
      </div>
    </div>
  )
}
