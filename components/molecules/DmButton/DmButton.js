'use client';

import { useState } from 'react';
import Button from '@/components/atoms/Button/Button';
import { cta, inventory, links } from '@/content/copy';
import styles from './DmButton.module.css';

/**
 * Instagram links can't pre-fill a message, so this copies one to the
 * clipboard, then opens the DM thread with the shop.
 */
export default function DmButton({ id, name }) {
  const [copied, setCopied] = useState(false);

  async function handleClick() {
    try {
      await navigator.clipboard.writeText(inventory.detail.dmMessage(id, name));
      setCopied(true);
    } catch {
      // Clipboard can be blocked; the link still opens the chat.
    }
  }

  return (
    <div className={styles.wrap}>
      <Button href={links.instagramDm} block onClick={handleClick}>
        {cta.dmToBuy}
      </Button>
      <p className={styles.help} aria-live="polite">
        {copied ? inventory.detail.copied : inventory.detail.dmHelp(id, name)}
      </p>
    </div>
  );
}
